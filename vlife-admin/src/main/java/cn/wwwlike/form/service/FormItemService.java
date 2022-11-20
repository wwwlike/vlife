package cn.wwwlike.form.service;

import cn.wwwlike.form.dao.FormItemDao;
import cn.wwwlike.form.entity.FormItem;
import cn.wwwlike.vlife.bi.Conditions;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.req.PageQuery;
import com.google.common.reflect.TypeToken;
import org.springframework.stereotype.Service;

import static cn.wwwlike.vlife.objship.read.ItemReadTemplate.GSON;

@Service
public class FormItemService extends VLifeService<FormItem, FormItemDao> {

    /**
     * 根据查询项目创建查询条件
     *
     * @param id
     * @return
     */
    public PageQuery<?> createQuery(String id) {
        FormItem item = findOne(id);
        Conditions condition = GSON.fromJson(item.getConditionJson(), new TypeToken<Conditions>() {
        }.getType());
        EntityDto entityDto = GlobalData.entityDto("sysUser");
        PageQuery<?> request = new PageQuery(entityDto.getClz());
        return request;
    }

}
