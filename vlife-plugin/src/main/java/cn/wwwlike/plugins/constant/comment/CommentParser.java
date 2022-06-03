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
import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.NodeList;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.TypeDeclaration;

import java.io.File;

/**
 * 实体类注释解析
 */
public class CommentParser {

    private static String clzStrToFilePath(String clzStr) {
        String path = clzStr.replace(".", "/");
        return "src/main/java/" + path + ".java";
    }

    public static ClzTag parser(Class clz) {
        return parser(clz.getName());
    }

    public static ClzTag parser(String clzStr) {
        String FILE_PATH = clzStrToFilePath(clzStr);
        return parser(new File(FILE_PATH));
    }


    public static ClzTag parser(File file) {
        ClzTag clzTag = new ClzTag();
        try {


            CompilationUnit cu = new JavaParser().parse(file).getResult().get();

            TypeDeclaration typeDeclaration = cu.getTypes().get(0);

            if (typeDeclaration.getComment().isPresent()) {
                String commentText = CommentUtils.parseCommentText(typeDeclaration.getComment().get().getContent());
                commentText = commentText.split("\n")[0].split("\r")[0];
                clzTag.setTitle(commentText);
                clzTag.setEntityName(typeDeclaration.getName().asString());
            }
            NodeList list = typeDeclaration.getMembers();
            FieldTag fieldTag = null;
            for (Object o : list) {
                if (o instanceof FieldDeclaration) {
                    fieldTag = new FieldTag();
                    fieldTag.setFieldName(((FieldDeclaration) o).getVariables().get(0).toString());
                    if (((FieldDeclaration) o).getComment().isPresent()) {
                        String comment = ((FieldDeclaration) o).getComment().get().getContent();
                        fieldTag.setTitle(CommentUtils.parseCommentText(comment));
                        clzTag.getTags().put(fieldTag.getFieldName(), fieldTag);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return clzTag;
    }
}
