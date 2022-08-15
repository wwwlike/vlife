
package cn.wwwlike.plugins;


import cn.wwwlike.plugins.utils.FileUtil;
import lombok.SneakyThrows;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.LifecyclePhase;
import org.apache.maven.plugins.annotations.Mojo;

import java.io.File;
import java.lang.reflect.Field;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
//@Mojo(name = "toTypeScript", defaultPhase = LifecyclePhase.NONE)
public class JavaToTypeScript extends AbstractMojo {

    //class加载器
    final static ClassLoader CLASS_LOADER = JavaToTypeScript.class.getClassLoader();
    //class根路径
    final static String BASE_PATH = CLASS_LOADER.getResource("").getPath().substring(1);
    //类型映射
    final static Map<String, String> TYPE_MAP = new HashMap<>();

    //super class
    static Class superClass;
    //super class 字段名集合
    static List<String> superClassFieldNameList = new ArrayList();

    static {
        TYPE_MAP.put("Integer", "number");
        TYPE_MAP.put("String", "string");
        TYPE_MAP.put("Date", "string");
        TYPE_MAP.put("DateTime", "string");
        TYPE_MAP.put("BigDecimal", "number");

        try {
            //基类
            superClass = CLASS_LOADER.loadClass("com.cai.orderingfood.common.base.BaseEntity");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }


    /**
     * 加载父类
     *
     * @return
     * @throws ClassNotFoundException
     */
    public static String loadSuperClass() throws ClassNotFoundException {
        try {
            List<String> fieldNameList = FieldUtils
                    .getAllFieldsList(superClass)
                    .stream()
                    .map(field -> field.getName())
                    .collect(Collectors.toList());
            superClassFieldNameList.addAll(fieldNameList);
            return getTypeScript(superClass, true);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    //转换类型
    public static String getTypeScript(Class clazz) {
        return getTypeScript(clazz, false);
    }

    //转换类型
    public static String getTypeScript(Class clazz, boolean isSupperClass) {
        String template = "interface =className= {\n=typeBody=\n}\n";
        if (Objects.nonNull(superClass) && !isSupperClass) {
            template = "interface =className= extends =superClassName= {\n=typeBody=\n}\n"
//                    .replaceAll("=superClassName=", "BaseDto");
                    .replaceAll("=superClassName=", superClass.getSimpleName());
        }
        String typeTemplate = "     // =remark=\n     =fieldName=?: =typeName=";
        //获取class全部的字段
        String typeBody = FieldUtils
                .getAllFieldsList(clazz)
                .stream()
                //只保留有set get方法的属性
                .filter((field) -> {
                    String fieldName = field.getName();
                    String setMethodName = "set" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
                    String getMethodName = "get" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
                    try {
                        clazz.getMethod(setMethodName, field.getType());
                        clazz.getMethod(getMethodName);
                        if (isSupperClass) {
                            return true;
                        }
                        //继续判断字段是否存在于父类基类
                        return !superClassFieldNameList.contains(field.getName());
                    } catch (NoSuchMethodException e) {
                        return false;
                    }
                })
                .map(field -> typeTemplate
                        .replaceAll("=fieldName=", field.getName())
                        .replaceAll("=typeName=", TYPE_MAP.get(field.getType().getSimpleName()))
                        .replaceAll("=remark=", getFieldRemark(field))
                )
                .collect(Collectors.joining("\n"));
        return template
                .replaceAll("=className=", clazz.getSimpleName())
                .replaceAll("=typeBody=", typeBody);
    }

    //获取字段注释
    public static String getFieldRemark(Field field) {
//        String remark = "";
//        try {
//            ApiModelProperty apiModelProperty = field.getAnnotation(ApiModelProperty.class);
//            if (Objects.nonNull(apiModelProperty)){
//                return apiModelProperty.value();
//            }
//        } catch (Throwable e) {
//            e.printStackTrace();
//        }
//        return remark;
        return  null;
    }

    //获取加载的所有class,并且加载到内存
    public static List<Class<?>> getAllClass(List<String> files) {
        String basePath = Paths.get(BASE_PATH).toString();
        return files.stream().map(filePath -> {
            filePath = Paths.get(filePath).toString();
            String packageName = filePath
                    .replace(basePath, "")
                    .substring(1)
                    .replaceAll("\\.class", "")
                    .replaceAll(File.separator + File.separator, ".");
            try {
                return CLASS_LOADER.loadClass(packageName);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
                return null;
            }
        }).filter(item -> Objects.nonNull(item)).collect(Collectors.toList());
    }

    //加载class文件
    public static List<String> getAllJavaFile(File file, List<String> files) {
        if (!file.isDirectory()) {
            return files;
        }
        file.listFiles((file1) -> {
            if (file1.isDirectory()) {
                getAllJavaFile(file1, files);
            } else {
                String name = file1.getName();
                if (name.toLowerCase().endsWith(".class")) {
                    files.add(file1.getAbsolutePath());
                }
            }
            return false;
        });
        return files;
    }

    @SneakyThrows
    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        String superClassTypeStr = loadSuperClass();
        String packageName = "com.cai.orderingfood.common.model.entity";
        URL url = CLASS_LOADER.getResource(packageName.replaceAll("\\.", "/"));
        //扫描包中的文件
        List<String> allJavaFile = getAllJavaFile(new File(url.getPath()), new ArrayList<String>());
        //把包中的class加载到内存中
        List<Class<?>> allClass = getAllClass(allJavaFile);
        //转换类型
        String result = allClass.stream().map(clazz -> getTypeScript(clazz)).collect(Collectors.joining("\n"));
        System.out.println(superClassTypeStr);
        System.out.println(result);

        //写入文件
        File file = new File(BASE_PATH + "type.d.ts");
        if(file.exists()){
            file.delete();
        }
        FileUtil.nioWriteFile(superClassTypeStr, BASE_PATH + "type.d.ts");

//        FileUtil.appendString(superClassTypeStr,file, Charset.defaultCharset());
//        FileUtil.appendString(result,file, Charset.defaultCharset());
    }
}

