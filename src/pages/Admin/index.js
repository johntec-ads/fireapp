
import { useState } from 'react';
import './admin.css'

import { auth } from '../../firebaseConnection'
import { signOut } from 'firebase/auth';


function Admin() {

  const [tarefaInput, setTarefaInput] = useState('');

   function handleRegister(e) {
    e.preventDefault();/* Metodo para não atualizar a página */

    alert('register tarefa ok')
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