import React, { Component } from 'react';
import logo from './assets/snake.svg';
import './App.css';
import Snake from './components/Snake';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <br />
          <h2>Welcome to Snake!</h2>
        </div>
        <Snake />
      </div>
    );
  }
}

export default App;
