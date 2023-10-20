import {  Result } from '@src/api/base';

//when条件是复杂逻辑的函数接口
export interface whenResult {
  (formData:any):boolean|Promise<Result<boolean>>
}

//数据对比模式
export enum FS_OPT{
  CHANGE,EQ,NE,LIKE,START_WITH,END_WITH,GT,GE,LT,LE,iSNULL,iSNOTNULL,INCLUDES,REGEX,
}

//比对类型
export enum FS_TYPE{
  field,//根据字段值比对
  model,//formily模型信息取值比对（暂未启用）
  result,//动态值结果
}
//取值属性
export enum FS_PROP{
  value,// 条件字段值
  size, //条件字段数组大小
  fetchData_type,// 字段异步请求数据，当前选中字段的数据类型（前提是该字段组件有异步请求，且请求的是formField[]）
  //待启用
  length, //条件字段值的长度
}

//设置 字段/属性
export enum FS_STATE{
  value, //设置值
  initialValue,//默认值
  display,//显示隐藏 visible hidden
  title,//标题
  required,//是否必填
  disabled,//是否禁用
  readOnly,//是否只读
  readPretty,//是否阅读状态
  editable,//字段可编辑
  description,//字段描述
  feedbacks,//提醒信息 
  fetch,//远程数据
  pattern,// 交互模式 'editable' | 'disabled' | 'readOnly' | 'readPretty'
  "x-decorator-props",
}

  //响应
export interface reaction{
    //状态
   state:FS_STATE;
    //匹配值(${})包裹的就是表达式;还可以传计算函数
   value: any;
}

/**
 * 动作
 * 执行到动作后则不能回到condition
 */
 export class VfAction{
    //所属的vf
    private _vf:VF;
    //响应的字段
    public fields:string[]=[];
    //是否条件满足时响应; undefined表示无需condition
    public fill:boolean=true;
    //响应内容
    public reations:reaction[]=[];

    getFields():string[]{
      return this.fields
    }
    getFill():boolean{
      return this.fill;
    }
    getReactions():reaction[]{
      return this.reations;
    }
    getVF():VF{
      return this._vf;
    }

  //   //级联属性类型
  //  public state:FS_STATE|undefined;
  //   //匹配值(${})包裹的就是表达式;还可以传计算函数
  //  public value: any;
   constructor(vf:VF,...fields:string[]){
      this._vf=vf;
      this.fill=true;
      this.fields=fields;
   }
  //  VF():VF{
  //     return this._vf;
  //  }

   then(...fields:string[]):VfAction{
    let f=fields;
    if(f===undefined||f.length===0){
      f=this.fields;
    }
    const va=new VfAction(this._vf,...f);
    va.fill=true;
    this.getVF().getActions().push(va);
    return va;
   }
   //不满足情况下执行
   otherwise(...fields:string[]):VfAction{
    const va=this.then(...fields);
    va.fill=false;//不满足时响应
    return va;
  }
  // fetch,//远程数据
  value(value:any):VfAction{
    this.reations.push({
      state:FS_STATE.value,value
    })
    return this;
  }
  //默认值
  default(value:any):VfAction{
    this.reations.push({
      state:FS_STATE.initialValue,value
    })
    return this;
  }
  selected():VfAction{
    this.reations.push({
      state:FS_STATE['x-decorator-props'],value:{style:{
        backgroundColor:"rgba(33, 150, 243, 0.15)",
      }}
    })
    return this;
  } 

  clearValue():VfAction{
    this.reations.push({
      state:FS_STATE.value,value:null
    })
    return this;
  }
  title(value:string):VfAction{
    this.reations.push({
      state:FS_STATE.title,value
    })
    return this;
  }
  //清除提醒
  clearFeedback():VfAction{
    this.reations.push({
      state:FS_STATE.feedbacks,value:[]
    })
    return this;
  }
  //否则情况是否的判断依据
  otherwiseExec(otherwiseFlag?:boolean):boolean{
    return (otherwiseFlag??true)&&(this.getVF().getResult()!==undefined||this.getVF().getAllConditions().length>0);
  }

  //增加提醒
  feedback(msg:string):VfAction{
    this.reations.push({
      state:FS_STATE.feedbacks,value:[ {
              code: "ValidateError",
              type: "error",
              messages: [msg],
            }]
    })
    this.otherwise(...this.fields).clearFeedback();
    return this;
  }
  //必填
  required(otherwiseFlag?:boolean):VfAction{
    this.reations.push({
      state:FS_STATE.required,value:true
    })
    if(this.otherwiseExec(otherwiseFlag)){
      this.otherwise(...this.fields).optional(false);
    }
    return this;
  }
  //非必填，可选
  optional(otherwiseFlag?:boolean):VfAction{
    this.reations.push({
      state:FS_STATE.required,value:false
    })
    if(this.otherwiseExec(otherwiseFlag)){
      this.otherwise(...this.fields).required(false);
    }
    return this;
  }
  disabled(otherwiseFlag?:boolean):VfAction{
    this.reations.push({
      state:FS_STATE.disabled,value:true
    })
    if(this.otherwiseExec(otherwiseFlag)){
      this.otherwise(...this.fields).enabled(false);
    }
    return this;
  }
  enabled(otherwiseFlag?:boolean):VfAction{
    this.reations.push({
      state:FS_STATE.disabled,value:false
    })
    if(this.otherwiseExec(otherwiseFlag)){
    this.otherwise(...this.fields).disabled(false);
    }
    return this;
  }
  /** 响应操作 */
  hide(otherwiseFlag?:boolean):VfAction{
    this.reations.push({
      state:FS_STATE.display,
      value:"hidden"
    })
    if(this.otherwiseExec(otherwiseFlag)){
      this.otherwise(...this.fields).show(false);
    }
    return this;
  }
  show(otherwiseFlag?:boolean):VfAction{
    this.reations.push({
      state:FS_STATE.display,
      value:"visible"
    })
    if(this.otherwiseExec(otherwiseFlag)){
      this.otherwise(...this.fields).hide(false);
    }
    return this;
  }
  readPretty(otherwiseFlag?:boolean){ 
    this.reations.push({
      state:FS_STATE.readPretty,
      value:"readPretty"
    })
    if(this.otherwiseExec(otherwiseFlag)){
      this.otherwise(...this.fields).editable(false);
    }
    return this;
  }
  editable(otherwiseFlag?:boolean){
    this.reations.push({
      state:FS_STATE.editable,
      value:"editable"
    })
    if(this.otherwiseExec(otherwiseFlag)){
      this.otherwise(...this.fields).readPretty(false);
    }
    return this;
  }
  description(val:string){
    this.reations.push({
      state:FS_STATE.description,
      value:val
    })
    return this;
  }
}

/**
 * 条件
 */
 export class VfCondition{
  /**
   * 所属vf
   */
  private _vf:VF;
  /**
   * 操作字段名
   */
  public field:string;
  //匹配属性，左边属性，value,对比 field表单上属性，formily对象
  public prop:FS_PROP|undefined;
  //匹配方式
  public opt:FS_OPT|undefined;
  //以下二选一
  public value: Object=new Object();

  public getField():string{
    return this.field;
  }
  public getValue():any|undefined{
    return this.value;
  }
  public getOpt():FS_OPT|undefined{
    return this.opt;
  }
  public getProp():FS_PROP|undefined{
    return this.prop;
  }

  constructor(vf:VF,field:string){
    this._vf=vf
    this.field=field;
  }

  /**    ---------------字段的指定属性------------------ */
  size():VfCondition{
    this.prop=FS_PROP.size;
    return this;
  }

  public change():VF{
    this.opt=FS_OPT.CHANGE;
    return this._vf;
  }

  /**    ---------------比对方式------------------ */
  public eq(val:any):VF{
    this.opt=FS_OPT.EQ;
   this.value=val;
    return this._vf;
  }
  ne(val: any): VF {
    this.opt=FS_OPT.NE;
   this.value=val;
    return this._vf;
  }
  gt(val: Number): VF {
    this.opt=FS_OPT.GT;
   this.value=val;
    return this._vf;
  }
  ge(val: Number): VF {
    this.opt=FS_OPT.GE;
   this.value=val;
    return this._vf;
  }
  lt(val: Number): VF {
    this.opt=FS_OPT.LT;
   this.value=val;
    return this._vf;
  }
  le(val: Number): VF {
    this.opt=FS_OPT.LE;
    this.value=val;
    return this._vf;
  }
  isNotNull(): VF {
    this.opt=FS_OPT.iSNOTNULL;
    return this._vf;
   }
   isNull(): VF {
    this.opt=FS_OPT.iSNULL;
    return this._vf;
   }
   includes(val:any[]):VF{
    this.opt=FS_OPT.INCLUDES;
    this.value=val;
    return this._vf;
   }
   regex(regex:RegExp):VF{
    this.opt=FS_OPT.REGEX;
    this.value=regex;
    return this._vf;
   }
   endsWidth(val:any):VF{
    this.opt=FS_OPT.END_WITH;
    this.value=val;
    return this._vf;
   }
   startsWidth(val:any):VF{
    this.opt=FS_OPT.START_WITH;
    this.value=val;
    return this._vf;
   }
 }

export class VF{
  /**
   * 作用于字段
   */
  public subField:string|undefined;
  /**
   * 一个全局是否满足判断的条件的函数
   */
   public result:whenResult|boolean|undefined;
  /**
   * 条件集合
   */
   public conditions:VfCondition[]=[];

   /**
    * 条件连接方式
    */
   public conn:"and"|"or"="and";
   /**
    * 响应内容
    */
    public actions:VfAction[]=[];


   //所有条件
   public getAllConditions():VfCondition[]{
    return this.conditions;
   }
   //所有响应
   public getActions():VfAction[]{
    return this.actions;
   }

   public clearActions(){
    return this.actions=[];
   }

   public getResult():whenResult|boolean|undefined{
    return this.result;
   }

   public getConn():"and"|"or"{
    return this.conn;
   }
   public getField():string|undefined{
    return this.subField;
   }

   constructor(subField?:string){
    if(subField){
      this.subField=subField
    }
   }

   /**
    * 1 主表静态条件联动 
    * 根据condition条件字段构造
    * @param f 条件字段
    */
  static field(f:string):VfCondition{
    const vf=new VF("");
    const vc=new VfCondition(vf,f);
    vf.conditions.push(vc);
    return vc;
  }

  /**
   * 2 主表动态条件联动
   * 根据结果(表达式值boolean|boolean函数结果|promise<Result<boolean>>函数结果)进行级联响应动作 
   * @param result 
   * @param watchField 监听的字段（这些字段发生变化触发联动）
   * @returns 
   */
  static result(result:boolean|whenResult,...watchField:string[]):VF{
    const  obj= new VF("");
    obj.result=result;
    obj.conn="and";
    return obj
  }

  /**
   * 3子表静态条件联动
   * @param subName 子表名
   * @param field 子表字段
   * @returns 
   */
   static subField(subName:string,field:string):VfCondition{
    const vf=new VF(subName);
    const vc=new VfCondition(vf,field);
    vf.conditions.push(vc);
  
    return vc;
  }
  
  /**
   * 4子表的动态条件联动
   * @param result 
   * @returns 
   */
   static subResult(subName:string,result:boolean|whenResult):VF{
    const  obj= new VF(subName);
    obj.result=result;
    obj.conn="and";
    return obj
  }


  /**
   * 3 直接设置执行字段响应(无条件)
   */
  static then(...f:string[]):VfAction{
    const vf=new VF("");
    const va=new VfAction(vf,...f);
    vf.getActions().push(va);
    return va;
  }

  /**
   * 子表设置
   * @param subName 子表字段 
   * @returns 
   */
    static subThen(subName:string,...f:string[]):VfAction{
      const vf=new VF(subName);
      const va=new VfAction(vf,...f);
      vf.getActions().push(va);
      return va;
    }

  then (...f:string[]):VfAction{
    const va=new VfAction(this,...f);
    this.getActions().push(va);
    return va;
  }
  and(f:string):VfCondition{
    const vc=new VfCondition(this,f);
    this.getAllConditions().push(vc);
    this.conn="and"
    return vc;
  }

  or(f:string):VfCondition{
    const vc=new VfCondition(this,f);
    this.getAllConditions().push(vc);
    this.conn="or"
    return vc;
  }

}