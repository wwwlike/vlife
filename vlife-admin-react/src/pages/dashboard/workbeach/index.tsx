import React, { useState } from 'react';
import { Button, Card, Divider, Input, Select, Steps, TabPane, Tabs, Timeline } from '@douyinfe/semi-ui';
import { useRequest } from 'ahooks';
import { Notification } from '@douyinfe/semi-ui';
import { useSelector } from 'react-redux';
import {JolPlayer} from "jol-player";

//ahook 模拟请求 hooks示例

function changeUsername(username: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}

export default () => {
  const [state, setState] = useState('0');
  const [currNum, setCurrNum] = useState(0);
  const gloable=useSelector(state=>state);

  const { loading, run } = useRequest(changeUsername, {
    manual: true,
    onSuccess: (result, params) => {
      if (result.success) {
        setState('');
        Notification.info({"content":`The username was changed to "${params[0]}" !`});
      }
    },
  });

  return (
    <div >
       <Card className='text-xl'  title='vlife-admin是基于vlife前后端组件封装能力打造的管理端业务应用开发平台' >
           <p className='text-xl' style={{ lineHeight: 1.8 }}>
            区别于其他的快速开发平台，V-LIFE以数据模型为中心，制定小而美的约定规则、简单简约人性化的设计理念，降低研发门槛，可提升数倍研发效能。
          </p>
          <p className='text-xl' style={{ lineHeight: 1.8 }}>
            【技&nbsp;&nbsp;术&nbsp;&nbsp;栈】： 前端react  后端：springboot
          </p>
          <p className='text-xl' style={{ lineHeight: 1.8 }}>
            【使用指南】 <a target={'_blank'} href='http://vlife.wwwlike.cn'>http://vlife.wwwlike.cn</a>
          </p>
          <p className='text-xl' style={{ lineHeight: 1.8 }}>
            【github】<a target={'_blank'} href='https://github.com/wwwlike/vlife'>https://github.com/wwwlike/vlife</a> 
          </p>
          <p className='text-xl' style={{ lineHeight: 1.8 }}>
            【gitee】<a target={'_blank'} href='https://gitee.com/wwwlike/vlife'>https://github.com/wwwlike/vlife</a>
          </p>
          <p className='text-xl' style={{ lineHeight: 1.8 }}>
            【视频介绍】<a target={'_blank'} href='https://www.bilibili.com/video/BV1sT411c71v/?vd_source=4c025d49e1ac4adb74b6dd2a39ce185e&t=119.6'>五分钟了解vlife快速开发</a> 
          </p>

        </Card>
        <br></br>
        <Card className='text-xl'  title='一个CRUD单表操作的迭代步骤' >
          <Steps className='bg-gray-300' current={currNum}  >
          <Steps.Step title="模型编写" description="模型、注释、注解、字典代码编写" onClick={()=>setCurrNum(0)} />
          <Steps.Step title="代码生成" description="注释提取、代码生成" onClick={()=>setCurrNum(1)} />
          <Steps.Step title="前端配置" description="菜单添加、字典同步" onClick={()=>setCurrNum(2)} />
          </Steps>
        </Card>

        {/* <JolPlayer
  option={{
    videoSrc:"https://tb-video.bdstatic.com/tieba-smallvideo-transcode-crf/230661707_7e0cc1f0351cc0d53ecf659aa1d6f107_6d9962da49ce_0.mp4?vt=1&pt=3&ver=&cr=2&cd=0&sid=&ft=8&tbau=2022-08-20_c4fe828f4736c91112dedbd61afd444cdbeb6dc9285e1b8bcffee980a1436e4f&ptid=7981090581",
    width: 1300,
    height: 768,
  }}
/> */}
    </div>
);
};