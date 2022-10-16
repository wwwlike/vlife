import { connect,mapProps } from '@formily/react'
import React from 'react';
import RoleResourcesSelect from '.';

export default connect(
    RoleResourcesSelect,
    mapProps(
      {
        required: true,
        validateStatus: true,
      },
      (props, field:any) => {
        console.log("field['componentProps'][field.props.name]",field['componentProps'][field.props.name])
      return {
            ...props,
            ...field['componentProps'][field.props.name],
            onChange(selectedKeys:any) {
              field.value=selectedKeys;
            }
        }
      }
      ),
    // mapReadPretty(PreviewText.Input)
  )

