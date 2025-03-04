
import { useState, useEffect } from 'react';
import './admin.css'

import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth';

import {
  addDoc,/* addDoc(collection, data): Adiciona um novo documento à 
  coleção especificada com os dados fornecidos. */
  collection,//.../...
  onSnapshot,/* onSnapshot(query, callback): Configura um ouvinte em tempo real para 
  receber atualizações quando os dados no Firestore mudam. */
  query,/* query(collection): Cria uma consulta para recuperar 
  documentos de uma coleção específica. */
  orderBy,/* orderBy(query, field): Ordena os resultados da consulta 
  com base em um campo específico. */
  where,
  doc,/* where(query, field, operator, value): Filtra os resultados 
  da consulta com base em uma condição específica. */
  deleteDoc,
  updateDoc,

} from 'firebase/firestore';


function Admin () {

  const [ tarefaInput, setTarefaInput ] = useState( '' );
  const [ user, setUser ] = useState( {} );
  const [ edit, setEdit ] = useState( {} );
  //state para armazenar as tarefas criadas
  const [ tarefas, setTarefas ] = useState( [] );


  useEffect( () => {
    async function loadTarefas () {
      const userDetail = localStorage.getItem( '@detailUser' )//obtém e converte o localStorage
      setUser( JSON.parse( userDetail ) )//passa o localStorage para a state setUser

      if ( userDetail ) {//Se encontrou dados do user logado no localStorage
        const data = JSON.parse( userDetail );
        //Montando a referência
        const tarefaRef = collection( db, "tarefas" )
        const q = query( tarefaRef, orderBy( "created", "desc" ), where( "userUid", "==", data?.uid ) )

        

         
        const unsub = onSnapshot( q, ( snapshot ) => {
          let lista = [];

          snapshot.forEach( ( doc ) => {
            lista.push( {
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
            } )
          } )

          console.log( lista )
          console.log(unsub)
          setTarefas( lista )
        } )
      }
    }

    loadTarefas();

  }, [] )

  async function handleRegister ( e ) {
    e.preventDefault();/* Metodo para não atualizar a página */
    if ( tarefaInput === '' ) {//Se tarefaInput estiver vazio...
      //faça:
      alert( 'Digite sua tarefa...' )
      return;//finaliza o código
    }

    //lógica para apenas atualizar a tarefa, e não duplica-la
    if(edit?.id){
      handleUpdateTarefa();
      return
    }



    //Adiciona um doc, criando a coleção "tarefas"  
    await addDoc( collection( db, "tarefas" ), {
      tarefa: tarefaInput,//state
      created: new Date(),//new Date para verificar qunado foi cadastrado a tarefa
      userUid: user?.uid//user '?' = Se user não estiver definido, retorna undefined            
    } )
      .then( () => {
        console.log( 'Tarefa Registrada' )
        setTarefaInput( '' );
      } )
      .catch( ( error ) => {
        console.log( 'Erro ao registrar ' + error )

      } )

  }

  async function handleLogout () {
    await signOut( auth );//Para logout, passa o component auth dentro do signOut
  }

  async function deleteTarefa ( id ) {
    //identificando tarefas pelo 'id'
    const docRef = doc( db, "tarefas", id )
    await deleteDoc( docRef )

  }

  function editTarefa ( item ) {
    setTarefaInput( item.tarefa );
    setEdit( item )
  }

  async function handleUpdateTarefa(){
    const docRef = doc(db, "tarefas", edit?.id)
    await updateDoc(docRef, {
      tarefa: tarefaInput
    })
    .then(() => {
      console.log("Tarefa Atualizada")
      setTarefaInput('')
      setEdit({})
    })
    .catch(() => {
      console.log("Erro ao atualizar")
      setTarefaInput('')
      setEdit({})
    })
  }

  return (
    <div className='admin-container'>

      <h1>Minhas tarefas</h1>

      <form className='form' onSubmit={ handleRegister } >
        <textarea
          placeholder='Digite sua tarefa...'
          value={ tarefaInput }
          onChange={ ( e ) => setTarefaInput( e.target.value ) }

        />

        {/* 'type é submit' porque esta dentro da tag de <form/> */ }

        { Object.keys( edit ).length > 0 ? (//se for maior que zero, clicou em editar
          <button className='btn-register'  type='submit' >Atualizar tarefa</button>
        ) : (//se for menor que zero, não clicou em editar
          <button className='btn-register' type='submit' >Registrar tarefa</button>
        ) }

      </form>

      { tarefas.map( ( item ) => (

        <article key={ item.id } className='list' >
          <p> { item.tarefa }  </p>

          <div>
            <button onClick={ () => editTarefa( item ) } >Editar</button>

            <button onClick={ () => deleteTarefa( item.id ) } className='btn-delete' >Concluir</button>
          </div>
        </article>

      ) ) }

      <button className='btn-logout' onClick={ handleLogout } >Sair</button>

    </div>
  )
}

export default Admin;