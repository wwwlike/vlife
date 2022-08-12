import React, { useState } from 'react';
import { Button, Input, Steps, Timeline } from '@douyinfe/semi-ui';
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
      vlife编写Java类就能实现一般复杂应用场景业务

       <Timeline mode="alternate">
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