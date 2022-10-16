import { connect,mapProps} from '@formily/react'
import TreeQuery from '@src/components/tree/TreeQuery';

export default connect(
    TreeQuery,
    mapProps(
      {
        required: true,
        validateStatus: true,
      },
      (props, field:any) => {
      return {
            ...props,
            ...field['componentProps'][field.props.name],
            onSelect(selectedKeys, selected, selectedNode) {
              field.value=selectedKeys;
            }
        }
      }
      ),
    // mapReadPretty(PreviewText.Input)
  )

