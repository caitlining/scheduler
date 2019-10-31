import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const ERROR_SAVE = "SAVING_ERROR";
  const ERROR_NO_INTERVIEWER = "INTERVIEWER ERROR";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const ERROR_DELETE = "DELETING_ERROR";
  const EDIT = "EDITING";

  const { mode, transition, back} = useVisualMode(
    props.interview? SHOW : EMPTY
  );

  function save(name, interviewer) {
    transition(SAVING);

    const interview = {
      student: name,
      interviewer: interviewer
    };

    if(!interview.interviewer){
      transition(ERROR_NO_INTERVIEWER, true)
    } else {
      props.bookInterview(props.id, interview)
      .then(response => {
        transition(SHOW);
      })
      .catch(error => {
        transition(ERROR_SAVE, true);
      })
    }

 

  };

  function confirmation() {
    transition(CONFIRM);
  }

  function cancel() {
    transition(DELETING, true);

    props.cancelInterview(props.id)
    .then(response => {
      transition(EMPTY);
    })
    .catch(error => {
      transition(ERROR_DELETE, true);
    })
  }




  return (
    <article className="appointment">
      <Header time={props.time}/>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && <Show student={props.interview.student} interviewer={props.interview.interviewer} onDelete={confirmation} onEdit={() => transition(EDIT)}/>}
        {mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => back()} onSave={save} />}
        {mode === EDIT && <Form name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onCancel={() => transition(SHOW)} onSave={save} />}
        {mode === SAVING && <Status message= 'Saving'/>}
        {mode === DELETING && <Status message= 'Deleting'/>}
        {mode === CONFIRM && <Confirm message= 'Are you sure you would like to delete?' onCancel={() => back()} onConfirm={cancel} />}
        {mode === ERROR_DELETE && <Error message= 'Error deleting appointment' onClose={() => back()}/>}
        {mode === ERROR_SAVE && <Error message= 'Error saving appointment' onClose={() => back()}/>}
        {mode === ERROR_NO_INTERVIEWER && <Error message= 'Error: No Interviewer Selected' onClose={() => back()}/>}


    </article>
  );
};
