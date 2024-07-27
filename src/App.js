import { useState } from 'react';
import { db } from './firebaseConection'
import { doc, setDoc, collection, addDoc, getDoc, getDocs } from 'firebase/firestore';

import './app.css';

function App () {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const [posts, setPosts] = useState([]);

  async function handleAdd() {
/*     await setDoc( doc(db, "post", "12345"), {
      titulo: titulo,
      autor: autor,
    } )
    .then(() => {
      console.log("Dados Registrados no BD")

    })
    .catch((error) => {
      console.log("Gerou Erro" + error)
    }) */

      await addDoc(collection(db, "post"), {
        titulo: titulo,
        autor: autor,
      })
      .then(() => {
        console.log("Cadastrado com sucesso")
        setAutor('')
        setTitulo('')
      })
      .catch((error) => {
        console.log("Errou!" + error)
      })

  }


  async function buscarPost() {
    /* const postRef = doc(db,"post", "HxGXvIECY38SCHuy8OGv" )
    await getDoc(postRef)
    .then((snapshot) => {
      setAutor(snapshot.data().autor)
      setTitulo(snapshot.data().titulo)
    })
    .catch((error) => {
      console.log("Errou!" + error)
    }) */

      const postsRef = collection(db, "post")
      await getDocs(postsRef)
      .then((snapshot) => {
        let lista = []

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(lista);

      })
      .catch((error) => {
        console.log("Errou ao buscar "+error)

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
        <button onClick={buscarPost} >Buscar posts</button>

        <ul>
  {posts
    .sort((a, b) => {
      const numA = parseInt(a.titulo.split(' ')[2]);
      const numB = parseInt(b.titulo.split(' ')[2]);
      return numA - numB;
    })
    .map((post) => {
      return (
        <li key={post.id}>
          <span>Titulo: {post.titulo} </span>
          <span>Autor: {post.autor} </span>
        </li>
      );
    })}
</ul>


      </div>


    </div>
  )
}

export default App;
