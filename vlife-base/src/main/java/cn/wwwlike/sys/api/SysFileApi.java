package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.SysFile;
import cn.wwwlike.sys.service.SysFileService;
import cn.wwwlike.common.VLifeApi;
import cn.wwwlike.web.params.bean.NativeResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
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
    public NativeResult<Map> uploadWangEditor(@RequestParam("wangeditor-uploaded-image") MultipartFile file, HttpServletResponse response) throws IOException {
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
    @GetMapping(value = "/image/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_GIF_VALUE, MediaType.IMAGE_PNG_VALUE,MediaType.APPLICATION_PDF_VALUE})
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
                e.printStackTrace();
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

    //PDF文件流输出
    @GetMapping(value = "/pdf/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_GIF_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.APPLICATION_PDF_VALUE})
    public ResponseEntity<byte[]> pdf(@PathVariable String id) {
        SysFile file = service.findOne(id);
        String fileName = file == null ? id : file.getFileName();
        File img = new File(imgPath + "/" + fileName);
        if (img.exists()) {
            try (FileInputStream input = new FileInputStream(img)) {
                byte[] bytes = new byte[(int) img.length()];
                input.read(bytes);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.set("X-Frame-Options", "SAMEORIGIN"); // 设置 X-Frame-Options
                return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else {
            Resource notFoundImage = new ClassPathResource("logo.png");
            try (InputStream inputStream = notFoundImage.getInputStream()) {
                byte[] data = StreamUtils.copyToByteArray(inputStream);
                HttpHeaders headers = new HttpHeaders();
                headers.set("X-Frame-Options", "SAMEORIGIN"); // 设置 X-Frame-Options
                return new ResponseEntity<>(data, headers, HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }
    }

    /**
     * 图片上传和入库
     * 图片上传组件
     */
    @PostMapping("/uploadImg")
    public SysFile uploadImg(@RequestParam("file") MultipartFile file, HttpServletResponse response) throws IOException {
        String fileName = service.uploadImg(file);
        SysFile ff = new SysFile();
        ff.setName(file.getOriginalFilename());
        ff.setFileName(fileName);
        ff.setFileSize(file.getSize());
        service.save(ff);
        return ff;
    }

    /**
     * 文件下载
     * 根据文件ID下载指定文件(浏览器弹出方式)
     */
    @GetMapping("/download/{id}")
    public void download(HttpServletResponse response,@PathVariable String id) throws IOException {
        SysFile sysFile=service.findOne(id);
        // 根据id找到文件存储的路径，这里假设文件存储在/upload目录下
        String fileName = sysFile == null ? id : sysFile.getFileName();
        if (!System.getProperty("os.name").toLowerCase().contains("win") &&
                !imgPath.startsWith("/")) {
            imgPath = "/" + imgPath;
        }
        File file=new File(imgPath + "/" + fileName);
        if (file.exists()) {
            // 设置文件下载响应头
            response.setContentType("application/octet-stream");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
            String encodedFileName = URLEncoder.encode( sysFile.getName(), "UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=" +encodedFileName );
            // 读取文件内容并写入响应流
            try (InputStream fis = new FileInputStream(file);
                 OutputStream os = response.getOutputStream()) {
                byte[] buffer = new byte[1024];
                int len;
                while ((len = fis.read(buffer)) != -1) {
                    os.write(buffer, 0, len);
                }
                os.flush();
            } catch (IOException e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    /**
     * 文件保存
     * 上传后批量保存
     */
    @PostMapping("/batchSave")
    public List<SysFile> batchSave(@RequestBody List<SysFile> files){
        files.forEach(f->{
            service.saveWithAssign(f,"relationId","projectId","type");
        });
        return files;
    }

}
