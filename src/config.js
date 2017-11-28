const parseSearch = (name) => {
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = decodeURI(window.location.search).substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}

export default {
  cinema_id: parseSearch('cinema_id') ? parseSearch('cinema_id') : 4,
  seller_id: parseSearch('seller_id') ? parseSearch('seller_id') : 1,
}