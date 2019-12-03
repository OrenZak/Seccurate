import React, { Component } from 'react';
import logo from './seccurate_logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Seccurate</h2>
        </div>
        <p className="App-intro">
          The Best False Positive, Maintained, And Free Vulnerability Scanner
        </p>
      </div>
    );
  }
}

export default App;
