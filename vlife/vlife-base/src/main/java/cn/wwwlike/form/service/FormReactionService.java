package cn.wwwlike.form.service;

import cn.wwwlike.form.dao.FormReactionDao;
import cn.wwwlike.form.entity.FormEvent;
import cn.wwwlike.form.entity.FormReaction;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.stereotype.Service;

@Service
public class FormReactionService extends VLifeService<FormReaction, FormReactionDao> {
    /**
     * 新增时隐藏是否存在
     * @param relationFieldId 隐藏的字段id
     * @param formId 表单id
     * @param idFieldId 新增时id为空字段的模型id
     * @return
     */
    public Boolean createhideExist(String relationFieldId,String formId,String idFieldId){
        QueryWrapper qw=QueryWrapper.of(FormReaction.class).eq("formFieldId",relationFieldId)
                .eq("reactionAttr","x-hidden")
                .eq("reactionValue","true")
                .eq("id",formId, FormEvent.class)
            .eq("eventType","null", FormEvent.class)
                .eq("formFieldId",idFieldId, FormEvent.class);

        return find(qw).size()>0;
    }


    /**
     * 修改时只读是否存在
     * @param relationFieldId 隐藏的字段id
     * @param formId 表单id
     * @param idFieldId 新增时id为空字段的模型id
     * @return
     */
    public Boolean modifyReadExist(String relationFieldId,String formId,String idFieldId){
        QueryWrapper qw=QueryWrapper.of(FormReaction.class).eq("formFieldId",relationFieldId)
                .eq("reactionAttr","x-read-pretty") //x-disabled
                .eq("reactionValue","true")
                .eq("id",formId, FormEvent.class)
                .eq("eventType","notNull", FormEvent.class)
                .eq("formFieldId",idFieldId, FormEvent.class);
        return find(qw).size()>0;
    }
}
