import { useState, useEffect } from 'react';//Hook para criar os estados
import { db } from './firebaseConnection';/* Import do banco de dados */

import {
  doc,//doc cria ref para um documento dentro de uma coleção 
  setDoc,/* setDoc: Cria ou sobrescreve um documento no firestore */
  collection,//O método collection é usado para acessar uma coleção no Firestore.
  addDoc,//O método addDoc é usado para adicionar um novo documento a uma coleção.
  getDoc,//getDoc é usado para recuperar dados de um documento específico no Firestore .
  getDocs,//Método usado para executar consultas em coleções ou grupos de coleções.
  updateDoc,/* O método updateDoc do Firestore é usado para atualizar campos específicos 
  de um documento existente sem substituir o documento inteiro. */
  deleteDoc,//Metodo para excluir um documento no Cloud Firestore.
  onSnapshot,/* Usado para receber atualizações em tempo real*/


} from 'firebase/firestore';

import './app.css';


function App () {

  const [ titulo, setTitulo ] = useState( '' );
  const [ autor, setAutor ] = useState( '' );
  const [ idPost, setIdPost ] = useState( '' );

  const [ posts, setPosts ] = useState( [] );//state para obter as coleções de doc

  /* Atualizando Real Time */
  useEffect( () => {
    async function loadPost () {
      const unsub = onSnapshot( collection( db, "posts" ), ( snapshot ) => {

        let listaPost = snapshot.docs.map( ( doc ) => {
          return {
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          }
        } )
        setPosts( listaPost )

      } )
    }

    loadPost();

  }, [] );

  /* CADASTRAR UM ITEM ÚNICO */
  async function handleAdd () {
    /*await aguarda - addDoc cria um cocumento-collection :acessa uma coleção */
    await addDoc( collection( db, "posts" ), {
      /* O que vou cadastrar */
      /* Propriedade e valor, igual a um objeto */
      titulo: titulo,
      autor: autor,
    } )
      /* Promisse retorna .then = sucesso ou .cacth= erro */
      .then( () => {
        console.log( 'Registro ralizado com sucesso' )
        setTitulo( '' );
        setAutor( '' );

      } )
      .catch( ( error ) => {
        console.log( "Gerou Erro" + error )
      } )
  }

  async function buscarPost () {
    /*  //BUSCANDO UM POST ESPECÍFICO
 
     //obtendo na const postRef na colection posts, o documento 12345
     const postRef = doc(db, "posts", "12345")
     //retorno com getDoc dos itens
     await getDoc(postRef)
     .then( (snapshot) => {//snapshot=informações rápidas de quaisquer evento que a app sofreu
       setAutor(snapshot.data().autor)//retorna os dados do db
       setTitulo(snapshot.data().titulo)
     })
     .catch( () => {
       console.log('Erro ao buscar')
     }) */

    //BUSCANDO VARIOS POSTS DE UMA COLEÇÃO
    const postsRef = collection( db, "posts" ) //Declara um referência e obtém a colection
    await getDocs( postsRef )
      .then( ( snapshot ) => {
        console.log( 'Sucesso na busca' )

        let lista = snapshot.docs.map( ( doc ) => {
          return {
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          }
        } )
        setPosts( lista )
        console.log( lista )
      } )
      .catch( ( error ) => {
        console.log( 'Erro na busca' + error )
      } )
  }
/* Edita post */
  async function editarPost () {
    const postRef = doc( db, "posts", idPost )
    await updateDoc( postRef, {
      titulo: titulo,
      autor: autor
    } )
      .then( () => {
        console.log( 'Atualizado' )
        setIdPost( '' )
        setTitulo( '' )
        setAutor( '' )

      } )
      .catch( () => {
        console.log( 'Erro ao atualizar o Post' )
      } )
  }

  /* Function para exclusão de posts */
  async function excluirPost ( id ) {
    const docRef = doc( db, "posts", id )
    await deleteDoc( docRef )
      .then( () => {
        alert( 'Post deletado.' )
      } )
      .catch( (error) => {
        console.log("Erro ao deletar " + error)

      } )
  }

  return (
    <div>
      <h2>React + Firebase ;-)</h2>
      <div className='container' >
        <label>Email</label>
        <input  />

      </div>


      {/* Busca por ID */ }
      <div className='container' >
        <label>ID do Post</label>
        <input
          placeholder='Digite o Id'
          value={ idPost }
          onChange={ ( e ) => setIdPost( e.target.value ) }
        />


        <label>Titulo:</label>
        <textarea
          type='text'
          placeholder='digite o titulo'
          value={ titulo }/* Instanciando o estado */
          /* onChange, dispara um evento para cada mudança no estado */
          onChange={ ( e ) => setTitulo( e.target.value ) }//

        />

        <label>Autor:</label>
        <input
          type='text'
          placeholder='Autor do post'
          value={ autor }/* Instanciando o estado */
          /* onChange, dispara um evento para cada mudança no estado */
          onChange={ ( e ) => setAutor( e.target.value ) }
        />

        <button onClick={ handleAdd } >Cadastrar</button> <br />
        <button onClick={ buscarPost } >Buscar post</button> <br />

        <button onClick={ editarPost } >Atualizar Post</button>

        <ul>
          { posts.map( ( item ) => {
            return (
              <li key={ item.id }>
                <strong>ID: { item.id } </strong> <br />
                <span>Titulo: { item.titulo } </span> <br />
                <span>Autor:  { item.autor } </span> <br />
                {/* Botão para excluir o post */ }
                <button onClick={ () => excluirPost( item.id ) } >Excluir</button><br />

              </li>
            )

          } ) }
        </ul>
      </div>
    </div>
  )
}

export default App;