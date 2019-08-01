const appid = "wx8280850d07d385eb";

//接口环境配置
const baseURLs = {
    "0": [
        "https://service.koolshare.cn",
        "https://yunpiao.wetax.com.cn",
        "https://apiyp.fapiaoer.cn" // 小程序B端线上域名
    ],
    "2": ["https://apifp.fapiaoer.cn", "https://yunpiaoer-cmm-release.yewifi.com", "https://apiyp.fapiaoer.cn"],
    "3": ["https://apifp-switch.fapiaoer.cn", "https://c-yunpiaoer.fapiaoer.cn"],
    "test": ["https://apifp.yewifi.com", "https://yunpiaoer-cmp-test.yewifi.com", "https://apisc.yewifi.com"],
    mock: ["http://rap2api.taobao.org/app/mock/25190", "http://rap2api.taobao.org/app/mock/25190"],
};

const apis = {
    postUnionId: '/wechat/littleapp/login',
    getLoginToken: '/wechat/oauth/expired_token',
    getrouters: '/littleapp/routers',
    getrouterInfo: '/littleapp/router_infos', // 设备列表的详细信息
    postOfflineDelRouter: '/littleapp/router_delete/', // 删除离线的路由器
    postOfflineRenameRouter: '/littleapp/router_rename/', // 重命名离线的路由器
    getInstalledApps: '/cgi-bin/luci/apps/installedApps', // 已安装的应用列表
    getInstallingStatus: '/cgi-bin/luci/apps/status', // 显示所有在安装中的应用状态
    postInstallApp: '/cgi-bin/luci/apps/install', // 安装应用
    postUninstallApp: '/cgi-bin/luci/apps/uninstall', // 卸载应用
    getAppLog: '/cgi-bin/luci/apps/log', // Show the log of app
    getSoftcenterRepo: '/softcenter/repo.json', // 返回应用在仓库的信息列表
    getRepoGen: '/repo/gen', // 打包并生成应用
    getAppPkg: (name, version) => `/apps/${name}/${version}/${name}.ks`, // 提供每个应用包的下载 /apps/{name}/{version}/{name}.ks
    getAppIndexPage: (name, version) => `/apps/${name}/${version}/index.html`, // 应用首页 /apps/{name}/{version}/index.html
    getAppIcon: (name, version) => `/apps/${name}/${version}/icon.png`, // 应用图标 /apps/{name}/{version}/icon.png
    postDeviceDirs: '/bridges/php/handler.php', // 获取设备的文件夹目录
    getBridgeFiles: (path) => `/bridge_files${path}`, // 请求文件内容
    postBridgeUploads: '/bridge_uploads', // 上传接口
    // postBridgeUploads: '/bridge_uploads', // 上传接口
    
};


// export {
//     apis, baseURLs,config
// }
const config = {
	//APPID: 'wx54fbe9949077ff30',
	//SECRET: 'a9fd94675d51a5791c8b3e8497d31d45',
	APPID: 'wxeaec76756d319d82',
	SECRET: '020b89c4f081641c2d292ad75ab85a6e',
}
export {
    apis,
    appid,
    baseURLs
};