// 遮罩层
// sock逻辑层


import React, { Component } from 'react';
import { connect } from 'react-redux';
import ShoppingCar from '@/Container/ShoppingCar';
import PayByWeixin from '@/Container/PayByWeixin';
import PayByHuiyuan from '@/Container/PayByHuiyuan';
import PaySuccess from '@/Container/PaySuccess';
import NetError from '@/Container/NetError';
import config from "@/config";

import './style.css'
import webSock from '@/utils/webSock';
import closeIcon from '@/imgs/close.png';
import axios from 'axios';
import qs from 'qs';

import TweenOne from 'rc-tween-one';

class Baffle extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      createOrderRepeatTims: 0,
    }
    
  }

  Socket = new webSock({
    'domain' : '120.24.179.157'
  }, this)

  // 订单倒计时
  setClock = () => {
    let that = this;
    this.setState({
      clock: 300,
      clockText: '05:00',
    })
    this.clock = setInterval(()=>{
      let clock = this.state.clock;
      clock = clock - 1;
      if (clock <= 0) {
        this.props.clearAllCart()
        this.props.changeProgress(0)
        clearInterval(that.clock)
        return;
      }
      this.setState({
        clock: clock,
        clockText: this.toClocktext(clock),
      })
    },1000)
  }

  componentWillUnmount() {
    clearInterval(this.clock)

  }

  toClocktext = (num) => {
    let left = Math.floor(num / 60);
    left = '0' + left;
    let right = num % 60;
    if (right < 10) {
      right = '0' + right;
    }
    return left + ':' + right
  }



  // 下单  可优化，若未改变商品 可以不请求
  createOrder = () => {

    let cart = [];
    this.props.store.cart.goodlist.forEach(val=>{
      let obj = {
        id: val.id,
        num: val.selectNum,
      }
      cart.push(obj)
    })
    cart = JSON.stringify(cart);
    
    // 监测 是否需要重新生成订单
    if(this.props.store.currentOrderCartList === cart && this.state.clock > 180) {
      // 传进redux的数组会转换为字符串
      console.log("不需要重新生成订单")
      return;
    }

    axios({
      method: 'post',
      url: '/cmts.php?c=api&a=create_canteen_order',
      data: qs.stringify({
        cinema_id:config.cinema_id,
        seller_id:config.seller_id,
        cart:cart
      })
    }).then((res) => {
      if (res.data.ResCode === '0') {
        this.props.createdOrder(cart,res.data.ResData.order_id)
        clearInterval(this.clock)
        this.setClock()
      } else {
        this.props.changeProgress(5)
      }
    }).catch(err=>{
      // 出错重试5次
      let createOrderRepeatTims = this.state.createOrderRepeatTims;
      createOrderRepeatTims++;
      this.setState({
        createOrderRepeatTims:createOrderRepeatTims,
      })
      if (createOrderRepeatTims < 5) {
        this.createOrder()
      } else {
        this.props.changeProgress(5)
        this.setState({
          createOrderRepeatTims:0,
        })
      }
    })
  }


  render() {
    return this.props.store && this.props.store.baffle  === true ? (
      <div className="Baffle">
        <div className="bg-cover"></div>

            <div className="Baffle-content">
            <img src={closeIcon} className="closeIcon" alt="" onClick={this.props.toggleBuffle}/>

            {
              // 购物车 progress == 1
              this.props.store.progress === 1 && <ShoppingCar {...this.props.store} createOrder={this.createOrder}></ShoppingCar>
            }
            {
              // 微信支付
              this.props.store.progress === 2 && <PayByWeixin {...this.state} ></PayByWeixin>
            }
            {
              // 会员支付
              this.props.store.progress === 3 && <PayByHuiyuan {...this.state} ></PayByHuiyuan>
            }
            {
              // 支付成功
              this.props.store.progress === 4 && <PaySuccess></PaySuccess>
            }

            {
              // 网络异常
              this.props.store.progress === 5 && <NetError></NetError>
            }
            </div>
           
      </div>
    ) : null
  }
}

function mapStateToProps (state) {
  return {store: state}
}
const mapDispatchToProps = (dispatch) => {
  return {
    changeProgress: (progress) => {
      dispatch({
        type: 'CHANGE_PROGRESS',
        progress: progress
      })
    },
    clearAllCart: ()=>{
      dispatch({
        type: 'CLEAR_CART',
      })
    },
    updateCart: (cart) => {
      dispatch({
        type: 'UPDATE_CART',
        cart: cart
      })
    },
    toggleBuffle: () => {
      dispatch({
        type: 'TOGGLE_BAFFLE',
      })
    },
    createdOrder: (cart,order_id) => {
      dispatch({
        type: 'CREATED_ORDER',
        order_id: order_id,
        cart: cart,
      })
    },
    
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Baffle);
