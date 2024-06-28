import React, { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../../hocs/withAuth';


const CategoriaPage = () => {
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    pegarcategoria();
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

  const pegarcategoria = async() =>{
    try {
        const response = await axios.get(
          'http://localhost:3001/categorias/all'
        );
        
        setCategorias(response.data);
      } catch (error) {
        setMessage('Erro ao cadastrar categoria.');
        console.error('Erro ao cadastrar categoria:', error);
      }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
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
        <br />
        <button type="submit">Cadastrar</button>
      </form>

      <h2>Lista de Categorias</h2>
      {categorias.length > 0 ? (
        <ul>
          {categorias.map((cat) => (
            <li key={cat._id}>
              {cat.categoria}{' '}
              <button
                onClick={async () => {
                  try {
                    await axios.delete(
                      `http://localhost:3001/categorias/${cat._id}`
                    );
                    setMessage('Categoria deletada com sucesso.');
                    setCategorias(categorias.filter((c) => c._id !== cat._id));
                  } catch (error) {
                    setMessage('Erro ao deletar categoria.');
                    console.error('Erro ao deletar categoria:', error);
                  }
                }}
              >
                Deletar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma categoria cadastrada.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default withAuth(CategoriaPage);
