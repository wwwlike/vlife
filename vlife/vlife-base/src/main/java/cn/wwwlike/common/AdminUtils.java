package cn.wwwlike.common;

import cn.wwwlike.vlife.objship.read.tag.ClzTag;
import cn.wwwlike.vlife.utils.FileUtil;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

public class AdminUtils {
    //api信息读取
    public  static List<ClzTag>  readApiFile() throws IOException {
        Resource resource = new ClassPathResource("title.json");
        InputStream is = resource.getInputStream();
        String json = FileUtil.getFileContent(is);
        Gson gson = (new GsonBuilder()).setPrettyPrinting().disableHtmlEscaping().create();
        List<ClzTag> allTag = gson.fromJson(json, new TypeToken<List<ClzTag>>() {
        }.getType());
        List<ClzTag> apitTags=allTag.stream().filter(tag->tag.getPath()!=null&&tag.getApiTagList()!=null&&
                tag.getApiTagList().size()>0).collect(Collectors.toList());
        return  apitTags;
    }
}
