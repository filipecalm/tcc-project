import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export default function LoginStatusListener() {
  const navigate = useNavigate();
  const toast = useToast();
  const lastStatusRef = useRef(localStorage.getItem('isLoggedIn')); // Armazena o último estado conhecido

  useEffect(() => {
    const checkLoginStatus = () => {
      const currentStatus = localStorage.getItem('isLoggedIn');

      // Verifica se o estado de login mudou desde a última verificação
      if (lastStatusRef.current !== currentStatus) {
        if (currentStatus === 'true') {
          // Usuário acabou de logar
          toast({
            title: 'Login realizado com sucesso.',
            description: "Bem-vindo novamente à Livraria.",
            status: 'success',
            duration: 5000,
            isClosable: true,
            onCloseComplete: () => navigate('/product'),
          });
        } 
        lastStatusRef.current = currentStatus;
      }
    };

    // Define um intervalo para a verificação periódica do estado de login
    const intervalId = setInterval(checkLoginStatus, 1000); // Verifica a cada 1 segundo

    return () => clearInterval(intervalId); // Limpa o intervalo quando o componente desmontar
  }, [navigate, toast]); // Dependências do useEffect

  return null; // Este componente não renderiza nada
}
