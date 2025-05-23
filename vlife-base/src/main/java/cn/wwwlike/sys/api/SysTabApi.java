package cn.wwwlike.sys.api;

import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.entity.SysTab;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.sys.service.SysTabService;
import cn.wwwlike.common.VLifeApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sysTab")
public class SysTabApi  extends VLifeApi<SysTab, SysTabService> {
    /**
     * 排序
     */
    @PostMapping("/sort")
    public String[] sort(@RequestBody String ids []){
        for(int i=0;i<ids.length;i++){
            SysTab sysTab = service.findOne(ids[i]);
            sysTab.setSort(i);
            service.save(sysTab);
        }
        return ids;
    }
}
