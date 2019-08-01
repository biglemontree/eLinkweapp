// const eeDirsStore = observable({
//   counter: 0,
//   uid = ''
// //   currentPath = '' // 当前全路径
// //   //文件夹
// //   dirs = []
// //   activeFooterIndex = 1
// //   actionItem = ''
// //   inpValue = '' // 重命名value
// })
// export default eeDirsStore

/**
 * Created by aaron on 2018/3/28.
 */
import Taro from '@tarojs/taro'

import {
  action,
  observable
} from 'mobx';
import { request } from '../utils/request.js'
import { apis } from '../utils/config.js'
import util from '../utils/util.js'

/*
 * 用户信息
 * */

class Store {
  uid = ''
  currentPath = '' // 当前全路径
  //文件夹
  dirs = []
  activeFooterIndex = 1
  actionItem = ''
  inpValue = '' // 重命名value


  

  //文件操作：
  actionDirs = function(action, rest) {
    const { uid, currentPath } = this
    let path = currentPath.replace(/^\/*/, '')
    return request({
      url: apis.postDeviceDirs,
      method: 'post',
      header: {
        ksuser: Taro.getStorageSync('token'),
        ksdev: uid
      },
      data: {
        action,
        ...rest
      }
    }).then(r => {
      if (action === 'list') {
        const arr = r.result.map(item => {
          const tpl = util.computeFileType(item.name)
          item.filetype = tpl
          return item
        })
        this.dirs = arr
        this.currentPath = rest.path
      }
    })
  }
  
  /*
   * 检查session过期情况如果过期重新登陆拿新的code去授权
   */
//   checkGlobalSession = function () {
//     return new Promise((resolve) => {
//       wx.checkSession({
//         success: () => {
//           //session_key 未过期，并且在本生命周期一直有效
//           const code = wx.getStorageSync('code')
//           resolve(code)
//         },
//         fail: () => {
//           // session_key 已经失效，需要重新执行登录流程
//           login().then(res => {
//             resolve(res.code)
//           })
//         }
//       })
//     })
//   }
}


export default (new Store())