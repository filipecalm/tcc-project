import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
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
import styles from './Register.module.scss';
import { formatCPF, formatRG } from '../../utils/utilsFunc'

interface FetchProps {
  name: string;
  email: string;
  cpf: string;
  rg?: string | null;
  gender: string;
  birth?: string | null;
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignupSchema = Yup.object({
  password: Yup.string().required('Password is required'),
  passwordConfirmation: Yup.string()
    .test('passwords-match', 'Os valores da senhas devem ser iguais', function (value) {
      return this.parent.password === value
    })
});

export default function Register() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const toast = useToast();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      cpf: '',
      rg: '',
      gender: '',
      dateOfBirth: '',
      phone: '',
      password: '',
      passwordConfirmation: ''
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      const formData = {
        name: values.name,
        email: values.email,
        cpf: values.cpf.replace(/\D/g, '').toString(),
        rg: values.rg ? values.rg.toString() : null,
        gender: values.gender,
        birth: values.dateOfBirth ? new Date(values.dateOfBirth).toLocaleDateString('en-US', { timeZone: 'America/Sao_Paulo', month: '2-digit', day: '2-digit', year: 'numeric' }) : undefined,
        phone: values.phone.toString(),
        password: values.password,
        confirmPassword: values.passwordConfirmation
      }
      try {
        const response = await registerUser(formData);
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('isLoggedIn', 'true');
          formik.setValues({
            name: '',
            email: '',
            cpf: '',
            rg: '',
            gender: '',
            dateOfBirth: '',
            phone: '',
            password: '',
            passwordConfirmation: '',
          });
          formik.setSubmitting(false);
          formik.setStatus({ isSuccess: true });
          localStorage.setItem('userData', JSON.stringify(formData));

          await fetchUserData()

          toast({
            title: 'Cadastro realizado com sucesso.',
            description: "Bem vindo à Livraria.",
            status: 'success',
            duration: 5000,
            isClosable: true,
            onCloseComplete: () => navigate('/product'),
          });
        } else {
          localStorage.setItem('isLoggedIn', 'false');
          toast({
            title: 'Erro de Cadastro',
            description: response.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      } catch (error) {
        localStorage.setItem('isLoggedIn', 'false');
        toast({
          title: 'Ocorreu um erro ao processar a requisição.',
          description: 'Por favor, tente novamente mais tarde.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  const registerUser = async (data: FetchProps) => {
    const response = await fetch(`${serverUrl}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  };

  async function fetchUserData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`${serverUrl}/user/me/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar dados do usuário');
      }

      const userData = await response.json();
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('role', userData.role);

      return userData;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  }

  const inputBackground = {
    background: 'white',
    color: 'black',
    '&:hover': {
      backgroundColor: '#ADD8E6',
    },
    '&:focus': {
      backgroundColor: 'white',
    },
  };

  const genderOptions = ['Feminino', 'Masculino'];
  const now = new Date();

  return (
    <div>
      <h1 className={styles.h1}>Cadastre-se</h1> <br />
      <h3 className={styles.h3}>Preencha abaixo os seus dados pessoais</h3>
      <Flex className={styles.flexName}>
        <Box className={styles.box}>
          <form onSubmit={formik.handleSubmit}>
            <VStack className={styles.vStack}>
              <FormControl>
                <FormLabel htmlFor="name">Nome Completo<span className={styles.red_asterisk}></span></FormLabel>
                <Input
                  className={styles.input}
                  sx={inputBackground}
                  id="name"
                  name="name"
                  variant="filled"
                  required={true}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">E-mail<span className={styles.red_asterisk}></span></FormLabel>
                <Input
                  className={styles.input}
                  sx={inputBackground}
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required={true}
                  autoComplete="email"
                />
              </FormControl>

              <Flex className={styles.flex}>
                <FormControl>
                  <FormLabel htmlFor="cpf">CPF<span className={styles.red_asterisk}></span></FormLabel>
                  <Input
                    className={styles.input}
                    sx={inputBackground}
                    id="cpf"
                    name="cpf"
                    type="text"
                    variant="filled"
                    maxLength={14}
                    onChange={e => {
                      e.target.value = formatCPF(e.target.value);
                      formik.handleChange(e);
                    }}
                    value={formatCPF(formik.values.cpf)}
                    isInvalid={!!(formik.errors.cpf && formik.touched.cpf)}
                    errorBorderColor="red.300"
                    required={true}
                  />
                  {formik.errors.cpf && formik.touched.cpf && (
                    <FormErrorMessage>{formik.errors.cpf}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="rg">RG</FormLabel>
                  <Input
                    className={styles.input}
                    sx={inputBackground}
                    id="rg"
                    name="rg"
                    type="text"
                    variant="filled"
                    onChange={e => {
                      e.target.value = formatRG(e.target.value);
                      formik.handleChange(e);
                    }}
                    maxLength={15}
                    value={formatRG(formik.values.rg)}
                  />
                </FormControl>
              </Flex>
              <Flex className={styles.flex}>
                <FormControl>
                  <FormLabel htmlFor="gender">Sexo<span className={styles.red_asterisk}></span></FormLabel>
                  <Select
                    sx={inputBackground}
                    id="gender"
                    name="gender"
                    placeholder="Selecione uma opção"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.gender}
                    required={true}
                  >
                    {genderOptions.map(option => (
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
                    maxDate={now}
                    className={styles.datepicker}
                  />
                </FormControl>
              </Flex>

              <Flex className={styles.flex}>
                <FormControl>
                  <FormLabel htmlFor="phone">Telefone<span className={styles.red_asterisk}></span></FormLabel>
                  <Input
                    className={styles.input}
                    sx={inputBackground}
                    id="phone"
                    name="phone"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    required={true}
                  />
                </FormControl>
              </Flex>
              <Flex className={styles.flex}>
                <FormControl>
                  <FormLabel htmlFor="password">Senha<span className={styles.red_asterisk}></span></FormLabel>
                  <Input
                    className={styles.input}
                    sx={inputBackground}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    required={true}
                    isInvalid={!!formik.errors.passwordConfirmation}
                    autoComplete="current-password"
                  />
                  {formik.errors.passwordConfirmation && (
                    <div className={styles.errorMessage}>{formik.errors.passwordConfirmation}</div>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="passwordConfirmation">
                    Confirmar senha<span className={styles.red_asterisk}></span>
                  </FormLabel>
                  <Input
                    className={styles.input}
                    sx={inputBackground}
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.passwordConfirmation}
                    required={true}
                    isInvalid={!!formik.errors.passwordConfirmation}
                    autoComplete="current-password"
                  />
                </FormControl>
              </Flex>
              <button className={styles.button} type="submit">
                Finalizar Cadastro
              </button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </div>
  );
}