import React, {Component} from 'react';
import './slider.css';

export default function (props){
  let onChange = props.onChange || (() =>{});
  return (
    <label className="switch">
      <input type="checkbox" checked={props.on ? 'true' : null} />
      <span className="slider round" onChange={onChange}></span>
    </label>
  );
}