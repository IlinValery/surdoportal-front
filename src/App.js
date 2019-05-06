import React from 'react';
import { BrowserRouter} from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStroopwafel, faCheck, faTimes, faBars, faEllipsisV, faPen, faTrash, faPoo} from '@fortawesome/free-solid-svg-icons'


import NavBar from './components/NavBar'
import Content from './Content'
import Footer from './components/Footer'

//Always add icons to use them!
library.add(faStroopwafel, faCheck, faTimes, faBars, faEllipsisV, faPen, faTrash, faPoo);

class App extends React.Component {
  render() {
    console.log("render App");
    return (
          <BrowserRouter>
            <NavBar/>

            <Content/>

            <Footer/>

          </BrowserRouter>
    );
  }
}

export default App;