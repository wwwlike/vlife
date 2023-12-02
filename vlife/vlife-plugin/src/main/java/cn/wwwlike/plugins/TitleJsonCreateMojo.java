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

package cn.wwwlike.plugins;

import cn.wwwlike.plugins.constant.comment.CommentParser;
import cn.wwwlike.plugins.utils.ClassLoaderUtil;
import cn.wwwlike.plugins.utils.FileUtil;
import cn.wwwlike.plugins.utils.JsonUtil;
import cn.wwwlike.vlife.objship.read.ItemReadTemplate;
import cn.wwwlike.vlife.objship.read.ModelReadCheck;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.objship.read.tag.FieldTag;
import org.apache.commons.lang3.StringUtils;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.LifecyclePhase;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.project.MavenProject;
import org.codehaus.plexus.util.FileUtils;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 读取entity里类及字段注释信息到resources里的title.json里
 * @requiresDependencyResolution compile
 */
@Mojo(name = "titleJson", defaultPhase = LifecyclePhase.INSTALL)
public class TitleJsonCreateMojo extends AbstractMojo {

    @Parameter
    private List<String> entityPackages;

    @Parameter(defaultValue = "${project.compileClasspathElements}", readonly = true, required = true)
    private List<String> compilePath;

    @Parameter(defaultValue = "${project}", readonly = true)
    private MavenProject project;

    public void execute() throws MojoExecutionException, MojoFailureException {
        try {
        List<File> files = new ArrayList<>();
        ClassLoader loader= ClassLoaderUtil.getRuntimeClassLoader(project);
        ModelReadCheck modelReadCheck= new ModelReadCheck();
        int errorNum=modelReadCheck.load(loader);
        if(errorNum==0) {

                String srcPath = "";
                files.addAll(FileUtils.getFiles(new File(project.getBasedir() + "/src/main/java" + srcPath), null, null));

            /* 写死，因为目前实体类父类都在class里。*/
            List<ClzTag> tags = new ArrayList<>();
            Map<String, FieldTag> dbEntityFieldTag = new HashMap<>();
            FieldTag idTag = new FieldTag();
            idTag.setTitle("主键id");
            idTag.setFieldName("id");
            idTag.setFieldType("string");
            idTag.setExtendsField(true);
            dbEntityFieldTag.put("id", idTag);
            FieldTag statusTag = new FieldTag();
            statusTag.setTitle("删除状态");
            statusTag.setExtendsField(true);
            statusTag.setFieldName("status");
            statusTag.setFieldType("string");
            dbEntityFieldTag.put("status", statusTag);
            FieldTag createDateTag = new FieldTag();
            createDateTag.setExtendsField(true);
            createDateTag.setTitle("创建时间");
            createDateTag.setFieldName("status");
            createDateTag.setFieldType("Date");
            dbEntityFieldTag.put("createDate", createDateTag);
            FieldTag modifyDateTag = new FieldTag();
            modifyDateTag.setExtendsField(true);
            modifyDateTag.setTitle("修改时间");
            modifyDateTag.setFieldName("modifyDate");
            modifyDateTag.setFieldType("Date");
            dbEntityFieldTag.put("modifyDate", modifyDateTag);
            FieldTag modifyIdTag = new FieldTag();
            modifyIdTag.setExtendsField(true);
            modifyIdTag.setTitle("修订人");
            modifyIdTag.setFieldType("string");
            modifyIdTag.setFieldName("modifyId");
            dbEntityFieldTag.put("modifyId", modifyIdTag);
            FieldTag createIdTag = new FieldTag();
            createIdTag.setExtendsField(true);
            createIdTag.setTitle("创建人");
            createIdTag.setFieldName("createId");
            createIdTag.setFieldType("string");
            dbEntityFieldTag.put("createId", createIdTag);
            //解析字段
            for (File path : files) {
                ClzTag tag = CommentParser.parserField(path,modelReadCheck);
                if(tag!=null){
                    tags.add(tag);
                }
            }
            /* entity的继承的属性 加入*/
            for (ClzTag tag : tags) {
                if ((tag.getParentsName()!=null&&tag.getParentsName().contains("DbEntity"))||
                        "DbEntity".equals(tag.getSuperName())) {
                    if (tag.getTags() == null) {
                        tag.setTags(dbEntityFieldTag);
                    } else {
                        dbEntityFieldTag.forEach((key, val) -> {
                            if (tag.getTags().get(key) == null) {
                                tag.getTags().put(key, val);
                            }
                        });
                    }
                }
            }
            //api解析
            for (ClzTag tag : tags) {
                if ((tag.getParentsName()!=null&&tag.getParentsName().contains("VLifeApi"))||"VLifeApi".equals(tag.getSuperName())||"VLifeApi".equals(tag.getEntityName())) {
                    for (File path : files) {
                        if (path.getName().equals(tag.getEntityName() + ".java")) {
                            try {
                                CommentParser.parserApi(path, tag);
                            }catch (Exception ex){
                                ex.printStackTrace();
                                System.out.println(tag.entityName);
                            }
                        }
                        ;
                    }
                }
            }
//        //api解析
//        for (File path : files) {
//            for()
////            ClzTag tag=CommentParser.parser(path);
////            tags.add(tag);//字段
//        }

            String filePath = project.getBasedir() + "/src/main/resources/";
            filePath = filePath + "/title.json";
            String data = JsonUtil.toPrettyJson(tags);
            FileUtil.nioWriteFile(data, filePath);
        }else{
            modelReadCheck.getLogger().error("模型信息读取存在错误,title不能生成");
        } } catch (IOException e) {
            e.printStackTrace();
        }
    }
}