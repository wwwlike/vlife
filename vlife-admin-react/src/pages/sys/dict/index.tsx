import { Card } from '@douyinfe/semi-ui';
import { VfButton } from '@src/components/table';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';
import { useDictSync } from '@src/provider/dictProvider';
import { UserPageReq } from '@src/types/user';
import React, { useEffect, useMemo, useState} from 'react';


/**
 * 在封装一层
 * 1. entityName
 * 2. reqName
 * 3. voName
 */
export default ()=>{
  //2页面模块需要共享的查询条件状态
  const [pageReq,setPageReq]=useState<Partial<any>>({queryType:false});
  const [typeReq,setTypeReq]=useState<Partial<any>>({queryType:true});
  const entityName="dict";
  const sync=useDictSync();
  const [title,setTitle]=useState('字典同步');
  const [reload,setReload]=useState<boolean>(false);
  const customBtns=useMemo(():VfButton[]=>{
    return [
      {
        title:title,
        key:"sync",
        tableBtn:true,
        loading:sync.loading,
        fun:()=>sync.runAsync().then(data=>{
          setReload(!reload)
        })
      }
    ]
  },[sync])

  return (
    <div className='h-full overscroll-auto'>
    {/* //   <div>
    //   <FormPage type='queryForm' 
    //           maxColumns={[4,4,4]} 
    //           formData={pageReq} 
    //           setFormData={setPageReq} 
    //           entityName={entityName}  
    //           modelName='dictPageReq'
    //           hideColumns={['sys']}
    //           />

    //   </div> */}
    <div  className='h-full w-72 float-left ' >
      {/* ${JSON.stringify(a)} */}
          <Card  title='字典分类'  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>        
          <TablePage
                key={'queryPage'}
                req={typeReq}
                entityName={entityName} 
                hideColumns={['createDate','modifyDate','id','status','sys','del','val','code','createId','modifyId']}
                btnEnable={{read:true}}
                reload={reload}
                lineClick={e=>{
                  setPageReq({...pageReq,code:e.code})
                }}
                />
           </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='字典明细'
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                key={'tablePage'}
                req={pageReq}
                entityName={entityName} 
                hideColumns={['createDate','modifyDate','id','status','createId','modifyId']}
                select_more={true}
                customBtns={customBtns}
                />
          </Card>
      </div> 
    </div>
  )
  }


