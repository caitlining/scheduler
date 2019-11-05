import { useEffect, useReducer } from "react";
import axios from "axios";

import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "reducers/application";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
      day: "Monday",
      days: [],
      appointments: {},
      interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(response => {
      const days = response[0].data
      const appointments = response[1].data
      const interviewers = response[2].data
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers})
    });
  }, [])

  function setDay(day) {
    dispatch({ type: SET_DAY, value: day})
  }
  
  function cancelInterview(id) {
    const nullAppointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: nullAppointment
    };

    const days = state.days.map((item) => {
      if (item.appointments.includes(id)){
        item.spots ++
        return item
      } else {
        return item
      }
    })

    return axios.delete(`api/appointments/${id}`)
    .then(() => {
      dispatch({ type: SET_INTERVIEW, days, appointments})
    })
  }

  function bookInterview(id, interview) {

    let days = state.days

    if (!state.appointments[id].interview) {
      days = state.days.map((item) => {
        if (item.appointments.includes(id)){
          item.spots --
          return item
        } else {
          return item
      }
    })

    }

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview}
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => {
      dispatch({ type: SET_INTERVIEW, appointments, days})
    })
  };

  return { state, setDay, bookInterview, cancelInterview}
};
