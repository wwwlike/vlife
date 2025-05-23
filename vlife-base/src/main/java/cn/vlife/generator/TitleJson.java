package cn.vlife.generator;

import cn.vlife.utils.FileUtil;
import cn.vlife.utils.JsonUtil;
import cn.vlife.utils.VlifePathUtils;
import cn.wwwlike.vlife.objship.read.CommentParser;
import cn.wwwlike.vlife.objship.read.ModelReadCheck;
import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.objship.read.tag.FieldTag;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

public class TitleJson {

    //是否模型和接口类
    private static boolean isModelFile(File file){
        String fileName= file.getPath();
        if(fileName.indexOf("\\req\\")!=-1||fileName.indexOf("\\vo\\")!=-1||fileName.indexOf("\\dto\\")!=-1||fileName.indexOf("\\entity\\")!=-1||fileName.indexOf("\\api\\")!=-1){
            return true;
        }
        return false;
    }
    private static List<ClzTag> tags = null;

    public static List<ClzTag> getJavaClzTag(){
        if(tags==null){
            create();
        }
        return tags;
    }

    public static void create(){
        tags=new ArrayList<>();
        try{
            String projectBaseDir = System.getProperty("user.dir");
            if(projectBaseDir.endsWith("vlife-admin")){
                projectBaseDir=projectBaseDir.substring(0,projectBaseDir.length()-12);
            }
            File projectBasedir = new File(projectBaseDir);
            List<File> files = new ArrayList<>();
            for(File file:projectBasedir.listFiles()){
                    if(new File(file.getPath()+"/src/main/java").exists()){
                        File directory = new File(file.getPath()+"/src/main/java");
                        try {
                            // 使用 listFiles 来获取目录下的所有.java 文件
                            Collection<File> allFiles = FileUtils.listFiles(directory, new String[]{"java"}, true);
                            // 直接将所有.java 文件转为 List
                            files.addAll( allFiles.stream().filter(_f->isModelFile(_f)).collect(Collectors.toList()));

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }

                Map<String, FieldTag> dbEntityFieldTag = new HashMap<>();
                FieldTag idTag = new FieldTag();
                idTag.setTitle("主键id");
                idTag.setFieldName("id");
                idTag.setFieldType("string");
                idTag.setExtendsField(true);
                dbEntityFieldTag.put("id", idTag);
                FieldTag statusTag = new FieldTag();
                statusTag.setTitle("删除状态");
                statusTag.setExtendsField(true);
                statusTag.setFieldName("status");
                statusTag.setFieldType("string");
                dbEntityFieldTag.put("status", statusTag);
                FieldTag createDateTag = new FieldTag();
                createDateTag.setExtendsField(true);
                createDateTag.setTitle("创建时间");
                createDateTag.setFieldName("status");
                createDateTag.setFieldType("Date");
                dbEntityFieldTag.put("createDate", createDateTag);
                FieldTag modifyDateTag = new FieldTag();
                modifyDateTag.setExtendsField(true);
                modifyDateTag.setTitle("修改时间");
                modifyDateTag.setFieldName("modifyDate");
                modifyDateTag.setFieldType("Date");
                dbEntityFieldTag.put("modifyDate", modifyDateTag);
                FieldTag modifyIdTag = new FieldTag();
                modifyIdTag.setExtendsField(true);
                modifyIdTag.setTitle("修订人");
                modifyIdTag.setFieldType("string");
                modifyIdTag.setFieldName("modifyId");
                dbEntityFieldTag.put("modifyId", modifyIdTag);
                FieldTag createIdTag = new FieldTag();
                createIdTag.setExtendsField(true);
                createIdTag.setTitle("创建人");
                createIdTag.setFieldName("createId");
                createIdTag.setFieldType("string");
                dbEntityFieldTag.put("createId", createIdTag);
                //解析字段
                for (File path : files) {
                    ClzTag tag = CommentParser.parserField(path);
                    if(tag!=null){
                        tags.add(tag);
                    }
                }
                //父类字段加入
                for (ClzTag tag : tags) {
                    if(tag.getParentsName()!=null&& tag.getParentsName().size()>0){
                        for(String p:tag.getParentsName()){
                            Optional<ClzTag> optional=tags.stream().filter(t->p.equals(t.getEntityName())).findFirst();
                            if(optional.isPresent()){
                                for (Map.Entry<String, FieldTag> entry : optional.get().getTags().entrySet()) {
                                    tag.getTags().putIfAbsent(entry.getKey(), entry.getValue());
                                }
                            }
                        }
                    }
                }
                /* entity的继承的属性 加入*/
                for (ClzTag tag : tags) {
                    if ((tag.getParentsName()!=null&&tag.getParentsName().contains("DbEntity"))||
                            "DbEntity".equals(tag.getSuperName())) {
                        if (tag.getTags() == null) {
                            tag.setTags(dbEntityFieldTag);
                        } else {
                            dbEntityFieldTag.forEach((key, val) -> {
                                if (tag.getTags().get(key) == null) {
                                    tag.getTags().put(key, val);
                                }
                            });
                        }
                    }
                }
                //解析api
                for (ClzTag tag : tags) {
                    if ((tag.getParentsName()!=null&&tag.getParentsName().contains("VLifeApi"))||"VLifeApi".equals(tag.getSuperName())||"VLifeApi".equals(tag.getEntityName())) {
                        for (File path : files) {
                            if (path.getName().equals(tag.getEntityName() + ".java")) {
                                try {
                                    CommentParser.parserApi(path, tag);
                                }catch (Exception ex){
                                    ex.printStackTrace();
                                    System.out.println(tag.entityName);
                                }
                            }
                        }
                    }
                }
//                String titleJson = Paths.get( VlifePathUtils.getResourcePath() , "title.json").toString();
//                String data = JsonUtil.toPrettyJson(tags);
//                FileUtil.nioWriteFile(data, titleJson);
        }catch (Exception ex){
            ex.printStackTrace();
        }
    }
}
