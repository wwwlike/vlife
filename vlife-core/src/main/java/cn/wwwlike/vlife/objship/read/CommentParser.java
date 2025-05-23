package cn.wwwlike.vlife.objship.read;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.tag.ApiTag;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.objship.read.tag.FieldTag;
import cn.wwwlike.vlife.utils.CommentUtils;
import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.NodeList;
import com.github.javaparser.ast.body.*;
import com.github.javaparser.ast.comments.Comment;
import com.github.javaparser.ast.comments.JavadocComment;
import com.github.javaparser.ast.comments.LineComment;
import com.github.javaparser.ast.expr.*;
import com.github.javaparser.ast.nodeTypes.NodeWithSimpleName;
import com.github.javaparser.ast.type.ClassOrInterfaceType;
import com.github.javaparser.ast.type.Type;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 实体类注释解析
 */
public class CommentParser {

    private static String clzStrToFilePath(String clzStr) {
        String path = clzStr.replace(".", "/");
        return "src/main/java/" + path + ".java";
    }

    public static ClzTag parser(Class clz) {
        return parserField(clz.getName());
    }

    public static ClzTag parserField(String clzStr) {
        String FILE_PATH = clzStrToFilePath(clzStr);
        return parserField(new File(FILE_PATH));
    }

    public static ClzTag parserField(File file) {
        ClzTag clzTag = new ClzTag();
        clzTag.setEntityName(file.getName().replace(".java",""));
        try {
            CompilationUnit cu = new JavaParser().parse(file).getResult().get();
            clzTag.setPackageName(cu.getPackageDeclaration().get().getName().asString());
            TypeDeclaration typeDeclaration = cu.getTypes().get(0);
            /* 设置父类 */
            if(typeDeclaration instanceof  ClassOrInterfaceDeclaration){
            if(((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes()!=null&&
                    ((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes().size()>0) {
                List<String> parentsName=new ArrayList<>();
                String extendClz=((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes().get(0).getName().asString();
                clzTag.setSuperName(extendClz);
                parentsName.add(extendClz);
                List<String> interfaces=((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().stream().map(NodeWithSimpleName::getNameAsString).collect(Collectors.toList());
                if(interfaces!=null&& interfaces.size()>0){
                    parentsName.addAll(interfaces);
                }
                clzTag.setParentsName(parentsName);
                if(((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes().get(0).getTypeArguments().isPresent()){
                    clzTag.setTypeName(
                            ((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes().get(0).getTypeArguments().get().get(0).asString()
                    );
                }
            }else if(((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes()!=null&&
                    ((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().size()>0) {
                clzTag.setSuperName(((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().get(0).getName().asString());
                clzTag.setParentsName(((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().stream().map(NodeWithSimpleName::getNameAsString).collect(Collectors.toList()));
                if(((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().get(0).getTypeArguments().isPresent()){
                    clzTag.setTypeName(
                            ((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().get(0).getTypeArguments().get().get(0).asString()
                    );
                }
            }}
            //不是模型，不是接口层的则排除
//            if(beanDto!=null||"VLifeApi".equals(clzTag.getSuperName())||"VLifeApi".equals(clzTag.getEntityName())) {
            if (typeDeclaration.getComment().isPresent()) {//有注释
                String commentText = CommentUtils.parseCommentText(typeDeclaration.getComment().get().getContent());
                commentText = commentText.split("\n")[0].split("\r")[0];//取注释的第一行
                clzTag.setTitle(commentText);
            }
            NodeList list = typeDeclaration.getMembers();
            FieldTag fieldTag = null;
            for (Object o : list) {
                if (o instanceof FieldDeclaration) {
                    fieldTag = new FieldTag();
                    fieldTag.setFieldName(((FieldDeclaration) o).getVariables().get(0).toString());
                    if (fieldTag.getFieldName().equals("id")) {
                        fieldTag.setExtendsField(true);
                    }
                    if (((FieldDeclaration) o).getComment().isPresent()) {
                        Comment comment=((FieldDeclaration) o).getComment().get();
                        fieldTag.setTitle(getLineComment(comment,1));//字段注释
                        fieldTag.setPlaceholder(getLineComment(comment,2));//字段说明
                    }
                    fieldTag.setFieldType(((FieldDeclaration) o).getElementType().asString());
                    clzTag.getTags().put(fieldTag.getFieldName(), fieldTag);
                }
            }
//            }else{
//                return null;
//            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return clzTag;
    }


    /**
     * 解析a'pi
     * @param file
     * @return
     */
    public static ClzTag parserApi(File file,ClzTag tag) {
        CompilationUnit cu = null;
        try {
            cu = new JavaParser().parse(file).getResult().get();
            TypeDeclaration typeDeclaration = cu.getTypes().get(0);
            NodeList<AnnotationExpr> annos= typeDeclaration.getAnnotations();
            if(annos!=null&&annos.size()>0){
                for(AnnotationExpr anno:annos){
                    if(anno.getName().asString().equals("RequestMapping")){
                        tag.setPath(((StringLiteralExpr)(anno.getChildNodes().get(1))).getValue());
                        break;
                    }
                }
            }
            NodeList list = typeDeclaration.getMembers();
            /*过滤有注解的方法接口*/
            List<MethodDeclaration> methodDeclarations= (List<MethodDeclaration>) typeDeclaration
                    .getMembers().stream().filter(t->(t instanceof MethodDeclaration)).filter(t->((MethodDeclaration)t).getAnnotations().size()>0).collect(Collectors.toList());
            ApiTag apiTag = null;
            for (MethodDeclaration method : methodDeclarations) {
                Optional<AnnotationExpr> optional=readAnnotation(method.getAnnotations(), GetMapping.class, PostMapping.class, RequestMapping.class, DeleteMapping.class, PutMapping.class);
                if(optional.isPresent()) {
                    AnnotationExpr mappingAnnotation=optional.get();
                    Object path=mappingAnnotation.getChildNodes().get(1);
                    apiTag=new ApiTag();
                    if(method.getComment().isPresent()) {
                        apiTag.setTitle(getLineComment(method.getComment().get(), 1));
                        apiTag.setRemark(getLineComment(method.getComment().get(), 2));
                    }else{
                        apiTag.setTitle(method.getNameAsString());
                    }
                    apiTag.setMethodName(method.getNameAsString());
                    if(path.getClass()==StringLiteralExpr.class){
                        apiTag.setPath(((StringLiteralExpr)path).getValue());
                    }else if(path.getClass()== MemberValuePair.class){
                        apiTag.setPath(((MemberValuePair)path).getValue().toString());
                    }
                    apiTag.setMethodType(mappingAnnotation.toString());
                    //查找VMethed注解
                    Optional<AnnotationExpr> vmethodAnnotation=readAnnotation(method.getAnnotations(), VMethod.class);
                    if(vmethodAnnotation.isPresent()&&vmethodAnnotation.get() instanceof NormalAnnotationExpr){
                        apiTag.setPermission(readAnnotationAttr((NormalAnnotationExpr)vmethodAnnotation.get(),"permission", PermissionEnum.class));
                    }
                    Type returnType= method.getType();
                    if (returnType.isClassOrInterfaceType()) {
                        ClassOrInterfaceType classType = returnType.asClassOrInterfaceType();
                        apiTag.setReturnWrapper(classType.getName().asString());
                        if (classType.getTypeArguments().isPresent() && classType.getTypeArguments().get().size() > 0) {
                            Type genericType=classType.getTypeArguments().get().get(0);
                            apiTag.setReturnGeneric(genericType.asString());
                        }
                    }else{
                        apiTag.setReturnWrapper(returnType.asString());
                    }
                    if(method.getParameters().size()>0){
                        Parameter parameter= method.getParameter(0);
                        apiTag.setParam(parameter.getNameAsString());//参数名
                        Type paramType=parameter.getType(); //参数类型
                        if (paramType.isClassOrInterfaceType()) {
                           ClassOrInterfaceType classType = paramType.asClassOrInterfaceType();
                           apiTag.setParamWrapper(classType.getName().asString());
                            if (classType.getTypeArguments().isPresent() && classType.getTypeArguments().get().size() > 0) {
                                Type genericType=classType.getTypeArguments().get().get(0);
                                apiTag.setParamGeneric(genericType.asString());
                            }
                        }else{
                            apiTag.setParamWrapper(method.getParameter(0).getTypeAsString());
                        }
                        if(method.getParameter(0).getAnnotations().size()>0){
                            apiTag.setParamAnnotation(method.getParameter(0).getAnnotations().get(0).getNameAsString());
                        }
                    }


                    //设置参数tag(未启用)
//                    apiTag.setParamTagList(new ArrayList<>());
//                    if(method.getParameters().size()>0){
//                        for(int i=0;i<method.getParameters().size();i++){
//                            ParamTag paramTag=new ParamTag();
//                            paramTag.setParamName(method.getParameter(i).getNameAsString());
//                            paramTag.setParamType(method.getParameter(i).getTypeAsString());
//                            apiTag.getParamTagList().add(paramTag);
//                        }
//                    }
                    tag.getApiTagList().add(apiTag);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return tag;
    }


    /**
     * 查找集合中注解满足的第一条
     * @param annotationExprs
     */
    public static Optional<AnnotationExpr> readAnnotation(NodeList<AnnotationExpr>  annotationExprs, Class ... annotationClasses){
        List<String> names= Arrays.stream(annotationClasses).map(s->s.getSimpleName()).collect(Collectors.toList());
        return annotationExprs.stream().filter(annotationExpr -> names.contains(annotationExpr.getNameAsString())).findFirst();
    }

    //提取注释的指定行数的字符串
    public static String getLineComment(Comment comment,int lineIndex){
        if (comment != null) {
            if (comment instanceof JavadocComment) {
                String commentStr = comment.getContent()
                        .replaceAll("\\*", "")
                        .replaceAll("\\r", "")
                        .replaceAll("null", "")
                        .replaceAll("\\;", "").trim();
                String lines[]= commentStr.split("\n");
                int i=1;
                for (String line : lines) {
                    if (!line.trim().startsWith("@")) {
                        if (lineIndex == i) {
                           return line.trim();
                        }
                    }
                    i++;
                }
            } else if (comment instanceof LineComment&& lineIndex ==1) {
                return comment.getContent();
            }else{
                return "";
            }
        }
        return "";
    }

    /**
     * 读取指定注解的指定属性值
     */
    public static <T> T readAnnotationAttr(NormalAnnotationExpr annotationExpr, String attr, Class<T> returnType) {
        for (MemberValuePair pair : annotationExpr.getPairs()) {
            if (pair.getNameAsString().equals(attr)) {
                Expression value = pair.getValue();
                if (returnType.isEnum()) {
                    SimpleName enumName =pair.getValue().asFieldAccessExpr().getName();
                    Enum<?> enumVariable = Enum.valueOf((Class<? extends Enum>) returnType, enumName.asString());
                    return returnType.cast(enumVariable);
                }else if (returnType.equals(String.class)) {
                    if (value.isStringLiteralExpr()) {
                        return returnType.cast(((StringLiteralExpr) value).getValue());
                    }
                } else if (returnType.equals(Integer.class) || returnType.equals(int.class)) {
                    if (value.isIntegerLiteralExpr()) {
                        return returnType.cast(Integer.parseInt(((IntegerLiteralExpr) value).getValue()));
                    }
                } else if (returnType.equals(Boolean.class) || returnType.equals(boolean.class)) {
                    if (value.isBooleanLiteralExpr()) {
                        return returnType.cast(((BooleanLiteralExpr) value).getValue());
                    }
                }
                // 如果类型不匹配，可以根据实际情况进行处理，比如抛出异常或返回默认值
                // 这里我们选择抛出异常
                throw new IllegalArgumentException("Annotation attribute type does not match the expected type");
            }
        }
        return null;
    }

}
