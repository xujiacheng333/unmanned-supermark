import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css'
import PayByWeixinIcon from "./PayByWeixinIcon.png"
import scanIntro from './scan-intro.png'
import loadingIcon from './loading.gif';
import noQrcode from './no-Qrcode.png';
import paying from './paying.png';
import config from '@/config';

// 预加载图片
[scanIntro, loadingIcon, noQrcode, paying].forEach(function (val,index) {
  var image = new Image();
  image.src = val;
  image.onload = function () {
  }
})

class PayByWeixin extends Component {


  // 取消正在支付
  cancelPaying = () => {
    this.props.dispatch({
      type: 'IS_PAYING',
      isPaying: false,
    })
  }

  render() {
    return (
      <div className="PayByWeixin">
        <div className="top">
          <h2>原价支付</h2>
          {
            <span className="price ">￥<strong>{this.props.store.cart.m_priceTotal}</strong></span>
          }
          
          <span className="letfTime">剩余支付时间{this.props.clockText}</span>
        </div>
        {

          // 未支付
          !this.props.store.isPaying && <div className="mid">
            <div className="Qrcode">
              <img className="Qrcode-img" src={noQrcode} alt=""/>
              <img className="loadingIcon" src={loadingIcon} alt=""/>
              {
                 <img className="Qrcode-img real-Qrcode-img" src={'http://wx.hayimovie.com/cmts.php?c=api&a=create_qrcode&content=http%3a%2f%2fwx.hayimovie.com%2fcmts.php%3fc%3dticket%26a%3dpay_canteen_order%26payment%3d0%26channel_id%3d1%26cinema_id%3d'+ config.cinema_id + '%26seller_id%3d' + config.seller_id + '%26order_id%3d' + this.props.store.cart.order_id} alt="" onClick={this.paying}/>
              }
            </div>
           <div className="text">
             <img src={PayByWeixinIcon} alt="" className="payIcon" />
             <span>微信扫码支付</span>
           </div>
          </div>
        }
        {
          this.props.store.isPaying && <div className="mid">
            <img className="paying" src={paying} alt=""/>
            <span className="paying-t1">扫码成功</span>
            <span className="paying-t2">请在手机上确认支付</span>
            <button className="paying-button" onClick={this.cancelPaying}>返回二维码</button>
          </div>
        }
        
        <div className="bottom">
          <img src={scanIntro} alt=""/>
        </div>
      </div>
    )
  }

}

function mapStateToProps (state) {
  return {store: state}
}
export default connect(mapStateToProps)(PayByWeixin);
