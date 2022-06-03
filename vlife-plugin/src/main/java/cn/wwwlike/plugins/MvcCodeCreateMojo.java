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
import cn.wwwlike.plugins.utils.ClassLoaderUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugins.annotations.LifecyclePhase;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.project.MavenProject;

import java.util.List;

/**
 * mvc框架三层代码自动创建
 *
 * @requiresDependencyResolution compile
 */
@Mojo(name = "codeCreate", defaultPhase = LifecyclePhase.NONE)
public class MvcCodeCreateMojo extends AbstractMojo {
    @Parameter
    private List<String> entityPackages;

    @Parameter(defaultValue = "${project.compileClasspathElements}", readonly = true, required = true)
    private List<String> compilePath;

    @Parameter(defaultValue = "${project}", readonly = true)
    private MavenProject project;

    public void execute() throws MojoExecutionException {
        if (entityPackages == null || entityPackages.size() == 0) {
            throw new MojoExecutionException("entityPackages没有设置");
        }
        for (String entity : entityPackages) {
            String path = entity.substring(0, StringUtils.lastIndexOf(entity, "."));
            new GeneratorMaster().pluginInit(ClassLoaderUtil.getRuntimeClassLoader(project), path);
        }
    }


}