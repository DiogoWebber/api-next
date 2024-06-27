import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'; // Importa useRouter do Next.js

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  const router = useRouter(); // Instancia useRouter para navegação
  
  useEffect(() => {
    ;
  }, []);


  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/user/login', {
        username,
        password
      });
      console.log(response.data);

      // Aqui você pode adicionar lógica para redirecionar para outra página após o login bem-sucedido
      // Exemplo:
      router.push('cadastrar/paginaadmin');
      
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorAlert('Usuário ou senha inválidos.'); // Exemplo de mensagem de erro genérica
      setTimeout(() => {
        setErrorAlert('');
      }, 3000); // Limpa o alerta após 3 segundos
    }
  };

  const handleCreateAccount = () => {
    // Redireciona para a página de cadastro de usuário
    router.push('./cadastrar/user');
  };

  return (
    <div>
      {errorAlert && <div className="alert alert-danger">{errorAlert}</div>}
      
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>

      <button onClick={handleCreateAccount}>Create Account</button>
    </div>
  );
}
