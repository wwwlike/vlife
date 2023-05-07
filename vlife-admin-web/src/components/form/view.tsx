import { FormFieldVo } from "@src/api/FormField";
import {
  PageComponentProp,
  PageComponentPropDto,
} from "@src/api/PageComponentProp";
import { dictObj } from "@src/context/auth-context";
import { ApiInfo } from "@src/dsl/datas/apis";
import { DataType, sourceType } from "@src/dsl/schema/base";
import { ComponentInfo, PropInfo } from "@src/dsl/schema/component";
import SelectIcon from "@src/components/SelectIcon";
import { Field } from "@formily/core";
import { ParamInfo } from "@src/dsl/schema/api";
import { listAll } from "@src/api/base/baseService";
import { Result } from "@src/api/base";
import { Select } from "@douyinfe/semi-ui";
const apiUrl = import.meta.env.VITE_APP_API_URL;

// /**
//  * @param def 返回组件指定属性的数据类型
//  * @param propName 组件属性
//  * @param subName  二级属性
//  * @returns
//  */
export const getDataType = (
  def: ComponentInfo,
  propName: string,
  subName?: string
): any => {
  if (def.propInfo) {
    const propObj: PropInfo = def.propInfo[propName] as PropInfo;
    if (subName && propObj.dataSub) {
      return (propObj.dataSub[subName] as PropInfo).dataType;
    } else {
      return propObj.dataType;
    }
  }
  return null;
};

/**
 * 将所有组件属性组装到一个对象（propObj）上面
 * @param p 组件属性DB数据
 * @param propObj  组件prop的传参值数据
 * @param value 属性值，[p]存的非fixed的需要进行转换后的值
 * @returns
 */
export const valueAdd = (
  p: Partial<PageComponentProp>,
  propObj: any,
  value: any
): any => {
  // console.log(JSON.stringify(value));
  if (p.subName || p.listNo) {
    //对象是数组
    if (p.listNo) {
      if (!propObj[p.propName + ""]) {
        propObj[p.propName + ""] = [];
      }
      while (propObj[p.propName + ""].length < p.listNo) {
        propObj[p.propName + ""].push({});
      }
      if (p.subName) {
        propObj[p.propName + ""][p.listNo - 1][p.subName] = value;
      } else {
        propObj[p.propName + ""][p.listNo - 1] = value;
      }
    } else if (p.subName) {
      //一般对象
      if (!propObj[p.propName + ""]) {
        propObj[p.propName + ""] = {};
      }
      propObj[p.propName + ""][p.subName] = value[p.subName]
        ? value[p.subName]
        : value;
    }
  } else {
    propObj[p.propName + ""] = value;
  }
  return propObj;
};

/**
 *
 * @param props 事件属性组装生成
 * @param componentInfo
 */
export const fetchEventPropObj = (
  props: Partial<PageComponentPropDto>[],
  componentInfo: ComponentInfo,
  propObj: any, //传入到组件的属性
  setEventChangeData: (prop: any) => void
): any => {
  if (propObj === undefined) propObj = {};
  for (let eventName in componentInfo.propInfo) {
    const filterPorp = props.filter((p) => p.propName === eventName);
    const propVal =
      filterPorp && filterPorp.length > 0 && filterPorp[0].propVal
        ? filterPorp[0].propVal
        : undefined;
    if (
      typeof componentInfo.propInfo[eventName] !== "string" &&
      (componentInfo.propInfo[eventName] as PropInfo).dataType ===
        DataType.event &&
      propVal
    ) {
      const propInfo: PropInfo = componentInfo.propInfo[eventName] as PropInfo;
      propObj[eventName] = function (val: any) {
        const apiFunc = ApiInfo[propVal].api;
        if (apiFunc) {
          apiFunc(val).then((d) => {
            if (propInfo.event?.propName) {
              setEventChangeData({ [propInfo.event?.propName]: d.data });
            }
          });
        }
      };
    }
  }
  return propObj;
};

// /**
//  * 静态数据请求
//  * 1固定2字典3field类数据提取
//  */
export const fetchStaticPropObj = (
  props: Partial<PageComponentPropDto>[],
  componentInfo: ComponentInfo,
  allDict: dictObj,
  field?: FormFieldVo,
  formData?: any //表单数据
): any => {
  let propsObj: any = {};
  // 1.组装fixed的简单对象,不需要转换直接从数据库里提取即可
  props
    ?.filter((p) => p.propName && p.propVal && p.sourceType === "fixed")
    .forEach((p) => {
      //图表类型，需要转换成组件形式
      if (p.propName) {
        const dt = getDataType(componentInfo, p.propName, p.subName);
        valueAdd(
          p,
          propsObj,
          dt === DataType.icon ? ( //图标
            <SelectIcon read={true} value={p.propVal} />
          ) : dt === DataType.image && p.propVal && p.propVal !== "" ? ( //图片
            `${apiUrl}/sysFile/image/${p.propVal}`
          ) : (
            p.propVal
          )
        );
      }
    });
  //2.  dataSource ===dict 方式取值
  props
    ?.filter((p) => p.propName && p.sourceType === "dict")
    .forEach((p) => {
      if (
        p.propName &&
        componentInfo &&
        componentInfo.propInfo &&
        typeof componentInfo.propInfo[p.propName] !== "string" &&
        allDict[p.propVal || "vlife"] &&
        allDict[p.propVal || "vlife"].data
      ) {
        //实际数据类型
        // const dt = getDataType(componentInfo, p.propName, p.subName);
        valueAdd(
          p,
          propsObj,
          allDict[p.propVal || "vlife"].data.map((d) => {
            return {
              label: d.label,
              value: field?.fieldType === "number" ? Number(d.value) : d.value,
            };
          })
        );
      }
    });

  //3 sys
  props
    ?.filter((p) => p.propName && p.propVal && p.sourceType === sourceType.sys)
    .forEach((p) => {
      if (
        p.propName &&
        componentInfo.propInfo &&
        typeof componentInfo.propInfo[p.propName] !== "string"
      ) {
        const propInfo: PropInfo = componentInfo.propInfo[
          p.propName
        ] as PropInfo;

        if (propInfo.sourceType === "sys" && field && p.propVal) {
          valueAdd(p, propsObj, field[p.propVal]);
        }
      }
    });

  // //4 func
  // props
  //   ?.filter((p) => p.propName && p.propVal && p.sourceType === sourceType.func)
  //   .forEach((p) => {
  //     if (
  //       formData &&
  //       field &&
  //       p.propName &&
  //       componentInfo.propInfo &&
  //       typeof componentInfo.propInfo[p.propName] !== "string" &&
  //       (componentInfo.propInfo[p.propName] as PropInfo).func
  //     ) {
  //       alert("1");
  //       const func1 = (componentInfo.propInfo[p.propName] as PropInfo).func;
  //       if (func1) {
  //         const v = func1(formData[field.fieldName]);
  //         alert(v);
  //         valueAdd(p, propsObj, v);
  //       }
  //     }
  //   });

  //3.  dataSource ===field 方式取值
  // props
  //   ?.filter((p) => p.propName && p.propVal && p.sourceType === "field")
  //   .forEach((p) => {
  //     if (p.propName) {
  //       valueAdd(p, propsObj, p.propVal ? formData[p.propVal] : null);
  //     }
  //   });

  return propsObj;
};

/**
 * 异步方式请求组件属性信息
 */
export const fetchPropObj = (
  props: Partial<PageComponentPropDto>[], //属性配置DB信息
  componentInfo: ComponentInfo, //组件信息
  // commonParams: any, //通用入参
  field?: Field //formily的字段信息
): Promise<any> => {
  let propsObj: any = {};
  return Promise.all(
    props
      ?.filter(
        (p) =>
          p.propName &&
          p.propVal &&
          (p.sourceType === sourceType.api ||
            // p.sourceType === "table" ||
            p.sourceType === sourceType.field)
      )
      .map(async (prop) => {
        if (prop.propVal && prop.propName) {
          if (prop.sourceType === sourceType.api) {
            //属性来源于接口
            const apiInfo = ApiInfo[prop.propVal];
            // 接口参数没有先不去请求数据
            const allParam = apiInfo?.params; //找到该接口
            const paramNames: string[] =
              allParam !== undefined ? Object.keys(allParam) : []; //得到该接口的所有参数
            let loadFlag: boolean = true;
            const paramObj: any = {};
            paramNames.forEach((name) => {
              //数据库里查找param字段
              const db = prop.params?.filter((p) => p.paramName === name);
              if (db && db?.length > 0 && db[0].paramVal) {
                if (db[0].sourceType === sourceType.fixed) {
                  paramObj[name] = db[0].paramVal; //当前是固定的，会从字段取计算动态的
                } else if (db[0].sourceType === sourceType.field && field) {
                  const fieldVal = field.query(db[0].paramVal).get("value"); //指定其他字段的值
                  if (allParam && typeof allParam[name] !== "string") {
                    if (
                      allParam[name].must === true &&
                      (fieldVal === null || fieldVal === undefined)
                    ) {
                      loadFlag = false;
                    }
                  }
                  paramObj[name] = fieldVal;
                } else if (db[0].sourceType === "fieldValue") {
                }
              } else if (allParam) {
                //另外两种接口入参取值方式：fieldValue,取当前字段值； fieldInfo取字段的指定属性
                const paramInfo: ParamInfo = allParam[name];
                if (paramInfo.sourceType === "fieldValue") {
                  paramObj[name] = field?.value;
                } else if (paramInfo.sourceType === "fieldInfo") {
                  paramObj[name] = //指定属性
                    field?.componentProps.fieldInfo[
                      paramInfo.fieldInfo?.attr || ""
                    ];
                }
                // loadFlag = false;
              }
            });

            const propinfo: PropInfo | undefined =
              componentInfo.propInfo && prop.propName
                ? (componentInfo.propInfo[prop.propName] as PropInfo)
                : undefined;
            // alert(JSON.stringify({ ...paramObj }));
            //执行接口，组装组件prop属性对象(直接赋值/转换赋值)
            if (loadFlag && propinfo && apiInfo.api) {
              propsObj = await apiInfo.api({ ...paramObj }).then((d) => {
                // 先判断是否需要转换  转换匹配
                if (apiInfo.match) {
                  const match = apiInfo.match.filter(
                    (f) =>
                      f.dataModel === propinfo.dataModel &&
                      f.dataType === propinfo.dataType
                  );
                  if (match && match.length > 0) {
                    if (typeof match[0].func === "function") {
                      propsObj = valueAdd(
                        prop,
                        propsObj,
                        match[0].func(d.data) //转换的方法, 转换方法里报错，需要监控
                      );
                    } else if (prop.relateVal) {
                      const func = match[0].func.filter(
                        (f) => f.key === prop.relateVal
                      );
                      if (func && func[0]) {
                        propsObj = valueAdd(
                          prop,
                          propsObj,
                          func[0].func(d.data)
                        );
                      }
                    }
                  }
                }
                if (prop.propName && prop.propName in propsObj === false) {
                  propsObj = valueAdd(prop, propsObj, d.data);
                }

                return propsObj;
              });
            } else if (loadFlag && propinfo && apiInfo.func) {
              if (prop.propName && prop.propName in propsObj === false) {
                propsObj = valueAdd(
                  prop,
                  propsObj,
                  apiInfo.func({ ...paramObj })
                );
              }
            }
            // return propsObj;
          }
          // else if (
          //   prop.propName &&
          //   componentInfo.propInfo &&
          //   typeof (componentInfo.propInfo[prop.propName] !== "string") &&
          //   (componentInfo.propInfo[prop.propName] as PropInfo).table !==
          //     undefined
          // ) {
          //   // table 方式
          //   const table = (componentInfo.propInfo[prop.propName] as PropInfo)
          //     .table;
          //   const entityName = prop.propVal;
          //   const labelField = table?.labelField || "name";
          //   const valField = table?.valField || "id";

          //   // table方式
          //   propsObj = await listAll({ entityName: entityName || "form" }).then(
          //     (d) => {
          //       propsObj = valueAdd(
          //         prop,
          //         propsObj,
          //         d.data?.map((d) => {
          //           return { label: d[labelField], value: d[valField] };
          //         })
          //       );
          //       return propsObj;
          //     }
          //   );
          // }
          else if (prop.sourceType === "field" && field) {
            valueAdd(prop, propsObj, field.query(prop.propVal).get("value"));
          }
          return propsObj;
        }
      })
  ).then((d) => {
    if (d.length > 0) {
      return { ...d[d.length - 1] };
      // setComponentPropFunc({ ...d[d.length - 1] }); //执行回调函数
    }
  });
  // const promiseTest = new Promise((resolve, reject) => {
  //   if (4 > 2) {
  //     resolve("a");
  //   } else {
  //     reject("error");
  //   }
  // });

  // return promiseTest.then(
  //   (data) => {
  //     console.log(data);
  //     return {
  //       optionList: [
  //         { label: "2123", value: "123" },
  //         { label: "234", value: "123" },
  //       ],
  //     };
  //   },
  //   (error) => {
  //     console.log(error);
  //     return "thenError";
  //   }
  // );

  // .then(data=>{
  //   console.log(data)
  //     return "then2";
  // }
};

/**
 * 组件属性创建
 * @param props  组件属性DB数据
 * @param componentInfo 组件信息
 * @param setComponentPropFunc set到指定对象里去
 */
export const componentPropCreate = (
  props: Partial<PageComponentPropDto>[],
  componentInfo: ComponentInfo,
  setComponentPropFunc: (prop: any) => void,
  setEventChangeData: (prop: any) => void,
  allDict: dictObj
) => {
  (async () => {
    /**
     * 1. 本地属性prop静态数据提取
     */
    let propsObj: any = fetchStaticPropObj(props, componentInfo, allDict) || {};

    // 2. 事件属性，组装传入
    propsObj = fetchEventPropObj(
      props,
      componentInfo,
      propsObj,
      setEventChangeData
    );
    // 3.远程数据提取 . api异步数据提取 (table是指定了api的异步取数据)
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
                const allParam = ApiInfo[prop.propVal].params;
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
                  const apiFunc = ApiInfo[prop.propVal].api;
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
