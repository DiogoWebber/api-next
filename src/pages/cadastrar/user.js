import axios from "axios";
import { useEffect, useState } from "react";
import Link from 'next/link'; 
import styles from '../../styles/styles.module.css'; 

export default function Home() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorAlert, setErrorAlert] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/user/users');
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3001/user/create-user', {
        username,
        password,
        email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      // Limpa os campos do formulário após a criação bem-sucedida
      setUsername('');
      setPassword('');
      setEmail('');
      // Atualiza a lista de usuários após a criação bem-sucedida
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response && error.response.status === 400) {
        setErrorAlert('Usuário já existe!'); // Exemplo de mensagem de erro específica
        // Você pode adicionar lógica adicional aqui para lidar com diferentes tipos de erros
      } else {
        setErrorAlert('Erro ao criar usuário.');
      }
      setTimeout(() => {
        setErrorAlert('');
      }, 3000); // Limpa o alerta após 3 segundos
    }
  };

  return (
    <div className={styles.containerUsers}>
      {errorAlert && <div className="alert alert-danger">{errorAlert}</div>}
      <div> 
      <div className={styles.containerMeio}>
  <h2>CRIAR USUÁRIO</h2>
  <form onSubmit={handleSubmit}>
    <label>
     Usuário:
      <input type="text" value={username} onChange={handleUsernameChange} required />
    </label>
    <label>
      Senha:
      <input type="password" value={password} onChange={handlePasswordChange} required />
    </label>
    <label>
      Email:
      <input type="email" value={email} onChange={handleEmailChange} required />
    </label>
    <button type="submit">Criar usuário</button>
  </form>

  <div className="link-container">
    <Link href="/">
      <button>Voltar para Admin</button>
    </Link>
  </div>
</div>

        </div>
    </div>

  );
}
