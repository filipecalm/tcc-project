import bcrypt from 'bcrypt';
import { User } from '../models';
import MESSAGE from '../constants/messages';
import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';

// helpers
import createUserToken from '../helpers/create-user-token';
import getToken from '../helpers/get-token';
import decodedToken from '../helpers/token-decoded';

export interface IUser extends Document {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  newpassword?: string;
  confirmPassword?: string;
  role: string;
  cpf: string;
  rg: string;
  birth: string;
  phone: string;
  gender: string;
}

export default class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      if (req.headers.authorization) {
        const users = await User.find({}, { password: 0, confirmPassword: 0 })
        res.status(200).json(users)
      } else {
        res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
      }
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = await User.findById(id, { password: 0, confirmPassword: 0 })

      if (!user) return res.status(404).json(MESSAGE.ERROR.USER.NOT_FOUND)

      res.status(200).json(user)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await User.findById(id, '_id name role');

      if (!user) return res.status(404).json(MESSAGE.ERROR.USER.NOT_FOUND);

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH);
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, confirmPassword, cpf, rg, birth, phone, gender } = req.body

      if (password !== confirmPassword) {
        return res.status(400).json({ message: MESSAGE.ERROR.USER.PASS_ERROR })
      }

      // Verificar se o email já existe no banco de dados
      const userExists = await User.findOne({ email })

      if (userExists) {
        return res.status(409).json({ message: MESSAGE.ERROR.USER.EMAIL_ERROR })
      }

      const salt = await bcrypt.genSalt(12)
      const passwordBcrypt = await bcrypt.hash(password, salt)

      let roleClient = 'client'

      // Se não houver admin no db, o primeiro usuário torna-se um admin
      const adminExists = await User.count({ role: 'admin' })
      if (!adminExists) {
        roleClient = 'admin'
      }

      const user = new User({
        name,
        email,
        password: passwordBcrypt,
        confirmPassword: passwordBcrypt,
        role: roleClient,
        cpf,
        rg,
        birth,
        phone,
        gender
      })

      const newUser = await user.save()

      await createUserToken(newUser, res)
    } catch (error) {
      res.status(400).json({ message: MESSAGE.ERROR.ERROR_CATCH })
    }
  }

  static async updatedUser(req: Request, res: Response) {
    try {
      const { id } = req.params

      const { name, email, password, newpassword, confirmPassword, cpf, rg, birth, phone, gender } = req.body

      if (newpassword && confirmPassword && newpassword !== confirmPassword) {
        return res.status(400).json(MESSAGE.ERROR.USER.PASS_ERROR)
      }

      const user = await User.findById(id)
      if (!user) return res.status(404).json(MESSAGE.ERROR.USER.NOT_FOUND)

      if (password && user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED);
      }


      if (email && email !== user.email) {
        // Se o novo email é diferente do email atual, verifica se o email já existe no banco de dados
        const emailExists = await User.findOne({ email })
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
          return res.status(400).json(MESSAGE.ERROR.USER.EMAIL_ERROR)
        }
      }

      let passwordBcrypt
      if (newpassword) {
        const salt = await bcrypt.genSalt(12)
        passwordBcrypt = await bcrypt.hash(newpassword, salt)
      }

      await User.findByIdAndUpdate(id, {
        name: name ? name : user.name,
        email: email ? email : user.email,
        password: passwordBcrypt ? passwordBcrypt : user.password,
        cpf: cpf ? cpf : user.cpf,
        rg: rg ? rg : user.rg,
        birth: birth ? birth : user.birth,
        phone: phone ? phone : user.phone,
        gender: gender ? gender : user.gender
      })

      res.json(MESSAGE.SUCCESS.USER.UPDATED)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async registerAdmin(req: Request, res: Response) {
    try {
      const { name, email, password, confirmPassword } = req.body

      if (password !== confirmPassword)
        throw new Error(MESSAGE.ERROR.USER.PASS_ERROR)

      // verificar se o email existe no db
      const userExists = await User.findOne({ email })

      if (userExists) throw new Error(MESSAGE.ERROR.USER.EMAIL_ERROR)

      const salt = await bcrypt.genSalt(12)
      const passwordBcrypt = await bcrypt.hash(password, salt)

      const roleADM = 'admin'

      const user = new User({
        name,
        email,
        password: passwordBcrypt,
        confirmPassword: passwordBcrypt,
        role: roleADM
      })

      const newUser = await user.save()

      await createUserToken(newUser, res)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // verificar se o email existe no db
      const user = await User.findOne({ email })
      if (!user) throw new Error(MESSAGE.ERROR.USER.PASS_EMAIL)

      const checkPassword = bcrypt.compare(password, user.password)
      if (!checkPassword) throw new Error(MESSAGE.ERROR.USER.PASS_ERROR)

      await createUserToken(user, res)
    } catch (error) {
      res.status(401).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async checkUser(req: Request, res: Response) {
    if (req.headers.authorization) {
      const token = getToken(req)
      const decoded = decodedToken(token)

      const currentUser = await User.findById(decoded.id).select('-password -confirmPassword')
      res.status(200).send(currentUser)
    } else {
      res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params

      const user = await User.findById(id)
      if (!user) return res.status(404).json(MESSAGE.ERROR.USER.NOT_FOUND)

      await User.findByIdAndRemove(id)

      res.json(MESSAGE.SUCCESS.USER.DELETED)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async deleteCurrentUser(req: Request, res: Response) {
    // caso o usuário queira excluir a própria conta
    try {
      const { id } = req.params
      const token = getToken(req)

      const decoded = decodedToken(token)

      // verifica se o id da requisição corresponde ao id do token
      if (decoded.id !== id) {
        return res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
      }

      const user = await User.findByIdAndDelete(id)

      if (!user) {
        return res.status(404).json(MESSAGE.ERROR.USER.NOT_FOUND)
      }

      res.json({ message: MESSAGE.SUCCESS.USER.DELETED })
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async listUsers(req: Request, res: Response) {
    try {
      const users = await User.find()
      res.json(users)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }
}