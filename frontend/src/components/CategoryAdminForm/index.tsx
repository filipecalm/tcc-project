import { Button, Input, FormControl, useToast } from '@chakra-ui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { submitAdminModalForm } from '../../utils/form';
import { Category } from '../../types';

export default function CategoryAdminForm({ setIsOpen, data, onClose }: any) {
  const categorySchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório')
  });
  const toast = useToast();
  const token = localStorage.getItem('token');
  const serverUrl = process.env.REACT_APP_SERVER_URL
  const emptyInitialValues = {
    name: ''
  };
  const initialValues = data ? data : emptyInitialValues;

  const formik = useFormik({
    initialValues,
    onSubmit: async formData => {
      const isUpdate = data ? true : false;
      const operation = isUpdate ? 'atualizada' : 'cadastrada';
      const submitFormParams = {
        category: 'category',
        fields: Object.keys(emptyInitialValues),
        formData,
        setIsOpen,
        token,
        isUpdate,
        id: data ? data._id : '',
        toast
      };

      // Adiciona uma verificação para checar se o nome da categoria já existe
      const existingCategory = await checkIfCategoryExists(formData.name);
      if (existingCategory) {
        return toast({
          title: 'Erro ao fazer a operação.',
          description: 'O nome da categoria já existe.',
          status: 'error',
          duration: 9000,
          isClosable: true
        });
      }

      const response = await submitAdminModalForm(submitFormParams);
      if (response !== 'Acesso Negado!') {
        formik.setSubmitting(false);
        formik.setStatus({ isSuccess: true });

        toast({
          title: 'Sucesso.',
          description: `Sua categoria foi ${operation}.`,
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
    validationSchema: categorySchema
  });

  const checkIfCategoryExists = async (name: string) => {
    const response = await fetch(`${serverUrl}/category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    const existingCategory = result.find((category: Category) => category.name === name);
    return existingCategory ? true : false;
  };

  return (
    <form onSubmit={formik.handleSubmit} title='Nome'>
      <FormControl mt={4} label='Nome'>
        <Input
          id="name"
          name="name"
          placeholder="Nome"
          value={formik.values.name}
          onChange={formik.handleChange}
          required={true}
        />
      </FormControl>
      <Button colorScheme="blue" sx={{ margin: '20px 0' }} mr={3} type="submit">
        Salvar
      </Button>
      <Button onClick={() => onClose()}>Cancelar</Button>
    </form>
  );
}
