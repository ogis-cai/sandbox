import React, { Component } from 'react';
import './App.css';
import DraggableList from './DraggableList';

// const Item = ({ height, children }) => (
//   <div style={{ height }}>
//     {children}
//   </div>
// );

class App extends Component {
  render() {
    return (
      <div className="App">
        <DraggableList />
      </div>
    );
  }
}

export default App;
