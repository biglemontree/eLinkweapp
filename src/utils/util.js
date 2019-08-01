import Taro from '@tarojs/taro'

const showActionSheet = (array) => {
    return new Promise((reslove, reject) => {
        Taro.showActionSheet({
            itemList: array,
            success: reslove,
            fail: reject
        })
    })
}

/**
 * 模态框
 * @param {*标题} title
 * @param {*提示内容} content
 */
const showModal = (title, content, showCancel = false) => {
    return new Promise((reslove, reject) => {
        Taro.showModal({
            title,
            content,
            showCancel: showCancel,
            success: reslove
        })
    })
}

/**
 * 吐司
 * @param {*标题} title
 * @param {*图标} icon
 */
const showToast = (title, icon) => {
    Taro.hideToast()
    return new Promise((reslove, reject) => {
        Taro.showToast({
            title,
            icon,
            duration: 2000,
            success: reslove
        })
    })
}

const computeFileType = (name) => {
//   const openType = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']
  const obj = {
    'video': ['mp3', 'mp4'],
    'excel': ['xcel', 'xsl'],
    'ppt': ['ppt'],
    'word': ['doc', 'docx'],
    'zip': ['zip', 'rar'],
    'flash': ['flv'],
    'ppt': ['ppt'],
    'pdf': ['pdf'],
  }
  const fileType = name.substring(name.lastIndexOf('.') + 1)
  for (let key in obj) {
    if (obj[key].includes(fileType)) {
      return key
    }
  }
  return 'default'
}
export default{
    showActionSheet,
    showModal,
    showToast,
    computeFileType
}
