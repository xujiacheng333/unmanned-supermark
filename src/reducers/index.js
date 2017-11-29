import { createStore} from 'redux'
import updateCart from './updateCart';

let store = createStore(create_reducers())

function create_reducers() {
  const initialState = {
    progress: 1,   //流程
    baffle: false, //开关
    cart: {
      totalNum:0,
      goodlist:[],
      m_priceTotal: 0,
      p_priceTotal: 0,
      order_id: undefined,
    },     //购物车
    currentOrderCartList: '',
    isPaying: false, // 正在支付
  }


  return function (state = initialState , action) {

    switch (action.type) {
      case 'CHANGE_PROGRESS':
        let change_progress_state = Object.assign({}, state, {
          progress: action.progress,
        })
        if (action.progress === 4) {
          // 当购买成  清空购物车
          change_progress_state.cart = {
            totalNum:0,
            goodlist:[],
            m_priceTotal: 0,
            p_priceTotal: 0,
            order_id: undefined,
          }
        }
        // 改变流程
        return change_progress_state
      case 'TOGGLE_BAFFLE':
        // 开关浮窗
        return Object.assign({}, state, {
          baffle: !state.baffle,
          progress: 1,
          isPaying: false,
        })
      case 'UPDATE_CART':
        // 更新购物车
        return updateCart(state, action.item, action.changeNum)
      case 'CLEAR_CART': 
        // 清空购物车
        return Object.assign({}, state, {
          cart: {
            totalNum:0,
            goodlist:[],
            m_priceTotal: 0,
            p_priceTotal: 0,
            order_id: undefined,
          },
          baffle: false,
        })
      case 'CREATED_ORDER':
        // 生成订单完成
        let create_order_state = Object.assign({}, state, {
          currentOrderCartList: action.cart
        })
        create_order_state.cart.order_id = action.order_id;
        return create_order_state; 
      case 'DISABLE_ORDER':
        // 订单失效
        let disable_order_state = Object.assign({}, state, {
          currentOrderCartList: undefined,
        })
        disable_order_state.cart.order_id = undefined;
        return disable_order_state;
      case 'IS_PAYING':
        // 正在支付
        return Object.assign({}, state, {
          isPaying: action.isPaying,
        })
      default:
        return state
    }
  }
}


export default store