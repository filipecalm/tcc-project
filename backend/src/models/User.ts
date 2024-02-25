import mongoose from 'mongoose';

interface IUser extends Document {
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

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  newpassword: {
    type: String,
    trim: true
  },
  confirmPassword: {
    type: String,
    trim: true
  },
  role: {
    type: String,
  },
  cpf: {
    type: String,
    trim: true
  },
  rg: {
    type: String,
    trim: true
  },
  birth: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  gender:{
    type: String,
    trim: true
  }
})

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
