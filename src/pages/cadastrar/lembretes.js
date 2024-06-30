import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, differenceInDays } from "date-fns";
import withAuth from '../../hocs/withAuth';
import Link from "next/link";
import styles from '../../styles/Home.module.css'; 

const Lembretes = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/transactions");
      if (response.status === 200) {
        const data = response.data;
        setTransactions(data);
      } else {
        throw new Error("Erro ao buscar transações");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return "-"; // Caso não haja data de vencimento

    const currentDate = new Date();
    const dueDateTime = new Date(dueDate);

    // Remove o horário da data atual para evitar problemas de comparação
    const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const dueDateWithoutTime = new Date(dueDateTime.getFullYear(), dueDateTime.getMonth(), dueDateTime.getDate());

    const diffDays = differenceInDays(dueDateWithoutTime, currentDateWithoutTime);

    if (diffDays > 0) {
      return diffDays + " dia(s) restante(s)";
    } else if (diffDays === 0) {
      return "Vence hoje";
    } else {
      return "Vencido";
    }
  };


  return (
    <div className={styles.level}> 
      <div className={styles.containerLevel}>
      <h2>Lembretes de Pagamento</h2>

      <table className={styles.tables}>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Tipo</th>
            <th>Vencimento</th>
            <th>Dias Restantes</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.description}</td>
              <td>{transaction.value.toFixed(2)}</td>
              <td>{transaction.categoria}</td>
              <td>{format(new Date(transaction.date), "yyyy-MM-dd")}</td>
              <td>{transaction.type === "entry" ? "Entrada" : "Saída"}</td>
              <td>{transaction.dueDate ? format(new Date(transaction.dueDate), "yyyy-MM-dd") : '-'}</td>
              <td>{calculateDaysRemaining(transaction.dueDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.admin}> 
      <Link href="/cadastrar/paginaadmin">
        <button style={{ padding: "10px 20px", cursor: "pointer" }}>
          Volta Pagina Admin
        </button>
      </Link>
    </div>
    </div>
    </div>
  );
};

export default withAuth(Lembretes);
