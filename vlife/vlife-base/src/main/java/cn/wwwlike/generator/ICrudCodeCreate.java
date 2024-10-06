package cn.wwwlike.generator;

import cn.wwwlike.form.IForm;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.vo.FormVo;
import com.squareup.javapoet.JavaFile;
import lombok.Data;

import java.io.File;
import java.io.IOException;

@Data
public abstract class ICrudCodeCreate  {
//    public static String targetDirectory = "vlife-admin/custom";'
    public String packageName;
    public IForm formVo;
    public String  targetDirectory = "vlife-admin/src/main/mvc";

    public  ICrudCodeCreate(String packageName, IForm iForm){
        this.packageName=packageName;
        this.formVo=iForm;
    }

    public  ICrudCodeCreate(String packageName, IForm iForm,String targetDirectory){
        this.packageName=packageName;
        this.formVo=iForm;
        this.targetDirectory=targetDirectory;
    }
    /**
     * 生成到当前module的源文件目录下
     */
    public  void generateJavaFIle(JavaFile javaFile) throws IOException {
        File dir = new File(targetDirectory);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        javaFile.writeTo(dir);
    }
    public abstract void  create();

}
