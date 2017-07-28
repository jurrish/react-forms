import React from 'react';
import ReactDom from 'react-dom';
import cowsay from 'cowsay-browser';
import faker from 'faker';
import superagent from 'superagent';

const API_URL = 'http://pokeapi.co/api/v2';

import '../src/style/_main.scss';


//create a form container every time you create a form
//it will have it's own state, and manage the state of a form's inputs

class PokemonForm extends React.Component {

  //the constructor will make a PokemonForm instance with a property of
  //it becomes this.props.pokeName
  //this.state.pokeName
  constructor(props) {
    super(props);
    this.state = {
      pokeName: '',
    }
    //bind eventChange to the instance! because we're passing this into another component
    //this looks like props.onChange which is available to the controlled input component of our returned form
    //we are passing this function INTO another component (through the props) - ie props.onChange goes into the element's onChange attribute
    this.handlePokeNameChange = this.handlePokeNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //we type in the input. it calls onChange. onChange gets called with an event. we setState of pokeform. so it's state changed to the value of the event (what we typed). it gets handled by handlePokeNameChange. the app is aware of the state change. this component is re-rendered.
  //this is one-way data binding! (when you have an input and change the state, the view has one-way data binding to the input's value - so when we type, we re-render that part of the dom)
  handlePokeNameChange (e) {
    this.setState({pokeName: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault()
//we get selectPokemon passed down to us from App. it takes a NAME argument
    this.props.pokemonSelect(this.state.pokeName)
  }

  render () {
    return (
      //ALL INPUTS SHOULD HAVE THEIR VALUES BOUND TO A state
      //this is called 'controlled input'
      //we create controlled inputs by binding "value" to a state property
      //and providing an onChange event handler to the input
      //we are using one way data binding
      <form
        onSubmit={this.handleSubmit} >
        <input
          type='text'
          name='pokemonName'
          placeholder='poke name'
          value={this.state.pokeName}
          onChange={this.handlePokeNameChange}
          />
          <p> Name: </p>
          <p> { this.state.pokeName } </p>
      </form>
    )
  }
}

class App extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      pokemonLookup: {},
      pokemonSelected: null,
      pokemonNameError: '',
      pokemonPic: null,
    }

    this.pokemonSelect = this.pokemonSelect.bind(this);
  }

  //called everytime the state is changed
  componentDidUpdate () {
    console.log('=====State====', this.state);
  }

//right before it (APP COMPONENT) gets added to the DOM (mounting)
//so, before the component is rendered to the dom, we want to make a request to the pokemonAPI
  componentDidMount () {
    superagent.get(`${API_URL}/pokemon`)
      .then(res => {
        let pokemonLookup = res.body.results.reduce((lookup, next) => {
          lookup[next.name] = next.url;
          return lookup
        }, {})
        console.log(pokemonLookup);
        this.setState({ pokemonLookup })
      })
      .catch(err => {
        console.log(err);
      })
  }

  //passed to child component through props
  pokemonSelect (name) {
    if(!this.state.pokemonLookup[name]) {
      //do something on state that enables the view to show an error that pokemon
      //doesnt exist
      this.setState({
        pokemonSelected: null,
        pokemonNameError: name,
      })
    } else {
      // make a request to th pokemon api and do something on
      //state to store the pokemon details to be displayed to the user
      superagent.get(this.state.pokemonLookup[name])
        .then(res => {
          console.log(res.body, '-----resbody');
          this.setState({
            pokemonSelected: name,
            pokemonPic: res.body.sprites.front_shiny,
          })
          console.log(this.state)
        })
        .catch(console.error(err))
    }
  }

  handleClick () {
  }
  //PokemonForm must have access to pokemonSelect if it can call it.
  //pass it through props! so, we add it as a property on PokemonForm. it's value will be .pokemonSelect function passed through the constructor. it is inherited from the parent App parent. it is created by the parent, then passed to child through props.
  render () {
    return (
      <div>
        <PokemonForm pokemonSelect={ this.pokemonSelect }/>
        { this.state.pokemonNameError ?
         <div>
          <h2> pokemon { this.state.pokemonNameError } does not exist </h2>
          <p> make another request! </p>
          <p> pokemon name error: { this.state.pokemonNameError } </p>
         </div> :
         <div>
           <h2> pokemon selected: { this.state.pokemonSelected } </h2>
           <img src={ this.state.pokemonPic } />
         </div>
        }
      </div>
    )
  }
}

//create a place to put the app
const container = document.createElement('div')
document.body.appendChild(container);
ReactDom.render(<App />, container);
