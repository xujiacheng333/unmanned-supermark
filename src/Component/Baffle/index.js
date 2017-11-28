// 遮罩层
// sock逻辑层


import React, { Component } from 'react';
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
      progress: 1,
      isPaying: false,
      isError: false,
      createOrderRepeatTims: 0,
      anim: {
        paused: true,
        animation: [],
      },
      clock: 300,
      clockText: '05:00',
    }
  }

  componentDidMount() {

  }

  Socket = new webSock({
    'domain' : '120.24.179.157'
  }, this)
  
  // 订单倒计时
  setClock = () => {
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
        return;
      }
      this.setState({
        clock: clock,
        clockText: this.toClocktext(clock),
      })
    },1000)
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

  componentWillUnmount() {
    clearInterval(this.clock)
  }
  
  // 重新打开 返回到购物车页
  componentWillReceiveProps(obj, nextProps) {
    if (this.state.progress === 1) return;
    this.changeProgress(1)
  }
  

  // 若为0 则关闭浮窗
  changeProgress = (progressNum) => {
    console.log(progressNum)
    if (progressNum === 2 || progressNum === 3) {
      this.anim()
      var connnetedWS = localStorage.getItem('connnetedWS');
      if (connnetedWS !== 'true') {
        // 网络连接失败
        return;
      }
      this.cancelPaying()
      this.createOrder() //下单
    } else if (progressNum === 4) {
      this.clearAllCart()
      this.cancelPaying()
      this.props.toggleBuffle(false)
    } else if (progressNum === 0){
      this.cancelPaying()
      this.props.toggleBuffle(false)
    } else if (progressNum === 1) {
      this.cancelPaying()
      this.anim()
    }

    this.setState({
      progress: progressNum
    })
    


  }

  anim = () => {
    let BaffleStyle = this.state.BaffleStyle;
    let BaffleAnim = this.state.BaffleAnim;
    BaffleStyle = {
      opacity: '0.1',
      scale: '0.1',
    }
    BaffleAnim = [
    {
      opacity: '1',
      duration: 100,
      scale: '1.05',

    },
    {
      opacity: '1',
      duration: 450,
      scale: '1',

    }
    ]
    this.setState({
      BaffleStyle: BaffleStyle,
      BaffleAnim: BaffleAnim,
    })
  }


  // 下单  可优化，若未改变商品 可以不请求
  createOrder = () => {
    let cart = [];
    this.props.shoppingCart.goodlist.forEach(val=>{
      let obj = {
        id: val.id,
        num: val.selectNum,
      }
      cart.push(obj)
    })
    cart = JSON.stringify(cart);
    
    // 监测 是否需要重新生成订单
    if (this.state.shoppingCart && this.state.clock > 180) {
      let Scart = []
      this.state.shoppingCart.goodlist.forEach(Sval => {
        let obj = {
          id: Sval.id,
          num: Sval.selectNum,
        }
        Scart.push(obj)
      })
      Scart = JSON.stringify(Scart);
      
      if(Scart == cart && this.state.clock > 180) {
        console.log("不需要重新生成订单")
        return;
      }
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
        let shoppingCart = this.props.shoppingCart;
        shoppingCart.order_id = res.data.ResData.order_id  //直接修改了当层的order_id;
        this.setState({
          shoppingCart: shoppingCart,
        })
        clearInterval(this.clock)
        this.setClock()
        // this.props.updateOrderId(res.data.ResData.order_id)
      } else {
        console.log(res.data.ResMsg)
        this.changeProgress(5)
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
        this.changeProgress(5)
        this.setState({
          createOrderRepeatTims:0,
        })
      }
    })
  }



  // paying 正在支付
  paying = () => {
    console.log("正在支付！！")
    this.setState({
      isPaying: true,
    })
  }

  cancelPaying = () => {
    this.setState({
      isPaying: false,
    })
  }

  clearAllCart = () => {
    let shoppingCart = {
      totalNum:0,
      goodlist:[],
      m_priceTotal: 0,
      p_priceTotal: 0,
      order_id: undefined,
    }
    this.setState({
      shoppingCart: shoppingCart,
    })
    this.props.clearAllCart()
  }





  closeCar = () => {
    this.changeProgress(0)
  }

  render() {
    return this.props.openBaffle  === true ? (
      <div className="Baffle">
        <div className="bg-cover"></div>



            

          <TweenOne 
            className="Baffle-content"
            style={this.state.BaffleStyle}
            animation={this.state.BaffleAnim}
            paused={false}
          >
            <img src={closeIcon} className="closeIcon" alt="" onClick={this.closeCar}/>
            {
              // 购物车 progress == 1
              this.state.progress === 1 && <ShoppingCar {...this.props} changeProgress={this.changeProgress}></ShoppingCar>
            }
            {
              // 微信支付
              this.state.progress === 2 && <PayByWeixin {...this.state} cancelPaying={this.cancelPaying} clearAllCart={this.clearAllCart} changeProgress={this.changeProgress}></PayByWeixin>
            }
            {
              // 会员支付
              this.state.progress === 3 && <PayByHuiyuan {...this.state}  cancelPaying={this.cancelPaying} clearAllCart={this.clearAllCart} changeProgress={this.changeProgress}></PayByHuiyuan>
            }

            {
              // 支付成功
              this.state.progress === 4 && <PaySuccess changeProgress={this.changeProgress}></PaySuccess>
            }

            {
              // 网络异常
              this.state.progress === 5 && <NetError></NetError>
            }

          </TweenOne>
      </div>
    ) : null
  }
}

export default Baffle;