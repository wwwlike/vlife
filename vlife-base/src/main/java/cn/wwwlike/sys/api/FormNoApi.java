package cn.wwwlike.sys.api;


import cn.wwwlike.sys.entity.FormNo;
import cn.wwwlike.sys.service.FormNoService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.web.bind.annotation.*;

/**
 * 单据号规则接口
 */
@RestController
@RequestMapping("/formNo")
public class FormNoApi extends VLifeApi<FormNo, FormNoService> {

    /**
     * 预览编号
     * 查询指定字段的下一组编号(未启用)
     */
    @GetMapping("/fieldNo/{formFieldId}")
    public String fieldNo(@PathVariable String formFieldId){
        return service.getNo(formFieldId,false);
    }
}
