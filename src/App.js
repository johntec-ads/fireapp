import { useState } from 'react';//Hook para criar os estados
import { db } from './firebaseConnection';/* Import do banco de dados */
import {
  doc,//doc cria ref para um documento dentro de uma coleção 
  setDoc,/* setDoc: Cria ou sobrescreve um documento no firestore */
  collection,//O método collection é usado para acessar uma coleção no Firestore.
  addDoc,//O método addDoc é usado para adicionar um novo documento a uma coleção.
  getDoc,//getDoc é usado para recuperar dados de um documento específico no Firestore .
  getDocs,//Método usado para executar consultas em coleções ou grupos de coleções.

} from 'firebase/firestore';

import './app.css';


function App () {

  const [ titulo, setTitulo ] = useState( '' );
  const [ autor, setAutor ] = useState( '' );

  const [posts, setPosts] = useState([]);//state para obter as coleções de doc

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
        setTitulo('');
        setAutor('');

      } )
      .catch( ( error ) => {
        console.log( "Gerou Erro" + error )
      } )
  }

  async function buscarPost() {    
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
     
      const postsRef = collection(db, "posts") //Declara um referência e obtém a colection
      await getDocs(postsRef)
      .then((snapshot) => {
        console.log('Sucesso na busca')

        let lista = snapshot.docs.map((doc) => {
        return{
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        }
      })
      setPosts(lista)
      console.log(lista)
      })
      .catch((error) => {
        console.log('Erro na busca' +error)
      })




  }




  return (
    <div>
      <h2>React + Firebase ;-)</h2>

      <div className='container' >
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

        <button onClick={ handleAdd } >Cadastrar</button>
        <button onClick={buscarPost} >Buscar post</button>

        <ul>
          {posts.map((item) => {
            return (
               <li key={item.id}>
              <strong>ID: {item.id} </strong> <br/>
              <span>Titulo: {item.titulo} </span> <br/>
              <span>Autor:  {item.autor} </span>

            </li>
            )
           
          })}
        </ul>

        
      </div>


    </div>
  )
}

export default App;