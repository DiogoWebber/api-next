import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link'; // Importe o Link do next/link

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    // Qualquer lógica de efeito desejada
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

      localStorage.setItem('token', response.data.data.token);
      console.log(response.data);

      // Redireciona para a página de administração após o login bem-sucedido
      router.push('/cadastrar/paginaadmin');
      
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorAlert('Usuário ou senha inválidos.');
      setTimeout(() => {
        setErrorAlert('');
      }, 3000);
    }
  };

  const handleCreateAccount = () => {
    // Redireciona para a página de cadastro de usuário
    router.push('/cadastrar/user');
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
