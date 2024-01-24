import {
  PageComponentProp,
  PageComponentPropDto,
} from "@src/api/PageComponentProp";
import { DataModel, OptEnum, sourceType } from "@src/dsl/base";
import { Field } from "@formily/core";
// import { filterFuns } from "@src/resources/filters";
import {
  CompInfo,
  CompProp,
  CompPropInfo,
  ParamsInfo,
  ParamsObj,
} from "../compConf/compConf";
import { apiDatas, loadApi } from "@src/resources/ApiDatas";
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
 * 已设置在数据库里的配置信息组装
 * 非接口方式数据组装
 */
export const fetchStaticPropObj = (
  props: Partial<PageComponentPropDto>[], //数据库信息
  field?: Field, //formily的字段信息,
  compProps?: CompProp //组件信息
): any => {
  let propsObj: any = {};
  if (props) {
    props.forEach((p) => {
      // fromField是关联其他字段的值的数据提取
      if (field&& compProps&&p.propName&& typeof compProps[p.propName] ==="object" 
      && (compProps[p.propName] as CompPropInfo).fromField===true ) {
        valueAdd(p, propsObj, field.query(p.propVal).get("value"));
      }else if (p.sourceType === sourceType.fixed && p.propName && p.propVal) {
        if((compProps?.[p.propName] as CompPropInfo).dataModel==DataModel.boolean){
          valueAdd(p, propsObj, JSON.parse(p.propVal));//boolean类型进行str->boolean
        }else{
          valueAdd(p, propsObj, p.propVal);
        }
      } 
    });
  }
  return propsObj;
};

//取指定了数据模型字段的字段值。
export const fetchFromFieldPropObj =( compProps: CompProp,formVo: FormVo,parentData:any,field:Field):any=>{
  let fromFieldObj: any = {};
    Object.keys(compProps)
      .filter(
        (k) =>
          typeof compProps[k] === "object" &&
          (compProps[k] as CompPropInfo).fromField&&(compProps[k] as CompPropInfo).fromField!==true
      )
      .forEach((key) => {
        fromFieldObj[key] = fetchFieldObj(
          formVo,
          compProps[key] as CompPropInfo,
          parentData,
          field
        );
      });
    return fromFieldObj;
}

/*
 * 请求字段的值方式
 */
const fetchFieldObj = (
  formVo: FormVo, //表单信息
  paranInfo: ParamsInfo,
  parentData: any, //父组件表单值
  field: Field //formily的字段信息
): any => {
  const fromField = paranInfo.fromField;
  if (fromField&&fromField!==true) {
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

//根据参数定义信息检擦所有参数值是否都有
const hasAllValues=(paramObjs:any,params:ParamsObj):boolean=>{
  const paramNames=Object.keys(params);
  return paramNames.every(paramName=>{
    if(typeof params[paramName]!=="object"){
      return true;
    }else{
      const paramInfo:ParamsInfo=params[paramName] as ParamsInfo;//参数信息
      const paramObj=paramObjs[paramName]; //参数值
      if(paramInfo.required===undefined||paramInfo.required===false||(
        paramObj!==undefined &&paramObj!==null&& //有字段有值
        (!Array.isArray(paramObj)||(Array.isArray(paramObj)&&paramObj.length>0))
      )){
        return true
      }
      return false;
    }
  })
}
/**
 * 1. 取出动态属性，组装进conditions里
 * 2. 取出不用给后端的参数      ((allParam[k] as ParamsInfo).send!==false)&& //
 */
export const dynamicParamsTran=(obj:any,params:ParamsObj):any=>{
  const paramName:string[]=Object.keys(params);
  // 
  const where=paramName.filter(key=> typeof params[key]==="object"&& (params[key] as ParamsInfo).dynamicParams && (params[key] as ParamsInfo).send!==false ).map(key=>{
    return {
      fieldName:key,
      opt: (params[key] as ParamsInfo).dynamicParamsOpt||OptEnum.eq,
      value: Array.isArray(obj[key])?obj[key]:[obj[key]],
    }
  })
  const {...newObj}=obj
  paramName.filter(key=> typeof params[key]==="object" && ((params[key] as ParamsInfo).dynamicParams||(params[key] as ParamsInfo).send===false)).forEach(key=> {
    delete newObj[key];
  })
  return {...newObj, conditionGroups: [{ where }],};
}
/**
 * 异步方式请求组件属性信息
 */
export const fetchPropObj = (
  props: Partial<PageComponentPropDto>[], //属性配置DB信息
  componentInfo: CompInfo, //组件信息
  field: Field, //formily的字段信息
  parentData: any, //作为子表单，父表单数据
  formVo: FormVo, //当前表单模型信息
  fieldOutParams?: any
): Promise<Field> => {
  let propsObj: any = {}; //组件属性对象
  //1 db存储的静态值提取=(非接口方式数据组装)
  let staticObj = fetchStaticPropObj(props, field,componentInfo.props);
  //2. 属性来自于其他field字段的值提取
  let fromFieldObj= fetchFromFieldPropObj(componentInfo.props||{}, formVo, parentData, field);
  //3. 接口方式取值
  if (props) {
    return Promise.all(
      props
        ?.filter(
          (p) => p.propName && p.propVal && p.sourceType === sourceType.api
        )
        .map(async (prop) => {
          if (prop.propVal && prop.propName) {
            if (prop.sourceType === sourceType.api) {
              const apiInfo = apiDatas[prop.propVal]; //接口配置信息
              const allParam=prop.relateVal?apiDatas[prop.propVal]?.match?.[prop.relateVal]?.params:{};
              // const allParam = {...apiInfo?.params,...matchParams}; //接口入参配置信息
              const paramNames: string[] =
                allParam !== undefined ? Object.keys(allParam) : []; //所有参数name数组
            
              const paramObj: any = {}; //参数对象
              //参数来源于同表单/页面的其他字段(组件)
              if (allParam) {
                //在fromfield配置里指定了固定类型的来源字段
                paramNames
                  .filter(
                    (k) =>
                      typeof allParam[k] === "object" &&
                      (allParam[k] as ParamsInfo).fromField && typeof (allParam[k] as ParamsInfo).fromField=== "object"
                  )
                  .forEach((key) => {
                    paramObj[key] = fetchFieldObj(
                      formVo,
                      allParam[key] as ParamsInfo,
                      parentData,
                      field
                    );
                  });
              //2读取存储到数据库配置的值
              paramNames.filter(name=> 
                typeof allParam[name] !== "string" &&
                typeof allParam[name] !== "boolean" &&
                typeof allParam[name] !== "number" 
              ).forEach((name) => {
                  const paramInfo: ParamsInfo = allParam[name] as ParamsInfo;
                  //数据库里查找param字段
                  const db = prop.params?.filter((p) => p.paramName === name);
                  if (db && db?.length > 0 && db[0].paramVal) {//转换
                     if (paramInfo.fromField===true) {
                      paramObj[name] = field.query(db[0].paramVal).get("value");
                    }else if (db[0].sourceType === sourceType.fixed) {//直接使用
                      paramObj[name] = db[0].paramVal;
                    }else if (db[0].sourceType === sourceType.field) {
                      paramObj[name] = field.query(db[0].paramVal).get("value");
                    }
                }else{
                  // alert("找不到")
                }
              });
              //传参配置里是固定值
              paramNames.filter(name=> 
                typeof allParam[name] == "string" ||
                typeof allParam[name] == "boolean" ||
                allParam[name] instanceof Date ||
                typeof allParam[name] == "number"
              ).forEach((name) => {
                paramObj[name] = allParam[name];
              })
              }
              if  (prop.sourceType==="api"&& apiInfo &&prop.relateVal&& (allParam===undefined||hasAllValues(paramObj,allParam))){
                //对入参进行转换，动态参数放入到 conditions里
                propsObj = await loadApi({apiInfoKey:prop.propVal,paramObj:{...paramObj,...fieldOutParams},match:prop.relateVal,filterConnectionType:prop.filterConnectionType,filterFunc:prop.filterFunc}).then((d) => {
                  if (prop.propName && prop.propName in propsObj === false) {
                    propsObj = valueAdd(prop, propsObj, d);
                  }
                  return propsObj;
                })
              }
              else {
                propsObj = valueAdd(prop, propsObj, undefined);
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
      ...fetchStaticPropObj(props,undefined,componentInfo.props),
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
