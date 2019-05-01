import React from 'react';
import { BrowserRouter} from 'react-router-dom'

import NavBar from './components/NavBar'
import Content from './Content'
class App extends React.Component {
  render() {
    console.log("render App");
    return (
          <BrowserRouter>
            <NavBar/>

            <Content/>



          </BrowserRouter>
    );
  }
}

export default App;