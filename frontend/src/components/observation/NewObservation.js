import React from 'react'
import { connect } from 'react-redux'
import observationService from '../../services/observations'
import { initializeObservations} from '../../reducers/observationReducer'
import { initUsers } from '../../reducers/usersReducer'
import { setMarkers, emptyMarkers } from '../../reducers/markerReducer'
import { LocationComponent } from './Location'
import { Link, Redirect } from 'react-router-dom'

class NewObservation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      species: [],
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      search: '',
      resultsVisibility: false,
      results: [],
      speciesId: '',
      date: '',
      time: '',
      active: {},
      additionalComments: '',
      popUpVisibility: false,
      observationSent: false,
      response: {},
      error: {
        visibility: false,
        message: []
      },
      number: 0,
      single: false,
      sex: 'undefined'
    }
  }

  addObservation = async (event) => {
    event.preventDefault()

    const requestObject = {
      token: this.props.user.token,
      user: this.props.user.id,
      species: this.state.speciesId,
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude,
      zipcode: this.props.location.zipcode,
      town: this.props.location.town,
      additionalComments: this.state.additionalComments,
      sex: this.state.sex,
      number: this.state.number,
      date: new Date(this.state.date + ' ' + this.state.time.replace('.', ':'))
    }

    this.setState({ latitude: '', longitude: '' })

    const response = await observationService.newObservation(requestObject)
    console.log('response här', response)
    this.setState({ response })
    if (response.id) {
      this.setState({ observationSent: true, error: { message: [], visibility: false }, showSex: false })
    } else if (response.error) {
      return this.setState({ error: { message: response.error, visibility: true } })
    }
    console.log(this.state.response)
    this.props.setMarkers()
    this.props.initializeObservations()
    this.props.initUsers()
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
    const species = this.props.species
    const search = event.target.value
    if (event.target.name === 'search') {
      const speciesFilter = species.filter(species => species.finnishName.toLowerCase().includes(search.toLowerCase()))
      if (speciesFilter.length < 21) {
          this.setState({
            results: speciesFilter,
            resultsVisibility: true
          })
      } else {
        this.setState({
          resultsVisibility: false
        })
      }
    }
  }

  handleNumberChange = (event) => {
    this.setState({ number: event.target.value })
    if (Number(event.target.value) === 1) {
      this.setState({ single: true })
    } else {
      this.setState({ single: false, sex: 'undefined' })
    }
  }

  handleDateChange = (event) => {
    const split = event.target.value.split('.')
    if (split.length === 3) {
      const date = split[1] + ' ' + split[0] + ' ' + split[2]
      this.setState({ date })
    }
  }

  handleSpeciesClick = (event) => {
    event.preventDefault()
    const laji = this.props.species.find(species => species.id === event.target.id)
    console.log(laji)
    const search = `${laji.finnishName} (${laji.latinName})`
    this.setState({ 
      resultsVisibility: false,
      active: laji,
      search,
      speciesId: laji.id
     })
  }

  handleSexChange = (event) => {
    console.log('handleSexChange', event.target.value)
    this.setState({ sex: event.target.value })
  }

  toggleVisibility = (event) => {
    event.preventDefault()
    this.setState({ popUpVisibility: !this.state.popUpVisibility })
    console.log(this.state)
  }

  toggleObservationSent = (event) => {
    event.preventDefault()
    this.setState({ observationSent: false, search: '', speciesId: '' })
  }

  render() {
    const visibility = {
      display: this.state.resultsVisibility ? '' : 'none'
    }

    const tr = {
      verticalAlign: 'top'
    }

    const oikea = {
      display: 'inline-block',
      width: '454px',
      paddingLeft: '60px'
    }

    const vasen = {
      float: 'left',
      width: '354px'
    }

    const errorMessage = {
      display: this.state.error.visibility ? '' : 'none',
      padding: '5px'
    }

    const errorMessageStyle = {
      color: '#A80000'
    }

    const showSex = {
      display: this.state.single ? '' : 'none'
    }

    if (!this.props.user.activated) {
      return (
        <Redirect to="/" />
      )
    }

    if (!this.state.observationSent) {
      return (
        <div>
          <h1>Lisää havainto</h1>
          <div>
          </div>
          <table style={vasen}>
            <tbody>
              <tr style={tr}>
                <td style={tr}>
                  <h4>Laji</h4>
                  Etsi nimen perusteella:<br />
                  <input id="search" type="text" className="lajiSearchInput" name="search" onChange={this.handleChange} value={this.state.search} placeholder="Tylli (Charadrius hiaticula)" />
                  <div className="speciesResults" style={visibility}>
                    {this.state.results.map(species => 
                      <p key={species.id}><a href="" onClick={this.handleSpeciesClick} id={species.id}>{species.finnishName} ({species.latinName}</a>)</p>)
                    }
                  </div>
                </td>
              </tr>
              <tr style={tr}>
                <td style={tr}>
                  Lukumäärä<br />
                  <input type="text" name="number" onChange={this.handleNumberChange} /><br />
                  <div style={showSex}>
                    Sukupuoli <br />
                    <select name="sex" className="dropdown" onChange={this.handleSexChange}>
                      <option value="Uros">Uros</option>
                      <option value="Naaras">Naaras</option>
                    </select>
                  </div>
                </td>
              </tr>
              <tr style={tr}>
                <td style={tr}>
                  <h4>Aika</h4>
                  Päivämäärä<br />
                  <input type="text" name="date" onChange={this.handleDateChange} placeholder="1.1.2018"/><br />
                  Kellonaika<br />
                  <input type="text" name="time" onChange={this.handleChange} placeholder="13.00"/>
                </td>
              </tr>
            </tbody>
          </table>
          <table style={oikea}>
            <tbody>
              <tr style={tr}>
                <td style={tr}>
                <LocationComponent />
                </td>
              </tr>
              <tr style={tr}>
                <td style={tr}>
                  <form onSubmit={this.addObservation}>
                    <h4>Kommentti</h4>
                    <textarea name="additionalComments" placeholder="Poikanen" onChange={this.handleChange} /><br />
                    <div style={errorMessage}>
                      Havainnon lisäys ei onnistunut.
                      {this.state.error.message.map(error => <p style={errorMessageStyle} key={error}>{error}</p>)}
                    </div>
                    <button>Lisää havainto</button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      const succesfulRequest = () => (
          <div>
            <h1>Havainto lisätty</h1>
            <h4>Lisätty havainto:</h4>
            <p>Laji: {this.state.response.species.finnishName} ({this.state.response.species.latinName})</p>
            <p>Päivämäärä: {this.state.response.date}</p>
            <p>Sijainti: {this.state.response.latitude}, {this.state.response.longitude} ({this.state.response.town})</p>
            <Link to="/uusihavainto" onClick={this.toggleObservationSent}>Palaa takaisin</Link>
          </div>
      )

      return (
        <div>
          {this.state.response.id ? succesfulRequest() : ''}
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    species: state.species,
    user: state.user,
    location: state.location
  }
}

export default connect(
  mapStateToProps,
  { setMarkers, emptyMarkers, initializeObservations, initUsers }
)(NewObservation)