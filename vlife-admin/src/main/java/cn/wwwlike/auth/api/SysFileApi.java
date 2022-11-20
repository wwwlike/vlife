package cn.wwwlike.auth.api;

import cn.wwwlike.auth.entity.SysFile;
import cn.wwwlike.auth.service.SysFileService;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.web.params.bean.NativeResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 文件存储接口;
 */
@RestController
@RequestMapping("/sysFile")
public class SysFileApi extends VLifeApi<SysFile, SysFileService> {


    /**
     * wangEditor上传图片接收
     */
    @PostMapping("/upload")
    public NativeResult<Map> uploadImg(@RequestParam("wangeditor-uploaded-image") MultipartFile file, HttpServletResponse response) throws IOException {
        Map map1 = new HashMap();
        Map map2 = new HashMap();
        String url = service.uploadImg(file);
        map2.put("url", "https://wwwlike.gitee.io/vlife-img/vlife_jg.png");
        map1.put("errno", 0);
        map1.put("data", map2);
        return NativeResult.success(map1);
    }

    /**
     * 上传文件，返回下载码。
     *
     * @param file
     * @return
     */
    @PostMapping("/uploadImg")
    public SysFile upload(@RequestParam("file") MultipartFile file, HttpServletResponse response) throws IOException {
        String url = service.uploadImg(file);
        SysFile ff = new SysFile();
        ff.setFileName(file.getOriginalFilename());
        ff.setUrl(url);
        ff.setSize(file.getSize() + "kb");
        service.save(ff);
        return ff;
    }
    
    /**
     * 明细查询文件存储;
     *
     * @param id 主键id;
     * @return 文件存储;
     */
    @GetMapping("/detail/{id}")
    public SysFile detail(@PathVariable String id) {
        return service.findOne(id);
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
