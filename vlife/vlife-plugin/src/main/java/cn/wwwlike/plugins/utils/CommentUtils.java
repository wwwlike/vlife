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

import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 注释文本工具
 *
 * @author leaf
 * @date 2017/4/3 0003
 */
public class CommentUtils {

    private static Pattern TAG_NAME_COMPILE = Pattern.compile("^@[\\w]+[\\t ]");

    /**
     * 获取注释的类型
     *
     * @param comment 注释文本
     * @return @see @param @resp @return等
     */
    public static String getTagType(String comment) {
        Matcher m = TAG_NAME_COMPILE.matcher(comment);
        if (m.find()) {
            return m.group().trim();
        } else {
            return null;
        }
    }

    /**
     * 解析基本的文本注释
     *
     * @param comment 注释文本
     */
    public static String parseCommentText(String comment) {
        List<String> comments = asCommentList(comment);
        for (String s : comments) {
            if (!s.startsWith("@")) {
                return s;
            }
        }
        return "";
    }

    /**
     * 将注释转为多行文本
     *
     * @param comment 注释文本
     */
    public static List<String> asCommentList(String comment) {
        comment = comment.replaceAll("\\*", "").trim();
        String[] array = comment.split("\n");
        List<String> comments = new ArrayList(array.length);
        int index = 0;
        StringBuilder sb = new StringBuilder();
        for (; index < array.length; index++) {
            String c = array[index].trim();

            if (StringUtils.isBlank(c)) {
                continue;
            }

            String tagType = CommentUtils.getTagType(c);
            if (StringUtils.isBlank(tagType)) {
                sb.append(c);
                sb.append("\n");
            } else {
                break;
            }
        }

        if (sb.length() > 0) {
            sb.deleteCharAt(sb.length() - 1);
            comments.add(sb.toString());
        }

        for (int i = index; i < array.length; i++) {
            String c = array[i].trim();
            if (StringUtils.isNotBlank(c)) {
                comments.add(c);
            }
        }
        return comments;
    }


}