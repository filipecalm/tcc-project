import { Button, Input, FormControl, Select, useToast } from '@chakra-ui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { submitAdminModalForm } from '../../utils/form';
import { useEffect, useState } from 'react';

export default function OrderAdminForm({ setIsOpen, data, onClose }: any) {
  const OrderSchema = Yup.object({
    userId: Yup.string().required('O ID do usuário é obrigatório.'),
    productId: Yup.string().required('Id do produto é obrigatório'),
    amount: Yup.number().required('A quantidade de produtos é obrigatória.')
  });
  const toast = useToast();
  const token = localStorage.getItem('token');

  interface Product {
    _id: string;
    name: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL
    const fetchProducts = async () => {
      const response = await fetch(`${serverUrl}/product`);
      const products = await response.json() as Product[];
      setProducts(products);
    };
    fetchProducts();
  }, []);

  const emptyInitialValues = {
    userId: '',
    productId: '',
    amount: 1
  };
  const initialValues = data ? data : emptyInitialValues;

  const formik = useFormik({
    initialValues,
    onSubmit: async formData => {
      const isUpdate = data ? true : false;
      const operation = isUpdate ? 'atualizado' : 'cadastrado';
      const parsedFormData = {
        product: [
          {
            productId: formData.productId,
            amount: formData.amount
          }
        ],
        userId: formData.userId
      };
      const submitFormParams = {
        category: 'cart',
        fields: Object.keys(emptyInitialValues),
        formData: parsedFormData,
        setIsOpen,
        token,
        isUpdate,
        id: data ? data._id : '',
        toast
      };
      const response = await submitAdminModalForm(submitFormParams);
      if (response !== 'Acesso Negado!') {
        formik.setSubmitting(false);
        formik.setStatus({ isSuccess: true });

        toast({
          title: 'Sucesso.',
          description: `Seu pedido foi ${operation}.`,
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
    validationSchema: OrderSchema
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl mt={4}>
        <Input
          id="userId"
          name="userId"
          placeholder="User ID"
          value={formik.values.userId}
          onChange={formik.handleChange}
          required={true}
        />
      </FormControl>
      <FormControl mt={4}>
      <Select
          id="productId"
          name="productId"
          placeholder="Produto"
          value={formik.values.productId}
          onChange={formik.handleChange}
          required={true}
        >
          <option value="">Selecione um produto</option>
          {products.map(product => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mt={4}>
        <Input
          id="amount"
          name="amount"
          placeholder="Quantidade"
          type="number"
          value={formik.values.amount}
          onChange={formik.handleChange}
          required={true}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        mr={3}
        type="submit"
        sx={{ margin: '10px' }}
      >
        Salvar
      </Button>
      <Button onClick={() => onClose()} sx={{ margin: '10px' }}>
        Cancelar
      </Button>
    </form>
  );
}
