export default function (state, item, changeNum) {
  let store = Object.assign({}, state)
  let cart = store.cart
  
  if (typeof item === 'object') {
    let hasItem = false;
    cart.goodlist.map(val => {
      if (val.id === item.id) {
        val.selectNum = parseInt(val.selectNum) + changeNum;
        hasItem = true;
      }
    })
    if (!hasItem) {
      item.selectNum = 1;
      cart.goodlist.push(item)
    }
  } else {
    let outputGoodlist = []
    cart.goodlist.forEach(val => {
      if (val.id === item) {
        val.selectNum = parseInt(val.selectNum) + changeNum;
      }
      if (val.selectNum > 0) {
        outputGoodlist.push(val)
      }
    })
    cart.goodlist = outputGoodlist;
  }

  
  cart.totalNum = 0;
  cart.m_priceTotal = 0;
  cart.p_priceTotal = 0;
  cart.goodlist.forEach(cval=>{
    cart.totalNum = parseInt(cart.totalNum) + parseInt(cval.selectNum);
    cart.m_priceTotal = parseFloat(cart.m_priceTotal) + parseFloat(parseFloat(cval.m_price) * parseInt(cval.selectNum)) ;
    cart.p_priceTotal = parseFloat(cart.p_priceTotal) + parseFloat(parseFloat(cval.p_price) * parseInt(cval.selectNum)); 
  })

  cart.m_priceTotal = cart.m_priceTotal.toFixed(2)
  cart.p_priceTotal = cart.p_priceTotal.toFixed(2)
  
  if (cart.totalNum === 0) {
    // 清空购物车之后自动隐藏
    store.baffle = false

  }

  return store;
}