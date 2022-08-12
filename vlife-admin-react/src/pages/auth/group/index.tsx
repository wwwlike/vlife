import { Card } from '@douyinfe/semi-ui';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';
import { UserPageReq } from '@src/types/user';
import React, { useEffect, useState} from 'react';


/**
 * 在封装一层
 * 1. entityName
 * 2. reqName
 * 3. voName
 */
export default ()=>{
  //2页面模块需要共享的查询条件状态
  //搜索条件，可以由url转换来
  const [formData,setFormData]=useState<any>({});
  const entityName="sysGroup";
  return (
    <div className='h-full overscroll-auto'>
    <div  className='h-full w-72 float-left ' >
          <Card  title='权限组管理'  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>
            { <FormPage type='queryForm' 
              maxColumns={[1,1,1]} 
              formData={formData} 
              setFormData={setFormData} //相应事件。
              entityName={entityName}  
              modelName='sysGroupPageReq' /> }
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='权限组列表'
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={formData} //搜索条件
                entityName={entityName} 
                viewModel={'sysGroupDetailVo'}
                editModel={'groupDto'}
                select_more={true}
                />
          </Card>
      </div> 
    </div>
  )
  }


