package cn.wwwlike.generator;

import cn.wwwlike.form.IForm;
import com.querydsl.core.types.PathMetadata;
import com.querydsl.core.types.PathMetadataFactory;
import com.querydsl.core.types.dsl.*;
import com.squareup.javapoet.*;
import org.apache.commons.lang3.StringUtils;

import javax.annotation.Generated;
import javax.lang.model.element.Modifier;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

public class DslEntityGenerator extends ICrudCodeCreate {

    public String appKey;

    public DslEntityGenerator(String packageName, IForm formVo) {
        super(packageName, formVo);
    }

    /**
     *
     * @param packageName main/java bbao'm     * @param formVo
     * @param targetDirectory
     */
    public DslEntityGenerator(String packageName, IForm formVo,String appKey, String targetDirectory) {
        super(packageName, formVo,targetDirectory);
        this.appKey=appKey;
    }
    @Override
    public void create() {
        List<FieldSpec> fieldSpecs = new ArrayList<>();
        formVo.getFields().forEach(f->{
            fieldSpecs.add( createField(f.getFieldName(),f.getJavaType()));
        });
        AnnotationSpec.Builder generated = AnnotationSpec.builder(Generated.class);
        generated.addMember("value","\"com.querydsl.codegen.EntitySerializer\"");
        String entityName= StringUtils.capitalize(formVo.getType());

        String thisClassName="Q"+entityName;
        List<MethodSpec> methodSpecs=new ArrayList<>();
        methodSpecs.add(methodSpec1(entityName));
        methodSpecs.add(methodSpec2(entityName));
        methodSpecs.add(methodSpec3(entityName,appKey));
        ClassName entity = ClassName.get(packageName+".entity",  entityName);
        ParameterizedTypeName superClzAndGenic = ParameterizedTypeName.get(ClassName.get(EntityPathBase.class),entity);
        ClassName qEntityClassName = ClassName.get(packageName+".entity", thisClassName); // Q类的名称
        ClassName dbEntityClassName = ClassName.bestGuess("cn.wwwlike.vlife.bean.QDbEntity");

        ClassName entityClassName = ClassName.bestGuess(packageName+".entity." + entityName);
        // 创建静态字段 sysUser
        FieldSpec entityField = FieldSpec.builder(qEntityClassName,StringUtils.uncapitalize( entityName), Modifier.PUBLIC, Modifier.STATIC, Modifier.FINAL)
                .initializer("new $T(\""+StringUtils.uncapitalize( entityName)+"\")", qEntityClassName)
                .build();
        // 添加固定字段 _super
        FieldSpec superField = FieldSpec.builder(dbEntityClassName, "_super", Modifier.PUBLIC, Modifier.FINAL)
                .initializer("new QDbEntity(this)")
                .build();
        // 随机生成一个正的 serialVersionUID，限制在0到10^10之间
        long serialVersionUID = Math.abs(new SecureRandom().nextLong() % 10000000000L); // 保留合理范围

        // 添加固定的 serialVersionUID 字段
        FieldSpec serialVersionUIDField = FieldSpec.builder(long.class, "serialVersionUID", Modifier.PRIVATE, Modifier.STATIC, Modifier.FINAL)
                .initializer("$L", serialVersionUID + "L") // 确保加上 L 后缀
                .build();


        TypeSpec dls = TypeSpec.classBuilder(thisClassName)
                .addModifiers(Modifier.PUBLIC)
                .addAnnotation(generated.build())
                .addField(serialVersionUIDField)
                .addField(entityField)
                .addField(superField)
                .addFields(fieldSpecs)
                .superclass(superClzAndGenic)
                .addMethods(methodSpecs)
//                .addStaticImport("com.querydsl.core.types.PathMetadataFactory.forVariable") // 添加静态导入
                .build();
        JavaFile javaFile = JavaFile.builder(getPackageName()+".entity", dls)
                .addStaticImport(PathMetadataFactory.class, "forVariable").build();


        try {
            generateJavaFIle(javaFile);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    // 创建字符串类型的 FieldSpec
    private static FieldSpec createField(String name,String javaType) {
       if(  javaType.equals("string")||javaType.equals("text")){
           return FieldSpec.builder(StringPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createString($S)", name)
                   .build();
       }else  if(javaType.equals("int")||javaType.equals("integer")){
//           public final NumberPath<Integer> loginNum = createNumber("loginNum", Integer.class);
           return FieldSpec.builder(NumberPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createNumber($S, $T.class)", name, Integer.class)
                   .build();
       }else  if(javaType.equals("double")){
           return FieldSpec.builder(NumberPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createNumber($S, $T.class)", name, Double.class)
                   .build();
       }else  if(javaType.equals("long")){
           return FieldSpec.builder(NumberPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createNumber($S, $T.class)", name, Long.class)
                   .build();
       } else  if(javaType.equals("date")){
//           public final DateTimePath<java.util.Date> modifyDate = createDateTime("modifyDate", java.util.Date.class);
           return FieldSpec.builder(DateTimePath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createDateTime($S, $T.class)", name, java.util.Date.class)
                   .build();
       }else  if(javaType.equals("date")){
//           public final DateTimePath<java.util.Date> modifyDate = createDateTime("modifyDate", java.util.Date.class);
           return FieldSpec.builder(DateTimePath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createDateTime($S, $T.class)", name, java.util.Date.class)
                   .build();
       }else  if(javaType.equals("boolean")){
           return FieldSpec.builder(BooleanPath.class, name, Modifier.PUBLIC, Modifier.FINAL)
                   .initializer("createBoolean($S)", name)
                   .build();
       }
        return null;
    }


    //构造方法1
    private MethodSpec methodSpec1(String entityName) {
        String variableName = "variable"; // 您可以根据实际需要修改这个参数名
        ClassName entityClassName = ClassName.bestGuess(packageName+".entity." + entityName);
        MethodSpec constructor = MethodSpec.constructorBuilder()
                .addModifiers(Modifier.PUBLIC)
                .addParameter(String.class, variableName)
                .addStatement("super($T.class, forVariable($L))", entityClassName, variableName)
                .build();
        return constructor;
    }

    //构造方法2
    private MethodSpec methodSpec2(String entityName) {
        String variableName = "metadata"; // 您可以根据实际需要修改这个参数名
        ClassName entityClassName = ClassName.bestGuess(packageName+".entity." + entityName);
        MethodSpec constructor = MethodSpec.constructorBuilder()
                .addModifiers(Modifier.PUBLIC)
                .addParameter(PathMetadata.class, variableName)
               .addStatement("super($T.class, $L)", entityClassName, variableName)
                .build();
        return constructor;
    }

    //构造方法3
    private MethodSpec methodSpec3(String entityName,String appKey) {
        String variableName = "path";
        ClassName entityClassName = ClassName.bestGuess("cn.vlife."+appKey+".entity." + entityName);
        ClassName pathClassName = ClassName.get("com.querydsl.core.types", "Path");
        // 创建构造方法
        MethodSpec constructor = MethodSpec.constructorBuilder()
                .addModifiers(Modifier.PUBLIC)
                .addParameter(ParameterSpec.builder(
                                ParameterizedTypeName.get(pathClassName, WildcardTypeName.subtypeOf(entityClassName)),
                                variableName)
                        .build())
                .addStatement("super($L.getType(), $L.getMetadata())", variableName, variableName)
                .build();

        return constructor;
    }
}



//    public QSysUser(String variable) {
//        super(SysUser.class, forVariable(variable));
//    }
//
//    public QSysUser(Path<? extends SysUser> path) {
//        super(path.getType(), path.getMetadata());
//    }
//
//    public QSysUser(PathMetadata metadata) {
//        super(SysUser.class, metadata);
//    }





//package cn.wwwlike.auth.entity;
//
//        import static com.querydsl.core.types.PathMetadataFactory.*;
//
//        import com.querydsl.core.types.dsl.*;
//
//        import com.querydsl.core.types.PathMetadata;
//        import javax.annotation.Generated;
//        import com.querydsl.core.types.Path;
//
//
///**
// * QSysUser is a Querydsl query type for SysUser
// */
//@Generated("com.querydsl.codegen.EntitySerializer")
//public class QSysUser extends EntityPathBase<SysUser> {
//
//    private static final long serialVersionUID = 2027141840L;
//
//    public static final cn.wwwlike.auth.entity.QSysUser sysUser = new cn.wwwlike.auth.entity.QSysUser("sysUser");
//
//    public final cn.wwwlike.vlife.bean.QDbEntity _super = new cn.wwwlike.vlife.bean.QDbEntity(this);
//
//    public final NumberPath<Integer> age = createNumber("age", Integer.class);
//
//    public final StringPath avatar = createString("avatar");
//
//    //inherited
//    public final DateTimePath<Date> createDate = _super.createDate;
//
//    //inherited
//    public final StringPath createDeptcode = _super.createDeptcode;
//
//    //inherited
//    public final StringPath createId = _super.createId;
//
//    public final StringPath email = createString("email");
//
//    //inherited
//    public final StringPath id = _super.id;
//
//    public final StringPath idno = createString("idno");
//
//    public final StringPath leaderId = createString("leaderId");
//
//    public final NumberPath<Integer> loginNum = createNumber("loginNum", Integer.class);
//
//    //inherited
//    public final DateTimePath<java.util.Date> modifyDate = _super.modifyDate;
//
//    //inherited
//    public final StringPath modifyId = _super.modifyId;
//
//    public final StringPath name = createString("name");
//
//    public final StringPath password = createString("password");
//
//    public final StringPath source = createString("source");
//
//    public final StringPath state = createString("state");
//
//    //inherited
//    public final StringPath status = _super.status;
//
//    public final BooleanPath superUser = createBoolean("superUser");
//
//    public final StringPath sysDeptId = createString("sysDeptId");
//
//    public final StringPath sysGroupId = createString("sysGroupId");
//
//    public final StringPath tel = createString("tel");
//
//    public final StringPath thirdId = createString("thirdId");
//
//    public final StringPath thirdToken = createString("thirdToken");
//
//    public final StringPath username = createString("username");
//
//    public final StringPath userType = createString("userType");
//
//    public QSysUser(String variable) {
//        super(SysUser.class, forVariable(variable));
//    }
//
//    public QSysUser(Path<? extends SysUser> path) {
//        super(path.getType(), path.getMetadata());
//    }
//
//    public QSysUser(PathMetadata metadata) {
//        super(SysUser.class, metadata);
//    }
//
//}
//
