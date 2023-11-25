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

//import sun.reflect.generics.reflectiveObjects.ParameterizedTypeImpl;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * 泛型工具类
 */
public class GenericsUtils {

    /**
     * 根据传入class查询它实现第一个**接口**的泛型里的第一个入参的类型
     *
     * @param clazz
     * @return
     */
    public static Class getGenericType(Class clazz) {

        Type[] types = clazz.getGenericInterfaces();
        if (types.length == 0) {
            return getSuperClassGenricType(clazz);
        }
//        if (types[0] instanceof ParameterizedType) {
//            Type[] types2 = ((ParameterizedTypeImpl) types[0]).getActualTypeArguments();
//            if (types2.length == 0) {
//                return getSuperClassGenricType(clazz);
//            }
//
//            Class entityClz = (Class) types2[0];
//            return entityClz;
//        }
        if (types[0] instanceof ParameterizedType) {
            Type[] types2 = ((ParameterizedType) types[0]).getActualTypeArguments();
            if (types2.length == 0) {
                return getSuperClassGenricType(clazz);
            }

            Class<?> entityClz = (Class<?>) types2[0];
            return entityClz;
        }
        return getSuperClassGenricType(clazz);

    }

    /**
     * 通过反射,获得指定类的父类的泛型参数的实际类型. 如DaoSupport<Buyer>
     *
     * @param clazz clazz 需要反射的类,该类必须继承范型父类
     * @param index 泛型参数所在索引,从0开始.
     * @return 范型参数的实际类型, 如果没有实现ParameterizedType接口，即不支持泛型，所以直接返回
     * <code>Object.class</code>
     */
    @SuppressWarnings("unchecked")
    public static Class getSuperClassGenricType(Class clazz, int index) {

        Type genType = clazz.getGenericSuperclass();


        if (!(genType instanceof ParameterizedType)) {

            return Object.class;
        }


        Type[] params = ((ParameterizedType) genType).getActualTypeArguments();
        if (index >= params.length || index < 0) {

            throw new RuntimeException("你输入的索引"
                    + (index < 0 ? "不能小于0" : "超出了参数的总数"));
        }
        if (!(params[index] instanceof Class)) {

            return Object.class;
        }
        return (Class) params[index];
    }

    /**
     * 通过反射,获得指定类的父类的第一个泛型参数的实际类型. 如DaoSupport<Buyer>
     *
     * @param clazz clazz 需要反射的类,该类必须继承泛型父类
     * @return 泛型参数的实际类型, 如果没有实现ParameterizedType接口，即不支持泛型，所以直接返回
     * <code>Object.class</code>
     */
    @SuppressWarnings("unchecked")
    public static Class getSuperClassGenricType(Class clazz) {

        return getSuperClassGenricType(clazz, 0);
    }

    /**
     * 通过反射,获得方法返回值泛型参数的实际类型. 如: public Map<String, Buyer> getNames(){}
     *
     * @param Method method 方法
     * @param int    index 泛型参数所在索引,从0开始.
     * @return 泛型参数的实际类型, 如果没有实现ParameterizedType接口，即不支持泛型，所以直接返回
     * <code>Object.class</code>
     */
    @SuppressWarnings("unchecked")
    public static Class getMethodGenericReturnType(Method method, int index) {

        Type returnType = method.getGenericReturnType();

        if (returnType instanceof ParameterizedType) {

            ParameterizedType type = (ParameterizedType) returnType;
            Type[] typeArguments = type.getActualTypeArguments();

            if (index >= typeArguments.length || index < 0) {

                throw new RuntimeException("你输入的索引"
                        + (index < 0 ? "不能小于0" : "超出了参数的总数"));
            }
            return (Class) typeArguments[index];
        }
        return Object.class;
    }

    /**
     * 通过反射,获得方法返回值第一个泛型参数的实际类型. 如: public Map<String, Buyer> getNames(){}
     *
     * @param Method method 方法
     * @return 泛型参数的实际类型, 如果没有实现ParameterizedType接口，即不支持泛型，所以直接返回
     * <code>Object.class</code>
     */
    @SuppressWarnings("unchecked")
    public static Class getMethodGenericReturnType(Method method) {

        return getMethodGenericReturnType(method, 0);
    }

    /**
     * 通过反射,获得方法输入参数第index个输入参数的所有泛型参数的实际类型. 如: public void add(Map<String,
     * Buyer> maps, List<String> names){}
     *
     * @param Method method 方法
     * @param int    index 第几个输入参数
     * @return 输入参数的泛型参数的实际类型集合, 如果没有实现ParameterizedType接口，即不支持泛型，所以直接返回空集合
     */
    @SuppressWarnings("unchecked")
    public static List<Class> getMethodGenericParameterTypes(Method method,
                                                             int index) {

        List<Class> results = new ArrayList<Class>();
        Type[] genericParameterTypes = method.getGenericParameterTypes();

        if (index >= genericParameterTypes.length || index < 0) {

            throw new RuntimeException("你输入的索引"
                    + (index < 0 ? "不能小于0" : "超出了参数的总数"));
        }
        Type genericParameterType = genericParameterTypes[index];

        if (genericParameterType instanceof ParameterizedType) {

            ParameterizedType aType = (ParameterizedType) genericParameterType;
            Type[] parameterArgTypes = aType.getActualTypeArguments();
            for (Type parameterArgType : parameterArgTypes) {
                Class parameterArgClass = (Class) parameterArgType;
                results.add(parameterArgClass);
            }
            return results;
        }
        return results;
    }

    /**
     * 通过反射,获得方法输入参数第一个输入参数的所有泛型参数的实际类型. 如: public void add(Map<String, Buyer>
     * maps, List<String> names){}
     *
     * @param Method method 方法
     * @return 输入参数的泛型参数的实际类型集合, 如果没有实现ParameterizedType接口，即不支持泛型，所以直接返回空集合
     */
    @SuppressWarnings("unchecked")
    public static List<Class> getMethodGenericParameterTypes(Method method) {

        return getMethodGenericParameterTypes(method, 0);
    }

    /**
     * 通过反射,获得Field泛型参数的实际类型. 如: public Map<String, Buyer> names;
     *
     * @param Field field 字段
     * @param int   index 泛型参数所在索引,从0开始.
     * @return 泛型参数的实际类型, 如果没有实现ParameterizedType接口，即不支持泛型，所以直接返回
     * <code>Object.class</code>
     */
    @SuppressWarnings("unchecked")
    public static Class getFieldGenericType(Field field, int index) {

        Type genericFieldType = field.getGenericType();

        if (genericFieldType instanceof ParameterizedType) {

            ParameterizedType aType = (ParameterizedType) genericFieldType;
            Type[] fieldArgTypes = aType.getActualTypeArguments();
            if (index >= fieldArgTypes.length || index < 0) {

                throw new RuntimeException("你输入的索引"
                        + (index < 0 ? "不能小于0" : "超出了参数的总数"));
            }
            return (Class) fieldArgTypes[index];
        }
        return Object.class;
    }

    /**
     * 通过反射,获得Field泛型参数的实际类型. 如: public Map<String, Buyer> names;
     *
     * @param Field field 字段
     * @param int   index 泛型参数所在索引,从0开始.
     * @return 泛型参数的实际类型, 如果没有实现ParameterizedType接口，即不支持泛型，所以直接返回
     * <code>Object.class</code>
     */
    @SuppressWarnings("unchecked")
    public static Class getFieldGenericType(Field field) {

        return getFieldGenericType(field, 0);
    }
}  