import { useState } from 'react';
import { db } from './firebaseConection'
import './app.css';

function App () {

  const {titulo, setTitulo} = useState('');
  const {autor, setAutor} = useState('');

  function handleAdd() {
    alert( 'TESTE ')
  }



  return (
    <div>
      <h1> React JS + Firebase </h1>

      <div className='container' >

        <label> Titulo: </label>
        <textarea
          type='text'
          placeholder='Digite o titulo'
          value={titulo}
          onChange={ (e) => setTitulo(e.target.valeu) }
        />

        <label>Autor</label>
        <input
          type='text'
          placeholder='Autor do post'
        />

        <button onClick={handleAdd} >Cadastrar</button>

      </div>


    </div>
  )
}

export default App;
