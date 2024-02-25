import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  useToast,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import Link from '../Link';
import styles from "./ModalLogin.module.scss"

interface ModalLoginProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ModalLogin({ isOpen, setIsOpen }: ModalLoginProps) {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async values => {
      setIsLoading(true);
      try {
        const data = await loginUser(values.email, values.password);

        if (data.token) {
          if (data.role === 'admin') localStorage.setItem('isAdmin', 'true');

          await fetchUserData();

          localStorage.setItem('token', data.token);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', data.userId);

          formik.setValues({
            email: '',
            password: ''
          });

          formik.setSubmitting(false);
          formik.setStatus({ isSuccess: true });

          setIsOpen(false);
        } else {
          toast({
            title: 'Erro ao fazer login.',
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
      } finally {
        setIsLoading(false);
      }
    }
  });

  const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${serverUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
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

  const handleModalClose = () => {
    setIsOpen(false);
    formik.setSubmitting(false);
    formik.setStatus({ isSuccess: false });
  }

  return (
    <Modal isOpen={isOpen} onClose={() => handleModalClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Já possui uma conta?</ModalHeader>
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <label htmlFor="email">E-mail</label>
            <Input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              required={true}
              autoComplete='email'
            />{' '}
            <br />
            <label htmlFor="password">Senha</label>
            <Input
              type="password"
              id="password"
              name="password"
              autoComplete='new-password'
              onChange={formik.handleChange}
              value={formik.values.password}
              required={true}
            />

          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              w="100%"
              type="submit"
            >
              Entrar
            </Button>

          </ModalFooter>
          {isLoading && (
            <Flex justify="center" >
              <Spinner size='lg' />
            </Flex>
          )}
        </form>
        <ModalHeader>Ainda não é cadastrado?</ModalHeader>
        <ModalFooter>
          <Link redirect='/register' className={styles.link}>
            <Button
              colorScheme="green"
              w="100%"
            >
              Criar cadastro
            </Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}