import React, { Component } from 'react';
import shoppingCartIcon from '@/imgs/shopping-cart.png';
import shoppingCartDelAll from '@/imgs/car-del-all.png';
import './style.css';
import ToggleSelectNum from '@/Component/ToggleSelectNum';
import QueueAnim from 'rc-queue-anim';
class ShoppingCar extends Component {
  
  constructor (props) {
    super(props)
  }

  numChange = (id ,num) => {
    this.props.updataGoodlist(id,num)
  }
  
  // 清空购物车
  clearAllCart = () => {
    this.props.clearAllCart()
    this.props.changeProgress(0)

  }


  // 微信支付 原价支付
  payByWeixin = () => {
    this.props.changeProgress(2)
  }
  
  // 会员支付
  payByHuiyuan = () => {
    this.props.changeProgress(3)
  }


  render() {
    return  (
      <div className="ShoppingCar">
        <div className="ShoppingCar-container">
          <div className="top">
            <img src={shoppingCartIcon} className="ShoppingCar-shopping-cart" alt="" onClick={this.toggleShoppingCar}></img>
            {
              this.props.shoppingCart.totalNum > 0 && <span className="ShoppingCar-cartTotalNum">{this.props.shoppingCart.totalNum}</span>
            }
            <div className="car-del-all" onClick={this.clearAllCart}><img src={shoppingCartDelAll} alt=""/>清空购物车</div>

          </div>
          <div className="main">
            <div className="ShoppingCar-good-container">
              <QueueAnim appear={false} type="left" interval="100">
                {
                  this.props.shoppingCart.goodlist.map((gval, gindex)=>(
                    <div className="ShoppingCar-good-item" key={gval.id}>
                      <img src={gval.imgurl} alt=""/>
                      <div className="mid">
                        <h3 className="name">{gval.name}</h3>
                        <div >
                          <span className="p_price">会员价￥<strong>{gval.p_price}</strong></span>
                          <span className="m_price">原价￥{gval.m_price}</span>
                        </div>
                      </div>
                      <ToggleSelectNum current={gval.selectNum} numChange={this.numChange} dataId={gval.id} ></ToggleSelectNum>
                      {
                        gindex < this.props.shoppingCart.goodlist.length - 1 && <hr/>
                      }
                      
                    </div>

                  ))
                }
              </QueueAnim>
            
            </div>
            
            <div className="bottom">
              <span className="button-title">合计</span>
              <div className="All_price">
                <span className="p_price">会员￥{this.props.shoppingCart.p_priceTotal}</span>
                <span className="m_price">原价￥{this.props.shoppingCart.m_priceTotal}</span>
              </div> 
              <button className="pay-weixin" onClick={this.payByWeixin}>原价支付</button>
              <button className="pay-huiyuan" onClick={this.payByHuiyuan}>会员支付</button>
            </div>
          </div>
          
        </div>
      </div>
    ) 
  }


}


export default ShoppingCar