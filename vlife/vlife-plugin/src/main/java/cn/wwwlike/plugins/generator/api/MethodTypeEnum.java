/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package cn.wwwlike.plugins.generator.api;

import cn.wwwlike.base.model.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import com.squareup.javapoet.MethodSpec;
import lombok.Getter;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import static cn.wwwlike.plugins.generator.api.Method.MethodContent;

import java.nio.file.Path;
import java.util.List;
/*
   delete("物理删除"),
   report("汇总统计"),
    count("总数查询"),
    list("列表查询"),
    update("修改"),
   add("新增"),*/
/**
 * 方法内容构造器：
 * 根据枚举内容来生成API的命名以及注解内容；
 * 全部应该根据配置属性来，不要有if(save)这种特例的写法。让构造器更加灵活通用
 */
@Getter
public enum MethodTypeEnum implements Method {
    //save commit paramsName===null ,则使用 对象名称小写代替
    save("保存","save", PostMapping.class, IdBean.class,null,IdBean.class,RequestBody.class,NAME_ALL,MethodContent.save),
    commit("提交","",PostMapping.class,IdBean.class,"dto",IdBean.class,RequestBody.class,NAME_KEY,MethodContent.save),
    //remove
    remove("逻辑删除","remove", DeleteMapping.class,String[].class,"ids",Long.class, RequestBody.class,NAME_PREFIX,MethodContent.remove),
    // query
    page("分页查询","page",GetMapping.class, PageQuery.class,"req",PageVo.class,null,NAME_ALL,MethodContent.page),
    list("列表查询","list",GetMapping.class, VlifeQuery.class,"req",List.class,null,NAME_ALL,MethodContent.list),
    get_one("单条查询","find",GetMapping.class, CustomQuery.class,"bean",IdBean.class,null,NAME_ALL,MethodContent.one),
    post_one("","",PostMapping.class, CustomQuery.class,"bean",IdBean.class,RequestBody.class,NAME_KEY,MethodContent.one),
    detail("明细查询","detail",GetMapping.class,String.class,"id",IdBean.class, PathVariable.class,NAME_ALL,MethodContent.detail);

    /**
     * 方法类型名称
     */
    String title;
    /**
     * 方法前缀名称
     */
    String prefix;
    /**
     * request请求注解类型
     */
    Class methodAnnotationClz;
    /**
     * 入参类型
     */
    Class paramsType;
    /**
     * 参数名
     */
    String paramsName;
    /**
     * 返回类型
     */
    Class returnType;
    /**
     * 入参参数注解
     */
    Class paramsAnnotationClz;
    /**
     * 方法名/请求地址的命名方式
     */
    String nameType="NAME_ALL";
    /**
     * 使用的方法体主函数的类型
     */
    MethodContent methodContent;

    MethodTypeEnum(String title,String prefix,Class methodAnnotationClz,
                   Class paramsType,String paramsName,Class returnType,
    Class paramsAnnotationClz,String nameType,MethodContent methodContent){
        this.title=title;
        this.prefix=prefix;
        this.methodAnnotationClz=methodAnnotationClz;
        this.paramsType=paramsType;
        this.paramsName=paramsName;
        this.returnType=returnType;
        this.paramsAnnotationClz=paramsAnnotationClz;
        this.nameType=nameType;
        this.methodContent=methodContent;
    }

    /**
     * 实际出参类型(数组长度大于索引1后面的为泛型内容)
     * 传入参数有值则希望与1.默认值进行组装(泛型)、2.覆盖默认的(默认是传入的接口父类)
     * 没转参数，3则直接使用默认的，4传入的和默认则用其中一个即可
     */
    @Override
    public Class[] realReturnType(Class out) {
        Class defOut=getReturnType();
        if(out==defOut){
            return ArrayUtils.toArray(out);
        }else if(out==null){
            return ArrayUtils.toArray(defOut);
        }else if(defOut.isInterface()&&defOut.isAssignableFrom(out)){
            return ArrayUtils.toArray(out);
        }else if(defOut.isInterface()&&!defOut.isAssignableFrom(out)){
            return ArrayUtils.toArray(defOut,out);
        }else{
            return ArrayUtils.toArray(defOut,out);
        }
    }

    /**
     * 实际入参类型；
     */
    @Override
    public  Class realParamsType(Class  in){
        if(in==null){
            return getParamsType();
        }else{
            return in;
        }
    }

    /*
     * 根据methodName多级路径风格的api地址
     */
    public String getPath(String methodName){
        String path="/"+methodName;
        if(this.getNameType().equals(NAME_ALL)){
            String key=StringUtils.uncapitalize(StringUtils.replaceIgnoreCase(methodName,getPrefix(),""));
            path="/"+getPrefix();
            if(StringUtils.isNotEmpty(key))
                path+="/"+key;
        }
        if(getParamsAnnotationClz()==PathVariable.class){
            path+="/{"+getParamsName()+"}";
        }
        return path;
    }

    /**
     * 方法命名
     */
    public <T extends Item>String methodName(Class<T> itemClz,Class in) {
        String name= ApiMethodCreate.filterKey(in.getSimpleName(),itemClz.getSimpleName());
        if(nameType==NAME_PREFIX){      /* 1. 使用前缀*/
            return this.getPrefix();
        }if(nameType==NAME_KEY){  /* 2. 使用过滤后的关键字*/
            if(StringUtils.isNotEmpty(name)){
                return StringUtils.uncapitalize(name);
            }
            return StringUtils.uncapitalize(itemClz.getSimpleName());/*无自定以名称则使用类名*/
        }
        return getPrefix()+(name!=null?StringUtils.capitalize(name):"");/* 前缀+关键字*/
    }



    @Override
    public String[] getMethodComment(String itemName, String inName, String returnName) {
        String[] restr=null;
        switch (getMethodContent()){
            case detail:restr=  new String[]{getTitle()+returnName,inName,returnName};break;
            case remove:{
                restr= new String[]{getTitle()+returnName,inName,"已删除数量"};
            }break;
            default: restr=new String[]{getTitle()+returnName,inName,returnName};
        }
        return restr;
    }


}
