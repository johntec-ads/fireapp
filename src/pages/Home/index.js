import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import './home.css'

function Home () {
  const [ email, setEmail ] = useState( '' )
  const [ password, setPassword ] = useState( '' )

 function handleLogin(e) {// (e) recebe um evento devido a submissão'onSubmit()
  e.preventDefault();//Não deixa atualizar a pagina

  if(email !== '' && password !== ''){
    alert('Teste de email Ok')

  }else{
    alert('Preencha todos os campos!')
  }

}


  return (
    <div className='home-container'>
      <h1>Lista de tarefas</h1>
      <span>Gerencie sua agenda de forma fácil</span>

      <form className='form' onSubmit={handleLogin} >
      <label>Email</label>
      <input
        type='text'
        placeholder='Digite seu email...'
        value={ email }
        onChange={ ( e ) => setEmail( e.target.value ) }
      />

      <label>Senha</label>
      <input
        autoComplete='false'
        type='password'
        placeholder='************'
        value={ password }
        onChange={ ( e ) => setPassword( e.target.value ) }
      />

      <button type='submit' >Acessar</button>
      </form>
        
      <Link className='button-link' to='/register' >
        Não possui uma conta ? Cadastre-se
      </Link>
    </div>
  )
}

export default Home;