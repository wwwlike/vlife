import { IconFolder } from '@douyinfe/semi-icons';
import { Card, Col, Empty, Row, Space } from '@douyinfe/semi-ui';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import { useNiceModal } from '@src/store';
import React, { useMemo } from 'react';
import { inflateSync } from 'zlib';

export default ()=>{
  const mp4Modal = useNiceModal("mp4Modal");
  const infos= useMemo(():{id:string,title:string,desc?:string,img?:string}[]=>{
    return [
      {id:'472144073',title:'平台介绍',desc:'低代码有多爽？一个星期的工作，1小时就能完成，手把手带你入门',img:'vlife_jg.png'},
      {id:'730461251',title:'01讲 平台快速开发能力介绍',desc:'6大特点助您高效开发',img:'vlife_jg.png'},
      {id:'985600387',title:'02讲 权限脚手架vlife-admin介绍',desc:'vlife-admin是一款可以用具大多数后台管理的权限骨架应用',img:'vlife_jg.png'},
      {id:'900746694',title:'03讲 权限控制之行级数据过滤',desc:'有相同角色的用户也能看到不同层级的数据',img:'vlife_jg.png'},
      {id:'603322119',title:'04讲 vlife-admin权限骨架应用搭建',desc:'手把手搭建这个前后端分离的骨架系统,搭建完毕就可以进行业务开发了',img:'vlife_jg.png'},
      {id:'218367223',title:'05讲 模型编程之查询模型实战',desc:'较复杂的查询逻辑写个Javabean就能完成，看看吧',img:'vlife_jg.png'},

    ];
  },[])
 return <div >
    {
      infos.map(
        (info)=>{
         return  (
            <Card key={info.id} style={{width:"25%",height:"340px",float:'left',cursor:'pointer'

          }} 
            cover={ 
              <img onClick={()=>{mp4Modal.show(
                  {id:info.id,title:info.title}
              )}}
               src={"http://admin.vlife.cc/image/"+info.img}
              />}>
             
              <Meta title={info.title} description={info.desc}/>
            </Card>)
         }
      )}
  </div>
}



// import { Card, Col, Empty, Row } from '@douyinfe/semi-ui';
// import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
// import React from 'react';

// export default ()=>{
//  return <>
//       <Row>
//         <Col span={6}>
//           <Card >
//             <Empty  image={<img src={"http://admin.vlife.cc/image/vlife_jg.png"} />}></Empty>  
//             <Meta title="01平台介绍" description="低代码有多爽？一个星期的工作，1小时就能完成，手把手带你入门"
//              />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card  >
//             Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card  >
//             Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card  >
//             Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
//           </Card>
//         </Col>
//       </Row>
//       <br/>
//       <Row>
//         <Col span={6}>
//           <Card >
//             Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card  >
//             Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card  >
//             Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card  >
//             Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
//           </Card>
//         </Col>
//       </Row>
//   </>
// }