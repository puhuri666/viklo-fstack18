import React from 'react'
import { connect } from 'react-redux'
import { addSpecies } from '../reducers/speciesReducer'
import speciesService from '../services/species'

class AddSpecies extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      finnishName: '',
      latinName: ''
    }
  }

  handleFieldChange = (event) => {
    event.preventDefault()
    this.setState({ [event.target.name]: event.target.value })
    console.log(this.state)
  }

  submit = async (event) => {
    event.preventDefault()
    const requestObject = {
      token: this.props.user.token,
      finnishName: this.state.finnishName,
      latinName: this.state.latinName
    }
    const response = await speciesService.addSpecies(requestObject)
    console.log(response)
    if (response.id) {
      this.props.addSpecies(response)
    }
  }

  render() {

    return (
      <div>
        <h1>lisää laji</h1>
        <form onSubmit={this.submit}>
        suomeksi: <input type="text" name="finnishName" onChange={this.handleFieldChange} /><br />
        latinaksi: <input type="text" name="latinName" onChange={this.handleFieldChange} /><br />
        <button>lisää laji</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect (
  mapStateToProps,
  { addSpecies }
)(AddSpecies)