import { useState, useEffect } from 'react';//Hook para criar os estados
import { db, auth } from './firebaseConnection';/* Import do banco de dados */

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

import { 
  createUserWithEmailAndPassword,//Cria user com email e senha
  signInWithEmailAndPassword,//Loguin de user com email e senha
  signOut,//logout de user
  onAuthStateChanged,//Monitora se tem usuário logado
} from 'firebase/auth'



import './app.css';


function App () {

  const [ titulo, setTitulo ] = useState( '' );
  const [ autor, setAutor ] = useState( '' );
  const [ idPost, setIdPost ] = useState( '' );

  //useState para autenticação de email
  const [ email, setEmail ] = useState( '' );
  const [ senha, setSenha ] = useState( '' );

  //state para obter as coleções de doc
  const [ posts, setPosts ] = useState( [] );

  //state para renderizar o cliente logado
  const [ user, setUser] = useState(false);
  const [ userDetail, setUserDetail] = useState({});

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

  useEffect(() => {
    async function checkLoguin() {
      onAuthStateChanged(auth, (user) => {
        if(user) {
          //user logado
          console.log(user)
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          })

        }else {
          //sem user logado
          setUser(false);
          setUserDetail({});
        }
      })

    }

    checkLoguin()
  }, [])

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
      .catch( ( error ) => {
        console.log( "Erro ao deletar " + error )

      } )
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      console.log( 'Cadastrado com sucesso')
      
      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      //códigos de erro
      if(error.code === 'auth/weak-password'){
        alert('Senha muito fraca')
      }else if(error.code === 'auth/email-already-in-use'){
        alert('Email já existe!')
      }
    })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log('User logado com sucesso');
      console.log(value.user);

      //Buscando no value.use
      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true)

      setEmail('')
      setSenha('')

    })
    .catch(() => {
      console.log('Erro ao logar')

    })
  }

  async function fazerLogout() {
    await signOut(auth)
    setUser(false);
    setUserDetail({});
  }

  return (
    <div>
      <h2>React + Firebase ;-)</h2>

      { user && (
        <div>
          <strong>Seja bem vindo(a)  (Você esta logado!) </strong>
          {/* Botão oculto, aparece somente se 'user' estiver logado */}
          <span>ID: {userDetail.uid} - Email: {userDetail.email} </span> <br/>
          <button onClick={fazerLogout} >Sair da conta</button>
          <br/><br/>
        </div>
      )}

      <div className='container'>
        <h2>Usuários</h2>
        <label>Email</label>
        <input
          value={ email }
          onChange={ ( e ) => setEmail( e.target.value ) }
          placeholder='Digite o email'
        /> <br />

        <label>senha</label>
        <input
          value={ senha }
          onChange={ ( e ) => setSenha( e.target.value ) }
          placeholder='Digite sua senha'
        /> <br />
        <button onClick={novoUsuario} >Cadastro User</button> <br/>
        <button onClick={logarUsuario} >Loguin User</button>
      </div>

      <br /><br />
      <hr />
      <br /><br />

      {/* Busca por ID */ }
      <div className='container' >
        <h2>Post</h2>
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

        <button onClick={ handleAdd } >Cadastro Post</button> <br />
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