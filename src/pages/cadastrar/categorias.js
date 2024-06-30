import React, { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../../hocs/withAuth';
import Link from "next/link";
import styles from '../../styles/Home.module.css'; 

const CategoriaPage = () => {
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    pegarCategorias();
  }, []);

  const handleCategoriaChange = (event) => {
    setCategoria(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/categorias/setCategorias',
        { nome: categoria }
      );
      setMessage('Categoria cadastrada com sucesso.');
      setCategorias([...categorias, response.data]);
      setCategoria('');
    } catch (error) {
      setMessage('Erro ao cadastrar categoria.');
      console.error('Erro ao cadastrar categoria:', error);
    }
  };

  const pegarCategorias = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/categorias/all'
      );
      setCategorias(response.data);
    } catch (error) {
      setMessage('Erro ao buscar categorias.');
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleDeleteCategoria = async (catId) => {
    try {
      await axios.delete(`http://localhost:3001/categorias/${catId}`);
      setMessage('Categoria deletada com sucesso.');
      setCategorias(categorias.filter((cat) => cat._id !== catId));
    } catch (error) {
      setMessage('Erro ao deletar categoria.');
      console.error('Erro ao deletar categoria:', error);
    }
  };

  return (
    <div className={styles.categorias}>
      <div className={styles.containerCategoria}>
        <h2>Cadastrar Categoria</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nome da Categoria:
            <input
              type="text"
              value={categoria}
              onChange={handleCategoriaChange}
              required
            />
          </label>
          <button type="submit">Cadastrar</button>
        </form>

        <h2>Lista de Categorias</h2>
        {categorias.length > 0 ? (
          <ul>
            {categorias.map((cat) => (
              <li key={cat._id} className={styles.userRow}>
                <span>{cat.categoria}</span>
                <button onClick={() => handleDeleteCategoria(cat._id)}>
                  Deletar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma categoria cadastrada.</p>
        )}

        {message && <p>{message}</p>}

        <Link href="/cadastrar/paginaadmin">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Voltar à Página Admin
          </button>
        </Link>
      </div>
    </div>
  );
};

export default withAuth(CategoriaPage);
