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
package cn.wwwlike.plugins.utils;

import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.project.MavenProject;

import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Julien Boz
 */
public class ClassLoaderUtil {


    public static ClassLoader getVlifeClassLoader(MavenProject project){
        ClassLoader loader =null;
        try {
            File projectBasedir=project.getBasedir();
            List<URL> classpathUrls = new ArrayList<>();
            // 添加每个Spring Boot应用程序的target目录的路径到classpathUrls列表中
            //            classpathUrls.add(new File(projectBasedir.getPath()+"\\target\\classes").toURI().toURL());
            for(File file:projectBasedir.getParentFile().listFiles()){
                if(new File(file.getPath()+"\\target\\classes").exists()){
                    classpathUrls.add(new File(file.getPath()+"\\target\\classes").toURI().toURL());
                }
            }
            URL[] urls = classpathUrls.toArray(new URL[0]);
            loader=  new URLClassLoader(urls, Thread.currentThread().getContextClassLoader());

        }catch (Exception ex){
            ex.printStackTrace();
        }
        return loader;
    }

    /**
     * Get classloader
     *
     * @param project MavenProject
     * @return ClassLoader
     * @throws MojoExecutionException dd
     */
    public static ClassLoader getRuntimeClassLoader(MavenProject project) throws MojoExecutionException {
        try {
            List<String> runtimeClasspathElements = project.getRuntimeClasspathElements();
            List<String> compileClasspathElements = project.getCompileClasspathElements();
            URL[] runtimeUrls = new URL[runtimeClasspathElements.size() + compileClasspathElements.size()];
            for (int i = 0; i < runtimeClasspathElements.size(); i++) {
                String element = runtimeClasspathElements.get(i);
                runtimeUrls[i] = new File(element).toURI().toURL();
            }
            int j = runtimeClasspathElements.size();
            for (int i = 0; i < compileClasspathElements.size(); i++) {
                String element = compileClasspathElements.get(i);
                runtimeUrls[i + j] = new File(element).toURI().toURL();
            }
            return new URLClassLoader(runtimeUrls, Thread.currentThread().getContextClassLoader());
        } catch (Exception e) {
            throw new MojoExecutionException("Unable to load project runtime !", e);
        }
    }


    public static ClassLoader getRuntimeClassLoader1(MavenProject project) throws MojoExecutionException {
        try {
            List<String> runtimeClasspathElements = project.getRuntimeClasspathElements();
            List<String> compileClasspathElements = project.getCompileClasspathElements();
            URL[] runtimeUrls = new URL[runtimeClasspathElements.size() + compileClasspathElements.size()];
            for (int i = 0; i < runtimeClasspathElements.size(); i++) {
                String element = runtimeClasspathElements.get(i);
                runtimeUrls[i] = new File(element).toURI().toURL();
            }
            int j = runtimeClasspathElements.size();
            for (int i = 0; i < compileClasspathElements.size(); i++) {
                String element = compileClasspathElements.get(i);
                runtimeUrls[i + j] = new File(element).toURI().toURL();
            }
            return new URLClassLoader(runtimeUrls, Thread.currentThread().getContextClassLoader());
        } catch (Exception e) {
            throw new MojoExecutionException("Unable to load project runtime !", e);
        }
    }


    public static List<URL>  getClassUrls(MavenProject project) {
        List<URL> classUrls = new ArrayList<>();
        try {
            List<String> runtimeClasspathElements = project.getRuntimeClasspathElements();
            for (String element : runtimeClasspathElements) {
                classUrls.add(new File(element).toURI().toURL());
            }
        } catch (Exception e) {
            // 处理异常
        }
        return classUrls;
    }
}
