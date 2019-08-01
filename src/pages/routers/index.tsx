import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentType } from 'react'
import { View,Image,AtIcon } from '@tarojs/components'
import {AtList, AtListItem} from 'taro-ui';
import { request } from '../../utils/request'

import { apis } from '../../utils/config.js'

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routersData: []
        }
    }
    componentDidMount () {
        request({
            url: apis.getrouters
        }).then(data => {
            this.setState({
                routersData: data
            })
        })
    }
  render() {
      const {routersData} = this.state

      return (
        <View>
            <View class="dirs-wrap">
                <AtList>
                    {routersData.map((item,index) => (
                        <AtListItem title={item.name} key={index} arrow='right' disabled={item.online===0} iconInfo={{ size: 25,
  color: '#FF4949', value: 'bookmark', }}>
                            <Image src={require('../../images/weui_new/folder.png')}></Image>
                            {/* <image class='folder-icon' wx:if="{{item.type=='dir'}}" slot="icon" ></image>
                            <image class='folder-icon' wx:else slot="icon" src="{{'/images/file_type/file_'+item.filetype+'.svg'}}"></image>
                            <!-- 三个点操作 -->
                            <block wx:if="{{activeFooterIndex!==2}}">
                            <i-icon type="switch" bindtap="chooseMore" data-item="{{item}}" slot="footer"/>
                            </block>
                            <!-- 批量操作 -->
                            <View wx:else slot="footer" data-index='{{index}}' bindtap='chooseItem'>
                            <icon wx:if="{{item.isSelect}}" type="success" size="23" class="invoice-list-itemRadioIcon"/>
                            <View wx:else  class='gray-circle'></View>
                            </View> */}
                            ooo
                            <View className='at-icon at-icon-settings'></View>
                        </AtListItem>
                    ))}
                    {/* <View wx:for="{{dirStore.dirs}}" wx:key="{{index}}" bindtap="openDir" bindlongpress="handleMoreAction" data-item="{{item}}">
                    
                    </View> */}
                </AtList>
            </View>
        </View>
    )
  }
}

export default Auth as ComponentType;
