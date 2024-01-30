/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from 'formik';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  Select,
  useToast
} from '@chakra-ui/react';
import styles from './EditProfile.module.scss';

interface UpdateUserProps {
  name: string;
  cpf: string;
  rg?: string | null;
  gender: string;
  birth?: string | null;
  phone: string;
  password: string;
  newpassword: string;
  confirmpassword: string;
}

const EditProfileSchema = Yup.object({
  newPassword: Yup.string(),
  confirmNewPassword: Yup.string().test(
    'passwords-match',
    'Os valores da senhas devem ser iguais',
    function (value) {
      return this.parent.newPassword === value;
    }
  )
});

export default function EditProfile() {
  const [userId, setUserId] = useState<string>(
    localStorage.getItem('userId') || ''
  );
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      name: '',
      cpf: '',
      rg: '',
      gender: '',
      dateOfBirth: '',
      phone: '',
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: EditProfileSchema,
    onSubmit: async values => {
      const formData = {
        name: values.name ? values.name : '',
        cpf: values.cpf ? values.cpf : '',
        rg: values.rg ? values.rg : '',
        gender: values.gender ? values.gender : '',
        birth: values.dateOfBirth ? values.dateOfBirth : '',
        phone: values.phone ? values.phone : '',
        password: values.password ? values.password : '',
        newpassword: values.newPassword ? values.newPassword : '',
        confirmpassword: values.confirmNewPassword
          ? values.confirmNewPassword
          : ''
      };
      try {
        const responseData = await updateUser(formData);
        if (responseData === 'Usuário atualizado com sucesso!') {
          formik.setSubmitting(false);
          formik.setStatus({ isSuccess: true });
          toast({
            title: 'Sucesso',
            description: 'Dados atualizados com sucesso.',
            status: 'success',
            duration: 9000,
            isClosable: true
          });
          navigate('/product');
        } else {
          toast({
            title: 'Erro ao atualizar cadastro.',
            description: 'Verifique se os seus dados estão corretos.',
            status: 'error',
            duration: 9000,
            isClosable: true
          });
        }
      } catch (error) {
        toast({
          title: 'Ocorreu um erro ao processar a requisição.',
          description: 'Por favor, tente novamente mais tarde.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  });

  const inputBackground = { background: 'gray.200' };
  const options = ['Feminino', 'Masculino'];

  const loadUserData = async () => {
    const token = localStorage.getItem('token');

    if (token && userId) {
      const response = await fetch(`${serverUrl}/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data) {
        formik.setValues({
          name: data.name,
          cpf: data.cpf,
          rg: data.rg ? data.rg : '',
          gender: data.gender,
          dateOfBirth: data.birth ? data.birth : '',
          phone: data.phone,
          password: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        localStorage.setItem('userData', JSON.stringify(data));
        setUserId(data._id);
      }
    } else {
      localStorage.removeItem('isLoggedIn');
      navigate('/');
    }
  };

  const updateUser = async (data: UpdateUserProps) => {
    const response = await fetch(`${serverUrl}/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <div>
      <h1 className={styles.h1}>Dados pessoais</h1>

      <Flex className={styles.flexName}>
        <Box className={styles.box}>
          <form onSubmit={formik.handleSubmit} title='Nome'>
            <VStack className={styles.vStack}>
              <FormControl>
                <FormLabel htmlFor="name">Nome Completo</FormLabel>
                <Input
                  sx={inputBackground}
                  id="name"
                  name="name"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </FormControl>
              <Flex className={styles.flex}>
                <FormControl>
                  <FormLabel htmlFor="cpf">Cpf</FormLabel>
                  <Input
                    sx={inputBackground}
                    id="cpf"
                    name="cpf"
                    type="number"
                    variant="filled"
                    maxLength={11}
                    onChange={e => {
                      if (e.target.value.length !== 11) {
                        formik.setFieldError(
                          'cpf',
                          'CPF deve ter 11 caracteres'
                        );
                      } else {
                        formik.setFieldError('cpf', undefined);
                      }
                      formik.handleChange(e);
                    }}
                    value={formik.values.cpf}
                    isInvalid={!!(formik.errors.cpf && formik.touched.cpf)}
                    errorBorderColor="red.300"
                  />
                  {formik.errors.cpf && formik.touched.cpf && (
                    <FormErrorMessage>{formik.errors.cpf}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="rg">Rg</FormLabel>
                  <Input
                    sx={inputBackground}
                    id="rg"
                    name="rg"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.rg}
                  />
                </FormControl>
              </Flex>
              <Flex className={styles.flex}>
                <FormControl>
                  <FormLabel htmlFor="gender">Sexo</FormLabel>
                  <Select
                    sx={inputBackground}
                    id="gender"
                    name="gender"
                    placeholder="Selecione uma opção"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.gender}
                  >
                    {options.map(option => (
                      <option key={option} value={option.toLowerCase()}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="dateOfBirth">
                    Data de Nascimento
                  </FormLabel>
                  <DatePicker
                    id="dateOfBirth"
                    name="dateOfBirth"
                    selected={
                      formik.values.dateOfBirth
                        ? new Date(formik.values.dateOfBirth)
                        : null
                    }
                    onChange={(date: Date) =>
                      formik.setFieldValue('dateOfBirth', date)
                    }
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    showMonthDropdown
                    className={styles.datepicker}
                  />
                </FormControl>
              </Flex>

              <Flex className={styles.flex}>
                <FormControl>
                  <FormLabel htmlFor="phone">Telefone</FormLabel>
                  <Input
                    sx={inputBackground}
                    id="phone"
                    name="phone"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                  />
                </FormControl>
              </Flex>
              <Flex className={styles.flex}>
                <FormControl>
                  <FormLabel htmlFor="password">Senha atual</FormLabel>
                  <Input
                    sx={inputBackground}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="newPassword">Nova senha</FormLabel>
                  <Input
                    sx={inputBackground}
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.newPassword}
                    isInvalid={!!formik.errors.confirmNewPassword}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="confirmNewPassword">
                    Confirmar nova senha
                  </FormLabel>
                  <Input
                    sx={inputBackground}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.confirmNewPassword}
                    isInvalid={!!formik.errors.confirmNewPassword}
                  />
                  {formik.errors.confirmNewPassword && (
                    <div className={styles.errorMessage}>
                      {formik.errors.confirmNewPassword}
                    </div>
                  )}
                </FormControl>
              </Flex>
              <button className={styles.button} type="submit">
                Salvar Alterações
              </button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </div>
  );
}
