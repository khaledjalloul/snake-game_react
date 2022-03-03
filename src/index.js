import React from 'react';
import ReactDOM from 'react-dom';
import Board from './SnakeGame.js';
import {WebWrap, Button} from './website-template/src/WebWrap.js'

ReactDOM.render(
  <WebWrap title="Snake Game" buttons={[new Button("Enable Walls", ()=>{}), new Button("Auto-solve", ()=>{})]}>
    <Board />
  </WebWrap>,
  document.getElementById('root')
);