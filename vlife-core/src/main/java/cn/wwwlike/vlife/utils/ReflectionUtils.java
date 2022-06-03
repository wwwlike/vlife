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

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.util.Assert;

import java.lang.reflect.*;
import java.util.*;

/**
 * 反射工具类.
 * <p>
 * 提供访问私有变量,获取泛型类型Class, 提取集合中元素的属性, 转换字符串到对象等Util函数.
 *
 * @author calvin
 */
public class ReflectionUtils {

    private static Logger logger = LoggerFactory.getLogger(ReflectionUtils.class);

    /**
     * 向上获得所有字段
     *
     * @param objClass
     * @return
     */
    public static List<Field> getAccessibleFieldByClass(Class objClass) {
        List<Field> fields = new ArrayList<>();
        Validate.notNull(objClass, "objClass can't be null");
        for (Class<?> superClass = objClass; superClass != Object.class; superClass = superClass
                .getSuperclass()) {
            fields.addAll(Arrays.asList(superClass.getDeclaredFields()));
        }
        return fields;
    }


    /**
     * 查询指定的字段
     *
     * @param objClass
     * @return
     */
    public static Field getAccessibleFieldByClass(Class objClass, String fieldName) {
        Field field = null;
        Validate.notNull(objClass, "objClass can't be null");
        for (Class<?> superClass = objClass; superClass != Object.class; superClass = superClass
                .getSuperclass()) {
            for (Field temp : Arrays.asList(superClass.getDeclaredFields())) {
                if (temp.getName().equals(fieldName)) {
                    return temp;

                }
            }
        }
        return field;
    }

    /**
     * 调用Getter方法.
     */
    public static Object invokeGetterMethod(Object obj, String propertyName) {
        String getterMethodName = "get" + StringUtils.capitalize(propertyName);
        return invokeMethod(obj, getterMethodName, new Class[]{}, new Object[]{});
    }

    /**
     * 调用Setter方法.使用value的Class来查找Setter方法.
     */
    public static void invokeSetterMethod(Object obj, String propertyName, Object value) {
        invokeSetterMethod(obj, propertyName, value, null);
    }

    /**
     * 调用Setter方法.
     *
     * @param propertyType 用于查找Setter方法,为空时使用value的Class替代.
     */
    public static void invokeSetterMethod(Object obj, String propertyName, Object value, Class<?> propertyType) {
        Class<?> type = propertyType != null ? propertyType : value.getClass();
        String setterMethodName = "set" + StringUtils.capitalize(propertyName);
        invokeMethod(obj, setterMethodName, new Class[]{type}, new Object[]{value});
    }

    /**
     * 直接读取对象属性值, 无视private/protected修饰符, 不经过getter函数.
     */
    public static Object getFieldValue(final Object obj, final String fieldName) {
        Field field = getAccessibleField(obj, fieldName);

        if (field == null) {
            throw new IllegalArgumentException("Could not find field [" + fieldName + "] on target [" + obj + "]");
        }

        Object result = null;
        try {
            result = field.get(obj);
        } catch (IllegalAccessException e) {
            logger.error("不可能抛出的异常{}", e.getMessage());
        }
        return result;
    }

    /**
     * 直接设置对象属性值, 无视private/protected修饰符, 不经过setter函数.
     */
    public static void setFieldValue(final Object obj, final String fieldName, final Object value) {
        Field field = org.springframework.util.ReflectionUtils.findField(obj.getClass(), fieldName);
        field.setAccessible(true);
        if (field != null) {
            org.springframework.util.ReflectionUtils.setField(field, obj, value);
        }
    }

    /**
     * 循环向上转型, 获取对象的DeclaredField, 并强制设置为可访问.
     * <p>
     * 如向上转型到Object仍无法找到, 返回null.
     */
    public static Field getAccessibleField(final Object obj, final String fieldName) {
        Assert.notNull(obj, "object不能为空");
        Assert.hasText(fieldName, "fieldName");
        for (Class<?> superClass = obj.getClass(); superClass != Object.class; superClass = superClass.getSuperclass()) {
            try {
                Field field = superClass.getDeclaredField(fieldName);
                field.setAccessible(true);
                return field;
            } catch (NoSuchFieldException e) {

            }
        }
        return null;
    }

    /**
     * 循环向上转型, 获取对象的DeclaredField, 获取真实filedName
     * <p>
     * 如向上转型到Object仍无法找到, 返回null.
     */
    public static String getAccessibleFieldName(final Object obj, final String fieldName) {
        Assert.notNull(obj, "object不能为空");
        Assert.hasText(fieldName, "fieldName");
        for (Class<?> superClass = obj.getClass(); superClass != Object.class; superClass = superClass.getSuperclass()) {
            Field fields[] = superClass.getDeclaredFields();
            for (Field field : fields) {
                if (field.getName().toUpperCase().equals(fieldName.toUpperCase())) {
                    return field.getName();
                }
            }
        }
        return null;
    }

    /**
     * 直接调用对象方法, 无视private/protected修饰符. 用于一次性调用的情况.
     */
    public static Object invokeMethod(final Object obj, final String methodName, final Class<?>[] parameterTypes,
                                      final Object[] args) {
        Method method = getAccessibleMethod(obj, methodName, parameterTypes);
        if (method == null) {
            throw new IllegalArgumentException("Could not find method [" + methodName + "] on target [" + obj + "]");
        }

        try {
            return method.invoke(obj, args);
        } catch (Exception e) {
            throw convertReflectionExceptionToUnchecked(e);
        }
    }

    /**
     * 循环向上转型, 获取对象的DeclaredMethod,并强制设置为可访问. 如向上转型到Object仍无法找到, 返回null.
     * <p>
     * 用于方法需要被多次调用的情况. 先使用本函数先取得Method,然后调用Method.invoke(Object obj, Object...
     * args)
     */
    public static Method getAccessibleMethod(final Object obj, final String methodName,
                                             final Class<?>... parameterTypes) {
        Assert.notNull(obj, "object不能为空");

        for (Class<?> superClass = obj.getClass(); superClass != Object.class; superClass = superClass.getSuperclass()) {
            try {
                Method method = superClass.getDeclaredMethod(methodName, parameterTypes);

                method.setAccessible(true);

                return method;

            } catch (NoSuchMethodException e) {

            }
        }
        return null;
    }

    /**
     * 利用某个对象里的构造方法,里的入参对象
     *
     * @param clazz
     * @param name
     * @param
     * @return
     */
    public static Method findMethodByObjConstructor(Class<?> clazz, String name, @Nullable Object obj) {
        Constructor[] cons = obj.getClass().getConstructors();
        Method method = null;
        for (Constructor constructor : cons) {
            method = findMethod(clazz, name, constructor.getParameterTypes());
            if (method != null) {
                break;
            }
        }
        return method;
    }


    @Nullable
    public static Method findMethod(Class<?> clazz, String name, @Nullable Class<?>... paramTypes) {
        Assert.notNull(clazz, "Class must not be null");
        Assert.notNull(name, "Method name must not be null");
        Class<?> searchType = clazz;
        while (searchType != null) {
            Method[] methods = (searchType.isInterface() ? searchType.getMethods() :
                    org.springframework.util.ReflectionUtils.getDeclaredMethods(searchType));
            for (Method method : methods) {
                if (name.equals(method.getName()) && hasSameParams(method, paramTypes)) {
                    return method;
                }
            }
            searchType = searchType.getSuperclass();
        }
        return null;
    }


    private static boolean hasSameParams1(Method method, Class<?>[] paramTypes) {
        return (paramTypes.length == method.getParameterCount() &&
                Arrays.equals(paramTypes, method.getParameterTypes()));
    }

    private static boolean hasSameParams(Method method, Class<?>[] paramTypes) {
        if (method.getParameterTypes() == null && paramTypes == null) {
            return true;
        } else if (paramTypes.length == method.getParameterCount()) {
            int i = 0;
            for (Class a : paramTypes) {

                if (!method.getParameterTypes()[i].isAssignableFrom(a)) {
                    return false;
                }
                i++;
            }
            return true;
        } else if (method.getParameterCount() == 1) {

            if (method.getParameterTypes()[0].isAssignableFrom(paramTypes.getClass())) {
                return true;
            }
        }
        return false;
    }


    /**
     * 通过反射, 获得Class定义中声明的父类的泛型参数的类型. 如无法找到, 返回Object.class. eg. public UserDao
     * extends HibernateDao<User>
     *
     * @param clazz The class to introspect
     * @return the first generic declaration, or Object.class if cannot be
     * determined
     */
    @SuppressWarnings("unchecked")
    public static <T> Class<T> getSuperClassGenricType(final Class clazz) {
        return getSuperClassGenricType(clazz, 0);
    }

    /**
     * 通过反射, 获得Class定义中声明的父类的泛型参数的类型. 如无法找到, 返回Object.class.
     * <p>
     * 如public UserDao extends HibernateDao<User,Long>
     *
     * @param clazz clazz The class to introspect
     * @param index the Index of the generic ddeclaration,start from 0.
     * @return the index generic declaration, or Object.class if cannot be
     * determined
     */
    @SuppressWarnings("unchecked")
    public static Class getSuperClassGenricType(final Class clazz, final int index) {

        Type genType = clazz.getGenericSuperclass();

        if (!(genType instanceof ParameterizedType)) {
            logger.warn(clazz.getSimpleName() + "'s superclass not ParameterizedType");
            return Object.class;
        }

        Type[] params = ((ParameterizedType) genType).getActualTypeArguments();

        if (index >= params.length || index < 0) {
            logger.warn("Index: " + index + ", Size of " + clazz.getSimpleName() + "'s Parameterized Type: "
                    + params.length);
            return Object.class;
        }
        if (!(params[index] instanceof Class)) {
            logger.warn(clazz.getSimpleName() + " not set the actual class on superclass generic parameter");
            return Object.class;
        }

        return (Class) params[index];
    }

    /**
     * 将反射时的checked exception转换为unchecked exception.
     */
    public static RuntimeException convertReflectionExceptionToUnchecked(Exception e) {
        if (e instanceof IllegalAccessException || e instanceof IllegalArgumentException
                || e instanceof NoSuchMethodException) {
            return new IllegalArgumentException("Reflection Exception.", e);
        } else if (e instanceof InvocationTargetException) {
            return new RuntimeException("Reflection Exception.", ((InvocationTargetException) e).getTargetException());
        } else if (e instanceof RuntimeException) {
            return (RuntimeException) e;
        }
        return new RuntimeException("Unexpected Checked Exception.", e);
    }

    @SuppressWarnings("unchecked")
    public static void setObjectFieldsEmpty(Object obj) {

        Class objClass = obj.getClass();
        Method[] objmethods = objClass.getDeclaredMethods();
        Map objMeMap = new HashMap();
        for (int i = 0; i < objmethods.length; i++) {
            Method method = objmethods[i];
            objMeMap.put(method.getName(), method);
        }
        for (int i = 0; i < objmethods.length; i++) {
            {
                String methodName = objmethods[i].getName();
                if (methodName != null && methodName.startsWith("get")) {
                    try {
                        Object returnObj = objmethods[i].invoke(obj, new Object[0]);
                        Method setmethod = (Method) objMeMap.get("set" + methodName.split("get")[1]);
                        if (returnObj != null) {
                            returnObj = null;
                        }
                        setmethod.invoke(obj, returnObj);
                    } catch (IllegalArgumentException e) {

                        logger.error("setObjectFieldsEmpty error", e);
                    } catch (IllegalAccessException e) {

                        logger.error("setObjectFieldsEmpty error", e);
                    } catch (InvocationTargetException e) {

                        logger.error("setObjectFieldsEmpty error", e);
                    }
                }
            }

        }
    }

}
