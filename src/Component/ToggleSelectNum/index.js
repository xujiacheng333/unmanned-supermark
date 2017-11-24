

import React, { Component } from 'react';
// import delIcon from '@/imgs/toggleNumSelect-del.png';
// import delIconActive from '@/imgs/toggleNumSelect-del-active.png';
import './style.css';

class ToggleSelectNum extends Component {
  
  reduce = () =>{
    this.props.numChange(this.props.dataId ,-1)
  }

  add = () => {
    this.props.numChange(this.props.dataId, 1)
  }

  render () {
    return (
      <div className="ToggleSelectNum">
        <div className="reduce" onClick={this.reduce}></div>
        <div className="content">{this.props.current}</div>
        <div className="add" onClick={this.add}></div>
      </div>
    )
  }
}

export default ToggleSelectNum