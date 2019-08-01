import Taro from '@tarojs/taro'
import qs from './qs'
import { appid, apis, baseURLs } from './config'
import { getToken, setToken } from './token'
import { updateApp } from './update-manager'

// 保存当前登录请求实例，避免多次登录而导致未知异常
let loginRequester = null
let wxLoginRequester = null
// 缓存当前未完成的请求数量，便于后面用来关闭loading
let requestCount = 0
// app 版本号
console.log(Taro.getApp());
const globalData = {
        //系统信息
        systemInfo: null,
        //用户信息
        userInfo: {},
        //启动参数
        launchOption: {},
        //版本号
        version: '3.7',
        //群信息
        shareTicket: '',
        // 跳转的环境
        envVersion: 'release', // trial 体验版 develop 开发版 release 正式版
        // 兼容信息
        canUse: {
            canUseNavigate: false
        },
        navHeight: 66,
    }
const { version, launchOption, systemInfo, userInfo } = globalData

// request 的默认参数
const defaultOptions = {
  baseURL: getBaseURL(),
  method: 'GET',
  loader: true,
  showError: true,
  header: {
        ksuser: Taro.getStorageSync('__TOKEN__')
    },
}

/**
 * 微信登录，获取code
 * @returns {Promise}
 */
function wxLogin() {
  return wxLoginRequester || (
    wxLoginRequester = new Promise((resolve, reject) => {
      Taro.login({
        success(res) {
          Taro.setStorage({
            key: 'code',
            data: res.code
          })
          resolve(res.code)
        },
        fail(res) {
          reject(res)
        },
        complete() {
          wxLoginRequester = null
        }
      })
    })
  )
}

/**
 * 用户登录，获取会话token
 * 2019.07.30 修改，登录接口返回 401 时，不重试登录
 * @return {Promise}
 */
function login() {
  return wxLogin().then(code => {
    return loginRequester || (
      loginRequester = request({
        url: apis.getLogin,
        baseURL: getBaseURL(1),
        data: { code, appid },
        retry: false, // 登录接口返回 401 后不重试登录
      })
      .then(res => {
        setToken(res.token)
        // 需要login返回code
        return { token: res.token, code }
      })
      .finally(() => {
        loginRequester = null
      })
    )
  })
}

function formatErrorMessage(res, requestOptions) {
  const { statusCode, data: responseData } = res
  const { method = '', data, formData, showError } = requestOptions
  const url = getRequestUrl(requestOptions)
  // Taro.request用的data, Taro.uploadFile用的formData
  const requestPayload = JSON.stringify(data || formData || {})

  const errorMessage = []
  errorMessage.push(`request: (${method.toUpperCase()}) ${url}`)
  errorMessage.push(`requestPayload: ${requestPayload}`)
  errorMessage.push(`statusCode: ${statusCode}`)
  errorMessage.push(`response: ${JSON.stringify(responseData)}`)

  // 添加额外的系统信息
  // showError 标识是否显示错误弹窗，详见App.onError
  errorMessage.push(`showError: ${showError === true ? 'true' : 'false'}`)
  errorMessage.push(`version: ${version}`)
  errorMessage.push(`launchOption: ${JSON.stringify(launchOption)}`)
  errorMessage.push(`systemInfo: ${JSON.stringify(systemInfo)}`)
  errorMessage.push(`userInfo: ${JSON.stringify(userInfo)}`)

  return `${errorMessage.join('\r\n')}\r\n`
}

/**
 * 上报错误信息，这里直接throw error，在App.onError统一处理
 */
function reportError(errorMessage) {
  throw new Error(errorMessage)
}

/**
 * 弹窗显示错误信息
 * @param  {String} errorMessage   错误信息
 * @param  {Object} requestOptions 原请求时带的options
 */
function showErrorMessage(errorMessage, {showError}) {
  if (showError === true) {
    Taro.showModal({
      content: errorMessage,
      title: '提示',
      showCancel: false,
      confirmColor: '#00A4FF'
    })
  }
}

/**
 * 拼串请求URL
 * 这里添加一些额外的查询参数到URL，如version, token
 * @param  {Object} requestOptions 请求时带的options
 * @return {String}                返回拼串后的URL
 */
function getRequestUrl(requestOptions) {
  const { baseURL = '', url = '', method = '', data = {}, token = '' } = requestOptions
  const joinCode = url.indexOf('?') === -1 ? '?' : '&'
  let query = {  }
  // GET请求，合并Taro.request会自动处理的data参数，以方便后面打印日志输出
  if (method.toUpperCase() === 'GET') {
    query = {...data}
  }
  return `${baseURL}${url}${joinCode}${qs.stringify(query)}`
}

/**
 * 业务异常处理
 * 按约定，接口code != 0时为业务异常
 * @param  {Object} res             Taro.request 接收到的报文
 * @param  {Object} requestOptions  原请求时带的options
 * @param  {Function} resolve       原请求Promise实例的resolve
 * @param  {Function} reject        原请求Promise实例的reject
 */
function handleServiceError(res, requestOptions, resolve, reject) {
  const { retry } = requestOptions
  const { data } = res
  const code = +data.code

  // token 失效，重新登录获取token后再请求原接口
  if (code === 401 && retry !== false) {
    // retry 后，需要用原来promise回调
    return retryRequest(requestOptions).then(res => {
        if (data) {
            resolve(res)
        }
    }).catch(error => reject(error))
  }

  reject(res)

  // 版本过旧
  if (code === 410) {
    updateApp()
  }
  // 其它异常
  else {
    showErrorMessage(data.message, requestOptions)
  }
}

/**
 * 响应异常处理
 * http状态码非200或报文格式不正确的异常
 * @param  {Object} res              Taro.request 接收到的报文
 * @param  {Object} requestOptions   原请求时带的options
 */
function handleResponseError(res, requestOptions, reject) {
  console.error('handleResponseError', res)
  const { statusCode } = res

  // 这里需要先 reject，
  // 因为在处理业务异常时，可能利用了 throw Error 来上报错误信息
  // 它会导致在外层的 catch 中拿不到原接口响应的数据
  reject(res)

  // 额外处理的 404 错误
  if (statusCode === 404) {
    showErrorMessage('接口不存在', requestOptions)
  }
  // 其它错误，统一上报
  // 这里不直接弹窗显示错误，在App.onError中会捕获错误并弹窗提示
  else {
    reportError(formatErrorMessage(res, requestOptions))
  }
}

/**
 * Taro.request 请求时的 fail 回调
 * @param  {Object} res Taro.request 响应的报文
 */
function handleRequestError(res, requestOptions, reject) {
  console.error('handleRequestError', res)
  const message = res.errMsg || ''
  let reason = '网络出错了，请稍候重试'

  if (message.indexOf('timeout') !== -1) {
    reason = '请求超时了'
  }

  // 为方便外边使用，这里把数据封装成和后端接口返回的数据格式一致
  reject({
    ...res,
    data: {
      ...res.data,
      message: reason
    }
  })

  showErrorMessage(reason, requestOptions)
}

/**
 * 请求前执行的函数
 * @param  {Object} requestOptions Taro.request 带的参数options
 */
function beforeSend({loader}) {
  // 累计当前未完成请求数，便于后面判断当前所有请求是否已完成
  requestCount = requestCount + 1

  // loading
  if (loader === true || loader === 'default') {
    Taro.showNavigationBarLoading()
  } else if (loader === 'indicator') {
    Taro.showLoading({ title: '请稍等', mask: true })
  }
}

/**
 * 请求完成时的回调（无论成功或失败）
 * 现只用来隐藏loading层
 */
function handleComplete() {
  requestCount = requestCount - 1
  // 在所有请求完成时，才隐藏loading
  if (requestCount <= 0) {
    requestCount = 0

    // 这里直接关闭，不判断当前请求使用的loading是哪种方式，
    // 避免在并行发起多个请求时，有些loading层没关闭
    Taro.hideLoading()
    Taro.hideNavigationBarLoading()
  }
}

/**
 * 请求响应时的回调
 * @param  {Object} res             Taro.request 接收到的报文
 * @param  {Object} requestOptions  原请求时带的options
 * @param  {Function} resolve       原请求Promise实例的resolve
 * @param  {Function} reject        原请求Promise实例的reject
 */
function handleResponse(res, requestOptions, resolve, reject) {
  const { data, statusCode } = res

  if (statusCode == 200 && typeof data === 'object') {
    console.log('response:', requestOptions.url, data)

    if (+data.code === 0) {
        if (data.data) {
            
            resolve(data.data)
        }else {
            resolve(data.result)

        }
    }
    // 其它业务异常
    // 这里不直接 reject，在接口返回401时，会进行登录并重新请求接口
    // 需要在 handleServiceError 中 resolve 或 reject
    else {
      handleServiceError(res, requestOptions, resolve, reject)
    }
  }
  // 非200或报文异常
  else {
    handleResponseError(res, requestOptions, reject)
  }
}

/**
 * handleRequest
 * @param  {Object} options        Taro.request或Taro.uploadFile的参数
 * @param  {String} token          token
 * @param  {String} interfaceName  兼容Taro.request, Taro.uploadFile接口，这里需要指定
 * @return {Promise}               返回一个Promise对象
 */
function handleRequest(options, token, interfaceName = 'request') {
  // promisify 化 Taro.request, Taro.uploadFile
  // 接管它的fail, success, complete回调，使用promise方式处理
  return new Promise((resolve, reject) => {
    // 合并请求参数
    const requestOptions = { ...defaultOptions, ...options, token }
    // 拼装url链接， 不直接赋值到requestOptions，避免在retryRequest时地址不对
    const url = getRequestUrl(requestOptions)
    // 打印日志，方便查看
    const method = requestOptions.method.toUpperCase()
    const baseURL = requestOptions.baseURL
    console.log('request:', `(${method})`,baseURL, options.url, options)
    
    // beforeSend
    beforeSend(requestOptions)

    Taro[interfaceName]({
      ...requestOptions,
      url,
      fail: res => handleRequestError(res, requestOptions, reject),
      success: res => handleResponse(res, requestOptions, resolve, reject),
      complete: handleComplete
    })
  })
}

/**
 * 重试请求，在接口返回401时，会尝试登录（获取新的token）并重新请求接口
 */
function retryRequest(options) {
  // 添加 retry: false 参数，避免接口返回 401 后多次重试
  const requestOptions = { ...options, retry: false }
  return login().then(res => handleRequest(requestOptions, res.token))
}

/**
 * Taro.request 封装
 * @param  {Object} options  请求参数，格式如下（更多请参考Taro.request接口）
 *  {
 *    baseURL, // 用于拼接url
 *    url, // 请求地址
 *    method, // String,(GET), 请求方法
 *    data, // 请求参数
 *    loader, // Boolean|String,(true), 是否显示loading，可指定loading类型：default(Taro.showNavigationBarLoading), indicator(Taro.showLoading)
 *    showError // Boolean,(true), 是否显示错误弹窗
 *  }
 * @return {Promise}      返回一个Promise
 */
function request(options = {}) {
  return getToken().then(token => handleRequest(options, token))
}

/**
 * Taro.uploadFile 封装
 * @param  {Object} options  请求参数，格式如下（更多请参考Taro.request接口）
 *  {
 *    baseURL, // 用于拼接url
 *    url, // 请求地址
 *    method, // String,(GET), 请求方法
 *    formData, // 请求参数
 *    loader, // Boolean|String,(true), 是否显示loading，可指定loading类型：default(Taro.showNavigationBarLoading), indicator(Taro.showLoading)
 *    showError // Boolean,(true), 是否显示错误弹窗
 *  }
 * @return {Promise}      返回一个Promise
 */
function uploadFile(options = {}) {
  return getToken().then(token => handleRequest(options, token, 'uploadFile'))
}

/**
 * 返回当前使用的baseurl
 */
function getBaseURL(i = 0) {
  if (typeof i !== 'number') {
    throw new TypeError(
      'getBaseURL：i 值必须是一个int类型，请再config.js baseURLs 变量中配置后使用。'
    )
  }
  const url =baseURLs['0']
  return url[i]
}

export { apis, request, uploadFile, getBaseURL, getToken, setToken, wxLogin, login }
export default request
