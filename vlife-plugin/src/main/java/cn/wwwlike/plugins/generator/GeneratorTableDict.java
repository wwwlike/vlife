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

package cn.wwwlike.plugins.generator;

import cn.wwwlike.vlife.base.BaseRequest;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.dto.ReqDto;
import cn.wwwlike.vlife.objship.dto.VoDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import com.squareup.javapoet.ClassName;
import com.squareup.javapoet.FieldSpec;
import com.squareup.javapoet.JavaFile;
import com.squareup.javapoet.TypeSpec;

import javax.lang.model.element.Modifier;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 数据字典代码生成器
 */
public class GeneratorTableDict {

    /**
     * 生成到当前module的源文件目录下
     *
     * @param javaFile
     * @throws IOException
     */
    private static void generateToCurrentAndroidStudioModule(JavaFile javaFile) throws IOException {
        String targetDirectory = "target/generated-sources/java";
        File dir = new File(targetDirectory);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        javaFile.writeTo(dir);
    }

    public void generator(List<EntityDto> entitys, List<VoDto> vos, List<ReqDto> res) {
        List<Class<? extends Item>> entityList = entitys.stream().map(entityDto -> {
            return entityDto.getClz();
        }).collect(Collectors.toList());
        List<Class<? extends VoBean>> voList = vos.stream().map(voDto -> {
            return voDto.getClz();
        }).collect(Collectors.toList());
        List<Class<? extends BaseRequest>> reqList = res.stream().map(resDto -> {
            return resDto.getClz();
        }).collect(Collectors.toList());
        dictGenerator(entitys);
        ClzPath(entitys);
    }

    /**
     * 字典生成一个包下面的生成在一起
     */
    public void dictGenerator(List<EntityDto> entitys) {
        Map groupDatas = entitys.stream().collect(Collectors.groupingBy(
                v -> {
                    return v.getClz().getPackage().getName();
                }));
        for (Object entityPackage : groupDatas.keySet()) {
            List<EntityDto> list = (List<EntityDto>) groupDatas.get(entityPackage);
            List<TypeSpec> innerClz = new ArrayList();
            for (EntityDto dto : list) {


                List<FieldSpec> fieldSpecs = new ArrayList<>();
                for (FieldDto field : dto.getFields()) {
                    fieldSpecs.add(
                            FieldSpec.builder(String.class, field.getFieldName(),
                                            Modifier.FINAL, Modifier.STATIC, Modifier.PUBLIC)
                                    .initializer("$S", field.getFieldName()).build());
                }
                TypeSpec sub = TypeSpec.classBuilder(dto.getType())
                        .addModifiers(Modifier.FINAL, Modifier.STATIC, Modifier.PUBLIC)
                        .addFields(fieldSpecs)
                        .build();
                innerClz.add(sub);
            }
            try {
                TypeSpec constants = TypeSpec.classBuilder("HrConstants")
                        .addModifiers(Modifier.PUBLIC)
                        .addTypes(innerClz)
                        .build();

                JavaFile javaFile = JavaFile.builder(entityPackage.toString(), constants).build();
                ;
                generateToCurrentAndroidStudioModule(javaFile);
            } catch (Exception ex) {

            }
        }

    }

    /**
     * 呈现树形递归的趋势
     *
     * @param
     * @return
     */
    public List<List<Class<? extends Item>>> getPath(List<List<Class<? extends Item>>> total, List<Class<? extends Item>> pathClz, EntityDto entityDto) {
        if (total == null) {
            total = new ArrayList<>();
        }
        if (pathClz == null) {
            Class clz = entityDto.getClz();
            pathClz = Arrays.asList(clz);
        } else {
            total.add(pathClz);
        }

        for (Class fkClz : entityDto.getFkTableClz()) {
            if (!pathClz.contains(fkClz)) {
                List temp = new ArrayList();
                temp.addAll(pathClz);
                temp.add(fkClz);
                getPath(total, temp, GlobalData.entityDto(fkClz));
            } else {
                total.add(pathClz);
            }
        }

        return total;
    }

    /**
     * 左查询路径创建，如果路径包涵了则结束
     *
     * @param entitys
     */
    public void ClzPath(List<EntityDto> entitys) {
        for (EntityDto entityDto : entitys) {
            List<List<Class<? extends Item>>> list = getPath(null, null, entityDto);
            List<FieldSpec> fieldSpecs = new ArrayList<>();
            for (List<Class<? extends Item>> clzss : list) {
                String name = "";
                for (Class clz : clzss) {
                    name += clz.getSimpleName() + "_";
                }
                name = name.substring(0, name.length() - 1);
                Class[] classes = clzss.toArray(new Class[clzss.size()]);


                ClassName bundle[] = new ClassName[classes.length];
                String str = "";
                for (int i = 0; i < classes.length; i++) {
                    bundle[i] = ClassName.get(classes[i]);
                    str += "$T.class,";
                }
                str = str.substring(0, str.length() - 1);

                fieldSpecs.add(
                        FieldSpec.builder(Class[].class, name,
                                        Modifier.FINAL, Modifier.STATIC, Modifier.PUBLIC)
                                .initializer("new Class[]{" + str + "}", bundle).build());
            }


            TypeSpec constants = TypeSpec.classBuilder("V" + entityDto.getClz().getSimpleName())
                    .addModifiers(Modifier.PUBLIC)
                    .addFields(fieldSpecs)
                    .build();
            JavaFile javaFile = JavaFile.builder(entityDto.getClz().getPackage().getName() + ".V", constants).build();
            try {
                generateToCurrentAndroidStudioModule(javaFile);
            } catch (Exception e) {
                e.printStackTrace();
            }


        }
    }
}
