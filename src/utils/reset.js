
// 获取浏览器高度
function windowHeight() {
    var myHeight = 0;
    if (typeof(window.innerHeight) === 'number') {
        //Non-IE
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientHeight)) {
        //IE 4 compatible
        myHeight = document.body.clientHeight;
    }


    resetHeight();


    return myHeight;
}

// 再次获取浏览器高度
function againwindowHeight() {
    var myHeight = 0;
    if (typeof(window.innerHeight) === 'number') {
        //Non-IE
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientHeight)) {
        //IE 4 compatible
        myHeight = document.body.clientHeight;
    }
    return myHeight;
}

// 监听高度变化
function resetHeight() {
    window.onresize = function(eve){
        var nowH = againwindowHeight()
        var Main = document.getElementsByClassName("App")[0];
        if (Main && Main.style) {
            Main.style.height = nowH +'px';
        // Main.style['height'] = nowH +'px';
        }
        
        // 最后一个内容框留白
        let goodsListHeight = windowHeight() - 200
        let ele = window.document.getElementsByClassName('goods_list-item')[window.document.getElementsByClassName('goods_list-item').length - 1]
        let paddingBottom = goodsListHeight - ele.offsetHeight;
        if (paddingBottom > 0) {
            ele.style.marginBottom = paddingBottom + 'px'
        } else {
            ele.style.marginBottom = '0px'
        }
    }
}

export {windowHeight};