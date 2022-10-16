import { Input } from '@douyinfe/semi-ui'
import { connect,mapProps,mapReadPretty,Field } from '@formily/react'
import TabSelect from '@src/components/select/TabSelect'

export default connect(
  TabSelect,
  mapProps(
    {
      required: true,
      readPretty:true,
      validateStatus: true,
    },
    (props, field:any) => {
      // alert(props)
        //  console.log("field['componentProps'][field.props.name]",field['componentProps'][field.props.name])
    return {
          ...props,
          onChange:(data)=>{
            field.value=data;
          },
          ...field['componentProps'][field.props.name]
        }
      }
    ),
    // mapReadPretty(({ value,...props }) =><</>
  // mapReadPretty(Input)
)