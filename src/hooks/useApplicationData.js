import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(response => {
      setState(prev => ({
        ...prev, 
        days: response[0].data,
        appointments: response[1].data,
        interviewers: response[2].data
      }))
    });
  }, [])

  function setDay(day) {
    setState({...state, day});
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview}
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(response => {
      setState({
        ...state,
        appointments
      })
    })
  };
  
  function cancelInterview(id) {
    const nullAppointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: nullAppointment
    };
    return axios.delete(`api/appointments/${id}`)
    .then(response => {
      setState({
        ...state,
        appointments
      })
    })
  }
  
  return { state, setDay, bookInterview, cancelInterview}
};
