package cn.vlife.generator;
import cn.vlife.common.IForm;
import com.squareup.javapoet.JavaFile;
import lombok.Data;

import java.io.File;
import java.io.IOException;
import java.util.Date;

@Data
public abstract class ICrudCodeCreate  {
    public String  fileComment(){
        return "请访问http://vlife.cc解锁更多;工作流、图表等设计器引擎插件请关注专业版/企业版";
    }
    public String packageName;//包名
    public IForm publihModel;//当前发布模型
    public IForm entityModel; //实体模型
    public String  targetDirectory;

    public  ICrudCodeCreate(String packageName, IForm publihModel,String targetDirectory){
        String typeClass=publihModel.getTypeClass();
        if(packageName==null&&typeClass!=null){
            this.packageName=typeClass.substring(0,typeClass.indexOf("."+publihModel.getItemType()+"."));
        }else{
            this.packageName=packageName;
        }
        this.publihModel=publihModel;
        this.entityModel=publihModel;
        this.targetDirectory=targetDirectory;
    }

    public  ICrudCodeCreate(String packageName, IForm publihModel,IForm entityModel,String targetDirectory){
        this.packageName=packageName;
        this.publihModel=publihModel;
        this.entityModel=entityModel;
        this.targetDirectory=targetDirectory;
    }

    public static Class getJavaTypeClass(String javaType){
        Class javaTypeClazz=null;
        if(javaType.indexOf(".")!=-1){
            try {
                javaTypeClazz=  Class.forName(javaType);
            } catch (ClassNotFoundException e) {
                //有包路径，但是还不存在，说明还未发布
                return null;
            }
        }
        if(javaType.equals("string")||javaType.equals("text")){
            javaTypeClazz=String.class;
        }else if (javaType.equals("double")){
            javaTypeClazz=Double.class;
        }else if (javaType.equals("long")){
            javaTypeClazz=Long.class;
        }else if (javaType.equals("int")){
            javaTypeClazz=Integer.class;
        }else if (javaType.equals("date")){
            javaTypeClazz= Date.class;
        }else if (javaType.equals("boolean")){
            javaTypeClazz=boolean.class;
        }
        return javaTypeClazz;
    }
    /**
     * 生成到当前module的源文件目录下
     */
    public  File generateJavaFile(JavaFile javaFile) throws IOException {
        File dir = new File(targetDirectory);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        javaFile.writeTo(dir);
        return new File(targetDirectory+"/"+javaFile.toJavaFileObject().toUri());
    }
    public abstract File  create();

}
