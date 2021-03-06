import React, { Component } from 'react';
import { connect } from 'react-redux';
import paySuccess from './paySuccess.png';
import './style.css'

class PaySuccess extends Component {

  constructor (props) {
    super(props)
    this.state = {
      closeNum: 3,
    }
  }

  closeClock = setInterval(()=>{
    let closeNum = this.state.closeNum;
    closeNum = closeNum - 1;
    if (closeNum <= 0) {
      this.props.dispatch({
        type: 'CHANGE_PROGRESS',
        progress: 1,
      })
      this.props.dispatch({
        type: 'TOGGLE_BAFFLE',
      })
      clearInterval(this.closeClock)

    }
    this.setState({
      closeNum: closeNum,
    })
  },1000)

  componentWillUnmount() {
    clearInterval(this.closeClock)
  }

  render() {
    return(
      <div className="PaySuccess">
        <img className="paySuccessIcon" src={paySuccess} alt=""/>
        <span className="PaySuccess-t1">付款成功</span>
        <span className="PaySuccess-t2">请往前自助取卖品</span>
        <span className="PaySuccess-t3">{this.state.closeNum}S后关闭此页面</span>
      </div>
      )
  }
}
export default connect()(PaySuccess);
