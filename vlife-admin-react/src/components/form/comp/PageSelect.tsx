import { connect,mapProps} from '@formily/react'
import PageSelect from '@src/components/select/PageSelect';

export default connect(
  PageSelect,
    mapProps(
      {
        required: true,
        validateStatus: true,
      },
      (props, field:any) => {
      return {
            ...props,
            ...field['componentProps'][field.props.name],
            onChange(selectedKeys:any) {
              field.value=selectedKeys;
            }
            // onSelect(selectedKeys, selected, selectedNode) {
            //   field.value=selectedKeys;
            // }
        }
      }
      ),
  )

