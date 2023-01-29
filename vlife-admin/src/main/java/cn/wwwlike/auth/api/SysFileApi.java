package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysFile;
import cn.wwwlike.auth.service.SysFileService;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.web.params.bean.NativeResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 文件存储接口;
 */
@RestController
@RequestMapping("/sysFile")
public class SysFileApi extends VLifeApi<SysFile, SysFileService> {


    @Value("${file.image.path}")
    public String imgPath;

    /**
     * wangEditor上传图片接收,不存数据库
     */
    @PostMapping("/upload")
    public NativeResult<Map> uploadImg(@RequestParam("wangeditor-uploaded-image") MultipartFile file, HttpServletResponse response) throws IOException {
        Map map1 = new HashMap();
        Map map2 = new HashMap();
        String url = service.uploadImg(file);
        map2.put("url", "http://localhost:8288/oa/sysFile/image/" + url);
        map1.put("errno", 0);
        map1.put("data", map2);
        return NativeResult.success(map1);
    }


    //通过produces 告知浏览器我要返回的媒体类型
    @GetMapping(value = "/image/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_GIF_VALUE, MediaType.IMAGE_PNG_VALUE})
    public BufferedImage image(@PathVariable String id) throws IOException {
        SysFile file = service.findOne(id);
        String fileName = file == null ? id : file.getFileName();
        if (!System.getProperty("os.name").toLowerCase().contains("win") &&
                !imgPath.startsWith("/")) {
            imgPath = "/" + imgPath;
        }
        return ImageIO.read(new FileInputStream(new File(imgPath + "/" + fileName)));
    }

    /**
     * 单独上传图片
     * ，存入数据库
     */
    @PostMapping("/uploadImg")
    public SysFile upload(@RequestParam("file") MultipartFile file, HttpServletResponse response) throws IOException {
        String fileName = service.uploadImg(file);
        SysFile ff = new SysFile();
        ff.setName(file.getOriginalFilename());
        ff.setFileName(fileName);
        ff.setSize(file.getSize() + "kb");
        service.save(ff);
        return ff;
    }


    @GetMapping("/details")
    public List<SysFile> detail(String ids[]) {
        return service.findByIds(ids);
    }


    /**
     * 保存文件存储;
     *
     * @param dto 文件存储;
     * @return 文件存储;
     */
    @PostMapping("/save")
    public SysFile save(@RequestBody SysFile dto) {
        return service.save(dto);
    }


    /**
     * 逻辑删除;
     *
     * @param id 主键id;
     * @return 已删除数量;
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }
}
