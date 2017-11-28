import axios from 'axios';
import qs from 'qs';
import React, { Component } from 'react';
import './style.css'
import navTopBg from '@/imgs/nav-top-bg.png';
import shoppingCartIcon from '@/imgs/shopping-cart.png';
import TweenOne from 'rc-tween-one';
import {windowHeight, resetHeight} from '@/utils/reset';
import utils from '@/utils/utils';
import config from "@/config";

// 组件
import Baffle from '@/Component/Baffle';
  
class Home extends Component {
  
  state = {
    goods_list:[],
    cartAnimation: {},
    currentGK_index: 0,
    shoppingCart: {
      totalNum: 0,
      goodlist: []
    },
    cartAnimationStyle: {
      opacity: '0',
    }
    // 测试
    // openBaffle: true,
    
  }

  componentDidMount() {

    axios({
      method: 'post',
      url: '/cmts.php?c=api&a=get_canteen_list&cinema_id=' + config.cinema_id,
      data: qs.stringify({
        cinema_id:config.cinema_id,
        seller_id:config.seller_id
      })
    }).then((res) => {
      if (res.data.ResCode === '0') {
        this.setState({
          goods_list: res.data.ResData.data
        });
        this.addPaddingToBottom()
      }
    })
  }



  // 选择商品 点击开始
  selectOneStart = (eve) => {
    let touchXY = {
      clientX: eve.changedTouches[0].clientX,
      clientY: eve.changedTouches[0].clientY,
    }
    this.setState({
      touchXY: touchXY
    })
  }
  
  // 选择商品 点击事件  （结束）
  selectOne = (eve) => {
    let that = this
    let clientX = parseInt(eve.changedTouches[0].clientX) 
    let clientY = parseInt(eve.changedTouches[0].clientY)
    let agal1 = (this.state.touchXY.clientX - 5) < clientX && (this.state.touchXY.clientX + 5) > clientX
    let agal2 = (this.state.touchXY.clientY - 5) < clientY && (this.state.touchXY.clientY + 5) > clientY
    if (!agal1 || !agal2) {
      return;
    }
    // 动画
    let cartAnimationStyle = {
      left: (clientX - 50) + 'px',
      top: (clientY - 50) + 'px',
      opacity: '0.1',
      scale: '0.1',

    }
    let cartAnimation = [
    {
      left: (clientX - 50) + 'px',
      top: (clientY - 65 ) + 'px',
      opacity: '0.7',
      duration: 450,
      scale: '1',
    },
    {
      left: '30px',
      top: (windowHeight() - 160) + 'px',
      opacity: '0.3',
      duration: 1000,
      scale: '0.3',
      // bottom: '34px',
    },{
      left: '30px',
      top: (windowHeight() - 160) + 'px',
      opacity: '0',
      duration: 450,
      scale: '0',
    }]
    this.setState({
      cartAnimationStyle: cartAnimationStyle,
      cartAnimation:cartAnimation,
    })

    // 被点击的方块变底色
    let ele = eve.currentTarget;
    ele.style.backgroundColor = "#000"
    ele.style.opacity = "0.1"
    setTimeout(()=>{
      ele.style.backgroundColor = "transparent"
    },100)
    
    // 更新购物车
    let goodsID = eve.currentTarget.getAttribute('data-goods-id')

    that.updataGoodlist(goodsID, 1)
    

  }
  
  //  更新所有商品
  updataGoodlist = (goodsID,changeNum) => {

    let goods_list = this.state.goods_list;
    goods_list.map((kval)=>{
      kval.canteens.map(cval=>{
        if (cval.id == goodsID) { 

          // 增加
          if (cval.selectNum === undefined) {
            cval.selectNum = 1
          } else {
            cval.selectNum += changeNum
          }

        }
        return cval;
      })
      return kval;
    })
    
    // 需要否？
    this.setState({
      goods_list: goods_list,
    })

    this.updateCart(goods_list)
  }
  
  // 更新购物车
  updateCart = (goods_list) => {
    let shoppingCart = {
      totalNum:0,
      goodlist:[],
      m_priceTotal: 0,
      p_priceTotal: 0,
    }
    goods_list.forEach(kval=>{
      kval.canteens.forEach(cval=>{
        if (cval.selectNum && cval.selectNum > 0) {
          // 去除超值推荐的重复内容
          if (!utils.isInShopCart(shoppingCart.goodlist, cval.id)) {
            shoppingCart.goodlist.push(cval);
            shoppingCart.totalNum += parseInt(cval.selectNum);  
          }
        }
      })
    })

    shoppingCart.goodlist.forEach(val=>{
      shoppingCart.m_priceTotal += parseFloat(val.m_price) * parseInt(val.selectNum);
      shoppingCart.p_priceTotal += parseFloat(val.p_price) * parseInt(val.selectNum);
    })
    shoppingCart.m_priceTotal = shoppingCart.m_priceTotal.toFixed(2)
    shoppingCart.p_priceTotal = shoppingCart.p_priceTotal.toFixed(2)
    
    if (shoppingCart.totalNum <= 0) {
      this.toggleBuffle(false)
    }

    this.setState({
      shoppingCart: shoppingCart,
    })

  }


  // 清空购物车 
  clearAllCart = () =>{

    let shoppingCart = {
      totalNum:0,
      goodlist:[],
      m_priceTotal: 0,
      p_priceTotal: 0,
      order_id: undefined,
    }
    let goods_list = this.state.goods_list;
    goods_list.map((kval)=>{
      kval.canteens.map(cval=>{
        if (cval.selectNum) {
          delete cval.selectNum
        }
        return cval;
      })
      return kval;
    })


    this.setState({
      goods_list: goods_list,
      shoppingCart: shoppingCart,
    })
  }

  // 滚动定时器
  scrollingTimeOut = null

  // 左侧栏 菜单品类 改变
  GK_change = (eve) => {
    let index = parseInt(eve.currentTarget.getAttribute('data-index'))
    this.setState({
      currentGK_index: index,
      goods_list_scrrolling: true,
    })
    if (this.state.goods_list_scrrolling === true && this.scrollingTimeOut !== null) {
      clearTimeout(this.scrollingTimeOut)
    }
    this.scrollingTimeOut = setTimeout(()=>{
      this.setState({
        goods_list_scrrolling: false,
      })
    },1500)
    
  }
  
  // 底部加padding
  addPaddingToBottom = () => {
    let goodsListHeight = windowHeight() - 200
    let ele = window.document.getElementsByClassName('goods_list-item')[window.document.getElementsByClassName('goods_list-item').length - 1]
    let paddingBottom = goodsListHeight - ele.offsetHeight;
    if (paddingBottom > 0) {
        ele.style.marginBottom = paddingBottom + 'px'
    } else {
        ele.style.marginBottom = '0px'
    }
  }


  scrollGoodsList = (eve) => {
    if (this.state.goods_list_scrrolling === true) return;
    let curTop = eve.currentTarget.scrollTop
    let titles = window.document.getElementsByClassName('goodsList-title');
    let topArr = [];
    for(let i = 0; i < titles.length; i++){
      topArr.push(titles[i].offsetTop - 15)
    }
    var outputIndex = 0;
    topArr.forEach((val, index) => {
      if (curTop > val) {
        outputIndex = index;
      }
    })
    this.setState({
      currentGK_index: outputIndex,
    })


  }

  // 购物车 开关
  toggleBuffle = (show) => {
    // 开关
    let _show = show===false ? false : true;
    let cartCanClickAnimation = []
    // 动画
    // 消失
    if (_show) {
      cartCanClickAnimation = [
      {
        opacity: '0.7',
        duration: 450,
        scale: '1.2',
      },{
        opacity: '0.7',
        duration: 450,
        scale: '0',
      }]
    } else {
      cartCanClickAnimation = [
      {
        opacity: '0.7',
        duration: 450,
        scale: '1.2',
      },{
        opacity: '1',
        duration: 450,
        scale: '1',
      }]
    }
    
    this.setState({
      cartCanClickAnimation: cartCanClickAnimation,
      openBaffle: _show,
    })
  }

  render() {
    return (
      <div className="Home" >
        <img src={navTopBg} className="navTopBg" alt="" />
        <div className="container">
          {
            // 商品分类
          }
          <div className="goodKind">
            {
              this.state.goods_list.map((val,index)=>(
                <a href={"#goods_list" + index} onClick={this.GK_change} data-index={index} className={index === this.state.currentGK_index ? 'item active' : 'item' } key={"goodKind" + index}>
                  {val.name}
                </a>

                ))
            }
          </div>
          
          {
            // 主要菜单
          }
          <div 
            className="goodsList" 
            onScroll={this.scrollGoodsList}
            >
            {
              this.state.goods_list.map((value,index) => (
                <div 
                  id={"goods_list" + index} 
                  className="goods_list-item"
                  key={'goodsList' + index}
                  >
                  <h2 className="goodsList-title" >{value.name}</h2>
                  <div className="oneTypeGoodsContainer">
                  {
                    value.canteens.map((oneGoods,oneIndex) => (
                      <div className="oneGoods" key={"ongoods-index-onIndex" + oneIndex} >
                        <div className="oneGoods-cover" data-goods-id={oneGoods.id} onTouchStart={this.selectOneStart} onTouchEnd={this.selectOne}></div>
                        {
                          oneGoods.selectNum > 0 && <span className="oneGoods-selectNum">{oneGoods.selectNum}</span>
                        }
                        
                        <img src={oneGoods.imgurl} className="oneGoods-img" alt="" />
                        <span className="oneGoods-title">{oneGoods.name}</span>
                        <div className="price" >
                          <span className="menber-price">会员￥<strong>{oneGoods.p_price}</strong></span>
                          <span className="normal-price">原价￥<strong>{oneGoods.m_price}</strong></span>
                        </div>
                        
                      </div>
                    ))
                  }

                  </div>
                </div>
                  
              ))    
            }
          </div>

          
          {
            // 购物车
          }
          <TweenOne 
            animation={this.state.cartCanClickAnimation}
            paused={false}
            className="shopping-cart-container"
          >
          {
            // 按钮右上角数字
            this.state.shoppingCart.totalNum > 0 && <span className="cartTotalNum">{this.state.shoppingCart.totalNum}</span>
          }
          {
            // 购物车按钮 可点击
            this.state.shoppingCart.totalNum > 0 && <img 
              component='img'
              src={shoppingCartIcon}
              className="shopping-cart" 
              alt="" 
              onClick={this.toggleBuffle} 
            ></img>
          }
          </TweenOne>

          <TweenOne 
            component='img'
            animation={this.state.cartAnimation}
            paused={false}
            style={this.state.cartAnimationStyle}
            className="shopping-cart"
            src={shoppingCartIcon}
            ease='linear'
            alt=""
          >
          </TweenOne>

          
        </div>

        <Baffle {...this.state} toggleBuffle={this.toggleBuffle} updataGoodlist={this.updataGoodlist} clearAllCart={this.clearAllCart} />
      </div>
    );
  }
}


export default Home;
