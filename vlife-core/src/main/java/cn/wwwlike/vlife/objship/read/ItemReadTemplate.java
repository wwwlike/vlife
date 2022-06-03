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

package cn.wwwlike.vlife.objship.read;

import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.*;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.PackageUtil;
import cn.wwwlike.vlife.utils.VlifeUtils;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.*;


/**
 * item-bean类型对象->vo,save,entity读取的模板模板类
 *
 * @param <T>
 */
@Data
public abstract class ItemReadTemplate<T extends BeanDto> implements ClazzRead<T> {

    protected List<T> readAll;
    protected List<FieldDto> fieldDtoList = null;
    private List<String> ignores = Arrays.asList("groupBys");

    public static String getClzType(Class clz) {
        if (clz.isArray()) {
            return LIST;
        } else if (BeanUtils.isSimpleProperty(clz)) {
            return BASIC;
        } else if (Collection.class.isAssignableFrom(clz)) {
            return LIST;
        } else if (Item.class.isAssignableFrom(clz)) {
            return ENTITY;
        } else if (VoBean.class.isAssignableFrom(clz)) {
            return VO;
        } else if (SaveBean.class.isAssignableFrom(clz)) {
            return SAVE;
        } else if (ReqDto.class.isAssignableFrom(clz)) {
            return REQ;
        } else {
            return API;
        }
    }

    /**
     * 读指定包路径的类路径到列表
     *
     * @param packageNames 要读取的包路径
     * @return 包路径下的所有类路径放入到集合里
     */
    public static List<String> readPackage(String... packageNames) {
        List<String> classStr = new ArrayList<>();
        for (String packageName : packageNames) {
            List<String> classNames = PackageUtil.getClassName(packageName, true);
            if (classNames != null) {
                classStr.addAll(classNames);
            }
        }


        return classStr;
    }


    /**
     * 读指定包路径的类路径到列表
     *
     * @param packageNames 要读取的包路径
     * @return 包路径下的所有类路径放入到集合里
     */
    public static List<String> readPackage(ClassLoader classLoader, String... packageNames) {
        List<String> classStr = new ArrayList<>();
        for (String packageName : packageNames) {
            List<String> classNames = PackageUtil.getClassName(classLoader, packageName, true);
            if (classNames != null) {
                classStr.addAll(classNames);
            }
        }
        return classStr;
    }

    /**
     * bean类型通用处理
     *
     * @param dto
     * @param s
     * @return
     */
    protected T superRead(T dto, Class s) {
        dto.setType(StringUtils.uncapitalize(s.getSimpleName()));
        dto.setTitle(dto.getType());

        dto.setClz(s);
        return dto;
    }

    /**
     * 核心读取方法
     * 读取集合里需要进类进行解析存入到read里
     *
     * @param clazzPackageUrl 类全量路径
     * @return 返回类信息
     * @throws ClassNotFoundException
     */
    public List<T> read(ClassLoader loader, List<String> clazzPackageUrl) throws ClassNotFoundException {
        readAll = new ArrayList<>();
        for (String url : clazzPackageUrl) {
            Class clazz = null;
            try {
                clazz = loader.loadClass(url);
            } catch (Exception ex) {
                ex.printStackTrace();
                continue;
            }

            T dto = readInfo(clazz);

            if (dto != null) {

                if (!VCT.ITEM_STATE.ERROR.equals(dto.getState())) {
                    fieldDtoList = new ArrayList<>();
                    Field[] fields = clazz.getDeclaredFields();

                    for (Field field : fields) {
                        if (!ignores.contains(field.getName())) {
                            FieldDto<T> fieldDto = FieldRead.getInstance().read(field, dto);
                            if (VCT.ITEM_STATE.ERROR.equals(fieldDto.getState())) {
                                dto.setState(VCT.ITEM_STATE.ERROR);
                            }
                            fieldDtoList.add(fieldDto);
                        } else {
                            System.out.println(field.getName());
                        }
                    }
                    dto.setFields(fieldDtoList);
                }

                readAll.add(dto);
            }

        }
        relation();


        return readAll;
    }

    @Override
    public T finished(T t) {
        return null;
    }

    /**
     * 可变参数方式读取
     */
    public List<T> read(ClassLoader loader, String... clazzPackageUrl) throws ClassNotFoundException {
        return read(loader, Arrays.asList(clazzPackageUrl));
    }

    /**
     * 路径查找
     *
     * @param path
     * @return
     */
    public Class<? extends Item>[] pathClz(String... path) {
        Class[] clz = new Class[path.length - 1];
        for (int i = 0; i < clz.length; i++) {
            clz[i] = GlobalData.entityDto(path[i]).getClz();
        }
        return clz;
    }


    /**
     * 字段查找
     *
     * @param root      实体类信息
     * @param fieldName 查找的字段
     * @return
     */
    public Field matchField(EntityDto root, String fieldName) {
        String[] fullPath = fieldName.split("_");
        if (fieldName.indexOf("_") != -1) {
            return matchFieldByLeftPath(root, fullPath);
        } else {
            return FieldRead.match(root.getClz(), fieldName);
        }
    }

    /**
     * 通过左查询去找字段从aaa_bbb_fieldName里验证并找到字段
     *
     * @param root 查询起点跟路径实体类对象信息
     * @param path 查询字段用“_”分解后的数组
     * @return
     */
    protected Field matchFieldByLeftPath(Class<? extends Item> root, String... path) {
        return matchFieldByLeftPath(GlobalData.entityDto(root), path);
    }

    protected Field matchFieldByLeftPath(EntityDto root, String... path) {
        List<Class<? extends Item>> clzs = root.getFkTableClz();
        String first = path[0];
        EntityDto next = null;
        for (Class clz : clzs) {
            if (clz.getSimpleName().equalsIgnoreCase(first)) {
                next = GlobalData.entityDto(clz);
                break;
            }
        }
        if (next != null) {
            if (path.length == 2) {
                return FieldRead.match(next.getClz(), path[1]);
            } else {

                return matchFieldByLeftPath(next, Arrays.copyOfRange(path, 1, path.length));
            }
        } else {
            return null;
        }
    }

    /**
     * 基础字段匹配查找，都是本表找不到的
     * 1. 没有下划线的匹配
     * 2. 有下划线的匹配
     *
     * @param item     当前 vo ,req字段；
     * @param fieldDto
     */
    protected <T extends NotEntityDto> List basicFieldMatch(T item, FieldDto fieldDto) {
        EntityDto entityDto = GlobalData.entityDto(item.getEntityClz());
        List<Class<? extends Item>> lefts = entityDto.getFkTableClz();
        List<Class<? extends Item>> rights = entityDto.getRelationTableClz();
        Field matchf = null;
        String voFieldName = fieldDto.getPathName();
        int has_index = voFieldName.indexOf("_");
        if (has_index == -1) {
            for (Class<? extends Item> inItemClz : lefts) {
                matchf = FieldRead.match(inItemClz, voFieldName);

                if (matchf != null) {
                    fieldDto.setEntityClz(inItemClz);

                    fieldDto.setEntityType(inItemClz.getSimpleName());
                    fieldDto.setEntityFieldName(matchf.getName());

                    fieldDto.setState(VCT.ITEM_STATE.NORMAL);
                    return Arrays.asList(entityDto.getClz(), inItemClz);
                }
            }

            for (Class<? extends Item> outItemClz : rights) {
                matchf = FieldRead.match(outItemClz, voFieldName);
                if (matchf != null) {
                    fieldDto.setEntityClz(outItemClz);

                    fieldDto.setEntityType(outItemClz.getSimpleName());
                    fieldDto.setEntityFieldName(matchf.getName());

                    fieldDto.setState(VCT.ITEM_STATE.NORMAL);

                    return Arrays.asList(entityDto.getClz(), Arrays.asList(outItemClz));
                }
            }
        } else {
            String[] path = voFieldName.split("_");

            Class itemClz = _MatchAndSetEntityPath(fieldDto, BASIC.equals(fieldDto.getFieldType()) ? true : false);
            if (itemClz != null) {
                matchf = FieldRead.match(itemClz, path[path.length - 1]);
            }
            if (matchf != null) {


                fieldDto.setEntityClz(itemClz);
                fieldDto.setEntityFieldName(matchf.getName());
                fieldDto.setEntityType(itemClz.getSimpleName());

                fieldDto.setState(VCT.ITEM_STATE.NORMAL);
                return fieldDto.getQueryPath();
            }
        }
        if (fieldDto.getEntityFieldName() == null) {
            fieldDto.setState(VCT.ITEM_STATE.ERROR);
        }
        return null;
    }


    /**
     * 复杂的五类对象设置 fieldDto里的相关信息
     * 查询结果集(VODTO)和保存的结果集里(saveDto)的以下务类对象在read的relation里会触发该方法的调用
     * list<VO>,
     * LIST<ITEM>,
     * List<String>, —>可能取不到entity
     * vo,
     * entity, 类型对象注入进行匹配，
     *
     * @param fieldDto     VO里注入的对象字段信息
     * @param iocEntityDto 被注入实体类VO对象信息
     * @param <T>
     * @return 对匹配信息进行设置到 fieldDto里，state =-1则匹配失败
     */
    protected <T extends ReqVoDto> FieldDto iocReverseMatch(FieldDto fieldDto, EntityDto iocEntityDto) {
        String fieldType = fieldDto.getFieldType();
        String voFieldName = fieldDto.getPathName();
        Class fieldClz = fieldDto.getClz();

        Class<? extends Item> entityClz = Item.class.isAssignableFrom(fieldClz) ? fieldClz : GenericsUtils.getGenericType(fieldClz);

        if (voFieldName.indexOf("_") != -1) {
            entityClz = _MatchAndSetEntityPath(fieldDto, false);
        } else {
            Class fieldEntityClz = fieldDto.getItemClz();
            if (!Item.class.isAssignableFrom(fieldEntityClz)) {
                fieldEntityClz = GenericsUtils.getGenericType(fieldEntityClz);
            }

            if (LIST.equals(fieldType) && iocEntityDto.getFkMap().get(fieldEntityClz) == null) {
                fieldDto.setQueryPath(entityClz, fieldEntityClz);

            } else if (!LIST.equals(fieldType) && iocEntityDto.getFkMap().get(entityClz) != null) {
                List list = new ArrayList<>();
                list.add(fieldEntityClz);
                fieldDto.setQueryPath(entityClz, list);
            }
        }
        if (entityClz != null) {
            fieldDto.setEntityClz(entityClz);
            fieldDto.setEntityType(StringUtils.uncapitalize(entityClz.getSimpleName()));
        }
        return fieldDto;
    }


    /**
     * 返回字段所在的实体类;
     * VO类型的对象查找IOC注入的匹配(主要是要找到查询到这个对象，相对于 item的实体类的路径)
     *
     * @param fieldDto    对有下划线的字段信息进行匹配找到他的路径    注入的字段信息(vo or entity)
     * @param leftToRight 查询顺序，字段是从左往右(查询条件req)， 对象注入(ioc)是从右往左(vo,save)
     *                    这里可以改为判断字段类型，来决定是true of false
     * @param <T>         返回数据存在的最后一个类信息，如果返回空，则说明 “_” 路径有错误
     * @return
     */
    protected <T extends ReqVoDto> Class<? extends Item> _MatchAndSetEntityPath(FieldDto fieldDto, Boolean leftToRight) {
        String voFieldName = fieldDto.getPathName();
        if (voFieldName.indexOf("_") == -1) {
            return null;
        }
        String[] _entityNames = voFieldName.split("_");

        String fieldType = fieldDto.getFieldType();
        if (BASIC.equals(fieldType) || !IdBean.class.isAssignableFrom(fieldDto.getClz())) {
            _entityNames = Arrays.copyOfRange(_entityNames, 0, _entityNames.length - 1);
        }

        if (!leftToRight) {
            _entityNames = VlifeUtils.reverseArray(_entityNames);
        }
        List entityNameList = Arrays.asList(_entityNames);

        List<Class> entityClzPaths = (List<Class>) entityNameList.stream().map(s -> {
            if (s.getClass() == String.class) {
                return GlobalData.entityDto((String) s).clz;
            } else {
                return s;
            }
        }).collect(Collectors.toList());

        Class itemEntityClz = ((NotEntityDto) fieldDto.getItemDto()).getEntityClz();

        if (leftToRight) {
            entityClzPaths.add(0, itemEntityClz);
        } else {
            entityClzPaths.add(itemEntityClz);
        }

        List queryPath = createQueryPath(entityClzPaths);
        fieldDto.setQueryPath(queryPath);


        if (leftToRight)
            return entityClzPaths.get(entityClzPaths.size() - 1);
        else
            return entityClzPaths.get(0);

    }

    /**
     * 顺序的表关系进来，转换成复杂的嵌套型的表关系
     *
     * @param entityClzPaths
     * @return
     */
    private List createQueryPath1(List<Class> entityClzPaths) {
        int left = 1;
        int subQuery = 2;

        Class before = null;
        List list = new ArrayList();
        List currList = list;
        List sub = null;
        for (Class clz : entityClzPaths) {
            if (before == null) {
                list.add(clz);
            } else {
                int tablesRelation = checkTableFieldRelation(before, clz);
                if (tablesRelation == 1) {
                    if (sub == null) {
                        list.add(clz);
                    } else {
                        sub.add(clz);
                    }
                } else {
                    if (sub == null) {
                        sub = new ArrayList();
                        list.add(clz);
                    } else {
                        sub.add(clz);
                    }
                }
            }
            before = clz;
        }
        return list;
    }


    /**
     * 顺序的表关系进来，转换成复杂的嵌套型的表关系(结果是对的，不易读)
     *
     * @param entityClzPaths
     * @return
     */
    private List createQueryPath(List<Class> entityClzPaths) {
        int left = 1;
        int right = 2;

        List list = new ArrayList();
        list.add(entityClzPaths.get(0));
        List curr = list;
        List sub = null;
        Class before = null;
        for (int i = 1; i < entityClzPaths.size(); i++) {
            Class clz = entityClzPaths.get(i);
            int fx = checkTableFieldRelation(before == null ? entityClzPaths.get(0) : before, clz);
            if (fx == 0) {
                return null;
            }
            before = clz;
            if (left == fx && sub == null) {
                curr.add(clz);
            } else if (left == fx && sub != null) {
                sub.add(clz);
            } else if (right == fx && sub == null) {
                sub = new ArrayList();
                sub.add(clz);
                curr.add(sub);
            } else if (right == fx && sub != null) {
                curr = sub;
                sub = new ArrayList();
                sub.add(clz);
                curr.add(sub);
            }
        }
        return list;
    }

    /**
     * 表1与表2的关系
     *
     * @param table
     * @param table2
     * @return 0无关系 1左连接 2右连接
     */
    private int checkTableFieldRelation(Class<? extends Item> table, Class<? extends Item> table2) {
        EntityDto entityDto = GlobalData.entityDto(table);
        List<Class<? extends Item>> lefts = entityDto.getFkTableClz();
        List<Class<? extends Item>> rights = entityDto.getRelationTableClz();
        if (lefts.contains(table2))
            return 1;
        if (rights.contains(table2))
            return 2;
        return 0;
    }

}
