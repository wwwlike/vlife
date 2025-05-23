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
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.*;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.query.CustomQuery;
import cn.wwwlike.vlife.utils.FileUtil;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.PackageUtil;
import cn.wwwlike.vlife.utils.VlifeUtils;
import com.google.common.reflect.TypeToken;
import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.querydsl.core.util.FileUtils;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.lang.reflect.Field;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.*;


/**
 * 模型元数据信息读取模板类
 */
@Data
public abstract class ItemReadTemplate<T extends BeanDto> implements ClazzRead<T> {
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    /**
     * title.json注释信息读取
     */
    protected static List<ClzTag> clzTags=null;
    /**
     * 读取完成后(relation里设置),开放共享的模型信息;
     */
    protected static List<EntityDto> infos = null;
    protected static List<VoDto> voDtos = null;
    protected static List<ReqDto> reqDtos = null;
    protected static List<SaveDto> saveDtos=null;
    protected static List<BeanDto> beanDtos=null;
    /**
     * 实现类读取的类信息
     */
    protected List<T> readAll;
    /**
     * 类的字段信息
     */
    protected List<FieldDto> fieldDtoList = null;
    private List<String> ignores = Arrays.asList("groupBys");
    /**
     * titleJson信息读取
     * 1. 默认classPath里查找,发布模式
     * 2. 没有则根据文件路径查找,插件模式
     */
    public void readTitleJson(){
        try{
            String json =null;
            Resource resource = new ClassPathResource("title.json");
            if(resource.isFile()){//classpath查找 开发环境
                InputStream is = resource.getInputStream();
                json = FileUtil.getFileContent(is);
            }else{
                File jsonFile =ResourceUtils.getFile("./src/main/resources/title.json");
                //整体项目运行install
                if(!jsonFile.exists()){
                    jsonFile =ResourceUtils.getFile("./vlife-admin/src/main/resources/title.json");
                }
                if(jsonFile.isFile()){//插件使用
                    json= new String(Files.readAllBytes(jsonFile.toPath()));
                }else{// jar包使用
                    InputStream is = ClassPathResource.class.getClassLoader().getResourceAsStream("/title.json");
                    if(is!=null){
                        json = FileUtil.getFileContent(is);
                    }
                }
            }
            if(json!=null){
                clzTags=GSON.fromJson(json, new TypeToken<List<ClzTag>>(){}.getType());
            } else{
                logger.warn("no comments,because not created title.json with vlife-plugin");
            }
        }catch (IOException ioe){
            ioe.printStackTrace();
        }
    }

    public static String getClzType(Class clz) {
        if (clz.isArray()) {
            return LIST;
        } else if (BeanUtils.isSimpleProperty(clz)) {
            return BASIC;
        } else if (Collection.class.isAssignableFrom(clz)) {
            return LIST;
        } else if (Item.class.isAssignableFrom(clz)) {
            return ENTITY;
        }  else if (SaveBean.class.isAssignableFrom(clz)) {
            return DTO;
        } else if (VoBean.class.isAssignableFrom(clz)) {
            return VO;
        }else if (ReqDto.class.isAssignableFrom(clz)) {
            return REQ;
        } else {
            return API;
        }
    }

    /**
     * 读指定包路径的类路径到列表
     * @param packageNames 要读取的包路径
     * @return 包路径下的所有类路径放入到集合里
     */
    public static List<String> readPackage(String... packageNames) {
        List<String> classStr = new ArrayList<>();
        for (String packageName : packageNames) {
            Set<String> classNames = PackageUtil.getClassName(packageName, true);
            if (classNames != null) {
                for(String className : classNames){
                    classStr.add(className.replace("BOOT-INF.classes.",""));
                }
            }
        }
        return classStr;
    }

    /**
     * 查询指定接口的实现类信息
     * @param interfaceClass 接口
     * @param classLoader 类classloader
     * @param <T>
     * @return
     * @throws IOException
     * @throws ClassNotFoundException
     */
    public static <T> List<Class<? extends T>> findImplementations(Class<T> interfaceClass, ClassLoader classLoader) throws IOException, ClassNotFoundException {
        List<Class<? extends T>> implementations = new ArrayList<>();

        // 在 classpath 中查找所有 jar 包
        Enumeration<URL> resources = classLoader.getResources("META-INF/services/" + interfaceClass.getName());

        while (resources.hasMoreElements()) {
            URL resource = resources.nextElement();

            // 读取每个 jar 包中的配置文件里的实现类名
            try (InputStream in = resource.openStream()) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8));
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    // 加载实现类
                    Class<?> implClass = Class.forName(line, true, classLoader);
                    // 判断实现类是否是接口的子类，并添加到结果列表中
                    if (interfaceClass.isAssignableFrom(implClass)) {
                        implementations.add((Class<? extends T>) implClass);
                    }
                }
            }
        }
        return implementations;
    }
    /**
     * 读指定包路径的类路径到列表
     * @param packageNames 要读取的包路径
     * @return 包路径下的所有类路径放入到集合里
     */
    public static List<String> readPackage(ClassLoader classLoader, String... packageNames) {
        Set<String> classStr = new HashSet<>();
        for (String packageName : packageNames) {
            Set<String> classNames = PackageUtil.getClassName(classLoader, packageName, true);
            if (classNames != null) {
                for(String classFullName : classNames){
                    classStr.add(classFullName.replace("BOOT-INF.classes.",""));
                }
            }
        }
        String regex = "^.*\\.Q[A-Z][a-zA-Z0-9]*$";  //dsl生成类匹配正则
        //指定包的数据
        List<String> classPaths= classStr.stream().filter(
                classFullName->(classFullName.indexOf(".entity.")!=-1||
                        classFullName.indexOf(".req.")!=-1||
                        classFullName.indexOf(".vo.")!=-1||
                        classFullName.indexOf(".item.")!=-1||
                        classFullName.indexOf(".do.")!=-1||
                        classFullName.indexOf(".dto.")!=-1)
                        ).filter(classFullName->classFullName.indexOf("VlifeQuery")==-1&&
                classFullName.indexOf("PageQuery")==-1).collect(Collectors.toList());
        List<String> models=new ArrayList<>();
        for (String classPath : classPaths) {
            try {
                Class<?> clazz = classLoader.loadClass(classPath);
                if (!classPath.matches(regex)&& isModel(clazz)) {
                    models.add(classPath);
                }
            }catch (Exception ex){
                ex.printStackTrace();
            }
        }
        return models;
    }

    public static boolean isModel(Class model){
        return DbEntity.class.isAssignableFrom(model)||SaveBean.class.isAssignableFrom(model)||VoBean.class.isAssignableFrom(model)|| CustomQuery.class.isAssignableFrom(model);
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
        dto.setClz(s);
        return dto;
    }

    /**
     * 核心读取方法
     * 读取集合里需要进类进行解析存入到read里
     * @param clazzPackageUrl 类全量路径
     * @return 返回类信息
     * @throws ClassNotFoundException
     */
    public List<T> read(ClassLoader loader, List<String> clazzPackageUrl) throws ClassNotFoundException {
        readAll = new ArrayList<>();
        for (String url : clazzPackageUrl) {
            Class clazz = null;
            try {
                if(url.startsWith("BOOT-INF.classes.")){
                    url=url.substring(17);
                }
                clazz = loader.loadClass(url);
            } catch (Exception ex) {
                ex.printStackTrace();
                continue;
            }
            try{
            T dto = readInfo(clazz);
            if (dto != null) {
                    fieldDtoList = new ArrayList<>();
                    /* item需要父类属性；其他模型不需要??? */
//                    Field[] fields = Item.class.isAssignableFrom(clazz)?clazz.getFields():clazz.getDeclaredFields();
                    /*13-2-14 改为需要, 如有字段不需要则调整为私有属性 */
                    Field[] fields = clazz.getFields();
                    for (Field field : fields) {
                        if (!ignores.contains(field.getName())) {
                            FieldDto<T> fieldDto = FieldRead.getInstance().read(field, dto);
                            if (VCT.ITEM_STATE.ERROR.equals(fieldDto.getState())) {
                                dto.setState(VCT.ITEM_STATE.ERROR);
                            }
                            fieldDtoList.add(fieldDto);
                        } else {
//                            System.out.println(field.getName());
                        }
                    dto.setFields(fieldDtoList);
                }
                readAll.add(dto);
            }
            }catch (Exception exception){
                exception.printStackTrace();
            }
        }
        /* 关联信息读取*/
        try{
        relation();
        /* 注释信息读取*/
        for(T beanInfo:readAll){
            if(clzTags!=null) {
                Optional<ClzTag> optional = clzTags.stream().filter(tag ->
                        tag.getEntityName() != null &&
                                tag.getEntityName().equalsIgnoreCase(beanInfo.getType())
                ).findFirst();

                if (optional.isPresent()) {
                    //用json写title
                    commentRead(beanInfo, optional.get());
                }
            }
            //其他模型用实体类的注释写title
            if(beanInfo instanceof ModelDto ){
                commentPerfect(beanInfo);
            }
        }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return readAll;
    }

    /**
     * 用实体类的注释完善其他模型,其他模型字段如果为空就覆盖;
     * @param beanInfo
     */
    private T commentPerfect(T beanInfo){
        if(StringUtils.isEmpty(beanInfo.getTitle())&&((ModelDto)beanInfo).getEntityDto()!=null){
            beanInfo.setTitle(((ModelDto)beanInfo).getEntityDto().getTitle() + "(视图)");
        }
        List<FieldDto> fieldDtos = beanInfo.getFields();
        /* 所有字段找对应的实体的字段title,字段是对象则找对象, vo save 存在嵌套注入的情况*/
        if(fieldDtos!=null ){
        fieldDtos.stream().forEach(modelField -> {
            infos.stream().forEach(entityDto -> {
                if (modelField.getEntityClz() != null && entityDto.getClz() == modelField.getEntityClz()) {
                    if (modelField.getEntityFieldName() != null) {
                        //1：在对应实体类找字段
                        Optional<FieldDto> optionalFieldDto = entityDto.getFields().stream().filter(ff -> {
                            return ff.getFieldName().equals(modelField.getEntityFieldName()) && ff.getItemClz() == modelField.getEntityClz();
                        }).findFirst();

                        if (optionalFieldDto.isPresent()&&
                                (modelField.getTitle()==null||
                                        modelField.getTitle().equals(modelField.getFieldName()))) {
                            modelField.setTitle(optionalFieldDto.get().getTitle());
                        }
                    } else if(modelField.getTitle()==null){
                        modelField.setTitle(entityDto.getTitle());
                    }
                }
            });
        });
        }
        return beanInfo;

    }

    /**
     * 注释读取
     */
    @Override
//    public T commentRead(T beanInfo ClzTag tag) {
//        if(clzTags!=null) {
//            Optional<ClzTag> optional = clzTags.stream().filter(tag ->
//                    tag.getEntityName()!=null&&
//                    tag.getEntityName().equalsIgnoreCase(beanInfo.getType())
//            ).findFirst();
//            if(optional.isPresent()){
//                ClzTag tag=optional.get();
//                if (tag.getTitle() != null) {
//                    beanInfo.setTitle(tag.getTitle());
//                }
//                if (tag.getTags().size() > 0) {
//                    List<FieldDto> fieldDtos = beanInfo.getFields();
//                    fieldDtos.stream().forEach(field -> {
//                        if (tag.getTags().get(field.getFieldName()) != null) {
//                            field.setTitle(tag.getTags().get(field.getFieldName()).getTitle());
//                            field.setPlaceholder(tag.getTags().get(field.getFieldName()).getPlaceholder());
//                        }
//                    });
//                }
//                beanInfo.setCommentRead(true);
//            }else{
//                beanInfo.setCommentRead(false);
//            }
//        }
//        return beanInfo;
//    }

    public T commentRead(T beanInfo,ClzTag tag) {
        if(tag.getEntityName().equals("SysDeptDto")){
            System.out.println("1111");
        }
        if (tag.getTitle() != null) {
            beanInfo.setTitle(tag.getTitle());
        }
        if (tag.getTags().size() > 0) {
            List<FieldDto> fieldDtos = beanInfo.getFields();
            if(fieldDtos!=null){
                fieldDtos.stream().forEach(field -> {
                    if (tag.getTags().get(field.getFieldName()) != null) {
                        field.setTitle(tag.getTags().get(field.getFieldName()).getTitle());
                        field.setPlaceholder(tag.getTags().get(field.getFieldName()).getPlaceholder());
                    }
                });
            }
        }
        beanInfo.setCommentRead(true);
        return beanInfo;
    }

//    /**
//     * 多包路径读取
//     */
//    public List<T> read(ClassLoader loader, String... clazzPackageUrl) throws ClassNotFoundException {
//        return read(loader, Arrays.asList(clazzPackageUrl));
//    }

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
    protected <T extends ModelDto> List basicFieldMatch(T item, FieldDto fieldDto) {
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
            /*
             * 查询(注入)queryPath路径顺序，
             * 1. 基础类型字段都是从左到右 true
             * 2. VO类型的对象是注入-false
             * 3. Req类型的List<String> 也应该是true
             */
            Boolean leftToRight=item instanceof ReqDto?true:(
                    BASIC.equals(fieldDto.getFieldType()) ? true : false);
            /** 找到字段所在的实体模型 **/
            Class itemClz = _MatchAndSetEntityPath(fieldDto, leftToRight);
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
     *  字段作为voBean,saveBean的注入对象(复杂)时，fieldDto里缺失信息的计算和写入；
     *  五类复杂对象注入：List<VO>,LIST<ITEM>,List<String>,vo,entity
     * @param fieldDto     VO里注入的对象字段信息
     * @param voEntityDto 被注入实体类VO对象信息
     * @param <T>
     * @return 对匹配信息进行设置到 fieldDto里，state =-1则匹配失败
     */
    protected <T extends ReqVoDto> FieldDto iocReverseMatch(FieldDto fieldDto, EntityDto voEntityDto) {
        String fieldType = fieldDto.getFieldType();/*字段分类 list basic, vo*/
        String voFieldName = fieldDto.getPathName();/*字段路径名称*/
        Class fieldClz = fieldDto.getClz(); /* 字段类型*/
        Class<? extends Item> entityClz =  /* 字段对应的实体类型*/
                Item.class.isAssignableFrom(fieldClz) ? fieldClz : GenericsUtils.getGenericType(fieldClz);

        if (voFieldName.indexOf("_") != -1) {
           Class pathNameLastElementEntityClz = _MatchAndSetEntityPath(fieldDto, false);
           if(pathNameLastElementEntityClz!=entityClz){
               fieldDto.queryPath=null;
               return fieldDto;
           }
        } else {
//            Class fieldEntityClz = fieldDto.getClz();
//            if (!Item.class.isAssignableFrom(fieldEntityClz)) {
//                fieldEntityClz = GenericsUtils.getGenericType(fieldEntityClz);
//            }
            if (LIST.equals(fieldType) && voEntityDto.getRelationTableClz().contains(entityClz)) {
                fieldDto.setQueryPath(entityClz, voEntityDto.getClz());
            } else if (!LIST.equals(fieldType) && voEntityDto.getFkMap().get(entityClz) != null) {
                List list = new ArrayList<>();
                list.add(entityClz);
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
     * 路径是对的，VO时注入的对象的类型匹配需要判断；(在modelReadCheck里把关)
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
        /* step1 如果是简单类型，或者是List<String> _entityNames数组的最后一个要去掉 */
        if (BASIC.equals(fieldType) || !IdBean.class.isAssignableFrom(fieldDto.getClz())) {
            _entityNames = Arrays.copyOfRange(_entityNames, 0, _entityNames.length - 1);
        }
        if (!leftToRight) {
            _entityNames = VlifeUtils.reverseArray(_entityNames);
        }
        List entityNameList = Arrays.asList(_entityNames);
        List<Class> entityClzPaths = (List<Class>) entityNameList.stream().map(s -> {
            if (s.getClass() == String.class) {
                EntityDto entityDto=GlobalData.entityDto((String) s);
                if(entityDto!=null){
                    return entityDto.clz;
                }else{
                    return null;
                }
            } else {
                return s;
            }
        }).collect(Collectors.toList());

        if(entityClzPaths.contains(null)){
            return null;
        }

        Class itemEntityClz = ((ModelDto) fieldDto.getItemDto()).getEntityClz();
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


    /**
     * Gson Object
     */
    public final static Gson GSON = new GsonBuilder().addDeserializationExclusionStrategy(new ExclusionStrategy() {
        @Override
        public boolean shouldSkipField(FieldAttributes fieldAttributes) {
            return false;
        }
        @Override
        public boolean shouldSkipClass(Class aClass) {
            return false;
        }
    }).create();

    /**
     * req,saveBean,voBean的dict如为空，对应的实体类字段不为空则进行同步和Entity里的一致
     */
    public void syncDictCode(FieldDto field){
        if(field.getEntityFieldName()!=null&& field.getDictCode()==null){
            infos.forEach(item->{
                if(item.getClz()==field.getEntityClz()){
                    item.getFields().forEach(f->{
                        if(f.getFieldName().equals(field.getEntityFieldName())){
                            if(f.getDictCode()!=null){
                                field.setDictCode(f.getDictCode());
                            }
                        }
                    });
                }
            });
        }
    }
}
