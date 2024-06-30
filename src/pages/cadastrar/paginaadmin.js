import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Link from "next/link";
import withAuth from "../../hocs/withAuth";

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [entryTotal, setEntryTotal] = useState(0);
  const [exitTotal, setExitTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editDate, setEditDate] = useState(new Date());
  const [editDueDate, setEditDueDate] = useState(new Date());
  const [editType, setEditType] = useState("entry");
  const [categorias, setCategorias] = useState([]);
  const [editCategoria, setEditCategoria] = useState("");
  const [editAccount, setEditAccount] = useState("");
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/accounts");
      setAccounts(response.data);
    } catch (error) {
      console.error("Erro ao buscar contas bancárias:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/categorias/all");
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/transactions");
      if (!response.ok) {
        throw new Error("Erro ao buscar transações");
      }
      const data = await response.json();
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setTransactions(data);
      updateTotals(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  const updateTotals = (transactions) => {
    let entrySum = 0;
    let exitSum = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "entry") {
        entrySum += transaction.value;
      } else if (transaction.type === "exit") {
        exitSum += transaction.value;
      }
    });

    setEntryTotal(entrySum);
    setExitTotal(exitSum);
    setTotal(entrySum - exitSum);
  };

  const handleTransactionSubmit = async () => {
    const transaction = {
      description: editDescription,
      value: parseFloat(editValue),
      date: editDate,
      dueDate: editDueDate,
      type: editType,
      categoria: editCategoria,
      accountName: editAccount,
    };

    try {
      const response = await fetch("http://localhost:3001/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar transação");
      }

      const data = await response.json();
      if (data.success) {
        fetchTransactions();
        clearTransactionForm();
      } else {
        alert("Erro ao adicionar transação. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert("Erro ao adicionar transação. Por favor, tente novamente.");
    }
  };

  const handleEditSubmit = async () => {
    const editedTransaction = {
      _id: editingTransaction._id,
      description: editDescription,
      value: parseFloat(editValue),
      type: editType,
      date: editDate,
      dueDate: editDueDate,
      categoria: editCategoria,
      accountName: editAccount
    };

    try {
      const response = await fetch(
        `http://localhost:3001/api/transactions/${editedTransaction._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedTransaction),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao editar transação: " + response.statusText);
      }

      fetchTransactions();
      closeEditModal();
    } catch (error) {
      console.error("Erro ao editar transação:", error);
      alert("Erro ao editar transação. Por favor, tente novamente.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/transactions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir transação");
      }

      fetchTransactions();
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      alert("Erro ao excluir transação. Por favor, tente novamente.");
    }
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setEditDescription(transaction.description);
    setEditValue(transaction.value.toString());
    setEditType(transaction.type);
    setEditCategoria(transaction.categoria);
    setEditDate(new Date(transaction.date));
    setEditDueDate(transaction.dueDate ? new Date(transaction.dueDate) : new Date());
    setEditAccount(transaction.accountName);
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
    clearTransactionForm();
  };

  const clearTransactionForm = () => {
    setEditDescription("");
    setEditValue("");
    setEditDate(new Date());
    setEditDueDate(new Date());
    setEditCategoria("");
    setEditAccount("");
    setEditType("entry");
  };

  return (
    <div className="container">
      <div className="controle">
        <Link href="/cadastrar/level">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Gerenciamento de Contas
          </button>
        </Link>
        <Link href="/cadastrar/categorias">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Adicionar Categorias
          </button>
        </Link>
        <Link href="/cadastrar/contabanco">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Cadastrar Conta Bancária
          </button>
        </Link>
        <Link href="/cadastrar/lembretes">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Lembretes
          </button>
        </Link>
      </div>

      <div className="container2">
        <h2>CONTROLE DE FINANÇAS</h2>
        <div className="summary-section">
          <div className="summary-box">
            <h3>Entrada</h3>
            <p>R$ {entryTotal.toFixed(2)}</p>
          </div>
          <div className="summary-box">
            <h3>Saída</h3>
            <p>R$ {exitTotal.toFixed(2)}</p>
          </div>
          <div className="summary-box">
            <h3>Total</h3>
            <p>R$ {total.toFixed(2)}</p>
          </div>
        </div>

        <div className="entry-section">
          <h3>Nova transação</h3>
          <div className="entry-form">
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Descrição"
              required
            />
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Valor"
              required
            />
            <DatePicker
              selected={editDate}
              onChange={(date) => setEditDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Selecione a Data"
              className="date-picker"
            />
            <DatePicker
              selected={editDueDate}
              onChange={(date) => setEditDueDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Selecione a Data de Vencimento"
              className="date-picker"
            />
            <select
              value={editCategoria}
              onChange={(e) => setEditCategoria(e.target.value)}
            >
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.categoria}>
                  {cat.categoria}
                </option>
              ))}
            </select>
            <select
              value={editAccount}
              onChange={(e) => setEditAccount(e.target.value)}
            >
              <option value="">Selecione a Conta</option>
              {accounts.map((account) => (
                <option key={account._id} value={account.accountName}>
                  {`${account.accountName} - ${account.bank}`}
                </option>
              ))}
            </select>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
            >
              <option value="entry">Entrada</option>
              <option value="exit">Saída</option>
            </select>

            <button onClick={handleTransactionSubmit}>Incluir</button>
          </div>
        </div>
      </div>

      <div className="container2">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Vencimento</th>
              <th>Categoria</th>
              <th>Conta</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.description}</td>
                <td>{transaction.value.toFixed(2)}</td>
                <td>
                  {transaction.date
                    ? format(new Date(transaction.date), "yyyy-MM-dd")
                    : ""}
                </td>
                <td>
                  {transaction.dueDate
                    ? format(new Date(transaction.dueDate), "yyyy-MM-dd")
                    : ""}
                </td>
                <td>{transaction.categoria}</td>
                <td>{transaction.accountName}</td>
                <td>{transaction.type === "entry" ? "Entrada" : "Saída"}</td>
                <td>
                  <button onClick={() => openEditModal(transaction)}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(transaction._id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTransaction && (
        <div id="editTransactionModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeEditModal}>
              &times;
            </span>
            <h2>Editar Transação</h2>
            <div className="entry-form">
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Descrição"
                required
              />
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Valor"
                required
              />
              <DatePicker
                selected={editDate}
                onChange={(date) => setEditDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Selecione a Data"
                className="date-picker"
              />
              <DatePicker
                selected={editDueDate}
                onChange={(date) => setEditDueDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Selecione a Data de Vencimento"
                className="date-picker"
              />
              <select
                value={editCategoria}
                onChange={(e) => setEditCategoria(e.target.value)}
              >
                {categorias.map((cat) => (
                  <option key={cat._id} value={cat.categoria}>
                    {cat.categoria}
                  </option>
                ))}
              </select>
              <select
                value={editAccount}
                onChange={(e) => setEditAccount(e.target.value)}
              >
                <option value="">Selecione a Conta</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account.accountName}>
                    {`${account.accountName} - ${account.bank}`}
                  </option>
                ))}
              </select>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
              >
                <option value="entry">Entrada</option>
                <option value="exit">Saída</option>
              </select>

              <button onClick={handleEditSubmit}>Atualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Home);
