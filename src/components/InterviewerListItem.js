import React from "react";
import "components/InterviewerListItem.scss";

const classNames = require('classnames');

export default function InterviewListItem(props) {

  const interviewerClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected
  });

  const name = props.name

  return (
    <li 
      className={interviewerClass}
      onClick = {() => props.setInterviewer(props.name)}>
      <img
        className="interviewers__item-image"
        src={ props.avatar }
        alt={ name }
      />
    {props.selected && (
      name
    )}
    </li>
  )
};
