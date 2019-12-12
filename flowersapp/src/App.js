import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    flowers: [],
    flower: {
      genus: '',
      species: '',
      comname: ''
    },
    currFlower: {
      genus: '',
      species: '',
      comname: ''
    },
    sighted: {
      name: '',
      person: '',
      location: '',
      sight: ''
    },
    userCreate: {
      user: '',
      pass: ''
    },
    userLogin: {
      user: '',
      pass: '',
      loggedIn: 'FALSE'
    },
    selectedFlowers: [{GENUS: '', SPECIES: '', COMNAME: '', SIGHTED: '', PERSON: '', LOCATION: ''}]
  }

  componentDidMount() {
    this.getFlowers();
  }

  getFlowers = _ => {
    fetch('http://localhost:2000/flowers')
      .then(response => response.json())
      .then(response => this.setState({ flowers: response.data }))
  }

  addFlower = _ => {
    const { flower } = this.state;
    fetch(`http://localhost:2000/flowers/add?genus=${flower.genus}&species=${flower.species}&comname=${flower.comname}`)
      .then(this.getFlowers)
  }

  addSighting = _ => {
    const { sighted } = this.state;
    fetch(`http://localhost:2000/sightings/add?name=${sighted.name}&person=${sighted.person}&location=${sighted.location}&sight=${sighted.sight}`)
      .then(console.log("Sighting added!"))
      .then(this.recentTen(sighted.name))
  }

  addUser = _ => {
    const { userCreate } = this.state;
    fetch(`http://localhost:2000/users/add?user=${userCreate.user}&pass=${userCreate.pass}`)
      .then(console.log("User added!"))
  }

  recentTen = (comname) => {
    fetch(`http://localhost:2000/flowersOrdered?name=${comname}`)
      .then(response => response.json())
      .then(response => {let count; if (response.data.length > 10) {count = 10} else {count = response.data.length}; this.setState({selectedFlowers: []}); this.setState({selectedFlowers: response.data.slice(response.data.length-count, response.data.length).reverse()}); console.log(response.data.slice(0,10).reverse()); console.log("Selected Flowers: ", this.selectedFlowers)})
  }

  checkUser = _ => {
    const { userLogin } = this.state;
    fetch(`http://localhost:2000/users/check?user=${userLogin.user}&pass=${userLogin.pass}`)
      .then(response => response.json())
      .then(response => {if (response.data.length === 1) {console.log("Success"); this.setState({ userLogin: {...userLogin, loggedIn: "TRUE"}})} else {console.log("Failure")}})
  }

  updateFlower = _ => {
    const { currFlower } = this.state;
    fetch(`http://localhost:2000/flowers/update?genus=${currFlower.genus}&species=${currFlower.species}&comname=${currFlower.comname}`)
      .then(console.log("Flower updated!"), currFlower)
  }

  renderItem = ( item ) => <p>COMNAME {item.COMNAME} GENUS {item.GENUS} SPECIES {item.SPECIES} SIGHTED {item.SIGHTED} PERSON {item.PERSON} LOCATION {item.LOCATION}</p>

  renderFlower = ({GENUS, SPECIES, COMNAME}) => <div key={COMNAME} onClick={() => {const {currFlower} = this.state; this.recentTen(COMNAME); this.setState({currFlower:{...currFlower, comname: COMNAME}}); this.forceUpdate(); }}>{GENUS + " " + SPECIES}</div>

  render() {
    const { flowers, flower, selectedFlowers, userLogin, userCreate, currFlower, sighted} = this.state;
    return (
      <div>
        <div>
          {flowers.map(this.renderFlower)}
        </div>
        <div>
          {selectedFlowers.map(this.renderItem)}
        </div>
        <div>
          <p>ADD FLOWER: </p>
          <p>COMNAME: </p>
          <input value={flower.comname} onChange={comname => this.setState({ flower: {...flower, comname: comname.target.value}})} />
          <p>GENUS: </p>
          <input value={flower.genus} onChange={genus => this.setState({ flower: {...flower, genus: genus.target.value}})}/>
          <p>SPECIES: </p>
          <input value={flower.species} onChange={species => this.setState({ flower: {...flower, species: species.target.value}})}/>
          <button onClick={() => {this.addFlower()}}>Add Flower</button>
        </div>
        <div>
          <p>ADD SIGHTING: </p>
          <p>NAME: </p>
          <input value={sighted.name} onChange={name => this.setState({ sighted: {...sighted, name: name.target.value}})} />
          <p>PERSON: </p>
          <input value={sighted.person} onChange={person => this.setState({ sighted: {...sighted, person: person.target.value}})}/>
          <p>LOCATION: </p>
          <input value={sighted.location} onChange={location => this.setState({ sighted: {...sighted, location: location.target.value}})}/>
          <p>SIGHTED: </p>
          <input value={sighted.sight} onChange={sight => this.setState({ sighted: {...sighted, sight: sight.target.value}})}/>
          <button onClick={() => {this.addSighting(); this.forceUpdate()}}>Add Sighting</button>
        </div>
        <div>
          <p>UPDATE CURRENT FLOWER:   {currFlower.comname}</p>
          <p>COMNAME: </p>
          <input value={currFlower.comname} onChange={comname => this.setState({ currFlower: {...currFlower, comname: comname.target.value}})} />
          <p>GENUS: </p>
          <input value={currFlower.genus} onChange={genus => this.setState({ currFlower: {...currFlower, genus: genus.target.value}})}/>
          <p>SPECIES: </p>
          <input value={currFlower.species} onChange={species => this.setState({ currFlower: {...currFlower, species: species.target.value}})}/>
          <button onClick={() => {this.updateFlower()}}>Update Flower</button>
        </div>
        <div>
          <p>CREATE ACCOUNT:   </p>
          <p>USERNAME: </p>
          <input value={userCreate.user} onChange={user => this.setState({ userCreate: {...userCreate, user: user.target.value}})}/>
          <p>PASSWORD: </p>
          <input type="password" value={userCreate.pass} onChange={pass => this.setState({ userCreate: {...userCreate, pass: pass.target.value}})}/>
          <button onClick={() => {this.addUser()}}>Create</button>
        </div>
        <div>
          <p>LOGIN:   </p>
          <p>USERNAME: </p>
          <input value={userLogin.user} onChange={user => this.setState({ userLogin: {...userLogin, user: user.target.value}})}/>
          <p>PASSWORD: </p>
          <input type="password" value={userLogin.pass} onChange={pass => this.setState({ userLogin: {...userLogin, pass: pass.target.value}})}/>
          <button onClick={() => {this.checkUser()}}>Login</button>
          <button onClick={() => {this.setState({ userLogin: {...userLogin, loggedIn: "FALSE"}}); console.log("Logged Out")}}>Logout</button>
        </div>
        <div>
          <p>USER STATUS:   </p>
          <div>LOGGED IN: {userLogin.loggedIn}</div>
        </div>
      </div>
    )
  }
}

export default App;
