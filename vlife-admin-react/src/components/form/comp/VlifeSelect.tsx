import { Select } from '@douyinfe/semi-ui';
import Label from '@douyinfe/semi-ui/lib/es/form/label';
import { connect,mapProps} from '@formily/react'
/**
 * 将vlife返回的数据 id,name转换成 semi需要的格式
 * 会进来两次需要处理
 */
export default connect(
  Select,
    mapProps(
      (props, field:any) => {
        let datas:any[]=[];
        if(field['componentProps'].props){
          datas=field['componentProps'].props.datas;
        }
        let key="id";
        if(field.props.name==='menuCode'){//特列
          key="resourcesCode"
        }else if(field.props.name.indexOf("code")!=-1){
          key="code"
        }
    //  console.log("datas",field['componentProps'])
      return {
            ...props,
           optionList:datas.map(data=>{return {value:data[key],label:data.name}}) 
        }
      }
      ),
  )

