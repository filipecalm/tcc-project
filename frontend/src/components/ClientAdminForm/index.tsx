import { Input, FormControl, useToast, Select, Button } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { submitAdminModalForm } from '../../utils/form';
import styles from './ClientAdminForm.module.scss';
import { formatCPF } from '../../utils/utilsFunc'

export default function ClientAdminForm({ setIsOpen, data, onClose }: any) {
  const isUpdate = data ? true : false;
  const method = isUpdate ? 'PUT' : 'POST';

  const clientSchema = Yup.object({
    name: isUpdate
      ? Yup.string()
      : Yup.string()
        .required('Nome é obrigatório'),
    cpf: isUpdate ? Yup.string() : Yup.string().required('CPF é obrigatório'),
    rg: Yup.string(),
    birth: Yup.string(),
    phone: isUpdate
      ? Yup.string()
      : Yup.string().required('Telefone é obrigatório'),
    password: isUpdate
      ? Yup.string().min(8)
      : Yup.string().required('Senha é obrigatória').min(8, 'Senha deve ter no mínimo 8 caracteres'),
    confirmPassword: isUpdate
      ? Yup.string().min(8)
      : Yup.string().test(
        'passwords-match',
        'Os valores das senhas devem ser iguais',
        function (value) {
          return this.parent.password === value;
        }
      ).min(8, 'Senha deve ter no mínimo 8 caracteres'),

    gender: isUpdate
      ? Yup.string()
      : Yup.string().required('Gênero é obrigatório')
  });


  if (isUpdate)
    clientSchema.shape({
      newpassword: Yup.string().test(
        'passwords-match',
        'Os valores da senhas devem ser iguais',
        function (value) {
          return this.parent.confirmPassword === value;
        }
      )
    });

  const toast = useToast();
  const token = localStorage.getItem('token');

  const emptyInitialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    rg: '',
    birth: '',
    phone: '',
    gender: ''
  };
  const initialValues = isUpdate
    ? { ...data, newpassword: '' }
    : emptyInitialValues;

  const formik = useFormik({
    initialValues,
    onSubmit: async formData => {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const serverUrl = process.env.REACT_APP_SERVER_URL;

      const operation = isUpdate ? 'atualizado' : 'cadastrado';
      const cpfOnlyNumbers = formData.cpf.replace(/\D/g, '');
      const submitFormParams = {
        category: 'user',
        fields: Object.keys(emptyInitialValues),
        formData: {
          ...formData,
          cpf: cpfOnlyNumbers.toString(),
          rg: formData.rg ? formData.rg.toString() : undefined,
          birth: formData.birth
            ? new Date(formData.birth).toLocaleDateString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            })
            : undefined,
          phone: formData.phone.toString()
        },
        setIsOpen,
        token,
        isUpdate,
        id: data ? data._id : '',
        toast,
        method
      };

      const parsedData = {
        ...submitFormParams.formData,
        userId: data ? data._id : undefined
      };

      const existingUser = await fetch(`${serverUrl}/user/${parsedData.userId}`, {
        headers
      });

      if (existingUser.status === 200 && !isUpdate) {
        formik.setFieldError('name', 'Já existe um usuário com esse nome');
        return;
      }

      const response = await submitAdminModalForm(submitFormParams);
      if (response !== 'Acesso Negado!') {
        formik.setSubmitting(false);
        formik.setStatus({ isSuccess: true });

        toast({
          title: 'Sucesso.',
          description: `Cliente ${operation}.`,
          status: 'success',
          duration: 9000,
          isClosable: true
        });
        setIsOpen(false);
      } else {
        toast({
          title: 'Erro ao fazer a operação.',
          description: 'Por favor tente novamente.',
          status: 'error',
          duration: 9000,
          isClosable: true
        });
      }
    },
    validationSchema: clientSchema
  });

  return (
    <form onSubmit={formik.handleSubmit} title='Nome'>
      <FormControl mt={4} title='Nome'>
        <Input
          id="name"
          name="name"
          placeholder="Nome"
          value={formik.values.name}
          onChange={formik.handleChange}
          required={!isUpdate}
          autoComplete='Nome'
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          required={!isUpdate}
          autoComplete='Email'
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="cpf"
          name="cpf"
          type="text"
          maxLength={14}
          onChange={e => {
            const formattedValue = formatCPF(e.target.value);
            e.target.value = formattedValue;
            if (formattedValue.replace(/\D/g, '').length !== 11) {
              formik.setFieldError(
                'cpf',
                'CPF deve ter 11 caracteres numéricos'
              );
            } else {
              formik.setFieldError('cpf', undefined);
            }
            formik.handleChange(e);
          }}
          value={formatCPF(formik.values.cpf)}
          isInvalid={!!(formik.errors.cpf && formik.touched.cpf)}
          errorBorderColor="red.300"
          placeholder="CPF (Digite apenas números)"
          required={!isUpdate}
          autoComplete='CPF'
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="rg"
          name="rg"
          type="number"
          placeholder="RG (Digite apenas números)"
          onChange={formik.handleChange}
          value={formik.values.rg}
          autoComplete='RG'
        />
      </FormControl>
      <FormControl mt={4}>
        <Select
          id="gender"
          name="gender"
          placeholder="Sexo"
          variant="filled"
          onChange={formik.handleChange}
          value={formik.values.gender}
          required={!isUpdate}
          autoComplete='Sexo'
        >
          {['Masculino', 'Feminino'].map(option => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mt={4}>
        <DatePicker
          id="birth"
          name="birth"
          selected={formik.values.birth ? new Date(formik.values.birth) : null}
          onChange={(date: Date) => formik.setFieldValue('birth', date)}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          yearDropdownItemNumber={100}
          scrollableYearDropdown
          showMonthDropdown
          className={styles.datepicker}
          placeholderText="Data de Nascimento"
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="phone"
          name="phone"
          type="number"
          variant="filled"
          onChange={formik.handleChange}
          value={formik.values.phone}
          placeholder="Telefone"
          autoComplete='Telefone'
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="password"
          name="password"
          type="password"
          variant="filled"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="Senha"
          autoComplete="current-password"
          isInvalid={!!formik.errors.password}
          required={!isUpdate}
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          variant="filled"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          placeholder="Confirmar Senha"
          autoComplete="current-password"
          isInvalid={!!formik.errors.confirmPassword}
        />
      </FormControl>
      {isUpdate && (
        <FormControl mt={4}>
          <Input
            id="newpassword"
            name="newpassword"
            type="password"
            variant="filled"
            onChange={formik.handleChange}
            value={formik.values.newpassword}
            placeholder="Nova Senha"
            isInvalid={!!formik.errors.newpassword}
          />
        </FormControl>
      )}

      <Button colorScheme="blue" sx={{ margin: '20px 0' }} mr={3} type="submit"
        onClick={() => {
          if (formik.errors.password && formik.touched.password) {
            toast({
              title: 'Senha inválida',
              description: 'A senha deve ter pelo menos 8 caracteres',
              status: 'warning',
              duration: 5000,
              isClosable: true
            });
          }
          formik.handleSubmit();
        }}>
        Salvar
      </Button>
      <Button onClick={() => onClose()}>Cancelar</Button>
    </form>
  );
}