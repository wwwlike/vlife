package cn.wwwlike.sys.service;

import cn.wwwlike.sys.dao.SysFileDao;
import cn.wwwlike.sys.entity.SysFile;
import cn.wwwlike.common.BaseService;
import cn.wwwlike.vlife.utils.FileUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;

@Service
public class SysFileService extends BaseService<SysFile, SysFileDao> {

    @Value("${file.image.path}")
    public String imgPath;

    public String getFileName() {
        return UUID.randomUUID().toString();
    }

    /**
     * 上传图片文件到指定文件夹，并返回网络地址
     *
     * @param multipartFile
     * @return
     */
    public String uploadImg(MultipartFile multipartFile) {
        if (!System.getProperty("os.name").toLowerCase().contains("win") &&
                !imgPath.startsWith("/")) {
            imgPath = "/" + imgPath;
        }
        String fileName = getFileName() + "." + multipartFile.getOriginalFilename().split("\\.")[1];
        String pathFileName = imgPath + "/" + fileName;
        FileUtil.createDir(imgPath);
        if (pathFileName.indexOf(":") == -1) { //linux
            pathFileName = "/" + pathFileName;
        }
        pathFileName = imgPath + "/" + fileName;
        File file = new File(pathFileName);
        OutputStream out = null;
        try {
            out = new FileOutputStream(file);
            byte[] ss = multipartFile.getBytes();
            for (int i = 0; i < ss.length; i++) {
                out.write(ss[i]);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return fileName;
    }
}
