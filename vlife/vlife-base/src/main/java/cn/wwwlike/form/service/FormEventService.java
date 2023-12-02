package cn.wwwlike.form.service;
import cn.wwwlike.form.dao.FormEventDao;
import cn.wwwlike.form.dto.FormDto;
import cn.wwwlike.form.dto.FormEventDto;
import cn.wwwlike.form.dto.FormFieldDto;
import cn.wwwlike.form.entity.FormEvent;
import cn.wwwlike.form.entity.FormReaction;
import cn.wwwlike.form.vo.FormEventVo;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FormEventService extends VLifeService<FormEvent, FormEventDao> {

    /**
     * 产生新增时隐藏的相关事件
     * @return
     */
    public FormEventDto createHideEventSave(String eventId,String formId,String idFieldId,String hideFieldId){
        FormEventDto dto=eventId==null?new FormEventDto():queryOne(FormEventDto.class,eventId);
        FormReaction reaction=new FormReaction();
        reaction.setFormFieldId(hideFieldId);
        reaction.setReactionAttr("x-hidden");
        reaction.setReactionValue("true");
        List<FormReaction> list=null;
        if(eventId==null){
            dto.setSys(true);
            dto.setFormId(formId);
            dto.setFormFieldId(idFieldId);
            dto.setEventType("null");
            dto.setAttr("value");
            list=dto.getReactions();
        }
        if(list==null){
            list=new ArrayList<>();
        }
        list.add(reaction);
        dto.setReactions(list);
        save(dto);
        return dto;
    }


    /**
     * 产生新增时隐藏的相关事件
     * @return
     */
    public FormEventDto modifyReadEventSave(String eventId,String formId,String idFieldId,String hideFieldId){
        FormEventDto dto=eventId==null?new FormEventDto():queryOne(FormEventDto.class,eventId);
        FormReaction reaction=new FormReaction();
        reaction.setFormFieldId(hideFieldId);
        reaction.setReactionAttr("x-read-pretty"); //" ") //x-disabled
        reaction.setReactionValue("true");
        List<FormReaction> list=null;
        if(eventId==null){
            dto.setSys(true);
            dto.setFormId(formId);
            dto.setFormFieldId(idFieldId);
            dto.setEventType("notNull");
            dto.setAttr("value");
            list=dto.getReactions();
        }
        if(list==null){
            list=new ArrayList<>();
        }
        list.add(reaction);
        dto.setReactions(list);
        save(dto);
        return dto;
    }


    /**
     * 查找当前字段[idFieldId]为空时的事件vo对象
     * @param idFieldId
     * @return
     */
    public FormEventVo findIdNullEvent(String idFieldId){
        List<FormEventVo> list=query(FormEventVo.class, QueryWrapper.of(FormEvent.class)
                .eq("attr","value")
                .eq("eventType","null")
                .eq("formFieldId",idFieldId));
        return list!=null&&list.size()>0?list.get(0):null;
    }

    /**
     * 查找当前字段[idFieldId]为空时的事件vo对象
     * @param idFieldId
     * @return
     */
    public FormEventVo findIdNotNullEvent(String idFieldId){
        List<FormEventVo> list=query(FormEventVo.class, QueryWrapper.of(FormEvent.class)
                .eq("attr","value")
                .eq("eventType","notNull")
                .eq("formFieldId",idFieldId));
        return list!=null&&list.size()>0?list.get(0):null;
    }

    @Autowired
    public FormReactionService reactionService;
    /**
     * 根据字段create_hide/modify_readOnly信息，自动创建事件响应
     * @param dto 本次保存的表单数据信息
     */
    public void createHideEvent(FormDto dto){
        //当前实体formid,主键的form里id
        String formId=dto.getId();
         Optional<FormFieldDto> idFieldOptional=dto.fields.stream().filter(fr->fr.fieldName.equals("id")).findFirst();
        if(idFieldOptional.isPresent()){
            String idFieldId=idFieldOptional.get().getId();
            FormEventVo eventVo=findIdNullEvent(idFieldId);
        //删除已经取消的新增隐藏
        if(eventVo!=null){
            eventVo.getReactions().forEach(reaction->{
                String fieldId=reaction.getFormFieldId();
               Optional<FormFieldDto> optional=dto.fields.stream().filter(d->d.getId().equals(fieldId)).findFirst();
                if(optional.isPresent()&&optional.get().create_hide!=true){
                    reactionService.remove(reaction.getId());
                }
            });
        }
        //新增时隐藏事件创建
        dto.getFields().stream().filter(f->f.isCreate_hide()==true).forEach(f->{
            String reactionFieldId=f.getId();
            if(reactionService.createhideExist(reactionFieldId,formId,idFieldId)==false){
                createHideEventSave(eventVo==null?null:eventVo.getId(),formId,idFieldId,reactionFieldId);
            }
        });
        FormEventVo eventVo2=findIdNullEvent(idFieldId);
        if(eventVo2!=null&&(eventVo2.getReactions()==null||eventVo2.getReactions().size()==0)){
            remove(eventVo2.getId());
        } }
    }


    /**
     * 根据字段modify_readOnly信息，自动创建事件响应
     * @param dto 本次保存的表单数据信息
     */
    public void modifyReadEvent(FormDto dto){
        //当前实体formid,主键的form里id
        String formId=dto.getId();
        Optional<FormFieldDto> idFieldOptional=dto.fields.stream().filter(fr->fr.fieldName.equals("id")).findFirst();
        if(idFieldOptional.isPresent()) {
            String idFieldId = idFieldOptional.get().getId();
            FormEventVo eventVo = findIdNotNullEvent(idFieldId);
            //删除已经取消的新增隐藏
            if (eventVo != null) {
                eventVo.getReactions().forEach(reaction -> {
                    String fieldId = reaction.getFormFieldId();
                    Optional<FormFieldDto> optional=dto.fields.stream().filter(d->d.getId().equals(fieldId)).findFirst();
                    if(optional.isPresent()&&optional.get().modify_read!=true){
                        reactionService.remove(reaction.getId());
                    }
                });
            }
            //新增事件&响应
            dto.getFields().stream().filter(f -> f.isModify_read() == true).forEach(f -> {
                String reactionFieldId = f.getId();
                if (reactionService.modifyReadExist(reactionFieldId, formId, idFieldId) == false) {
                    modifyReadEventSave(eventVo == null ? null : eventVo.getId(), formId, idFieldId, reactionFieldId);
                }
            });
            FormEventVo eventVo2 = findIdNotNullEvent(idFieldId);
            if (eventVo2 != null && (eventVo2.getReactions() == null || eventVo2.getReactions().size() == 0)) {
                remove(eventVo2.getId());
            }
        }
    }


}
