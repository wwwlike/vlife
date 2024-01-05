package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysFile;
import cn.wwwlike.auth.service.SysFileService;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.web.params.bean.NativeResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 文件接口
 */
@RestController
@RequestMapping("/sysFile")
public class SysFileApi extends VLifeApi<SysFile, SysFileService> {
    @Value("${file.image.path}")
    public String imgPath;
    @Value("${vlife.packroot}")
    public String packroot;

    /**
     * 图片上传
     * 采用wangEditor上传图片接收,不存数据库
     */
    @PostMapping("/upload")
    public NativeResult<Map> uploadImg(@RequestParam("wangeditor-uploaded-image") MultipartFile file, HttpServletResponse response) throws IOException {
        Map map1 = new HashMap();
        Map map2 = new HashMap();
        String url = service.uploadImg(file);
        map2.put("url", packroot+"/oa/sysFile/image/" + url);
        map1.put("errno", 0);
        map1.put("data", map2);
        return NativeResult.success(map1);
    }

    /**
     * 图片流输出
     */
    @GetMapping(value = "/image/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_GIF_VALUE, MediaType.IMAGE_PNG_VALUE,})
    public byte[] image(@PathVariable String id) throws IOException {
        SysFile file = service.findOne(id);
        String fileName = file == null ? id : file.getFileName();
        if (!System.getProperty("os.name").toLowerCase().contains("win") &&
                !imgPath.startsWith("/")) {
            imgPath = "/" + imgPath;
        }
        File img=new File(imgPath + "/" + fileName);
        if (img.exists()) {
            try (FileInputStream input =new FileInputStream(img)) {
                byte[] bytes = new byte[input.available()];
                input.read(bytes);
                return bytes;
            } catch (IOException e) {
            }
        }else{
            Resource notFoundImage = new ClassPathResource("logo.png");
            try (InputStream inputStream = notFoundImage.getInputStream()) {
                byte[] data = StreamUtils.copyToByteArray(inputStream);
                return data;
            }catch (IOException ee) {}
        }
        return null;
    }

    /**
     * 图片上传入库
     */
    @PostMapping("/uploadImg")
    public SysFile upload(@RequestParam("file") MultipartFile file, HttpServletResponse response) throws IOException {
        String fileName = service.uploadImg(file);
        SysFile ff = new SysFile();
        ff.setName(file.getOriginalFilename());
        ff.setFileName(fileName);
        ff.setFieldSize(file.getSize() + "kb");
        service.save(ff);
        return ff;
    }

    /**
     * 图片详情
     * @param ids
     * @return
     */
    @GetMapping("/details")
    public List<SysFile> detail(String ids[]) {
        return service.findByIds(ids);
    }

    /**
     * 图片删除
     */
    @DeleteMapping("/remove/{id}")
    public Long remove(@PathVariable String id) {
        return service.remove(id);
    }
}
