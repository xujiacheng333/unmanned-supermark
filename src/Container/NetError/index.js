import React, { Component } from 'react';
import './style.css'
import netError from './netError.png';

class NetError extends Component {
  render() {
    return (
      <div className="NetError">
        <img className="netErrorIcon" src={netError} alt=""/>
        <span className="NetError-t1">网络故障</span>
        <span className="NetError-t2">请稍后重试</span>
      </div>
    )
  }

}

export default NetError