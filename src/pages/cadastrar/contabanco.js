import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from "next/link";
import styles from '../../styles/Home.module.css'; 

import withAuth from '@/hocs/withAuth';

const AddAccountForm = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/accounts");
      setAccounts(response.data);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const submitAccount = async () => {
    try {
      const response = await axios.post("http://localhost:3001/accounts", {
        accountName,
        bank,
        accountNumber,
        balance: parseFloat(balance)
      });

      if (response.data.success) {
        fetchAccounts(); // Atualiza a lista de contas após adição bem sucedida
        setAccountName("");
        setBank("");
        setAccountNumber("");
        setBalance("");
      } else {
        alert("Erro ao cadastrar conta bancária. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar conta bancária. Por favor, tente novamente.");
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await axios.delete(`http://localhost:3001/accounts/${accountId}`);
      fetchAccounts(); // Atualiza a lista de contas após exclusão bem sucedida
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir conta bancária. Por favor, tente novamente.");
    }
  };

  return (
    <div className={styles.level}>
    <div className={styles.containerLevel}>
      <h2>CADASTRO DE CONTAS BANCÁRIAS</h2>
      <div className={styles.entrysection}>
        <h3>Nova conta bancária</h3>
        <div className="entry-form">
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Nome da Conta"
            required
          />
          <input
            type="text"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            placeholder="Banco"
            required
          />
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Número da Conta"
            required
          />
          <input
            type="text"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="Saldo Inicial"
            required
          />
          <button onClick={submitAccount}>Cadastrar Conta</button>
        </div>
      </div>
      {/* Tabela de Contas Bancárias */}
      <div className={styles.contas}>
  <table className={styles.tables}>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Banco</th>
        <th>Número</th>
        <th>Saldo</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {accounts.map((account) => (
        <tr key={account._id}>
          <td>{account.accountName}</td>
          <td>{account.bank}</td>
          <td>{account.accountNumber}</td>
          <td>{account.balance.toFixed(2)}</td>
          <td>
            <button onClick={() => handleDeleteAccount(account._id)}>
              Excluir
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<div className={styles.admin} >
      <Link href="/cadastrar/paginaadmin">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Voltar a Pagina Admin
          </button>
        </Link>
    </div>
    </div> </div>
  );
};

export default withAuth(AddAccountForm);
