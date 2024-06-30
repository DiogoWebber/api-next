import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from 'next/link';
import withAuth from '../../hocs/withAuth';
import styles from '../../styles/Home.module.css'; 

const UpdateUserLevelPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/user/users");
        setUsers(response.data);
      } catch (error) {
        setMessage("Erro ao buscar usuários.");
      }
    };
    fetchUsers();
  }, []);

  const toggleUserLevel = (userId) => {
    setUsers(
      users.map((user) =>
        user._id === userId
          ? { ...user, level: user.level === "ON" ? "OFF" : "ON" }
          : user
      )
    );
  };

  const applyChanges = async () => {
    try {
      const promises = users.map((user) =>
        axios.put(`http://localhost:3001/user/update-level/${user._id}`, {
          level: user.level,
        })
      );
      await Promise.all(promises);
      setMessage("Níveis dos usuários atualizados com sucesso.");
    } catch (error) {
      setMessage("Erro ao aplicar alterações.");
    }
  };

  return (
    <div className={styles.level}> 
      <div className={styles.containerLevel}>
        <h2>Atualizar Nível dos Usuários</h2>
        {users.map((user) => (
          <div key={user._id} className={styles.userRow}>
            <span>{user.username}</span>
            <span>Status: {user.level}</span>
            <button onClick={() => toggleUserLevel(user._id)}>
              {user.level === "ON" ? "Desativar" : "Ativar"}
            </button>
          </div>
        ))}
        <div className={styles.buttons}>
          <button onClick={applyChanges}>
            Aplicar Alterações
          </button>
          <Link href="/cadastrar/paginaadmin">
            <button>
              Voltar para Admin
            </button>
          </Link>
        </div>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default withAuth(UpdateUserLevelPage);
