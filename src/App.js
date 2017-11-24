import React, { Component } from 'react';
import './App.css';
import Home from '@/Container/Home';
import {windowHeight} from '@/utils/reset';

class App extends Component {
  

  render() {
    return (
      <div className="App" style={{height: windowHeight()}}    >
        <Home></Home>
      </div>
    );
  }
}


export default App;
