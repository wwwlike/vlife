import React, { useState } from 'react';
import { Button, Card, Col, Divider, Empty, Input, Row, Select, Space, Steps, TabPane, Tabs, Timeline, Upload } from '@douyinfe/semi-ui';
import { useRequest } from 'ahooks';
import { Notification } from '@douyinfe/semi-ui';
import { useSelector } from 'react-redux';
import img from './step1.gif'
import {
  IconUpload,IconDownload
} from "@douyinfe/semi-icons";


import { IllustrationNotFound, IllustrationNotFoundDark } from '@douyinfe/semi-illustrations'

//ahook 模拟请求 hooks示例

function changeUsername(username: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}

export default () => {
  const [error, setError] = useState<string>();
  const [state, setState] = useState();
  const [currNum, setCurrNum] = useState(0);
  const gloable=useSelector(state=>state);
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const { loading, run } = useRequest(changeUsername, {
    manual: true,
    onSuccess: (result, params) => {
      if (result.success) {
        Notification.info({"content":`The username was changed to "${params[0]}" !`});
      }
    },
  });

  return (
    <div >
        <Card className='text-xl'  title='VLIFE已开放前端代码生成功能' >
          <p className='text-xl'><b>1. 生成与服务端匹配的业务模型定义代码（VO/REQ/ENTITY/DTO）的TS代码</b></p>
          <p className='text-xl'><b>2. 生成与服务端API接口匹配的服务调用函数的TS代码</b></p>
          <p className='text-xl'><b>3. 访问线上服务生成前端代码<a href='http://admin.vlife.cc/ts/code'>http://admin.vlife.cc/ts/code</a></b></p>

          
        </Card>
        <br/>
        {/* <Card className='text-xl'  title='操作步骤' >
          <Steps className='bg-gray-300' current={currNum}  >
          <Steps.Step title="运行插件" description="在IDEA里运行`titleJson`插件，生成title.json文件" onClick={()=>setCurrNum(0)} />
          <Steps.Step title="下载代码" description="上传title.json文件服务端同步生成前端代码" onClick={()=>setCurrNum(1)} />
          <Steps.Step title="使用代码" description="解压代码，把代码放入service文件夹" onClick={()=>setCurrNum(2)} />
          </Steps>
        </Card> */}
        <div className="grid">
          <Row>
              <Col span={16}>
                <Card className='text-xl'  title={"step1 服务端生成title.json文件"} >
                <Empty image={<img src={img} style={{ width: 700, height: 550 }} />}></Empty>
                </Card>
              </Col>
              <Col span={8}>
                <Card className='text-xl'  title={state?"TS代码已生成":"step2 提交title.json文件"} >
              {state? 
          <div>
                 <Space>
            <a href={apiUrl+"/ts/download?code="+state}>  <Button icon={<IconDownload />} theme="light">
                代码下载
            </Button></a>
       &nbsp;&nbsp;&nbsp;&nbsp;
           <Button icon={<IconDownload />} onClick={()=>{
            setState(undefined)
           }}>
                重新上传
            </Button>
            </Space>
          </div>
          :  <Upload 
          action={apiUrl+"/ts/upload"}
           fileName='titleFile'
           afterUpload={(data:any)=>{
              if(data.response.data===-1){
                setError("上传文件格式不正确,请重新上传");
              }else{
                setState(data.response.data)
              }
            return data}}>
              <Button icon={<IconUpload />} theme="light">点击上传</Button>{error}
          </Upload> }
                </Card>
                </Col>
          </Row>
          </div></div>
  )
};