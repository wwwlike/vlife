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

import cn.wwwlike.vlife.base.IModel;
import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;

import static  cn.wwwlike.plugins.generator.api.Method.MethodContent;
import javax.lang.model.element.Modifier;
import java.util.Optional;

/**
 * 类说明
 *
 * @author xiaoyu
 * @date 2022/6/29
 */
public class ApiMethodCreate {

    public static MethodSpec createMethod(Method methodEnum,
                                          Class<? extends Item> itemClz){
        return createMethod(methodEnum,itemClz,methodEnum.getParamsType(),methodEnum.getReturnType());
    }
    /**
     * @param methodEnum default构造方法的名称
     * @param itemClz 实体类信息
     */
    public static MethodSpec createMethod(Method methodEnum,
                                          Class<? extends Item> itemClz, Class in ,Class out){
        String methodName =null;
        if(IdBean.class.isAssignableFrom(itemClz)&& IdBean.class.isAssignableFrom((in))){
            methodName=  itemClz==in?methodEnum.getPrefix():methodEnum.getPrefix()+in.getSimpleName();
        }else{
            methodName=methodEnum.getPrefix();
        }
        //方法体
        //入参名
        String paramsName= StringUtils.uncapitalize(methodEnum.getParamsName()==null?in.getSimpleName():methodEnum.getParamsName());

        MethodSpec.Builder methodSpec = MethodSpec.methodBuilder(methodName)
                .addModifiers(Modifier.PUBLIC);
        //注释
        String[] commonts=methodComment(methodEnum,itemClz,in,out);
        BeanDto dto=null;
        CodeBlock.Builder methodComment = CodeBlock.builder();
        methodComment.add(commonts[0] + "\n");
        methodComment.add("@param "+paramsName+" "+commonts[1]+ "\n");
        methodComment.add("@return "+commonts[2]+ "\n");
        //返回类型
        Class[] returnClz=methodEnum.realReturnType(out);//临时的
        TypeName returnGenic =null;
        if(returnClz.length==2){//带泛型
            TypeName returnTypeName = TypeName.get(returnClz[1]);
            returnGenic= ParameterizedTypeName.get(ClassName.get(returnClz[0]), returnTypeName);
        }else{
            returnGenic = TypeName.get(returnClz[0]);
        }
        //入参
        ParameterSpec.Builder inSpec = ParameterSpec.builder(methodEnum.realParamsType(in),paramsName);
        //参数前加注解
        if(methodEnum.getParamsAnnotationClz()!=null){
            AnnotationSpec.Builder pathAnnotation = AnnotationSpec.builder(methodEnum.getParamsAnnotationClz());
            inSpec.addAnnotation(pathAnnotation.build());
        }
        methodSpec.addParameter(inSpec.build());
        //方法的注解
        AnnotationSpec.Builder methodAnnotation = AnnotationSpec.builder(methodAnnotation(in,methodEnum));
        methodAnnotation.addMember("value", "\"" + methodEnum.getPath(methodName) + "\"");
        MethodContent mtype= methodEnum.getMethodContent();
        if(MethodContent.save==mtype){
            if(Item.class.isAssignableFrom((in))){
                methodSpec.addStatement("return service.save("+paramsName+")");
            }else{
                methodSpec.addStatement("return service.save("+paramsName+",true)");
            }
        }else if(mtype==MethodContent.remove){
            methodSpec.addStatement("return service.remove("+paramsName+")");
        }else if(mtype==MethodContent.page&&Item.class.isAssignableFrom(out)){
            methodSpec.addStatement("return service.findPage("+methodEnum.getParamsName()+")");
        }else if(mtype==MethodContent.page&& VoBean.class.isAssignableFrom(out)){
            methodSpec.addStatement("return service.queryPage("+out.getSimpleName()+".class,"+methodEnum.getParamsName()+")");
        }else if(mtype==MethodContent.list&&Item.class.isAssignableFrom(out)) {
            methodSpec.addStatement("return service.find("+methodEnum.getParamsName()+")");
        }else if(mtype==MethodContent.list&&VoBean.class.isAssignableFrom(out)) {
            methodSpec.addStatement("return service.query("+out.getSimpleName()+".class,"+methodEnum.getParamsName()+")");
        }else if(mtype==MethodContent.one&&Item.class.isAssignableFrom(out)) {
            methodSpec.addStatement("List<"+out.getSimpleName()+"> list=service.find("+methodEnum.getParamsName()+")");
            methodSpec.addStatement("return list.get(0)");
        }else if(mtype==MethodContent.one&&VoBean.class.isAssignableFrom(out)) {
            methodSpec.addStatement("List<"+out.getSimpleName()+"> list=service.query("+out.getSimpleName()+".class,"+methodEnum.getParamsName()+")");
            methodSpec.addStatement("return list.get(0)");
        }else if(mtype==MethodContent.detail&&Item.class.isAssignableFrom(out)) {
            methodSpec.addStatement("return service.findOne("+ methodEnum.getParamsName()+")");
        }else if(mtype==MethodContent.detail&&VoBean.class.isAssignableFrom(out)) {
            methodSpec.addStatement("return service.queryOne("+out.getSimpleName()+".class,"+methodEnum.getParamsName()+")");
        }

        //方法最后的构造
        methodSpec.returns(returnGenic)
                .addJavadoc(methodComment.build())
                .addAnnotation(methodAnnotation.build());

        return methodSpec.build();
    }

    /**
     * 过滤得到模型里除去类型、实体名称关键字后余下的模型名字
     * @param modelName 非实体模型名字
     * @param itemClzName 实体模型名字 accountVo
     * @return
     */
    public static String filterKey (String modelName,String itemClzName){
        String ends[]={"vo","dto","bean","pojo","req","do","query","request","page","detail","details","string","list"};
        String name=modelName;
        for(String str:ends){
            name= StringUtils.replaceIgnoreCase(name,str,"");
        }
        name= StringUtils.replaceIgnoreCase(name,itemClzName,"");
        return   name;
    }


    /**
     * 方法上的注释[0]方法注释[1]入参注释[2]出参注释
     */
    public static String[] methodComment(Method methodEnum,Class<? extends Item> item,Class param,Class out){
        EntityDto entityDto=GlobalData.entityDto(item);
        param=param==null?methodEnum.getParamsType():param;
        out=out==null?methodEnum.getReturnType():out;
        String itemName=entityDto.getTitle();
        String paramName="";
        String returnName="";
        BeanDto beanDto=null;
        if(IModel.class.isAssignableFrom(param)&&GlobalData.get(param)!=null){
            beanDto=GlobalData.get(param);
            paramName=beanDto.getTitle();
        }else{/*取得属性名称*/
            String paramProperty=methodEnum.getParamsName();
            Optional<FieldDto> optional= entityDto.getFields().stream().filter(fieldDto->fieldDto.getFieldName().equalsIgnoreCase(paramProperty)).findFirst();
            if(optional.isPresent()){
              paramName=optional.get().getTitle();
            }
        }
        if(IModel.class.isAssignableFrom(out)){
            beanDto=GlobalData.get(out);
            returnName=beanDto.getTitle();
        }
        return methodEnum.getMethodComment(itemName,paramName,returnName);
    }


    /**
     * 方法上使用的注解
     * 入参里有VClazz里有则覆盖MethodEnum里默认的
     * @return
     */
    private static Class methodAnnotation(Class in,Method methodEnum){
        return methodEnum.getMethodAnnotationClz();
//        //方法上是否有注解
//        VClazz inClz=(VClazz) in.getAnnotation(VClazz.class);
//        if(inClz==null||inClz.requestType()== RequestTypeEnum.NULL){
//            return methodEnum.getMethodAnnotationClz();
//        }else{
//            if(inClz.requestType()== RequestTypeEnum.POST){
//                return PostMapping.class;
//            } else if(inClz.requestType()== RequestTypeEnum.GET){
//                return GetMapping.class;
//            }
//        }
    }
}
