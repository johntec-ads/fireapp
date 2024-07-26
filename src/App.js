import { useState } from 'react';
import { db } from './firebaseConection'
import { doc, setDoc } from 'firebase/firestore';

import './app.css';

function App () {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  async function handleAdd() {
    await setDoc( doc(db, "post", "12345"), {
      titulo: titulo,
      autor: autor,
    } )
    .then(() => {/* promise sucess */
      console.log("Dados Registrados no BD")

    })
    .catch((error) => {/* promise error */
      console.log("Gerou Erro" + error)
    })
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
          onChange={ (e) => setTitulo(e.target.value) }
        />

        <label>Autor</label>
        <input
          type='text'
          placeholder='Autor do post'
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd} >Cadastrar</button>

      </div>


    </div>
  )
}

export default App;
