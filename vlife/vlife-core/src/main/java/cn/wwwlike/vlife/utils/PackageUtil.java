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

package cn.wwwlike.vlife.utils;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.*;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

public class PackageUtil {

    /**
     * 获取某包下（包括该包的所有子包）所有类
     *
     * @param packageName 包名
     * @return 类的完整名称
     */
    public static Set<String> getClassName(String packageName) {
        return getClassName(packageName, true);
    }

    /**
     * 获取指定包下的类信息
     * @param packageName  包名路径
     * @param childPackage 是否遍历子包
     * @return 类的完整名称Arrays.stream(((URLClassLoader) loader).getURLs()).filter(t->t.path.indexOf("classes")!=-1).collect(Collectors.toList())
     */
    public static Set<String> getClassName(ClassLoader loader, String packageName, boolean childPackage) {
        Set<String> fileNames = new HashSet<>();
        try {
            Enumeration<URL> resources = loader.getResources(packageName.replace('.', '/'));
            while (resources.hasMoreElements()) {
                URL resource = resources.nextElement();
                String protocol = resource.getProtocol();
                if ("file".equals(protocol)) {//开发环境可以读取到目录
                    String path = resource.getPath();
                    fileNames.addAll(getClassNameByFile(path, null, childPackage));
                } else if ("jar".equals(protocol)) {
//                    System.out.println("jarjarjarjarjar");
                }
            }
        }catch (IOException exception){
            exception.printStackTrace();
        }
    /** java8方式取类信息
        URL[] urls=((URLClassLoader) loader).getURLs();
        //开发时环境:用遍历取到classes里的类信息
        for(URL u:urls){
            String type = u.getProtocol();
            String path=u.getPath();
            path=path.replace("test-","");
            if (path.endsWith("classes/")) {
                fileNames.addAll(getClassNameByFile(path, null, childPackage));
            }
        }*/

        try {
            Enumeration<URL> resources = loader.getResources("");
            while (resources.hasMoreElements()) {
                URL resource = resources.nextElement();
                String protocol = resource.getProtocol();
               if ("jar".equals(protocol)) {
                   List<String> jarClass=getClassNameByJars1(packageName, childPackage,resource);
                   fileNames.addAll(jarClass);
               }
            }
        }catch (IOException exception){
            exception.printStackTrace();
        }
           //生产环境：从jar包里指定包路径[packageName]的class
//        List<String> jarClass=getClassNameByJars(((URLClassLoader) loader).getURLs(), packageName, childPackage);
//        fileNames.addAll(jarClass);
        return fileNames;
    }

    /**
     * 获取某包下所有类
     *
     * @param packageName  包名
     * @param childPackage 是否遍历子包
     * @return 类的完整名称
     */
    public static Set<String> getClassName(String packageName, boolean childPackage) {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
       return getClassName(loader,packageName,childPackage);
    }

    /**
     * 从项目文件获取某包下所有类
     *
     * @param filePath     文件路径
     * @param className    类名集合
     * @param childPackage 是否遍历子包
     * @return 类的完整名称
     */
    private static List<String> getClassNameByFile1(String filePath, List<String> className, boolean childPackage) {
        List<String> myClassName = new ArrayList<String>();
        File file = new File(filePath);
        File[] childFiles = file.listFiles();
        for (File childFile : childFiles) {
            if (childFile.isDirectory()) {
                if (childPackage) {
                    myClassName.addAll(getClassNameByFile1(childFile.getPath(), myClassName, childPackage));
                }
            } else {
                String childFilePath = childFile.getPath();
                if (childFilePath.endsWith(".class")) {
                    childFilePath = childFilePath.substring(childFilePath.indexOf("\\classes") + 9, childFilePath.lastIndexOf("."));
                    childFilePath = childFilePath.replace("\\", ".");
                    myClassName.add(childFilePath);
                }
            }
        }

        return myClassName;
    }

    /**
     * 从项目文件获取某包下所有类
     * @param filePath     文件路径
     * @param className    类名集合
     * @param childPackage 是否遍历子包
     * @return 类的完整名称
     */
    private static List<String> getClassNameByFile(String filePath, List<String> className, boolean childPackage) {
        List<String> myClassName = new ArrayList<String>();
        File file = new File(filePath);
        File[] childFiles = file.listFiles();
        for (File childFile : childFiles) {
            if (childFile.isDirectory()) {
                if (childPackage) {
                    myClassName.addAll(getClassNameByFile(childFile.getPath(), myClassName, childPackage));
                }
            } else {
                String childFilePath = childFile.getPath();
                if (childFilePath.endsWith(".class")) {
                    String classesPath = File.separator + "classes" + File.separator;
                    int start = childFilePath.indexOf(classesPath) + classesPath.length();
                    int end = childFilePath.lastIndexOf(".");
                    childFilePath = childFilePath.substring(start, end);
                    childFilePath = childFilePath.replace(File.separator, ".");
                    myClassName.add(childFilePath);
                }
            }
        }

        return myClassName;
    }

    /**
     * 从jar获取某包下所有类
     *
     * @param jarPath      jar文件路径
     * @param childPackage 是否遍历子包
     * @return 类的完整名称
     */
    private static List<String> getClassNameByJar(String jarPath, boolean childPackage) {
        List<String> myClassName = new ArrayList<String>();
        String[] jarInfo = jarPath.split("!");
        String jarFilePath = jarInfo[0].substring(jarInfo[0].indexOf("/"));
        String packagePath = jarInfo[1].substring(1);
        try {
            JarFile jarFile = new JarFile(jarFilePath);
            Enumeration<JarEntry> entrys = jarFile.entries();
            while (entrys.hasMoreElements()) {
                JarEntry jarEntry = entrys.nextElement();
                String entryName = jarEntry.getName();
                if (entryName.endsWith(".class")) {
                    if (childPackage) {
                        if (entryName.startsWith(packagePath)) {
                            entryName = entryName.replace("/", ".").substring(0, entryName.lastIndexOf("."));
                            myClassName.add(entryName);
                        }
                    } else {
                        int index = entryName.lastIndexOf("/");
                        String myPackagePath;
                        if (index != -1) {
                            myPackagePath = entryName.substring(0, index);
                        } else {
                            myPackagePath = entryName;
                        }
                        if (myPackagePath.equals(packagePath)) {
                            entryName = entryName.replace("/", ".").substring(0, entryName.lastIndexOf("."));
                            myClassName.add(entryName);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return myClassName;
    }

    /**
     * 从所有jar中搜索该包，并获取该包下所有类
     *
     * @param urls         URL集合
     * @param packagePath  包路径
     * @param childPackage 是否遍历子包
     * @return 类的完整名称
     */
    private static List<String> getClassNameByJars(URL[] urls, String packagePath, boolean childPackage) {
        List<String> myClassName = new ArrayList<String>();
        if (urls != null) {
            for (int i = 0; i < urls.length; i++) {
                URL url = urls[i];
                String urlPath = url.getPath();
                if (urlPath.endsWith("classes/")) {
                    continue;
                }
                String jarPath = urlPath + "!/" + packagePath;
                myClassName.addAll(getClassNameByJar(jarPath, childPackage));
            }
        }
        return myClassName;
    }


    private static List<String> getClassNameByJars1(String packagePath, boolean childPackage,URL...urls) {
        List<String> myClassName = new ArrayList<String>();
        if (urls != null) {
            for (int i = 0; i < urls.length; i++) {
                URL url = urls[i];
                String urlPath = url.getPath();
                if (urlPath.endsWith("classes/")) {
                    continue;
                }
                String jarPath = urlPath + "!/" + packagePath;
                myClassName.addAll(getClassNameByJar(jarPath, childPackage));
            }
        }
        return myClassName;
    }
}