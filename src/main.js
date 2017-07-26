import React from 'react';
import ReactDom from 'react-dom';
import cowsay from 'cowsay-browser';
import faker from 'faker';

import '../src/style/_main.scss';

class App extends React.Component {

  constructor (props) {
    super(props);
  }

  handleClick () {
  }

  render () {
    return (
      <div>
        <h1> boop</h1>
      </div>
    )
  }
}

//create a place to put the app
const container = document.createElement('div')
document.body.appendChild(container);
ReactDom.render(<App />, container);
