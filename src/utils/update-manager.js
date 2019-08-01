/**
 * 升级app
 */
export function updateApp() {
  if (!wx.getUpdateManager) {
    return;
  }
  const updateManager = wx.getUpdateManager();
  updateManager.onCheckForUpdate(function(res) {
    // 请求完新版本信息的回调
    console.log("是否有可用的新版:", res.hasUpdate);
    if (!res.hasUpdate) {
      wx.showToast({
        icon: 'none',
        title: '当前已是最新版本'
      })
    }
    //todo
  });

  updateManager.onUpdateReady(function() {
    wx.showModal({
      title: "更新提示",
      content: "新版本已经准备好，是否重启应用？",
      success: function(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      }
    });
  });
  updateManager.onUpdateFailed(function() {
    // 新的版本下载失败
    console.log("新的版本下载失败");
    wx.showToast({
      title: "新的版本下载失败",
      icon: "none",
      duration: 2000
    });
  });
}
