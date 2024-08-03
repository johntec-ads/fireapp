import { useState } from 'react';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { auth } from '../../firebaseConnection';
import { createUserWithEmailAndPassword } from 'firebase/auth';


/* import './register.css' */

function Register () {
  const [ email, setEmail ] = useState( '' )
  const [ password, setPassword ] = useState( '' )
  const navigate = useNavigate();

  async function handleRegister ( e ) {// (e) recebe um evento devido a submissão'onSubmit()
    e.preventDefault();//Não deixa atualizar a pagina

    if ( email !== '' && password !== '' ) {
      await createUserWithEmailAndPassword( auth, email, password )

        .then( () => {
          navigate( '/admin', { replace: true } )
        } )

        .catch( ( ) => {
          console.log( 'Erro no cadastro')
        } )

    } else {
      alert( 'Preencha todos os campos!' )
    }

  }


  return (
    <div className='home-container'>
      <h1>Cadastre-se</h1>
      <span>Vamos criar sua conta</span>

      <form className='form' onSubmit={ handleRegister } >
        <label>Email</label>
        <input
          type='text'
          placeholder='Digite seu email...'
          value={ email }
          onChange={ ( e ) => setEmail( e.target.value ) }
        />

        <label>Senha</label>
        <input          
          type='password'
          placeholder='************'
          value={ password }
          onChange={ ( e ) => setPassword( e.target.value ) }
        />

        <button type='submit' >Cadastrar</button>
      </form>

      <Link className='button-link' to='/' >
        Já possui uma conta ? Faça login!
      </Link>
    </div>
  )
}

export default Register;