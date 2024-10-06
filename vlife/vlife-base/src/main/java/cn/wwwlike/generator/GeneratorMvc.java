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

    //开发环境下可以create代码
    public static void create(String rootPackage,IForm form,String appKey,String dslEntityTragetDirectory){
        File entity=new File(srcDirectory+"/"+rootPackage.replace(".","/")+"/"+ StringUtils.capitalize(form.getType())+".java");
        new EntityGenerator(rootPackage,form,entity.exists()?srcDirectory:targetDirectory).create();
        new DslEntityGenerator(rootPackage,form,appKey,dslEntityTragetDirectory).create();
        if(!entity.exists()){
            new DaoGenerator(rootPackage,form,targetDirectory).create();
            new ServiceGenerator(rootPackage,form,targetDirectory).create();
            new ApiGenerator(rootPackage,form,targetDirectory).create();
        }
    }

}
