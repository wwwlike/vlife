import React from 'react'

/**
 * formily与组件的转换组件
 */

export default (obj:any)=>{
  return (
    <div>
      {JSON.stringify(obj)}
    </div>
  )

}