package cn.wwwlike.generator;

import cn.wwwlike.form.IForm;
import cn.wwwlike.form.vo.FormVo;
import org.apache.commons.lang3.StringUtils;

import java.io.File;

/**
 * 创建后端三层结构代码
 * 支持覆盖
 */
public class GeneratorMvc {
    public void clear(FormVo formVo){
    }
    public static String  targetDirectory = "vlife-admin/src/main/mvc";

    public static String  srcDirectory = "vlife-admin/src/main/java";

    //entity每次覆盖，指定生成到 srcDirectory目录下，这样queryDsl生成文件不怕被clear
    public static void create(String rootPackage,IForm form,String appKey,String dslEntityTragetDirectory){
        File apiInSrcMainJava=new File(srcDirectory+"/"+rootPackage.replace(".","/")+"/"+ StringUtils.capitalize(form.getType())+"Api.java");
        new EntityGenerator(rootPackage,form,srcDirectory).create(); //实体文件创建or覆盖
        new DslEntityGenerator(rootPackage,form,appKey,dslEntityTragetDirectory).create();//querydsl文件创建/覆盖
        if(!apiInSrcMainJava.exists()){ // 在mvc文件夹下就覆盖，在src文件夹下就跳过
            new DaoGenerator(rootPackage,form,targetDirectory).create();
            new ServiceGenerator(rootPackage,form,targetDirectory).create();
            new ApiGenerator(rootPackage,form,targetDirectory).create();
        }
    }
}
