import React, { useState } from 'react';
import { Button, Card, Divider, Input, Select, Steps, TabPane, Tabs, Timeline } from '@douyinfe/semi-ui';
import { useRequest } from 'ahooks';
import { Notification } from '@douyinfe/semi-ui';
import { useSelector } from 'react-redux';
import {JolPlayer} from "jol-player";

export default()=>{

  return  (<><JolPlayer className='w-1000'
  option={{
    videoSrc:"https://tb-video.bdstatic.com/tieba-smallvideo-transcode-crf/230661707_7e0cc1f0351cc0d53ecf659aa1d6f107_6d9962da49ce_0.mp4?vt=1&pt=3&ver=&cr=2&cd=0&sid=&ft=8&tbau=2022-08-20_c4fe828f4736c91112dedbd61afd444cdbeb6dc9285e1b8bcffee980a1436e4f&ptid=7981090581",
    height: 768,
  }}
/></>)
}