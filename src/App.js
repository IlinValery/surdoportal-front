import React from 'react';
import { BrowserRouter} from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faStroopwafel,
    faCheck,
    faTimes,
    faBars,
    faEllipsisV,
    faPen,
    faTrash,
    faPoo,
    faPlus,
    faMinus,
    faKey,
    faExclamationTriangle,
    faSearch
} from '@fortawesome/free-solid-svg-icons'


import NavBar from './components/Common/NavBar'
import Content from './Content'
import Footer from './components/Common/Footer'

//Always add icons to use them!
library.add(faStroopwafel, faCheck, faTimes, faBars, faEllipsisV, faPen, faTrash, faPoo, faPlus, faMinus, faKey, faExclamationTriangle, faSearch);

class App extends React.Component {
  render() {
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