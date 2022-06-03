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

import cn.wwwlike.vlife.base.Item;
import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 本框架写得一些工具方法
 */
public class VlifeUtils {
    /**
     * 将实体类路径添加到集合里；被包涵的和一致的不用被添加；
     *
     * @param existList 已经有的类路径列表<数组>
     * @param items     本次要添加的数组路径
     * @return
     */
    public static List<List<Class<? extends Item>>> addItemClzArray(List<List<Class<? extends Item>>> existList, List<Class<? extends Item>> items) {
        if (existList.size() == 0) {
            existList.add(items);
        } else {
            boolean flag = false;
            for (int i = 0; i < existList.size(); i++) {
                int relation = itemRelation(existList.get(i), items);
                if (relation == 3) {
                    existList.remove(i);
                    flag = true;
                    break;
                } else if (relation == 4 && i == existList.size() - 1) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                existList.add(items);
            }
        }
        return existList;
    }

    /**
     * Class数组 A和 B的 对比包涵关系
     *
     * @param a 数组A
     * @param b 数组B
     * @return 1相等 2 a包涵b 3 b包涵a 4不相等
     */
    private static Integer itemRelation(List<Class<? extends Item>> a, List<Class<? extends Item>> b) {
        for (int i = 0; i < a.size(); i++) {
            if (a.get(i) == b.get(i)) {
                if (i == a.size() - 1 && b.size() > a.size()) {
                    return 3;
                } else if (i == a.size() - 1 && b.size() == a.size()) {
                    return 1;
                } else if (i == b.size() - 1 && b.size() < a.size()) {
                    return 2;
                }
            } else {
                return 4;
            }
        }
        return null;
    }


    /**
     * 从集合里去每个对象里的指定属性取值
     * 在表里查询指定的字段集合，返回queryDsl形式
     * 找对象里所有字段的name 放入到string 数组里
     * basic 查询基本数据类型字段, false :chax
     * 有问题： 取出的fieldName 不是数组怎么办
     */
    public static <T> T[] getCollectionFieldValByName(Collection list, String fieldName, Class<T> v) {
        T[] a = (T[]) Array.newInstance(v, list.size());
        Stream<Object> stream = list.stream();
        return stream.map(p -> {

            return (T) ReflectionUtils.invokeGetterMethod(p, fieldName);
        }).collect(Collectors.toList()).toArray(a);
    }

    /**
     * 静态工具方法
     * 根据查询路径获得其中的左连接Clazz的查询路径
     *
     * @return
     */
    public static List<Class<? extends Item>> leftJoinPathByQueryPath(List queryPath) {
        List<Class<? extends Item>> total = new ArrayList();
        if (queryPath != null) {
            for (Object obj : queryPath) {
                if (obj instanceof Class) {
                    total.add((Class) obj);
                } else if (obj instanceof List) {
                    break;
                }
            }
        }
        return total;
    }

    /**
     * 递归获取全量路径
     *
     * @param total         全量路径字符串形式的表达式拼接-> a_b__c__d
     *                      ——>select * from a left b where b.id in (select c.b_id from c where exist (select id from d where d.c_id=c.id)))
     * @param fullQueryPath
     * @return
     */
    public static String fullPath(String total, List fullQueryPath, Boolean isFirst) {
        for (int i = 0; i < fullQueryPath.size(); i++) {
            Object obj = fullQueryPath.get(i);
            String fix = "_";
            if (isFirst == false && i == 0) {
                fix = "__";
            }
            if (obj instanceof List) {
                total = fullPath(total, (List) obj, false);
            } else if (obj instanceof Class) {
                total = total + (total.equals("") ? "" : fix) + StringUtils.uncapitalize(((Class) obj).getSimpleName());
            }
        }
        return total;
    }

    /**
     * 把查询的对象 class信息打平
     *
     * @param queryPath
     * @return
     */
    public static List<Class> queryPathClazzList(List queryPath) {
        List<Class> clazz = new ArrayList<>();
        for (Object obj : queryPath) {
            if (obj instanceof Class) {
                clazz.add((Class) obj);
            } else {
                clazz.addAll(queryPathClazzList((List) obj));
            }
        }
        return clazz;
    }

    /**
     * 去掉最后一个queryPath的最后一个对象 (使用该方法前对queryPath进行拷贝)
     *
     * @param clone_queryPath 浅拷贝的对象
     * @return
     */
    public static List removeQueryPathLast(List clone_queryPath) {
        List reList = new ArrayList();
        for (int i = 0; i < clone_queryPath.size(); i++) {
            if (i != clone_queryPath.size() - 1 || clone_queryPath.get(i) instanceof List) {
                if (clone_queryPath.get(i) instanceof Class) {
                    reList.add(clone_queryPath.get(i));
                } else {
                    List subList = removeQueryPathLast((List) clone_queryPath.get(i));
                    if (subList.size() > 0) {
                        reList.add(subList);
                    }
                }
            }
        }
        return reList;
    }

    /**
     * 数组反转
     *
     * @param array
     * @return
     */
    public static String[] reverseArray(String[] array) {
        String[] newArray = new String[array.length];
        for (int i = 0; i < newArray.length; i++) {
            newArray[i] = array[array.length - i - 1];
        }
        return newArray;
    }
}
