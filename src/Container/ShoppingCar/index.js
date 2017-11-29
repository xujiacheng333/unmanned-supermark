import React, { Component } from 'react';
import { connect } from 'react-redux';
import shoppingCartIcon from '@/imgs/shopping-cart.png';
import shoppingCartDelAll from '@/imgs/car-del-all.png';
import './style.css';
import ToggleSelectNum from '@/Component/ToggleSelectNum';
import QueueAnim from 'rc-queue-anim';
class ShoppingCar extends Component {
  
  
  // 微信支付 原价支付
  payByWeixin = () => {
    this.props.createOrder()
    this.props.changeProgress(2)
  }
  
  // 会员支付
  payByHuiyuan = () => {
    this.props.createOrder()
    this.props.changeProgress(3)
  }


  render() {
    return  (
      <div className="ShoppingCar">
        <div className="ShoppingCar-container">
          <div className="top">
            <img src={shoppingCartIcon} className="ShoppingCar-shopping-cart" alt="" onClick={this.toggleShoppingCar}></img>
            {
              this.props.cart.totalNum > 0 && <span className="ShoppingCar-cartTotalNum">{this.props.cart.totalNum}</span>
            }
            <div className="car-del-all" onClick={this.props.clearAllCart}><img src={shoppingCartDelAll} alt=""/>清空购物车</div>

          </div>
          <div className="main">
            <div className="ShoppingCar-good-container">
              <QueueAnim appear={false} type="left" interval="100">
                {
                  this.props.cart.goodlist.map((gval, gindex)=>(
                    <div className="ShoppingCar-good-item" key={gval.id}>
                      <img src={gval.imgurl} alt=""/>
                      <div className="mid">
                        <h3 className="name">{gval.name}</h3>
                        <div >
                          <span className="p_price">会员价￥<strong>{gval.p_price}</strong></span>
                          <span className="m_price">原价￥{gval.m_price}</span>
                        </div>
                      </div>
                      <ToggleSelectNum current={gval.selectNum} numChange={this.props.updateCart} dataId={gval.id} ></ToggleSelectNum>
                      {
                        gindex < this.props.cart.goodlist.length - 1 && <hr/>
                      }
                      
                    </div>

                  ))
                }
              </QueueAnim>
            
            </div>
            
            <div className="bottom">
              <span className="button-title">合计</span>
              <div className="All_price">
                <span className="p_price">会员￥{this.props.cart.p_priceTotal}</span>
                <span className="m_price">原价￥{this.props.cart.m_priceTotal}</span>
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
    updateCart: (item, changeNum) => {
      dispatch({
        type: 'UPDATE_CART',
        item: item,
        changeNum: changeNum
      })
    },
    clearAllCart: ()=>{
      dispatch({
        type: 'CLEAR_CART',
      })
    }
    
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ShoppingCar);
