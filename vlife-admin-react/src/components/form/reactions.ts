// 根据FormReaction信息返回对应的 formReaction对象

import { SchemaReaction } from '@formily/react'
import { FormEventDto, FormEventVo } from '@src/mvc/model/FormEvent'
import { FormReactionVo } from '@src/mvc/model/FormReaction'
import { isStringObject } from 'util/types'
import { IGeneralFieldState } from '@formily/core'
import { stringify } from 'querystring'
import { FormFieldVo } from '@src/mvc/model/FormField'
import { FormVo } from '@src/mvc/model/Form'
import { attrs } from '@src/pages/design/event/event'

/**
 * 事件触发字符串
 */
const when = (event: FormReactionVo): string => {
  return '{{$deps[0].required===true}}'
}

/**
 * 响应字段的名称计算(如有$则去掉返回第一层)
 */
const reactionName = (prop: string): string => {
  if (prop.indexOf('$') !== -1) {
    return prop.substring(0, prop.indexOf('$'))
  } else {
    return prop
  }
}

/**
 * 响应字段的匹配值
 * 将prop:aaa&bbb&ccc ;val=123的入参 转换成 {aaa:{bbb:{ccc:123}}} 返回出去
 * 支持递归计算
 * $是分隔符
 */
const reactionVal = (prop: string, val: any): any => {
  const $index = prop.indexOf('$')
  // if ($index !== -1) {
  //   if(isStringObject(val)){
  //   }

  //   return { prop.substring(1,2): '' }
  // } else {
  //   return { prop: `{{${val}}}` }
  // }
}

const fulfillObj = (prop: string, val: any): any => {
  // const stringObj = isStringObject(val)
  const len = val.length
  //去除匹配值里有的字符串开头结尾的符号"'
  if (val && len && (val.startsWith('"') || val.startsWith("'"))) {
    val = val.substring(1, len - 1)
  }

  const isObj = prop.indexOf('$') !== -1
  if (!isObj) {
    //简单对象
    if (prop.startsWith('x-')) {
      console.log('aaaa', {
        schema: {
          [prop]: val,
        },
      })
      return {
        schema: {
          [prop]: val,
        },
      }
    } else {
      return {
        state: {
          [prop]: val,
        },
      }
    }
  } else {
    //包含$
    const before = prop.substring(0, prop.indexOf('$'))
    const after = prop.substring(prop.indexOf('$') + 1)
    const obj = fulfillObj(before, {})
    obj[before.startsWith('x-') ? 'schema' : 'state'][before][after] = val

    return obj
  }
}
//1. Boolean类型，取反;
const otherwiseObj = (prop: string, val: any, field: FormFieldVo): any => {
  if (attrs[prop].type === 'boolean') {
    return fulfillObj(prop, val === 'false' ? true : false)
  }
  return {}
}

const whenEl = (prop: string, eventType: string, val: any): string => {
  if (eventType === 'change') {
    return `{{$self.${prop}}}`
  } else if (eventType === 'equals') {
    return `{{$self.${prop}==="${val}"}}`
  } else if (eventType === 'ne') {
    return `{{$self.${prop}!=="${val}"}}`
  }
  return ''
}

/**
 * 主动联动，
 * 扩展点：满足条件修改指定值为某个值，otherwise(不满足)时如何处理
 * 1. Boolean类型，取反
 * 2. 有默认值,otherwise取默认值
 * 3. 制空
 */
export const eventReaction = (
  events: FormEventVo[], //联动信息
  fields: FormFieldVo[], //所有字段信息
): SchemaReaction[] => {
  let obj: SchemaReaction[] = []
  events.forEach((event) => {
    obj = [
      ...obj,
      ...event.reactions.map((reaction) => {
        return {
          target: `${reaction.fieldName}`,
          // when: `{{$self.value==="${event.val}"}}`,
          when: whenEl(event.attr, event.eventType, event.val),
          fulfill: fulfillObj(
            reaction.reactionAttr,
            // '{{$self.value.split('/')[1]}}',
            reaction.reactionValue,
          ),
          otherwise: otherwiseObj(
            reaction.reactionAttr,
            reaction.reactionValue,
            fields.filter((f) => f.fieldName === reaction.fieldName)[0],
          ),
          //'{{($self.value.startsWith("/")?$self.value.substring(1):$self.value).split("/").join(":")}}'
          // fulfill: {
          //   schema: {
          //     ['disabled']: true,
          //   },
          // },
          // state: {
          //   decoratorProps: {
          //     gridSpan: 2,
          //   },
          // },
          // state: '{{344433}}',
          // schema: reactionVal(reaction.reactionAttr, reaction.reactionValue),
          // schema: {
          //   properties: {
          //     input: {
          //       'x-component': 'Select',
          //     },
          //   },
          // },
          //不满足时，有默认值的或者是boolean类型的，不满足则可以实现
          // otherwise: {
          //   schema: {
          //     [reactionName(reaction.reactionAttr)]: '{{false}}',
          //   },
          // },
        }
      }),
    ]
  })
  console.log('obj', obj)
  return obj
}
/**
 * 被动形式
 */
// export const reaction = (reactions: FormReactionVo[]): SchemaReaction[] => {
//   return reactions.map((reactionVo) => {
//     // r.depsFieldName
//     return {
//       //依赖的字段
//       dependencies: ['.' + reactionVo.depsFieldName],
//       // target: 'name',reactionVo.depsFieldName
//       //触发事件
//       // when: when(reactionVo),
//       when: '{{$deps[0].required===true}}',
//       //满足时
//       fulfill: {
//         schema: {
//           required: '{{true}}',
//         },
//       },
//       //不满足时
//       otherwise: {
//         schema: {
//           required: '{{false}}',
//         },
//       },
//     }
//   })
// }
