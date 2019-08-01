import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import 'taro-ui/dist/style/index.scss'
import Index from './pages/index'
import Ddnsto from './pages/ddnsto'
import ERouters from './pages/routers'
import EeDirs from './pages/ee-dirs'
import Auth from './pages/common/auth'
import {getToken} from './utils/token';
import counterStore from './store/counter'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  counterStore
}

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/ddnsto/index',
      'pages/ee-dirs/index',
      'pages/routers/index',
      'pages/common/auth',
    ],
   
    window: {
      backgroundTextStyle: 'light',
      "navigationBarBackgroundColor": "#1797FB",
    "navigationBarTitleText": "易有云",
    "navigationBarTextStyle": "white",
    "enablePullDownRefresh": true
    },
    "navigateToMiniProgramAppIdList": [
    "wx8abaf00ee8c3202e"
  ],
  "tabBar": {
    "color": "#9B9DB1",
    "selectedColor": "#1797FB",
    "borderStyle": "white",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "./images/weui_new/dt_0.png",
        "selectedIconPath": "./images/weui_new/dt_1.png",
        "text": "DDNSTO"
      },
      {
        "pagePath": "pages/routers/index",
        "iconPath": "./images/weui_new/folder_0.png",
        "selectedIconPath": "./images/weui_new/folder_1.png",
        "text": "文件管理"
      },
      {
        "pagePath": "pages/ddnsto/index",
        "iconPath": "./images/weui_new/my_0.png",
        "selectedIconPath": "./images/weui_new/my_1.png",
        "text": "我的"
      }
    ]
  },
  }
  componentDidMount () {
      getToken().then(token => {
        if (!token) {
            Taro.navigateTo({url: '/pages/common/auth'})
            return
        }
        }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
        <Ddnsto />
        <ERouters />
        <EeDirs />
        <Auth />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
