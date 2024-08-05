
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


 } from 'firebase/firestore';


function Admin() {

  const [tarefaInput, setTarefaInput] = useState('');
  const [user, setUser] = useState({});
  //state para armazenar as tarefas criadas
  const [ tarefas, setTarefas ] = useState([]);


  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem('@detailUser')//obtém e converte o localStorage
      setUser(JSON.parse(userDetail))//passa o localStorage para a state setUser

      if(userDetail) {//Se encontrou dados do user logado no localStorage
        const data = JSON.parse(userDetail);
        //Montando a referência
        const tarefaRef = collection(db, "tarefas")
        const q = query(tarefaRef, orderBy("created", "desc" ), where("userUid", "==" , data?.uid))

        /* PROCURANDO ERRO ...AQUI */

        const unsub = onSnapshot(q, (snapshot) => {
          
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
            })
          })
          console.log(lista)
          setTarefas(lista)
        })
      }
    }

    loadTarefas();

  },[])

   async function handleRegister(e) {
    e.preventDefault();/* Metodo para não atualizar a página */
      if(tarefaInput === ''){//Se tarefaInput estiver vazio...
        //faça:
        alert('Digite sua tarefa')
        return;//finaliza o código
      }
      //Adiciona um doc, criando a coleção "tarefas"  
      await addDoc(collection(db, "tarefas"), {
        tarefa: tarefaInput,//state
        created: new Date(),//new Date para verificar qunado foi cadastrado a tarefa
        userUid: user?.uid//user '?' = Se user não estiver definido, retorna undefined            
      })
      .then(() => {
        console.log('Tarefa Registrada')
        setTarefaInput('');
      })
      .catch((error) => {
        console.log('Erro ao registrar ' + error)

      })
    
   }

   async function handleLogout() {
    await signOut(auth);//Para logout, passa o component auth dentro do signOut
   }

  return(
    <div className='admin-container'>
      
      <h1>Minhas tarefas</h1>

      <form className='form' onSubmit={handleRegister} > 
        <textarea
          placeholder='Digite sua tarefa...'
          value={tarefaInput}
          onChange={(e) => setTarefaInput(e.target.value)}

        />
        <button className='btn-register' type='submit' >Registrar tarefa</button>{/* 'submit' porque esta dentro da
        tag de <form/> */}
      </form>

      <article className='list' >
        <p>Estudar javascript e reactjs no fim de semana</p>

        <div>
          <button>Editar</button>
          <button className='btn-delete' >Concluir</button>
        </div>
      </article>

      <button className='btn-logout' onClick={handleLogout} >Sair</button>

    </div>
  )
}

export default Admin;