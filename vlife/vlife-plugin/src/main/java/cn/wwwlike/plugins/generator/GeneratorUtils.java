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

import cn.wwwlike.vlife.base.Item;
import com.squareup.javapoet.JavaFile;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.UrlResource;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class GeneratorUtils {
    /**
     * 判断编译的文件是否已经有了
     * @param clz
     * @param type
     * @return
     */
    public boolean compileClzExist1(ClassLoader loader, Class<? extends Item> clz, CLZ_TYPE type) {
        String packageName = clz.getPackage().getName();
        int index = packageName.lastIndexOf("entity");
        String className = null;
        if (type == CLZ_TYPE.API) {
            className = packageName.substring(0, index) + "api." + clz.getSimpleName() + "Api";
        } else if (type == CLZ_TYPE.SERVICE) {
            className = packageName.substring(0, index) + "service." + clz.getSimpleName() + "Service";
        } else if (type == CLZ_TYPE.DAO) {
            className = packageName.substring(0, index) + "dao." + clz.getSimpleName() + "Dao";
        } else if (type == CLZ_TYPE.VITEM) {
            className = packageName.substring(0, index) + "item." + clz.getSimpleName() + "Item";
        }
        if (className != null) {
            try {
                loader.loadClass(className);
            } catch (Exception ex) {
                return false;
            }
            return true;
        }
        return false;
    }

    public String classPathName(Class itemClz,String basePath, CLZ_TYPE type){
        String packageName = itemClz.getPackage().getName();
        int index = packageName.lastIndexOf(".");
        String key=type.name().toLowerCase();
        String filePath=basePath+"\\"+
                (packageName.substring(0, index) +"\\"+ key+"\\"+itemClz.getSimpleName()+StringUtils.capitalize(key)).replaceAll("\\.","\\\\");
        return filePath;
    }
    /**
     * 源文件是否存在
     * @return
     */
    public boolean sourceClzExist(Class itemClz,String basePath, CLZ_TYPE type) {
        if(new File(classPathName(itemClz,basePath,type)+".java").exists()){
            return true;
        }
        return false;
    }


    enum CLZ_TYPE {API, DAO, SERVICE, VITEM, DICT}

    /**
     * 生成到当前module的源文件目录下
     * @param javaFile
     * @throws IOException
     */
    public void createJavaFile(JavaFile javaFile, String path) throws IOException {
        String targetDirectory = "target/generated-sources/java";
        File dir = new File(targetDirectory);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        javaFile.writeTo(dir);
    }

    /**
     *
     * @param targetDirectory 目标文件夹
     * @param cover 覆盖
     * @param javaFiles Java文件(javapoe已经创建好的包路径的文件)
     * @throws IOException
     */
    public void createJavaFiles(String targetDirectory, Boolean cover, List<JavaFile> javaFiles) throws IOException {
        File dir = new File(targetDirectory);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        for(JavaFile javaFile:javaFiles){
            javaFile.writeTo(dir);
        }
    }


}
