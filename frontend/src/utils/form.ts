export const submitAdminModalForm = async ({
  category,
  fields,
  formData,
  setIsOpen,
  token,
  toast,
  isUpdate,
  id,
}: any): Promise<any> => {
  const isMultipart = Object.keys(formData).includes('images');
  const formDataWithImage = new FormData();
  if (isMultipart) {
    fields.forEach((field: any) => {
      formDataWithImage.append(field, formData[field]);
    });
  }
  if (!token) {
    toast({
      title: 'Usuário não autenticado.',
      description: "Por favor realize o login ou cadastro antes de prosseguir.",
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
    setIsOpen(false);
  }
  try {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const fetchUrl = isUpdate ? `${serverUrl}/${category}/${id}` : `${serverUrl}/${category}`;
    const response = await fetch(`${fetchUrl}`, {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isMultipart ? {} : { 'Content-Type': 'application/json' })
      },
      body: isMultipart ? formDataWithImage : JSON.stringify(formData),
    });
    return await response.json();
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