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

package cn.wwwlike.plugins.constant.comment;

import cn.wwwlike.plugins.utils.CommentUtils;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.ModelReadCheck;
import cn.wwwlike.vlife.objship.read.tag.ApiTag;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.objship.read.tag.FieldTag;
import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.NodeList;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.body.TypeDeclaration;
import com.github.javaparser.ast.expr.AnnotationExpr;
import com.github.javaparser.ast.expr.StringLiteralExpr;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 实体类注释解析
 */
public class CommentParser {

    private static String clzStrToFilePath(String clzStr) {
        String path = clzStr.replace(".", "/");
        return "src/main/java/" + path + ".java";
    }

    public static ClzTag parser(Class clz,ModelReadCheck modelReadCheck) {
        return parserField(clz.getName(),modelReadCheck);
    }

    public static ClzTag parserField(String clzStr,ModelReadCheck modelReadCheck) {
        String FILE_PATH = clzStrToFilePath(clzStr);
        return parserField(new File(FILE_PATH),modelReadCheck);
    }

    public static ClzTag parserField(File file, ModelReadCheck modelReadCheck) {
        ClzTag clzTag = new ClzTag();
        clzTag.setEntityName(file.getName().replace(".java",""));
        try {
            CompilationUnit cu = new JavaParser().parse(file).getResult().get();
            TypeDeclaration typeDeclaration = cu.getTypes().get(0);
            /* 设置父类 */
            if(((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes()!=null&&
                    ((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes().size()>0) {
                clzTag.setSuperName(((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes().get(0).getName().asString());
                if(((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes().get(0).getTypeArguments().isPresent()){
                    clzTag.setTypeName(
                    ((ClassOrInterfaceDeclaration) typeDeclaration).getExtendedTypes().get(0).getTypeArguments().get().get(0).asString()
                    );
                }
            }else if(((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes()!=null&&
                    ((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().size()>0) {
                clzTag.setSuperName(((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().get(0).getName().asString());
                if(((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().get(0).getTypeArguments().isPresent()){
                    clzTag.setTypeName(
                            ((ClassOrInterfaceDeclaration) typeDeclaration).getImplementedTypes().get(0).getTypeArguments().get().get(0).asString()
                    );
                }
            }

            BeanDto beanDto= modelReadCheck.find(StringUtils.uncapitalize(clzTag.getEntityName()));
            //不是模型，不是接口层的则排除
            if(beanDto==null&&!"VLifeApi".equals(clzTag.getSuperName())){
                return null;
            }

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
                    if(fieldTag.getFieldName().equals("id")){
                        fieldTag.setExtendsField(true);
                    }
                    if (((FieldDeclaration) o).getComment().isPresent()) {
                        String comment = ((FieldDeclaration) o).getComment().get().getContent();
//                      //取注释的第一行
                        fieldTag.setTitle(CommentUtils.parseCommentText(comment).split("\n")[0].split("\r")[0]);
                    }else if(beanDto!=null){
                       List<FieldDto> fields=beanDto.getFields();
                        for(FieldDto fieldDto:fields){
                           if(fieldDto.getFieldName().equals(fieldTag.getFieldName())){
                               fieldTag.setTitle(fieldDto.getTitle());
                           }
                        }
                    }
                    fieldTag.setFieldType(((FieldDeclaration) o).getElementType().asString());
//                        fieldTag.setFieldType(((FieldDeclaration) o).getVariables().get(0).getChildNodes().get(0).name);
                    clzTag.getTags().put(fieldTag.getFieldName(), fieldTag);

                }
            }
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
            /*过滤接口*/
            List<MethodDeclaration> methodDeclarations= (List<MethodDeclaration>) typeDeclaration
                    .getMembers().stream().filter(t->(t instanceof MethodDeclaration)).collect(Collectors.toList());
            ApiTag apiTag = null;
            for (MethodDeclaration method : methodDeclarations) {
                apiTag=new ApiTag();
                apiTag.setTitle(method.getComment().isPresent()?method.getComment().get().getContent():"");
                apiTag.setMethodName(method.getNameAsString());
                apiTag.setReturnClz(method.getTypeAsString());
                apiTag.setPath(((StringLiteralExpr)(method.getAnnotation(0).getChildNodes().get(1))).getValue());
                apiTag.setMethodType(method.getAnnotation(0).getChildNodes().get(0).toString());
                if(method.getParameters().size()>0){
                    apiTag.setParam(method.getParameter(0).getNameAsString());
                    apiTag.setParamWrapper(method.getParameter(0).getTypeAsString());
                }
                tag.getApiTagList().add(apiTag);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return tag;
    }
}
