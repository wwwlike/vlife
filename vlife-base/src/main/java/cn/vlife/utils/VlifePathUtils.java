package cn.vlife.utils;

import cn.wwwlike.vlife.bean.DbEntity;

import java.nio.file.Path;
import java.nio.file.Paths;

public class VlifePathUtils {

    //判断是否为jar包运行
    public static boolean isRunningFromJar() {
        String protocol = DbEntity.class.getResource("").getProtocol();
        return "jar".equals(protocol);
    }

    //获取资源路径
    public static String getResourcePath() {
        String path = VlifePathUtils.class.getClassLoader().getResource("").getPath();
        // 处理获取到的路径，去掉前面的"/"
        // 因为URL的格式在Windows上可能会有'/'
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        path= path.replace("/target/classes","");
        Path resourcePath = Paths.get(path, "src", "main", "resources");
        return  resourcePath.toString();
    }
}
