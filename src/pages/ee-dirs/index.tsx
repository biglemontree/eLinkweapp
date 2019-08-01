import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentType } from 'react'
import { View,Image } from '@tarojs/components'
import {AtList, AtListItem} from 'taro-ui';
import { request, wxLogin } from '../../utils/request'

import { apis } from '../../utils/config.js'

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = { current: 1, };
    }
    componentDidMount () {
        request({
            url: apis.getrouterInfo
        }).then(data => {
            this.setState({
                routerInfo: data
            })
        })
    }
  render() {

      return (
<View>
    <View class="dirs-wrap">
        {/* <i-tag wx:if="{{activeFooterIndex==2}}"
            class="i-tags right mr-20px" 
            bindtap="cancelAll"
            name="cancel" 
            color="blue">
            取消
        </i-tag> */}
        {/* <AtListItem title="上级目录" onClick="goback">
            <Image class='folder-icon' slot="icon" src='/images/weui_new/folder_back.svg'></Image>
        </AtListItem> */}
        <AtList>
            {/* <View wx:for="{{dirStore.dirs}}" wx:key="{{index}}" bindtap="openDir" bindlongpress="handleMoreAction" data-item="{{item}}">
            <AtListItem title="{{item.name}}" label="{{item.date}}" >
                <image class='folder-icon' wx:if="{{item.type=='dir'}}" slot="icon" src='/images/weui_new/folder.png'></image>
                <image class='folder-icon' wx:else slot="icon" src="{{'/images/file_type/file_'+item.filetype+'.svg'}}"></image>
                <!-- 三个点操作 -->
                <block wx:if="{{activeFooterIndex!==2}}">
                <i-icon type="switch" bindtap="chooseMore" data-item="{{item}}" slot="footer"/>
                </block>
                <!-- 批量操作 -->
                <View wx:else slot="footer" data-index='{{index}}' bindtap='chooseItem'>
                <icon wx:if="{{item.isSelect}}" type="success" size="23" class="invoice-list-itemRadioIcon"/>
                <View wx:else  class='gray-circle'></View>
                </View>
            </AtListItem>
            </View> */}
        </AtList>
    </View>
    
    {/* <i-tab-bar current="{{ current }}" bindchange="handleTabChange" fixed="{{true}}">
      <block wx:if="{{activeFooterIndex !==2}}">
        <i-tab-bar-item key="actionUpload" icon="homepage" current-icon="homepage_fill" title="上传" ></i-tab-bar-item>
        <i-tab-bar-item key="actionChoose" icon="group" current-icon="group_fill" title="选择"></i-tab-bar-item>
        <i-tab-bar-item key="sort" icon="remind" current-icon="remind_fill" title="排序" ></i-tab-bar-item>
      </block>  
      <block wx:else>
        <i-tab-bar-item key="chooseAll" icon="homepage" current-icon="homepage_fill" title="全选" ></i-tab-bar-item>
        <i-tab-bar-item key="copy" icon="group" current-icon="group_fill" title="复制"></i-tab-bar-item>
        <i-tab-bar-item key="move" icon="remind" current-icon="remind_fill" title="移动" ></i-tab-bar-item>
        <i-tab-bar-item key="zip" icon="remind" current-icon="remind_fill" title="压缩" ></i-tab-bar-item>
        <i-tab-bar-item key="del" icon="remind" current-icon="remind_fill" title="删除" ></i-tab-bar-item>
      </block>  
    </i-tab-bar>

    <i-action-sheet visible="{{ actionShow }}" actions="{{ actions }}" data-item="{{item}}" show-cancel bind:cancel="toggleAction"
        bind:click="delete" mask-closable="{{ false }}">
        <View slot="header" style="padding: 16px">
            <View style="color: #444;font-size: 16px">确定吗？</View>
            <text>删除后无法恢复哦</text>
        </View>
    </i-action-sheet>
    <!-- 上传 -->
    <i-action-sheet visible="{{ actionSheetShow }}" actions="{{ actions1 }}" bind:cancel="handleCancel1" bind:click="handleClickItem1" >
      <View slot="header">
      <View class='top-tips'> 上传到{{title}}</View>
    </View>
    </i-action-sheet>

    <!-- 排序 -->
    <action-sort></action-sort>

    <!-- 单个文件操作sheet -->
    <action-sheet-file></action-sheet-file>
    
    <!-- new -->
    <i-modal title="新建文件夹" visible="{{ newDirModalShow }}" bind:ok="createDirs" data-dirname="dirname" bind:cancel="handleCloseRenameModal">
        <input value="{{ dirName }}" focus bindinput="changeFileName" data-dirname="dirname" wx:if="{{ newDirModalShow }}" />
    </i-modal> */}
</View>
    )
  }
}

export default Auth as ComponentType;
