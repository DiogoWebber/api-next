import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { checkAuth } from '../utils/auth';
import { ClipLoader } from 'react-spinners';

const withAuth = (WrappedComponent) => {
  return (props) => { // Inicializar como false
    const [isActive, setIsActive] = useState(true);
    const router = useRouter();

    useEffect(() => {
      verifyToken();
    }, []);
    
    const verifyToken = async () => {
      try {
        console.log('Verificando Token');
        const auth = await checkAuth();
    
        console.log('Resultado da verificação:', auth); // Adicione este log para verificar o que está sendo retornado
    
        if (!auth.isValid) {
          console.log('Token inválido. Redirecionando para a página de login.');
          localStorage.removeItem('token'); // Remover apenas se o token for inválido
          router.push('/');
          return;
        }
    
        // Restante do código de verificação
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        localStorage.removeItem('token'); // Em caso de erro, limpar o token e redirecionar para a página de login
        router.push('/');
      }
    };

    if (!isActive) {
      return (
        <div style={styles.spinnerContainer}>
          <strong>Usuário desativado!</strong>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

const styles = {
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '200px 0px',
    alignItems: 'center'
  },
};

export default withAuth;
