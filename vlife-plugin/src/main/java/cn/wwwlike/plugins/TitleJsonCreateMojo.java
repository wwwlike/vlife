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

import cn.wwwlike.plugins.constant.comment.ClzTag;
import cn.wwwlike.plugins.constant.comment.CommentParser;
import cn.wwwlike.plugins.utils.FileUtil;
import cn.wwwlike.plugins.utils.JsonUtil;
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
import java.util.List;

/**
 * 读取entity里类及字段注释信息到resources里的title.json里
 *
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
            if (entityPackages == null || entityPackages.size() == 0) {
                throw new MojoFailureException("entityPackages没有设置");

            } else {
                entityPackages.stream().forEach(path -> {
                    try {
                        String srcPath = path.replace(".", "/");
                        files.addAll(FileUtils.getFiles(new File(project.getBasedir() + "/src/main/java/" + srcPath), null, null));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }
            List<ClzTag> tags = new ArrayList<>();
            for (File path : files) {
                tags.add(CommentParser.parser(path));
            }
            String filePath = project.getBasedir() + "/src/main/resources/";
            filePath = filePath + "/title.json";
            String data = JsonUtil.toPrettyJson(tags);
            FileUtil.nioWriteFile(data, filePath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}