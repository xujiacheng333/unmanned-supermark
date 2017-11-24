

document.addEventListener('touchstart',function (event) { 
  if(event.touches.length>1){ 
    console.log("开始")
    event.preventDefault(); 
  } 
}) 
document.addEventListener('touchmove',function (event) { 
  if(event.touches.length>1){ 
    console.log("滚动")
    event.preventDefault(); 
  } 
}) 

