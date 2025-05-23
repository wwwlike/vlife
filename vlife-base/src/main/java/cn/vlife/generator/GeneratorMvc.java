package cn.vlife.generator;

import cn.vlife.common.IForm;
import cn.wwwlike.vlife.dict.VCT;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.util.List;

/**
 * 创建后端三层结构代码
 * 支持覆盖
 */
public class GeneratorMvc {
    public static String  srcDirectory = "vlife-admin/src/main/java"; //
    public static String dslEntityTragetDirectory="vlife-admin/target/generated-sources/java";
    /**
     * 实体模型发布
     * 返回api文件
     */
    public static<T extends IForm> File  entityCreate(T entityModel){
        String rootPackage=entityModel.getTypeClass().replace(".entity."+StringUtils.capitalize(entityModel.getType()),"");
        File apiFile=new File(srcDirectory+"/"+rootPackage.replace(".","/")+"/api/"+ StringUtils.capitalize(entityModel.getType())+"Api.java");
        new EntityGenerator(rootPackage,entityModel,srcDirectory).create(); //实体文件创建or覆盖
        new DslEntityGenerator(rootPackage,entityModel,dslEntityTragetDirectory).create();//querydsl文件创建/覆盖
        if(!apiFile.exists()){
            apiFile=  new ApiGenerator(rootPackage,entityModel,srcDirectory).create();
            new DaoGenerator(rootPackage,entityModel,srcDirectory).create();
            new ServiceGenerator(rootPackage,entityModel,srcDirectory).create();
        }
        return apiFile;
    }

    /**
     * dto模型发布通知更新api
     * 返回api文件
     */
    public static File dtoCreate(IForm publishModel,IForm entityModel){
        String entityTypeClass=entityModel.getTypeClass();
        String rootPackage=entityTypeClass.substring(0,entityTypeClass.indexOf(".entity."));
        File apiFile=new File(srcDirectory+"/"+rootPackage.replace(".","/")+"/api/"+ StringUtils.capitalize(publishModel.getType())+"Api.java");
        new DtoGenerator(rootPackage,publishModel,entityModel,srcDirectory).create(); //模型覆盖
        if(!apiFile.exists()){
            apiFile=new DtoApiGenerator(rootPackage,publishModel,entityModel,srcDirectory).create(); //api覆盖
        }
        return  apiFile;
    }

    /**
     * api单独发布
     * 返回api文件
     */
    public static File apiCreate( IForm entityModel, List<? extends IForm> dtos){
        return new ApiGenerator(null,entityModel,srcDirectory).create();
    }



    //未发布成功模型的Java类文件删除
    public static<T extends IForm> void remove(T form){
        String classEntity=StringUtils.capitalize(form.getType());
        String modelPath=srcDirectory+"/"+form.getTypeClass().replace(".","/");//模型地址
        if(VCT.MODEL_TYPE.ENTITY.equals(form.getItemType())){
            //实体类级联类删除
            String QEntityPath=(dslEntityTragetDirectory+"/"+form.getTypeClass().replace(".","/")+".java").replace(classEntity,"Q"+classEntity);
            File apiFile=new File(modelPath.replace("/entity/","/api/")+"Api.java");
            File serviceFile=new File(modelPath.replace("/entity/","/service/")+"Service.java");
            File daoFile=new File(modelPath.replace("/entity/","/dao/")+"Dao.java");
            File dslEntityFile=new File(QEntityPath);
            if(apiFile.exists()){
                apiFile.delete();
            }
            if(serviceFile.exists()){
                serviceFile.delete();
            }
            if(daoFile.exists()){
                daoFile.delete();
            }
            if(dslEntityFile.exists()){
                dslEntityFile.delete();
            }
        }else if(VCT.MODEL_TYPE.DTO.equals(form.getItemType())){
            //dto级联类删除
            File apiFile=new File(modelPath.replace("/dto/","/api/")+"Api.java");
            if(apiFile.exists()){
                apiFile.delete();
            }
        }
        File  modelFile=new File(modelPath+".java");
        if(modelFile.exists()){
            modelFile.delete();
        }
    }

}
