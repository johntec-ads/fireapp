import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConection';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth'


import './app.css';

function App () {

  const [ titulo, setTitulo ] = useState( '' );
  const [ autor, setAutor ] = useState( '' );
  const [ idPost, setIdPost ] = useState( '' );

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [ posts, setPosts ] = useState( [] );

  useEffect( () => {
    async function loadPost () {
      const unsub = onSnapshot( collection( db, "post" ), ( snapshot ) => {

        let listaPost = []

        snapshot.forEach( ( doc ) => {
          listaPost.push( {
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          } )
        } )

        setPosts( listaPost );

      } )

    }
    loadPost()
  }, [] )


  async function handleAdd () {
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

    await addDoc( collection( db, "post" ), {
      titulo: titulo,
      autor: autor,
    } )
      .then( () => {
        console.log( "Cadastrado com sucesso" )
        setAutor( '' )
        setTitulo( '' )
      } )
      .catch( ( error ) => {
        console.log( "Errou!" + error )
      } )

  }


  async function buscarPost () {
    /* const postRef = doc(db,"post", "HxGXvIECY38SCHuy8OGv" )
    await getDoc(postRef)
    .then((snapshot) => {
      setAutor(snapshot.data().autor)
      setTitulo(snapshot.data().titulo)
    })
    .catch((error) => {
      console.log("Errou!" + error)
    }) */

    const postsRef = collection( db, "post" )
    await getDocs( postsRef )
      .then( ( snapshot ) => {
        let lista = []

        snapshot.forEach( ( doc ) => {
          lista.push( {
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          } )
        } )

        setPosts( lista );

      } )
      .catch( ( error ) => {
        console.log( "Errou ao buscar " + error )

      } )
  }

  async function editarPost () {
    const docRef = doc( db, "post", idPost )
    await updateDoc( docRef, {
      titulo: titulo,
      autor: autor,
    } )
      .then( () => {
        console.log( "Post atualizado com sucesso." )
        setAutor( "" )
        setTitulo( "" )
        setIdPost( "" )

      } )
      .catch( ( error ) => {
        alert( error )
      } )

  }

  async function excluirPost ( id ) {
    const docRef = doc( db, "post", id )
    await deleteDoc( docRef )
      .then( () => {
        console.logo( "Post deletado" )
      } )
      .catch( () => {
        console.log( 'Erro ao deletar' )
      } )
  }

   async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha )
    .then(() => {
      console.log('Cadastrado com sucesso')
    })
    .catch(() => {
      console.log('Erro ao cadastrar')
    })

  }


  return (
    <div>
      <h1> React JS + Firebase </h1>

      <div className='container' >
        <h2>Usuários</h2>
        <label>Email</label>
        <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Digite o e-mail'
        /> <br/>

<label>Senha</label>
        <input
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder='Digite sua senha'
        /> <br/><br/>  
        <button onClick={novoUsuario} >Novo usuário</button>      
      </div>
      <hr/>

      <div className='container' >
        <h2>POST</h2>

        <label>ID do Post:</label>
        <input placeholder='Digite o ID do post'
          value={ idPost }
          onChange={ ( e ) => setIdPost( e.target.value ) }
        /> <br />

        <label> Titulo: </label>
        <textarea
          type='text'
          placeholder='Digite o titulo'
          value={ titulo }
          onChange={ ( e ) => setTitulo( e.target.value ) }
        />

        <label>Autor</label>
        <input
          type='text'
          placeholder='Autor do post'
          value={ autor }
          onChange={ ( e ) => setAutor( e.target.value ) }
        />

        <button onClick={ handleAdd } >Cadastrar</button><br />
        <button onClick={ buscarPost } >Buscar posts</button> <br />

        <button onClick={ editarPost } >Atualizar Post</button>

        <ul>
          { posts
            .sort( ( a, b ) => {
              /* a.titulo.split(' ')[2] divide o título em partes separadas por 
              espaços e pega a terceira parte (índice 2). */
              const numA = parseInt( a.titulo.split( ' ' )[ 2 ] );
              /* parseInt converte essa parte em um número para comparação. */
              const numB = parseInt( b.titulo.split( ' ' )[ 2 ] );
              /* return numA - numB ordena os posts em ordem crescente. */
              return numA - numB;
            } )
            .map( ( post ) => {
              return (
                <li key={ post.id }>
                  <strong> ID:{ post.id }</strong> <br />
                  <span>Titulo: { post.titulo } </span><br />
                  <span>Autor: { post.autor } </span><br />
                  <button onClick={ () => excluirPost( post.id ) } >Excluir</button><br /><br />
                </li>
              );
            } ) }
        </ul>
      </div>
    </div>
  )
}

export default App;
