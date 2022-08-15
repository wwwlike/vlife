import React, { useState } from 'react';
import { Button, Input, Select, Steps, Timeline } from '@douyinfe/semi-ui';
import { useRequest } from 'ahooks';
import { Notification } from '@douyinfe/semi-ui';
import { useSelector } from 'react-redux';
//ahook 模拟请求 hooks示例

function changeUsername(username: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}

export default () => {
  const [state, setState] = useState('');
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
    <div>

<Select defaultValue='abc' style={{ width: 120 }}>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying' disabled>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>
        <br/><br/>
        <Select defaultValue='abc' disabled style={{ width: 120 }}>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
        </Select>
        <br/><br/>
        <Select placeholder='请选择业务线' style={{ width: 120 }}>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying' disabled>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>
      {/* {JSON.stringify(gloable)}
      <Input
        onChange={(e) => setState(e)}
        value={state}
        placeholder="Please enter username"
        style={{ width: 240, marginRight: 16 }}
      />
      <button className='h-6 w-6 text-white'>222</button>
      <Button className='h-6 w-6 text-white' disabled={loading}  onClick={() => run(state)}>
        {loading ? 'Loading' : 'Edit'}
      </Button> */}
      <p>
          使用vlife平台可实现编写Java类就能完成多表的关联业务的CRUD功能
      </p>
      <p>
          权限采用RBAC权限模型，用户，权限组、角色、资源(接口)；用户与权限组关联，拥有权限组里的角色的资源权限。
      </p>
       <Timeline mode="alternate" >
        <Timeline.Item time="2022-06月" extra="基于springboot2,queryDSL，实现编写模型就能完成后端CRUD接口业务服务。">
          低代码平台服务端
        </Timeline.Item>
        <Timeline.Item time="2022-08月" extra="在react18使用函数式hooks编程 基于vite、ts4、formily,ahook，实现后端模型信息转换成前端业务组件的渲染。">
          前端低代码平台
        </Timeline.Item>
        <Timeline.Item time="2022-10月" extra="文档完善，项目开源">
          进行中...
        </Timeline.Item>
        <Timeline.Item time="2022-12月" extra="apass云服务">
        已规划
        </Timeline.Item>
    </Timeline>

    </div>


    


  );
};