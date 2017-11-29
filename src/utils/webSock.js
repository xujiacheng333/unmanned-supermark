import axios from 'axios';
import qs from 'qs';
import _config from '@/config';
import store from '@/reducers';


function myWebSocket(config, that){
        this.domain = config.domain || document.domain;
        this.port = config.port || 7272;
        this.client_id = null;
        this.ws = null;
        this.component = that


        this.init = function(){
            var that = this;
            var ws = new WebSocket('ws://'+that.domain+':'+that.port);
            // 当socket连接打开时，输入用户名
            ws.onopen = function(){
                // 登录
                var login_data = '{"type":"getClientId"}';
                console.log("websocket握手成功");
                ws.send(login_data);    
            };
            // 当有消息时根据消息类型显示不同信息
            ws.onmessage = function(e){
                console.log("服务器返回数据：",e.data);
                //writelog("服务器返回数据："+e.data);
                var data = eval("("+e.data+")");
                var func = data['type'];
                if(func && func in that){
                    that[func](data);
                }else{
                    console.log("收到不可识别消息：",data);        
                }
            };
            ws.onclose = function(){
              console.log("连接关闭，即时重连");
              localStorage.setItem('connnetedWS', false)
              that.init();
            };
            ws.onerror = function(){
              localStorage.setItem('connnetedWS', false)
              console.log("出现错误");
            };
            that.ws = ws;
        }
        this.getClientIdCallback = function(data){       
            var that = this;
            that.client_id = data['client_id']; 
            let sendData = qs.stringify({
                cinema_id: _config.cinema_id,
                seller_id: _config.seller_id,
                client_id: that.client_id,
            })
            axios({
                method: 'POST',
                url: '/cmts.php?c=api&a=report_seller_client_id',
                // headers: {
                //     'Content-Type': 'application/x-www-form-urlencoded'
                // },
                data: sendData,
            }).then(res=>{
                if (res.status === 200 && res.data.status === 'ok') {
                    console.log(res)
                    localStorage.setItem('connnetedWS', true)
                }
            })
                 
        }
        this.paying = function(data){
            console.log('paying_data:',data);
            var res = data['res'];
            console.log('paying_res:',res);
            store.dispatch({
                type: 'IS_PAYING',
                isPaying: true,
            })
        }
        this.pay_success = function(data){
            console.log('pay_success_data:',data);
            var res = data['res'];
            console.log('pay_success_res:',res);
            store.dispatch({
                type: 'CHANGE_PROGRESS',
                progress: 4,
            })
        }

        this.init();
        
    }



export default myWebSocket