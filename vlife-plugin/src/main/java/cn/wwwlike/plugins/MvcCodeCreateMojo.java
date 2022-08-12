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

import cn.wwwlike.plugins.generator.GeneratorMaster;
import cn.wwwlike.plugins.generator.GeneratorTableDict;
import cn.wwwlike.plugins.utils.ClassLoaderUtil;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.objship.read.ItemReadTemplate;
import cn.wwwlike.vlife.objship.read.ModelReadCheck;
import com.squareup.javapoet.JavaFile;
import lombok.SneakyThrows;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugins.annotations.LifecyclePhase;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.project.MavenProject;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.List;

/**
 * mvc框架三层代码自动创建
 *
 * @requiresDependencyResolution compile
 */
@Mojo(name = "codeCreate", defaultPhase = LifecyclePhase.INSTALL)
public class MvcCodeCreateMojo extends AbstractMojo {
    @Parameter
    private List<String> entityPackages;

    @Parameter(defaultValue = "${project.compileClasspathElements}", readonly = true, required = true)
    private List<String> compilePath;

    @Parameter(defaultValue = "${project}", readonly = true)
    private MavenProject project;


    /**
     * 1. 类信息读取
     * 2. 代码生成（已经有则不覆盖）
     * 3. 字典生成 (每次覆盖，生成到generated-sources/java)
     */
    public void execute() throws MojoExecutionException {
        List<String> sourceRoots=project.getCompileSourceRoots();
        ClassLoader loader=ClassLoaderUtil.getRuntimeClassLoader(project);
        ModelReadCheck modelReadCheck= new ModelReadCheck();
        int errorNum=modelReadCheck.load(loader);
        GeneratorMaster generatorMaster = new GeneratorMaster();
        if(errorNum==0){
            try {
                //mvc文件生成
                for(String sourceRoot:sourceRoots){
                    if(sourceRoot.indexOf("target")==-1) {
//                    URL url=new URL(sourceRoot);
//                    URLClassLoader classLoader=new URLClassLoader(ArrayUtils.,loader);
                        List<JavaFile> mvcFiles = generatorMaster.generator(sourceRoot, loader, modelReadCheck.getItemDtos(),
                                modelReadCheck.getVoDtos(), modelReadCheck.getReqDtos(), modelReadCheck.getSaveDtos());
                        generatorMaster.createJavaFiles(sourceRoot, false, mvcFiles);
                    }
                }
                //字典生成目录，待做成配置
                GeneratorTableDict tableDict = new GeneratorTableDict();
                List<JavaFile> dictFiles=tableDict.generator(modelReadCheck.getItemDtos(), modelReadCheck.getVoDtos(), modelReadCheck.getReqDtos());
                String dicgTarget=project.getBasedir().getPath()+"/target/generated-sources/java";
                generatorMaster.createJavaFiles(dicgTarget,true,dictFiles);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }else{
            modelReadCheck.getLogger().error("模型信息读取存在错误,代码生成失败");
        }
    }



//    /**
//     * 1. 类信息读取
//     * 2. 代码生成
//     * 3. 字典生成
//     */
//    public void execute1() throws MojoExecutionException {
//        /* 每次生成覆盖的路径,生成到target里,每次生成覆盖即可,这类用户进行修改*/
//         List<String> sourceRoots=project.getCompileSourceRoots();
//         for(String sourceRoot:sourceRoots){
//             String dicgTarget=project.getBasedir().getPath()+"/target/generated-sources/java";
//
//         }
////        if (entityPackages == null || entityPackages.size() == 0) {
////            throw new MojoExecutionException("entityPackages没有设置");
////        }
////        for (String entity : entityPackages) {
////            String path = entity.substring(0, StringUtils.lastIndexOf(entity, "."));
////        }
////        String classPath=project.getBasedir()+"/target/classes";
////        URL[] urls = new URL[1];
////        try {
////            urls[0] = new URL("file:"+classPath);
////        } catch (MalformedURLException e) {
////            e.printStackTrace();
////        }
////        URLClassLoader urlClassLoader = new URLClassLoader(urls,Thread.currentThread().getContextClassLoader());
//        ClassLoader loader=ClassLoaderUtil.getRuntimeClassLoader(project);
//        ModelReadCheck modelReadCheck= new ModelReadCheck();
//        int errorNum=modelReadCheck.load(loader);
//        if(errorNum==0){
//            GeneratorMaster generatorMaster = new GeneratorMaster();
//            GeneratorTableDict tableDict = new GeneratorTableDict();
//            List<JavaFile> mvcFiles=generatorMaster.generator(loader, modelReadCheck.getItemDtos(),
//                    modelReadCheck.getVoDtos(), modelReadCheck.getReqDtos(),modelReadCheck.getSaveDtos());
//            List<JavaFile> dictFiles=tableDict.generator(modelReadCheck.getItemDtos(), modelReadCheck.getVoDtos(), modelReadCheck.getReqDtos());
//            try {
//                generatorMaster.createJavaFiles(sourceRoots.get(0),false,mvcFiles);
//                generatorMaster.createJavaFiles(dicgTarget,true,dictFiles);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }else{
//            modelReadCheck.getLogger().error("模型信息读取存在错误,代码生成失败");
//        }
//
//
//    }


}