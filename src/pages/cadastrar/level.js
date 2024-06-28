import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from 'next/link';

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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Atualizar Nível dos Usuários</h2>
      {users.map((user) => (
        <div
          key={user._id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span style={{ flex: 1 }}>{user.username}</span>
          <span style={{ marginRight: "10px" }}>Status: {user.level}</span>
          <button
            onClick={() => toggleUserLevel(user._id)}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            {user.level === "ON" ? "Desativar" : "Ativar"}
          </button>
        </div>
      ))}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={applyChanges}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Aplicar Alterações
        </button>
        <Link href="/cadastrar/paginaadmin">
          <button
            style={{
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Voltar para Admin
          </button>
        </Link>
      </div>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default UpdateUserLevelPage;
