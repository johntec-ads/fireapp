import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { auth } from '../firebaseConnection';
import { onAuthStateChanged } from 'firebase/auth';//Fica verificando se tem user logado

export default function Private ( { Children } ) {

  const [ loading, setLoading ] = useState( true )//state para verificar se tem user ou não.
  const [ signed, setSigned ] = useState( false )//state que verifica se user esta logado ou não.

  useEffect( () => {
    //Verifica se tem user logado
    async function checkLogin () {
      const unsub = onAuthStateChanged( auth, ( user ) => {
        
        //se tem user logado
        if ( user ) {
          //Criando um objeto
          const userData = {
            uid: user.uid,
            email: user.email,
          }
          //salvar no localStorage
          localStorage.setItem('@detailUser', JSON.stringify(userData))

          setLoading(false);
          setSigned(true);


        } else {
          //não possui user logado          
          setLoading(false);
          setSigned(false);

        }

      } )

    }
    checkLogin()

  }, [] )

  //Verificações
  if(loading) {
    //se tiver carreando, renderiza apenas um div
    return(
      <div>

      </div>
    )
  }

  if(!signed){//se não estiver logado
    //e estiver tentando acessar
    return <Navigate to='/'/>

  }

  return Children;

}