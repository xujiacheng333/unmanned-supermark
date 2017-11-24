import axios from 'axios';
import qs from 'qs';

function api({data, way, file=false, isAlert=true, get=false}) {
  let headers;
  let outputdata;
  let params;
  // 若有数据上传
  if (file) {
    headers = {
      'Content-Type': 'multipart/form-data'
    };
    params = new FormData(); //创建form对象

    for (let key in data) {
      params.append(key, data[key]);
    }

    return new Promise(function(resolve, reject) {
      axios.post('/lv.php?a=' + way, params, {
        headers: headers
      })
        .then((res) => {
          if (res.data.ResCode == '0') {
            resolve(res.data.ResData);
          } else {
            console.error(res.data.ResMsg)
            if (isAlert) {
              alert(res.data.ResMsg)
            }
            reject(res.data.ResMsg)
          }
        }).catch((err) => {
        console.error(err)
        if (isAlert) {
          alert(err)
        }
        reject(err)
      })
    })

  } 
  else if (get) {
    // return new Promise(function(resolve, reject) {
    //   axios({
    //     method: 'get',
    //     url: '/lv.php?a=' + way,
    //   }).then((res) => {
    //     resolve(res)
    // })
  }
  else {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    outputdata = qs.stringify(data)
    return new Promise(function(resolve, reject) {
      axios({
        method: 'post',
        url: '/lv.php?a=' + way,
        headers: headers,
        data: outputdata,
      }).then((res) => {
        // console.log(res)
        if (res.data.ResCode == '0') {
          resolve(res.data.ResData);
        } else if (res.data.ResCode == '1001') {
          localStorage.setItem('isLogin', 0)
        } else {
          console.error(res.data.ResMsg)
          if (isAlert) {
            alert(res.data.ResMsg)
          }
          reject(res.data.ResMsg)
        }
      }).catch((err) => {
        console.error(err)
        if (isAlert) {
          alert(err)
        }
        reject(err)
      })
    })
  }
}


export default api;