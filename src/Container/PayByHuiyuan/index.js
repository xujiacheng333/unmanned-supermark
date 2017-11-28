import React, { Component } from 'react';
import './style.css'
import PayByHuiyuanIcon from './PayByHuiyuanIcon.png'
import loadingIcon from './loading.gif';
import noQrcode from './no-Qrcode.png';
import paying from './paying.png';

// 预加载图片
[PayByHuiyuanIcon, loadingIcon, noQrcode, paying].forEach(function (val,index) {
  var image = new Image();
  image.src = val;
  image.onload = function () {
  }
})


class PayByHuiyuan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cinema_id: 2,
      seller_id: 1,
    }
  }

  timeout() {

  }
  
  componentDidMount() {

  }



  // 取消正在支付
  cancelPaying = () => {
    this.props.cancelPaying()
  }

  componentWillUnmount() {
    clearInterval(this.clock)
  }

  render() {
    return (
      <div className="PayByHuiyuan">
        <div className="top">
          <h2>会员支付</h2>
          {
            this.props.shoppingCart && <span className="price ">￥<strong>{this.props.shoppingCart.p_priceTotal}</strong></span>
          }
          
          <span className="letfTime">剩余支付时间{this.props.clockText}</span>
        </div>
        
        {
          // 未支付
          !this.props.isPaying && <div className="mid">
            <div className="Qrcode">
              
              <img className="Qrcode-img" src={noQrcode} alt=""/>
              <img className="loadingIcon" src={loadingIcon} alt=""/>
              {
                this.props.shoppingCart && this.props.shoppingCart.order_id && <img className="Qrcode-img real-Qrcode-img" src={'http://wx.hayimovie.com/cmts.php?c=api&a=create_qrcode&content=http%3a%2f%2fwx.hayimovie.com%2fcmts.php%3fc%3dticket%26a%3dpay_canteen_order%26payment%3d1%26channel_id%3d1%26cinema_id%3d'+ this.state.cinema_id + '%26seller_id%3d' + this.state.seller_id + '%26order_id%3d' + this.props.shoppingCart.order_id} alt=""/>
              }
              
            </div>
           <div className="text">
             <img src={PayByHuiyuanIcon} alt="" className="payIcon" />
             <span>微信扫码支付</span>
           </div>
        </div>
        }
        {
          this.props.isPaying && <div className="mid">
            <img className="paying" src={paying} alt=""/>
            <span className="paying-t1">扫码成功</span>
            <span className="paying-t2">请在手机上确认支付</span>
            <button className="paying-button" onClick={this.cancelPaying}>返回二维码</button>
          </div>
        }
      </div>
    )
  }

}

export default PayByHuiyuan;