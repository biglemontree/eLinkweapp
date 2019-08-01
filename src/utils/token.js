import Taro from '@tarojs/taro'

const TOKEN_KEY = '__TOKEN__'

/**
 * 从本地获取token
 * @returns {Promise}
 */
export function getToken() {
  return new Promise(resolve => {
    Taro.getStorage({
      key: TOKEN_KEY,
      success: res => resolve(res.data || ''),
      fail: () => resolve('')
    })
  })
}

/**
 * 保存token到本地
 * @param token
 * @returns {Promise}
 */
export function setToken(token) {
  return new Promise(resolve => {
    Taro.setStorage({
      key: TOKEN_KEY,
      data: token,
      complete: () => resolve(token)
    })
  })
}
