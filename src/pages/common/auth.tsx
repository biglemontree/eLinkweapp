import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentType } from 'react'
import { View, Button } from '@tarojs/components'

import { request, wxLogin } from '../../utils/request'
import {setToken} from '../../utils/token';

import { apis } from '../../utils/config.js'

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = { current: 1, };
    }
    config: Config = {
        navigationBarTitleText: '首页'
    }
    getUserInfo= (e) => {
        const res = e.detail
        // login()获取code-> 请求微信接口->获取session_key 和 openId
        return wxLogin().then((code) => {
            return request({
                url: apis.postUnionId,
                method: 'post',
                data: {
                    code: code,
                    iv: res.iv,
                    encryptedData: res.encryptedData
                }
            }).then(data => {
                if(data.code === -2) {
                    Taro.showModal({ title: '提示', content: '请前往https://service.koolshare.cn绑定ddnsto'})
                    return
                }

                setToken(data.token).then(() => {
                    Taro.switchTab({
                        url: '/pages/index/index'
                    })
                })
            });
        })
    }
    onClose(event) {
        if (event.detail === 'confirm') {
            // 异步关闭弹窗
            setTimeout(() => {
                this.setState({
                    show: false
                });
            }, 1000);
        } else {
            this.setState({
                show: false
            });
        }
    }
  gotologin() {
    Taro.navigateTo({
      url: '/pages/e-link/index',
    })
  }
  render() {

      return (
        <View className='middle px-20px'>
        <Button open-type="getUserInfo" type='primary' onGetUserInfo={this.getUserInfo}> 微信授权登录 </Button>
        </View>
    )
  }
}

export default Auth as ComponentType;
