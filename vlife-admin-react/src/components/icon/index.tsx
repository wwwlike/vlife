// import { Icon } from '@douyinfe/semi-ui';
import React, { ReactNode } from 'react';

import  * as Icon from '@douyinfe/semi-ui';
import { IconHome,IconDelete } from '@douyinfe/semi-icons';
import { IconProps, IconSize } from '@douyinfe/semi-ui/lib/es/icons';


interface iconProps{
  name:string,
  svg?: ReactNode;
  size?: IconSize;
  spin?: boolean;
  rotate?: number;
  prefixCls?: string;
  type?: string;
} 
export default ({name,...props}:iconProps)=> {
  if(name==='IconHome'){
  return <IconHome {...props} />
  }else if(name==='remove'){
    return <IconDelete {...props} />
  }
  
  else{
  return <></>
  }
}

