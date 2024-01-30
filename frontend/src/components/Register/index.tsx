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

interface FetchProps {
  name: string;
  email: string;
  cpf: string;
  rg?: string | null;
  gender: string;
  birth?: string | null;
  phone: string;
  password: string;
  confirmpassword: string;
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
    onSubmit: async values => {
      const formData = {
        name: values.name,
        email: values.email,
        cpf: values.cpf.toString(),
        rg: values.rg ? values.rg.toString() : undefined,
        gender: values.gender,
        birth: values.dateOfBirth ? new Date(values.dateOfBirth).toLocaleDateString('en-US', { timeZone: 'America/Sao_Paulo', month: '2-digit', day: '2-digit', year: 'numeric' }) : undefined,
        phone: values.phone.toString(),
        password: values.password,
        confirmpassword: values.passwordConfirmation
      }
      try {
        const responseData = await registerUser(formData);
        if (responseData.token) {
          localStorage.setItem('token', responseData.token);
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

          toast({
            title: 'Cadastro realizado com sucesso.',
            description: "Bem vindo à Livraria.",
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          navigate('/product');
        } else {
          toast({
            title: 'Erro ao fazer o cadastro.',
            description: "Verifique se os seus dados estão corretos.",
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          localStorage.setItem('isLoggedIn', 'false');
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

  const inputBackground = { background: 'gray.200' };
  const genderOptions = ['Feminino', 'Masculino'];

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
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.rg}
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