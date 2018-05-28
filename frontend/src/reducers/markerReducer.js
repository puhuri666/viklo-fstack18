import observationService from '../services/observations'

const markerReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_MARKERS':
      return action.data
    case 'ADD_MARKER':
      return [...state, action.data]
    case 'EMPTY_MARKERS':
      console.log('EMPTY MARKERS')
      return []
    case 'DELETE_LAST':
      const length = state.length
      const id = state[length-1].id
      return state.filter(marker => marker.id !== id)
    default:
      return state
  }
}

export const setMarkers = () => {
  return async (dispatch) => {
    const observations = await observationService.getAll()
    dispatch ({
      type: 'SET_MARKERS',
      data: observations
    })
  }
}

export const markersForUser = (data) => {
  return async (dispatch) => {
    dispatch ({
      type: 'SET_MARKERS',
      data
    })
  }
}

export const addMarker = (data) => {
  return async (dispatch) => {
    dispatch ({
      type: 'ADD_MARKER',
      data
    })
  }
}

export const emptyMarkers = () => {
  return async (dispatch) => {
    dispatch ({
      type: 'EMPTY_MARKERS'
    })
  }
}

export const deleteLast = () => {
  return async (dispatch) => {
    dispatch({
      type: 'DELETE_LAST'
    })
  }
}

export default markerReducer