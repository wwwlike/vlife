package cn.wwwlike.auth.api;

import cn.wwwlike.auth.config.SecurityConfig;
import cn.wwwlike.auth.entity.SysFile;
import cn.wwwlike.auth.service.SysFileService;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.web.params.bean.NativeResult;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
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
        ff.setFileSize(file.getSize());
//        ff.setCreateId(SecurityConfig.getCurrUser().getId());
        service.save(ff);
        return ff;
    }

    //批量保存
    @PostMapping("/save")
    public List<SysFile> batchSave(@RequestBody List<SysFile> files){
        files.forEach(f->{
            service.saveWithAssign(f,"relationId","projectId","type");
        });
        return files;
    }


    /**
     * 数据下载
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
     * 文件查询
     */
    @PostMapping("/list")
    public List<SysFile> list(@RequestBody PageQuery<SysFile> req){
        return service.find(req);
    }

    /**
     * 文件详情
     * @param ids
     * @return
     */
    @GetMapping("/details")
    public List<SysFile> detail(String ids[]) {
        //同时对文件进行删除
        return service.findByIds(ids);
    }
    /**
     * 权限组删除
     */
    @DeleteMapping("/remove")
    public Long remove(@RequestBody String[] ids) {
        return service.remove(ids);
    }
}
