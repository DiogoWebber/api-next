import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import "../../styles/Home.module.css"; // Importando o arquivo CSS
import axios from "axios";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [entryTotal, setEntryTotal] = useState(0);
  const [exitTotal, setExitTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editType, setEditType] = useState("entry");
  const [editDate, setEditDate] = useState(new Date());
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [editCategoria, setEditCategoria] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    pegarcategoria();
  }, []);

  const pegarcategoria = async () => {
    try {
      const response = await axios.get("http://localhost:3001/categorias/all");

      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao mostrar categoria:", error);
    }
  };
  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        updateTotals(data);
      } else {
        throw new Error("Erro ao buscar transações");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch("http://localhost:3001/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data); // Atualiza o estado das contas com os dados recebidos
      } else {
        throw new Error("Erro ao buscar contas bancárias");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao buscar contas bancárias. Por favor, tente novamente.");
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
    const description = document.getElementById("description").value;
    const value = parseFloat(document.getElementById("value").value);
    const categoria = document.getElementById("categoria").value;
    const type = document.getElementById("type").value;

    const date = editDate;

    const transaction = { description, value, date, type, categoria };

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
      } else {
        alert("Erro ao adicionar transação. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
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
      categoria: editCategoria, // Inclui a categoria atualizada
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
      closeEditModal(); // Fechar modal de edição após sucesso
    } catch (error) {
      console.error("Erro:", error);
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
      console.error("Erro:", error);
      alert("Erro ao excluir transação. Por favor, tente novamente.");
    }
  };

  const submitAccount = async () => {
    const account = {
      accountName,
      bank,
      accountNumber,
      balance: parseFloat(balance),
    };

    try {
      const response = await fetch("http://localhost:3001/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar conta bancária");
      }

      const data = await response.json();
      if (data.success) {
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

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setEditDescription(transaction.description);
    setEditValue(transaction.value.toString());
    setEditType(transaction.type);
    setEditCategoria(transaction.categoria); // Inclui a categoria para edição

    // Validate transaction.date before setting editDate
    if (transaction.date) {
      setEditDate(new Date(transaction.date));
    } else {
      setEditDate(new Date());
    }
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
    setEditDescription("");
    setEditValue("");
    setEditType("entry");
    setEditDate(new Date());
  };
  const handleDeleteAccount = async (accountId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/accounts/${accountId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir conta bancária");
      }

      fetchAccounts(); // Atualiza a lista de contas após exclusão bem sucedida
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir conta bancária. Por favor, tente novamente.");
    }
  };

  return (
    <div className="container">
      <div className="controle">
        <Link href="/cadastrar/level">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Gerenciamento de Contas
          </button>
        </Link>
      </div>
      <div className="paginacategorias">
        <Link href="/cadastrar/categorias">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Adicionar Categorias
          </button>
        </Link>
      </div>
      {/* Seção de Controle de Finanças */}
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

        {/* Formulário de Nova Transação */}
        <div className="entry-section">
          <h3>Nova transação</h3>
          <div className="entry-form">
            <input
              type="text"
              id="description"
              placeholder="Descrição"
              required
            />
            <input type="text" id="value" placeholder="Valor" required />
            <DatePicker
              selected={editDate}
              onChange={(date) => setEditDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Selecione a Data"
              className="date-picker"
            />
            <select id="type" defaultValue="entry">
              <option value="entry">Entrada</option>
              <option value="exit">Saída</option>
            </select>
            <select id="categoria" name="categoria">
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.categoria}>
                  {cat.categoria}
                </option>
              ))}
            </select>
            <button onClick={handleTransactionSubmit}>Incluir</button>
          </div>
        </div>
      </div>
      {/* Tabela de Transações */}
      <div className="container2">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Ações</th>
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
      {/* Modal de Edição */}
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
      {/* Formulário de Nova Conta Bancária */}
      <div className="container2">
        <h2>CADASTRO DE CONTAS BANCÁRIAS</h2>
        <div className="entry-section">
          <h3>Nova transação</h3>
          <div className="entry-form">
            <input
              type="text"
              id="description"
              placeholder="Descrição"
              required
            />
            <input type="text" id="value" placeholder="Valor" required />
            <DatePicker
              selected={editDate}
              onChange={(date) => setEditDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Selecione a Data"
              className="date-picker"
            />
            <select id="categoria" defaultValue="">
              <option value="" disabled>
                Selecione uma Categoria
              </option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.categoria}>
                  {cat.categoria}
                </option>
              ))}
            </select>
            <select id="type" defaultValue="entry">
              <option value="entry">Entrada</option>
              <option value="exit">Saída</option>
            </select>
            <button onClick={handleTransactionSubmit}>Incluir</button>
          </div>
        </div>
      </div>
      {/*Tabela de Contas Bancárias*/}
      <div className="container3">
        <table className="account-table">
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
    </div>
  );
}
