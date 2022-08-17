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

package cn.wwwlike.plugins.generator;

import cn.wwwlike.base.common.RequestTypeEnum;
import cn.wwwlike.plugins.generator.api.ApiMethodCreate;
import cn.wwwlike.plugins.generator.api.Method;
import cn.wwwlike.plugins.generator.api.MethodTypeEnum;
import cn.wwwlike.plugins.utils.FileUtil;
import cn.wwwlike.vlife.annotation.VClazz;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.objship.dto.*;
import cn.wwwlike.vlife.query.req.PageQuery;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.lang.model.element.Modifier;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * api智能生成逻辑
 * 1. 查询：一个req产生一个查询方法，没有req则产生 pageVo<Item>的默认分页方法
 * 1.1 req是page； 则返回的是 Page(VO)
 *     VO的优先级为 1关键字一样； 2EntityVO,3entity,4没有使用过的VO。
 *
 * 2. 明细：一个api一个或者多个detail方法，根据id查询
 *  2.1 有一个detail则产生一个detail方法
 *  2.2 无detail则产生实体类的方法
 *
 * 3. 保存: 一个entity,dto产生一个save方法
 *   3.1 eneity->save方法
 *   3.2 saveDto-> xxxSave方法
 *
 *
 *
 */
 public class GeneratorAutoApi {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    /**
     * 当前操作的实体类信息
     */
    private Class<? extends Item> item =null;
    private EntityDto itemDto=null;

    public JavaFile apiGenerator(EntityDto itemDto, List<VoDto> vos, List<ReqDto> reqs, List<SaveDto> saves) {
        this.itemDto=itemDto;
        this.item = itemDto.getClz();
        /*step1类对象信息过滤：req,vo,dto */
        List<ReqDto> reqDtos = reqs.stream().filter(req -> {
            return req.getEntityClz() == item;
        }).collect(Collectors.toList());
        List<VoDto> voDtos = vos.stream().filter(vo -> {
            return vo.getEntityClz() == item;
        }).collect(Collectors.toList());
        List<SaveDto> saveDtos = saves.stream().filter(save -> {
            return save.getEntityClz() == item;
        }).collect(Collectors.toList());
        /* step2 api上的关键信息构造：超类/包名/注释/注解等 */
        String packageName = item.getPackage().getName();//实体类包名
        int index = packageName.lastIndexOf("entity");
        String servicePackageName = packageName.substring(0, index) + "service";
        String apiPackageName = packageName.substring(0, index) + "api";
        ClassName superClazz = ClassName.get(VLifeApi.class);//父类
        TypeName itemName = TypeName.get(item); //实体类
        ClassName serviceName = ClassName.get(servicePackageName, item.getSimpleName() + "Service");//service类
        ParameterizedTypeName superClzAndGenic = ParameterizedTypeName.get(superClazz, itemName, serviceName);//api的类的泛型
        AnnotationSpec.Builder anBuilder = AnnotationSpec.builder(RequestMapping.class)
                .addMember("value", "\"/" + StringUtils.uncapitalize(item.getSimpleName()) + "\"");
        CodeBlock.Builder classComment = CodeBlock.builder();
        Class masterVo=compMasterVo(voDtos,item.getSimpleName());
        classComment.addStatement(itemDto.getTitle() + "接口");
        List<MethodSpec> methodSpecs = new ArrayList<>();
        /* step3 3.1 查询方法 ，一个DTO创建一个查询方法 */
        methodSpecs.addAll(createQueryMethod(reqDtos,voDtos,masterVo));
        /* step3 3.2 保存方法 ，一个DTO创建一个SAVE方法 */
        methodSpecs.addAll(createSaveMethod(saveDtos));
        /* step3 3.3 明细方法 根据ID返回单条结果 */
        methodSpecs.addAll(createDetailMethod(voDtos,item,masterVo));
        /*step3 3.4 删除方法，一个逻辑删除方法*/
        methodSpecs.add(ApiMethodCreate.createMethod(MethodTypeEnum.remove,item));
        TypeSpec apiClazz = TypeSpec.classBuilder(item.getSimpleName() + "Api")
                .addModifiers(Modifier.PUBLIC)
                .addJavadoc(classComment.build())
                .addAnnotation(RestController.class)
                .addAnnotation(anBuilder.build())
                .superclass(superClzAndGenic)
                .addMethods(methodSpecs)
                .build();
        JavaFile javaFile = JavaFile.builder(apiPackageName, apiClazz).build();
        return javaFile;
    }

    /**
     * 创建查询方法
     * 没有查询条件(REQ)则无法产生列表、分页类型的查询方法
     */
    private List<MethodSpec> createQueryMethod(List<ReqDto> reqDtos,List<VoDto> voDtos,Class masterVo){
        List<MethodSpec> methodSpecs = new ArrayList<>();
        reqDtos.stream().forEach(req -> {
            VClazz vClazz=(VClazz) req.getClz().getAnnotation(VClazz.class);
            Method method=null;
            boolean pageQuery=PageQuery.class.isAssignableFrom(req.getClz());
            if(vClazz==null||vClazz.requestType()== RequestTypeEnum.NULL){
                method=pageQuery?MethodTypeEnum.page:MethodTypeEnum.list;
            }else{
                switch (vClazz.requestType()){
                    /*把默认查询list,查询page get方式的查询，支持注解改成post查询并仅返回一条记录 ,这里绑定了MethodTypeEnum 不优雅*/
                    case POST_ONE:method=MethodTypeEnum.post_one;break;//类似登录提交，路径和查询的有区别
                    case GET_ONE:method=MethodTypeEnum.get_one;break;
                    default:
                        method=pageQuery?MethodTypeEnum.page:MethodTypeEnum.list;
                }
            }
            Class voClz=compVoReturnClz(req,voDtos,masterVo);
            methodSpecs.add(ApiMethodCreate.createMethod(method
                    ,item,req.getClz(),voClz));
        });
        return methodSpecs;
    }


    /**
     * 创建保存类方法
     */
    private List<MethodSpec> createSaveMethod(List<SaveDto> saveDtos){
        List<MethodSpec> methodSpecs = new ArrayList<>();
        saveDtos.forEach(dto->{
            VClazz vClazz=(VClazz) dto.getClz().getAnnotation(VClazz.class);
            Method method=null;
            if(vClazz==null||vClazz.requestType()!=RequestTypeEnum.SAVE_CustomName){
                methodSpecs.add(ApiMethodCreate.createMethod(MethodTypeEnum.save
                        ,item,dto.clz,dto.clz));
            }else{
                methodSpecs.add(ApiMethodCreate.createMethod(MethodTypeEnum.commit
                        ,item,dto.clz,dto.clz));
            }
        });
        if(methodSpecs.size()==0){
            methodSpecs.add(ApiMethodCreate.createMethod(MethodTypeEnum.save
                    ,item,item,item));
        }
        return methodSpecs;
    }


    /**
     * 创建明细方法，优先级：
     * 1. vo里包含detail关键子的，有一个则创建一个，完成后则不进行其他vo的创建
     * 2. 根据vo.getFields()里detail的数量来决定 ，有关联表多的可以当作detail（待完成）为1则不启用
     * 3. 用entity当返回值
     */
    private List<MethodSpec> createDetailMethod(List<VoDto> voDtos,Class<? extends Item> item,Class masterVo){
        List<MethodSpec> methodSpecs = new ArrayList<>();
        voDtos.stream().filter(voDto -> {
            return StringUtils.indexOfIgnoreCase(voDto.getType(),"detail")!=-1;
        }).forEach(dto->{
            methodSpecs.add(ApiMethodCreate.createMethod(MethodTypeEnum.detail
                    ,item,String.class,dto.clz));
        });
        if(methodSpecs.size()==0&&masterVo!=null){
            methodSpecs.add(ApiMethodCreate.createMethod(MethodTypeEnum.detail
                    ,item,String.class,masterVo));
        }
        if(methodSpecs.size()==0){
            methodSpecs.add(ApiMethodCreate.createMethod(MethodTypeEnum.detail
                    ,item,String.class,item));
        }
        return methodSpecs;
    }

    /**
     * 主要的vo对象 -> itemName+"Vo"
     */
    public Class compMasterVo(List<VoDto> voDtos,String itemName){
        for(VoDto vo:voDtos){
            String voName=vo.getClz().getSimpleName();
            if(voName.equalsIgnoreCase(itemName+"Vo")){
                return vo.getClz(); //过滤都为null则是masterVO
            }
        }
        return null;
    }

    /**
     * 传入查询条件Req从VODtos里找到最合适的结果进行匹配
     * 1. 无VO则用实体模型
     * 2. 注解匹配： 注解里给的类名
     * 3. 关键字匹配：关键字一样
     * 4. 使用itemVO： 关键字里只有实体类名和VO
     * 5. 使用entity： 使用实体类名
     * @return
     */
    private  Class compVoReturnClz(ReqDto req,List<VoDto> voDtos,Class masterVo){
        //case1
        if(voDtos==null||voDtos.size()==0){
            return  item;
        }
        //case2
        VClazz v=req.getClz().getAnnotation(VClazz.class);
        if(v!=null&&v.returnType()!=Object.class){
            Class returnType=v.returnType();
            if(Item.class.isAssignableFrom(returnType)||VoBean.class.isAssignableFrom(returnType)){
                return returnType;
            }/**查询的出参既不是item,也不是voBean则异常**/
            logger.error(req.getClz().getSimpleName()+"  VClazz[returnType] is setting error!");
        }
        /* case3*/
        if(req!=null){
            String itemName=item.getSimpleName();
            String key=ApiMethodCreate.filterKey(req.getClz().getSimpleName(),itemName);
            for(VoDto vo:voDtos){
                String voName=vo.getClz().getSimpleName();
                String voKey=ApiMethodCreate.filterKey(voName,itemName);
                if(StringUtils.isNotEmpty(key)&&key.equalsIgnoreCase(voKey)){
                    return vo.getClz();
                }
            }
        }
        // case4
        if(masterVo!=null){
            return masterVo; // itemNameVo
        }
        // case5
        return item;
    }
}
