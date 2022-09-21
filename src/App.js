import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      contacts: [],
      name: '',
      number: '',
      adress: '',
      email: '',
      formStatus: '',
      contactIdSelected: null,
    }
  }

  componentDidMount() {
    let appid = "63256eba0581750298f30802"
    axios.get(`https://io.etter.cloud/v4/select_all/token/632411e20581750298f3078c/project/contact_app/collection/contact/appid/${appid}/contact`)
      .then(response => {
        this.setState({ contacts: response.data })
      })
      .catch(error => {
        console.log('error');
      })
  }

  loadData = () => {
    let appid = "63256eba0581750298f30802"
    axios.get(`https://io.etter.cloud/v4/select_all/token/632411e20581750298f3078c/project/contact_app/collection/contact/appid/${appid}/contact`)
      .then(response => {
        this.setState({ contacts: response.data })
      })
      .catch(error => {
        console.log('error');
      })
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmitHandler = (e) => {
    e.preventDefault();
    this.loadData()
    let payload = {};
    let url = '';
    if (this.state.formStatus === '') {
      payload = {
        token: "632411e20581750298f3078c",
        project: "contact_app",
        collection: "contact",
        appid: "63256eba0581750298f30802",
        name: this.state.name,
        number: this.state.number,
        adress: this.state.adress,
        email: this.state.email,
      }
      url = "https://io.etter.cloud/v4/insert/contact"
      this.addContact(url, payload)
    }
    if (this.state.formStatus === 'Edit') {
      payload = {
        token: "632411e20581750298f3078c",
        project: "contact_app",
        collection: "contact",
        appid: "63256eba0581750298f30802",
        id: this.state.contactIdSelected,
        update_field: "name~number~adress~email",
        update_value: this.state.name+"~"+this.state.number+"~"+this.state.adress+"~"+this.state.email
      }
      url = "https://io.etter.cloud/v4/update_id/contact"
      this.editContact(url, payload)
    }
  }

  addContact = (url, payload) => {
    axios.post(url, payload)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log('error', error)
      })
  }

  // edit Contact belum bisa dijalankan: response belum terkirim dari database dan belumm bisa di console.log

  editContact = (url, payload) => {
    axios.post(url, payload)
      .then(response => {
        console.log(response)
        let contacts = [...this.state.contacts]
        let contactsIndex = contacts.findIndex(contacts => contacts._id === this.state.contactIdSelected)

        contacts[contactsIndex].name = response.data.name
      })
      .catch(error => {
        console.log('error', error)
      })
  }


  editButtonHandler = (contact) => {
    this.setState({
      name: contact.name,
      number: contact.number,
      adress: contact.adress,
      email: contact.email,
      contactIdSelected: contact._id,
      formStatus: 'Edit'
    })
    this.loadData()
  }

  deleteButtonHandler = (contact) => {

    let id = contact._id
    let appid = "63256eba0581750298f30802"
    let url = `https://io.etter.cloud/v4/remove_id/token/632411e20581750298f3078c/project/contact_app/collection/contact/appid/${appid}/id/${id}/contact`
    let payload = {
      token: "632411e20581750298f3078c",
      project: "contact_app",
      collection: "contact",
      appid: "63256eba0581750298f30802",
      id: contact._id
    }
    
    axios.delete(url, payload)
      .then(response => {
        let contacts = [...this.state.contacts]
        console.log(contacts)
        this.loadData()
        // let indexContacts =  contacts.findIndex(element => element.id === id)
        // console.log(indexContacts)
        
        // contacts.splice(index, 1)
      })
      .catch(error => {
        console.log(error)
      })
  }


  render() {
    return (
      <div className='container m-auto align-item-center'>
        <h2>{this.state.formStatus} My Contact List</h2>
        <div className=''>
          <form onSubmit={this.onSubmitHandler}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              className='form-control m-1'
              value={this.state.name}
              onChange={this.onChangeHandler}></input>
            <label>Number</label>
            <input
              type="text"
              name="number"
              className='form-control m-1'
              value={this.state.number}
              onChange={this.onChangeHandler}></input>
            <label>Adress</label>
            <input
              type="text"
              name="adress"
              className='form-control m-1'
              value={this.state.adress}
              onChange={this.onChangeHandler}></input>
            <label>Email</label>
            <input
              type="email"
              name="email"
              className='form-control m-1'
              value={this.state.email}
              onChange={this.onChangeHandler}></input>
            <button className="btn btn-primary btn-sm">Submit</button>
          </form>
        </div>

        <div className='list-wrapper'>
          <h2>Contact</h2>
          <div className='cards'>
            {this.state.contacts.map(contact => {
              return (
                <div className='card m-2' key={contact._id}>
                  <div className='d-flex flex-row col-12'>
                    <div className='col-md-6 p-2'>
                      <h5>Name: {contact.name}</h5>
                      <h5>Number: {contact.number}</h5>
                      <h5>Adress: {contact.adress}</h5>
                      <h5>Email: {contact.email}</h5>
                      <button
                        className="btn btn-primary btn-sm m-2"
                        onClick={() => this.editButtonHandler(contact)}
                      >Edit</button>
                      <button
                        className="btn btn-danger btn-sm m-2"
                        onClick={() => this.deleteButtonHandler(contact)}>Delete</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default App