import {
  PageComponentProp,
  PageComponentPropDto,
} from "@src/api/PageComponentProp";
import { dictObj } from "@src/context/auth-context";
import { sourceType } from "@src/dsl/schema/base";
import { Field } from "@formily/core";
import { listAll } from "@src/api/base/baseService";
import { filterFuns } from "@src/resources/filters";
import {
  CompInfo,
  CompProp,
  CompPropInfo,
  ParamsInfo,
} from "../compConf/compConf";
import { apiDatas } from "@src/resources/ApiDatas";
import { isBasic } from "@src/util/func";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";

function getValueByKey(key: string, input: string): string | undefined {
  const pairs = input.split(",");
  let valueWithoutKey: string | undefined;
  for (const pair of pairs) {
    const [currentKey, value] = pair.split(":");
    if (!currentKey) {
      valueWithoutKey = value;
    } else if (currentKey === key) {
      return value;
    }
  }
  return key ? undefined : valueWithoutKey;
}

/**
 * 将所有组件属性组装到一个对象（propObj）上面
 * @param p 组件属性DB数据
 * @param propObj  组件prop的传参值数据
 * @param value 属性值，[p]存的非fixed的需要进行转换后的值
 * @returns
 */
const valueAdd = (
  p: Partial<PageComponentProp>,
  propObj: any,
  value: any
): any => {
  //对象是数组
  if (p.propName)
    if (
      p.listNo !== undefined &&
      p.listNo !== null &&
      p.sourceType !== sourceType.api
    ) {
      if (!propObj[p.propName]) {
        propObj[p.propName] = [];
      }
      while (propObj[p.propName].length < p.listNo + 1) {
        propObj[p.propName].push({});
      }
      if (p.subName) {
        propObj[p.propName][p.listNo][p.subName] = value;
      } else {
        propObj[p.propName][p.listNo] = value;
      }
    } else if (
      p.subName !== null &&
      p.subName !== undefined &&
      p.sourceType !== sourceType.api
    ) {
      //一般对象
      if (!propObj[p.propName]) {
        propObj[p.propName] = {};
      }
      propObj[p.propName][p.subName] = value[p.subName]
        ? value[p.subName]
        : value;
    } else {
      propObj[p.propName] = value;
    }
  return propObj;
};

/**
 *
 * @param props 事件属性组装生成
 * @param componentInfo
 */
// export const fetchEventPropObj = (
//   props: Partial<PageComponentPropDto>[],
//   componentInfo: CompInfo,
//   propObj: any, //传入到组件的属性
//   setEventChangeData: (prop: any) => void
// ): any => {
//   if (propObj === undefined) propObj = {};
//   for (let eventName in componentInfo.propInfo) {
//     const filterPorp = props.filter((p) => p.propName === eventName);
//     const propVal =
//       filterPorp && filterPorp.length > 0 && filterPorp[0].propVal
//         ? filterPorp[0].propVal
//         : undefined;
//     if (
//       typeof componentInfo.propInfo[eventName] !== "string" &&
//       (componentInfo.propInfo[eventName] as PropInfo).dataType ===
//         DataType.event &&
//       propVal
//     ) {
//       const propInfo: PropInfo = componentInfo.propInfo[eventName] as PropInfo;
//       propObj[eventName] = function (val: any) {
//         const apiFunc = ApiInfo[propVal].api;
//         if (apiFunc) {
//           apiFunc(val).then((d) => {
//             if (propInfo.event?.propName) {
//               setEventChangeData({ [propInfo.event?.propName]: d.data });
//             }
//           });
//         }
//       };
//     }
//   }
//   return propObj;
// };
isBasic;
/**
 * 已设置在数据库里的配置信息组装
 */
export const fetchStaticPropObj = (
  props: Partial<PageComponentPropDto>[],
  field?: Field //formily的字段信息
): any => {
  // alert("123");
  let propsObj: any = {};
  if (props) {
    props.forEach((p) => {
      //db里是fiexed类型值瓶
      if (p.sourceType === sourceType.fixed && p.propName && p.propVal) {
        valueAdd(p, propsObj, p.propVal);
        // propsObj[p.propName] = p.propVal;
      } else if (
        field &&
        p.sourceType === sourceType.field &&
        p.propName &&
        p.propVal
      ) {
        valueAdd(p, propsObj, field.query(p.propVal).get("value"));
      }
    });
  }

  return propsObj;
};

/*
 * 请求字段的值方式
 */
export const fetchFieldObj = (
  formVo: FormVo, //表单信息
  infos: ParamsInfo,
  parentData: any, //父组件表单值
  field: Field //formily的字段信息
): any => {
  const fromField = infos.fromField;
  if (fromField) {
    const fieldInfo: FormFieldVo[] = formVo.fields
      .filter((f) => f.entityType === fromField.entity)
      .filter((f) => f.dataType !== "array")
      .filter((ff) => ff.entityFieldName === fromField?.field);
    // 本表通过field匹配进行查找，如果找不到，父组件也有值则在父组件里寻找，把entity和field组合起来
    if (fieldInfo && fieldInfo.length > 0) {
      return field.query(fieldInfo[0].fieldName).get("value");
    } else if (parentData) {
      const pvs = Object.keys(parentData).filter(
        (f) =>
          f.toLowerCase() === (fromField.entity + fromField.field).toLowerCase()
      );
      if (pvs && pvs.length > 0) {
        return parentData[pvs[0]];
      }
    }
  }
  return undefined;
};

/**
 * 异步方式请求组件属性信息
 */
export const fetchPropObj = (
  props: Partial<PageComponentPropDto>[], //属性配置DB信息
  componentInfo: CompInfo, //组件信息
  field: Field, //formily的字段信息
  parentData: any, //作为子表单，父表单数据
  rootFormName: string, //表单名称 form-type
  formVo: FormVo //当前表单模型信息
): Promise<Field> => {
  let propsObj: any = {}; //组件属性对象
  //1 db存储的静态值提取
  let staticObj = fetchStaticPropObj(props, field);
  //2. 属性来自于其他field字段的值提取
  let fromFieldObj: any = {};
  if (componentInfo && componentInfo.props) {
    const compProp: CompProp = componentInfo.props;
    Object.keys(compProp)
      .filter(
        (k) =>
          typeof compProp[k] === "object" &&
          (compProp[k] as ParamsInfo).fromField
      )
      .forEach((key) => {
        fromFieldObj[key] = fetchFieldObj(
          formVo,
          compProp[key] as ParamsInfo,
          parentData,
          field
        );
      });
  }

  if (props) {
    return Promise.all(
      props
        ?.filter(
          (p) => p.propName && p.propVal && p.sourceType === sourceType.api
        )
        .map(async (prop) => {
          if (prop.propVal && prop.propName) {
            if (prop.sourceType === sourceType.api) {
              const apiInfo = apiDatas[prop.propVal]; //取得接口信息
              const allParam = apiInfo?.params; //接口参数信息
              const paramNames: string[] =
                allParam !== undefined ? Object.keys(allParam) : []; //所有参数名称
              let mustFlag: boolean = true; //必填入参是否都满足标识
              const paramObj: any = {}; //参数对象
              //参数来源于同表单/页面的其他字段(组件)
              // let paramsFromFieldObj: any = {};
              if (apiInfo && apiInfo.params) {
                const params: {
                  [key: string]: ParamsInfo | string | boolean | number;
                } = apiInfo.params;
                Object.keys(params)
                  .filter(
                    (k) =>
                      typeof params[k] === "object" &&
                      (params[k] as ParamsInfo).fromField
                  )
                  .forEach((key) => {
                    paramObj[key] = fetchFieldObj(
                      formVo,
                      params[key] as ParamsInfo,
                      parentData,
                      field
                    );
                    // alert(paramObj[key]);
                  });
              }

              paramNames.forEach((name) => {
                if (
                  allParam &&
                  typeof allParam[name] !== "string" &&
                  typeof allParam[name] !== "boolean" &&
                  typeof allParam[name] !== "number"
                ) {
                  const paramInfo: ParamsInfo = allParam[name] as ParamsInfo;
                  //数据库里查找param字段
                  const db = prop.params?.filter((p) => p.paramName === name);
                  if (db && db?.length > 0 && db[0].paramVal) {
                    //一  取自db配置
                    if (db[0].sourceType === sourceType.fixed) {
                      //1 接口入参固定值: fixed从数据库取存储的值 paramVal
                      paramObj[name] = db[0].paramVal;
                    } else if (db[0].sourceType === sourceType.field) {
                      // if (getValueByKey(formName, db[0].paramVal) !== undefined) {
                      //   // const parentProp =
                      //   //   getValueByKey(formame, db[0].paramVal) || "";
                      //   // paramObj[name] = pareNntData[parentProp];
                      // } else {
                      paramObj[name] = field.query(db[0].paramVal).get("value");
                      // }
                    }
                    // else if (db[0].sourceType === sourceType.field && field) {
                    //   //2 接口来自表单里指定field的值，
                    //   const paramVal = db[0].paramVal;
                    //   if (
                    //     paramVal.indexOf(",") === -1 &&
                    //     paramVal.indexOf(":") === -1
                    //   ) {
                    //     //来源于当前表单的字段
                    //     const fieldVal = field.query(paramVal).get("value");
                    //     paramObj[name] = fieldVal;
                    //   } else if (
                    //     getValueByKey(formName, paramVal) !== undefined
                    //   ) {
                    //     //来源于关联表单的字段 包涵“，：”的形式就表示取自其他模型里的字段
                    //     const parentProp =
                    //       getValueByKey(formName, paramVal) || "";
                    //     paramObj[name] = parentData[parentProp];
                    //   }
                    // }
                  }
                  //必填的是否都有
                  if (
                    paramInfo.must === true &&
                    (paramObj[name] === undefined || paramObj[name] === null)
                  ) {
                    mustFlag = false; //不满足
                  }
                } else if (allParam) {
                  //固定写死
                  paramObj[name] = allParam[name];
                }
              });

              const propinfo: CompPropInfo | undefined =
                componentInfo.props && prop.propName
                  ? (componentInfo.props[prop.propName] as CompPropInfo)
                  : undefined;
              //执行接口，组装组件prop属性对象(直接赋值/转换赋值)  //接口异步请求到的数据，存储到缓存里
              if (mustFlag && propinfo && apiInfo.api) {
                propsObj = await apiInfo.api({ ...paramObj }).then((d) => {
                  //异步请求到的数据
                  let datas = d.data;
                  //1. 内部过滤器
                  if (apiInfo.filter) {
                    datas = apiInfo.filter(datas, paramObj);
                  }
                  //放到缓存里
                  window.localStorage.setItem(
                    `fetchData_${rootFormName}_${field.path}`,
                    JSON.stringify(datas)
                  );
                  //异步请求数据的数据存储起来(fetchData,提供给有需要的组件使用)
                  // field.setComponentProps({
                  //   ...field.componentProps,
                  //   fetchData: datas,
                  // });
                  propsObj = valueAdd(
                    { propName: "fetchData" },
                    propsObj,
                    datas
                  );

                  //某个字段异步请求的数据，最后取代上面的
                  propsObj = valueAdd(
                    { propName: `fetchData_${prop.propName}` },
                    propsObj,
                    datas
                  );
                  //执行数据过滤
                  if (prop.filterFunc && filterFuns[prop.filterFunc] && datas) {
                    datas = filterFuns[prop.filterFunc].func(datas); //数据过滤
                  }
                  //执行数据转换
                  if (prop.relateVal && apiInfo.match) {
                    //数据一致的转换函数
                    datas = apiInfo.match[prop.relateVal].func(datas);
                  }
                  if (prop.propName && prop.propName in propsObj === false) {
                    propsObj = valueAdd(prop, propsObj, datas);
                  }
                  return propsObj;
                });
              } else if (mustFlag && propinfo) {
                if (prop.propName && prop.propName in propsObj === false) {
                  propsObj = valueAdd(
                    prop,
                    propsObj,
                    apiInfo.api({ ...paramObj })
                  );
                }
              }
            } else if (prop.sourceType === sourceType.field && field) {
              valueAdd(prop, propsObj, field.query(prop.propVal).get("value"));
            }
            return propsObj;
          }
        })
    ).then((componenetPropObj: any[]) => {
      field.setComponentProps({
        ...field.componentProps,
        ...componenetPropObj[0], //当前异步请求值
        ...staticObj, //固定值预设值打散
        ...fromFieldObj, //来源于其他字段的入参
      });
      return field;
      //map方法返回的是数组数据，故取第0个（废弃掉，改为设置到field的props里，直接返回field即可）
      // return { ...componenetPropObj[0] };
    });
  } else {
    return new Promise(() => {
      field.setComponentProps({
        ...fromFieldObj, //来源于其他字段的入参
      });
      return field;
    });
  }
};

/**
 * 指定模型字段上异步请求的原始数据读取
 * @param field 字段
 * @param modelName 模型名称
 * @returns
 */
export const fieldComponentFetchData = (
  modelName: string,
  field: string
): any => {
  const fetchDataStr = window.localStorage.getItem(
    `fetchData_${modelName}_${field}`
  );
  if (fetchDataStr) {
    return JSON.parse(fetchDataStr);
  } else {
    throw new Error("该字段选择的组件没有任何异步请求");
  }
};

/**
 * 页面的(非form)组件属性创建
 * @param props  组件属性DB数据
 * @param componentInfo 组件信息
 * @param setComponentPropFunc set到指定对象里去
 */
export const componentPropCreate1 = (
  props: Partial<PageComponentPropDto>[],
  componentInfo: CompInfo,
  setComponentPropFunc: (prop: any) => void,
  setEventChangeData: (prop: any) => void,
  allDict: dictObj
) => {
  (async () => {
    let propsObj: any = {};
    //属性固定值拼接
    if (componentInfo && componentInfo.props) {
      const propInfo = componentInfo.props;
      const keys = Object.keys(propInfo);
      keys.forEach((k) => {
        if (
          typeof propInfo[k] === "string" ||
          typeof propInfo[k] === "boolean" ||
          typeof propInfo[k] === "number"
        ) {
          propsObj[k] = propInfo[k];
        }
      });
    }
    /**
     * 2. 本地属性prop静态数据提取
     */
    propsObj = {
      ...propsObj,
      ...fetchStaticPropObj(props),
    };
    // 3. 事件属性，组装传入(暂去)
    // propsObj = fetchEventPropObj(
    //   props,
    //   componentInfo,
    //   propsObj,
    //   setEventChangeData
    // );
    // 4.远程数据提取 . api异步数据提取 (table是指定了api的异步取数据)
    if (
      props?.filter(
        (p) => p.propName && p.propVal && p.sourceType === sourceType.api //???  || p.sourceType === "table"
      ).length > 0
    ) {
      Promise.all(
        props
          ?.filter(
            (p) => p.propName && p.propVal && p.sourceType === sourceType.api //|| p.sourceType === "table"
          )
          .map(async (prop) => {
            if (prop.propVal) {
              if (prop.sourceType === sourceType.api) {
                // 接口参数没有先不去请求数据
                const allParam = apiDatas[prop.propVal].params;
                const paramNames: string[] =
                  allParam !== undefined ? Object.keys(allParam) : [];
                let load: boolean = true;
                const paramObj: any = {};
                if (paramNames.length > 0) {
                  paramNames.forEach((name) => {
                    const db = prop.params?.filter((p) => p.paramName === name);
                    if (db && db?.length > 0 && db[0].paramVal) {
                      paramObj[name] = db[0].paramVal;
                    } else {
                      load = false;
                    }
                  });
                }
                if (load) {
                  const apiFunc = apiDatas[prop.propVal].api;
                  if (apiFunc) {
                    propsObj = await apiFunc(paramObj).then((d) => {
                      // const dt = getDataType(
                      //   componentInfo,
                      //   prop.propName,
                      //   prop.subName
                      // );
                      propsObj = valueAdd(prop, propsObj, d.data);
                      return propsObj;
                    });
                  }
                }
                // return propsObj;
              } else {
                // table方式
                propsObj = await listAll({ entityType: "form" }).then((d) => {
                  propsObj = valueAdd(prop, propsObj, d.data);
                  return propsObj;
                });
              }
              return propsObj;
            }
          })
      ).then((d) => {
        if (d.length > 0) {
          setComponentPropFunc({ ...d[d.length - 1] }); //执行回调函数
        }
      });
    } else {
      setComponentPropFunc(propsObj);
    }
  })();
};

/**
 * 页面的(非form)组件属性创建
 * @param props  组件属性DB数据
 * @param componentInfo 组件信息
 * @param setComponentPropFunc 组件属性回写
 */
export const componentPropCreate = (
  props: Partial<PageComponentPropDto>[],
  componentInfo: CompInfo,
  setComponentPropFunc: (prop: any) => void
) => {
  (async () => {
    let propsObj: any = {};
    //属性固定值拼接
    if (componentInfo && componentInfo.props) {
      const propInfo = componentInfo.props;
      const keys = Object.keys(propInfo);
      keys.forEach((k) => {
        if (
          typeof propInfo[k] === "string" ||
          typeof propInfo[k] === "boolean" ||
          typeof propInfo[k] === "number"
        ) {
          propsObj[k] = propInfo[k];
        }
      });
    }
    /**
     * 2. 数据库存储数据组装
     */
    propsObj = {
      ...propsObj,
      ...fetchStaticPropObj(props),
    };
    setComponentPropFunc(propsObj);
    // /**
    //  * 异步提取
    //  */
    // if (
    //   props?.filter(
    //     (p) => p.propName && p.propVal && p.sourceType === sourceType.api //???  || p.sourceType === "table"
    //   ).length > 0
    // ) {
    //   Promise.all(
    //     props
    //       ?.filter(
    //         (p) => p.propName && p.propVal && p.sourceType === sourceType.api //|| p.sourceType === "table"
    //       )
    //       .map(async (prop) => {
    //         if (prop.propVal) {
    //           if (prop.sourceType === sourceType.api) {
    //             // 接口参数没有先不去请求数据
    //             const allParam = apiDatas[prop.propVal].params;
    //             const paramNames: string[] =
    //               allParam !== undefined ? Object.keys(allParam) : [];
    //             let load: boolean = true;
    //             const paramObj: any = {};
    //             if (paramNames.length > 0) {
    //               paramNames.forEach((name) => {
    //                 const db = prop.params?.filter((p) => p.paramName === name);
    //                 if (db && db?.length > 0 && db[0].paramVal) {
    //                   paramObj[name] = db[0].paramVal;
    //                 } else {
    //                   load = false;
    //                 }
    //               });
    //             }
    //             if (load) {
    //               const apiFunc = apiDatas[prop.propVal].api;
    //               if (apiFunc) {
    //                 propsObj = await apiFunc(paramObj).then((d) => {
    //                   // const dt = getDataType(
    //                   //   componentInfo,
    //                   //   prop.propName,
    //                   //   prop.subName
    //                   // );
    //                   propsObj = valueAdd(prop, propsObj, d.data);
    //                   return propsObj;
    //                 });
    //               }
    //             }
    //             // return propsObj;
    //           } else {
    //             // table方式
    //             propsObj = await listAll({ entityType: "form" }).then((d) => {
    //               propsObj = valueAdd(prop, propsObj, d.data);
    //               return propsObj;
    //             });
    //           }
    //           return propsObj;
    //         }
    //       })
    //   ).then((d) => {
    //     if (d.length > 0) {
    //       setComponentPropFunc({ ...d[d.length - 1] }); //执行回调函数
    //     }
    //   });
    // } else {
    // }
  })();
};