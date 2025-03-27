import React from 'react'
import './Title.css';

const Title = (props) => {
  return (
    <div id="title">
        <h1>
            Set: {props.title}
        </h1>
    </div>
  )
}

export default Title;