import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link'; // Importe o Link do next/link
import styles from '../styles/styles.module.css';


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

    router.push('/cadastrar/user');
  };

  return (
    <div className={styles.containerMaior}> 
    <div className={styles.container}>
      {errorAlert && <div className="alert alert-danger">{errorAlert}</div>}
      
      <h2>CONECTE-SE</h2>
      <form onSubmit={handleLogin}>
        <label id="user">
          Usuário:
          <input type="text" value={username} onChange={handleUsernameChange} required />
        </label>
        <br />
        <label>
          Senha:
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>

      <button onClick={handleCreateAccount}>Criar conta</button>
      
    </div>
    </div>
  );
}
