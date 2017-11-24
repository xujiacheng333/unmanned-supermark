
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
        console.log(eve)
        var nowH = againwindowHeight()
        var Main = document.getElementsByClassName("App")[0];
        if (Main && Main.style) {
            Main.style.height = nowH +'px';
        // Main.style['height'] = nowH +'px';
        }

    }
}

export {windowHeight};