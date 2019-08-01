import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Swiper, SwiperItem, Button } from '@tarojs/components'
import { AtTabs, AtTabsPane,AtGrid , } from 'taro-ui'
import './index.less'
import request from '../../utils/request';
import { apis } from '../../utils/config.js'


const tabListTitle= [
    { title: '软件中心' },
    { title: '状态详情' },
    { title: '穿透配置' },
  ]
class index extends Component {
    constructor(props) {
        super(props);
        this.state = { current: 1, installedApps:[],routerInfo:{}};
    }
    config: Config = {
        navigationBarTitleText: '首页'
    }
    handleChange = (value) => {
        this.setState({
            current: value
        });
    }
    getrouters() {
        request({
            url: apis.getrouters
        }).then(data => {
            this.setState({
                installedApps: data
            })
        })
    }
    getroutersInfo() {
        request({
            url: apis.getrouterInfo
        }).then(data => {
            this.setState({
                routerInfo: data
            })
        })
    }
    componentDidMount () {
        this.getroutersInfo()
        this.getrouters()
    }
    render() {
        const { current,routerInfo, installedApps } = this.state
        return (
            <View>
                <View className="bg-fixed bg-primary">
                </View>
                <View >
                    <View className="pannel relative">
                        <View className='router-name absolute flex items-top'>
                            <Image className='router-pic' src={require('../../images/weui_new/router_1.svg')}></Image>
                            <Text className='c-fff ml-10px'>roter</Text>
                        </View>
                        <View className='r-tabs'>
                            <AtTabs current={ current } tabList={tabListTitle} onClick={this.handleChange}>
                                <AtTabsPane current={ current } index={0} >
                                    
                                </AtTabsPane>
                                <AtTabsPane current={ current } index={1} >

                                </AtTabsPane>
                                <AtTabsPane current={ current } index={2} ></AtTabsPane>
                            </AtTabs>
                        </View>
                        <View className='clear-float'></View>
                        <View className='card-content mt-20px'>
                            {current == 0 && <AtGrid data={installedApps}></AtGrid>}
                            {
                                current == 1 && <View className='fs-28px '>
                                    <View>
                                        <View className='little-gray mr-30px inline-block'>设备ID</View>
                                        <Text className=''>{routerInfo.UploadTotalBytes}</Text>
                                    </View>
                                    <View className='my-20px'>
                                        <Text className='little-gray mr-30px'>外网IP</Text>
                                        <Text className=''>{routerInfo.UploadTotalBytes}</Text>
                                    </View>
                                    <View className='my-20px'>
                                        <Text className='little-gray mr-30px'>穿透速度</Text>
                                        <Text className=''>{routerInfo.UploadSpeed}</Text>
                                    </View>
                                    <View>
                                        <Text className='little-gray mr-30px'>穿透流量</Text>
                                        <Text className=''>{routerInfo.UploadTotalBytes}</Text>
                                    </View>
                                </View>
                            }
                            {
                                current == 2 && <View className='fs-28px '>
                                    <Swiper className="i-swipeout-demo-item">
                                        <SwiperItem>
                                        <View className='demo-text-1'>1</View>
                                        </SwiperItem>
                                        {/* <View slot="content" className='swipeout-content'>
                                            <View className='domain'>
                                                router.ddnsto.com/
                                            </View>
                                            <View className='ip-http fs-28px mt-10px'>
                                                http://192.168.50.1
                                            </View>
                                        </View> */}
                                    </Swiper>
                                    <View className='new-ds mt-20px center'>新建通道</View>
                                </View>
                            }
                            
                        </View>
                    </View >

                </View >
            </View>
        );
    }
}

export default index as ComponentType;