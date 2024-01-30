/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Input, FormControl, Select, useToast } from '@chakra-ui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { submitAdminModalForm } from '../../utils/form';
import { useEffect, useState } from 'react';

interface InputProps {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  required: boolean;
}

export default function ProductAdminForm({ setIsOpen, data, onClose }: any) {
  const productSchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório'),
    price: Yup.number().required('Preço é obrigatório'),
    description: Yup.string().required('Descrição é obrigatório'),
    categoryid: Yup.string().required('Categoria é obrigatório'),
    images: Yup.mixed()
  });

  interface Category {
    _id: string;
    name: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/category`);
      const categories = await response.json() as Category[];
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  const toast = useToast();
  const token = localStorage.getItem('token');

  const emptyInitialValues = {
    name: '',
    price: '',
    description: '',
    categoryid: '',
    images: null
  };

  const [initialValues, setInitialValues] = useState(data ? { ...data, categoryid: data.categoryid?._id } : emptyInitialValues);

  const formik = useFormik({
    initialValues,
    onSubmit: async formData => {
      const isUpdate = data ? true : false;
      const operation = isUpdate ? 'atualizado' : 'cadastrado';
      const submitFormParams = {
        category: 'product',
        fields: Object.keys(emptyInitialValues),
        formData,
        setIsOpen,
        token,
        isUpdate,
        id: data ? data._id : '',
        toast
      };
      const response = await submitAdminModalForm(submitFormParams);

      if (response === 'Acesso Negado!' || response === 'Já existe um produto com este nome! Por favor, utilize outro nome!') {
        toast({
          title: 'Erro ao fazer a operação.',
          description: 'Por favor tente novamente.',
          status: 'error',
          duration: 9000,
          isClosable: true
        });

      } else if (response !== 'Acesso Negado!') {
        formik.setSubmitting(false);
        formik.setStatus({ isSuccess: true });

        toast({
          title: 'Sucesso.',
          description: `Seu produto foi ${operation}.`,
          status: 'success',
          duration: 9000,
          isClosable: true
        });
        setIsOpen(false);

      }
    },
    validationSchema: productSchema
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl mt={5}>
        <Input
          id="name"
          name="name"
          placeholder="Nome"
          value={formik.values.name}
          onChange={formik.handleChange}
          required={true}
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="Preço"
          value={formik.values.price}
          onChange={formik.handleChange}
          required={true}
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="description"
          name="description"
          placeholder="Descrição"
          value={formik.values.description}
          onChange={formik.handleChange}
          required={true}
        />
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="images"
          name="images"
          placeholder="Imagem"
          type="file"
          onChange={(event) => {
            const file = event.currentTarget.files && event.currentTarget.files[0];
            if (file) {
              formik.setFieldValue('images', file);
            }
          }}
          required={!data}
        />
      </FormControl>
      <FormControl mt={4}>
        <Select
          id="category"
          name="category"
          placeholder="Categoria"
          value={formik.values.category}
          onChange={event => {
            formik.setFieldValue('category', event.target.value);
            const category = categories.find((cat: { name: string; }) => cat.name === event.target.value);
            const categoryId = category ? category._id : '';
            formik.setFieldValue('categoryid', categoryId);
          }}
          required={true}
        >
          {Array.isArray(categories) && categories.map(cat => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <Button
        colorScheme="blue"
        mr={3}
        sx={{ marginTop: '20px' }}
        type="submit"
        disabled={formik.isSubmitting}
      >
        Salvar
      </Button>
      <Button onClick={() => onClose()} sx={{ marginTop: '20px' }}>
        Cancelar
      </Button>
    </form>
  );
}
