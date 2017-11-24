function isInShopCart(goodlist, id) {
  let output = false;
  goodlist.forEach(val => {
    if (val.id == id) {
      output = true;
    }
  })
  return output;
}


export default {
  isInShopCart: isInShopCart,
}