package cn.wwwlike.sys.service;

import cn.wwwlike.sys.dao.ButtonDao;
import cn.wwwlike.sys.dto.FormDto;
import cn.wwwlike.sys.entity.Button;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.entity.SysResources;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ButtonService extends VLifeService<Button, ButtonDao> {

    @Autowired
    public SysResourcesService resourcesService;

    @Autowired
    public FormService formService;

    public Button save(Button button){
        if(button.getSysResourcesId()!=null){
            SysResources _resources=resourcesService.findOne(button.getSysResourcesId());
            String _model = "entity".equals( _resources.paramType)  || "dto".equals(_resources.paramType)
                    ? _resources.paramWrapper
                    : null;
            button.setModel(_model);
        }
        return super.save(button);
    }



    //接口资源对应的系统按钮是否已经创建
    private List<Button> resourcesSysBtn(String sysResourcesId){
         QueryWrapper qw=QueryWrapper.of(Button.class);
         qw.eq("sysResourcesId",sysResourcesId);
         return find(qw);
    }

    /**
     * 根据模型创建该模型的相关系统级按钮
     * @return
     */
    public List<Button> createSysButton(String entityType,String modelType){
        FormDto form=formService.getModelByType(modelType);
        List<Button> sysButtons=new ArrayList<>();
        List<SysResources> createResources=resourcesService.find("url","/"+modelType+"/create");
        if(createResources!=null&&createResources.size()>0){
            SysResources saveResources=createResources.get(0);
            String resourceId=saveResources.getId();
            String resourceEntityId=saveResources.getFormId();
            List<Button> buttons=resourcesSysBtn(resourceId);
            if(buttons==null||buttons.size()==0){
                Button create=new Button();
                create.setActionType("create");
                create.setTooltip("创建"+form.getTitle());
                create.setModel(modelType);
                create.setSysResourcesId(resourceId);
                create.setTitle("新增");
                create.setIcon("IconPlus");
                create.setSysBtn(true);
                create.setResourcesEntityId(resourceEntityId);
                super.save(create);
                sysButtons.add(create);
            }else{
                sysButtons.addAll(buttons);
            }
        }
        //编辑按钮
        List<SysResources> editResources=resourcesService.find("url","/"+modelType+"/edit");
        if(editResources!=null&&editResources.size()>0){
            SysResources saveResources=editResources.get(0);
            String resourceId=saveResources.getId();
            String resourceEntityId=saveResources.getFormId();
            List<Button> buttons=resourcesSysBtn(resourceId);
            if(buttons==null||buttons.size()==0){
                Button edit=new Button();
                edit.setActionType("edit");
                edit.setTooltip("编辑"+form.getTitle());
                edit.setModel(modelType);
                edit.setIcon("IconSave");
                edit.setSysResourcesId(resourceId);
                edit.setTitle("修改");
                edit.setSysBtn(true);
                edit.setResourcesEntityId(resourceEntityId);
                super.save(edit);
                sysButtons.add(edit);
            }else{
                sysButtons.addAll(buttons);
            }
        }
        //删除按钮
        List<SysResources> remove=resourcesService.find("url","/"+modelType+"/remove");
        if(remove!=null&&remove.size()>0){
            SysResources removeResources=remove.get(0);
            String resourceEntityId=removeResources.getFormId();
            String removeResourceId=removeResources.getId();
            List<Button> delSysBtn=resourcesSysBtn(removeResourceId);
            if(delSysBtn==null||delSysBtn.size()==0) {
                Button removeBtn = new Button();
                removeBtn.setTooltip("删除"+form.getTitle());
                removeBtn.setActionType("api");
                removeBtn.setModel(modelType);
                removeBtn.setSysResourcesId(removeResourceId);
                removeBtn.setResourcesEntityId(resourceEntityId);
                removeBtn.setTitle("删除");
                removeBtn.setSysBtn(true);
                removeBtn.setIcon("IconDeleteStroked");
                super.save(removeBtn);
                sysButtons.add(removeBtn);
            }else{
                sysButtons.addAll(delSysBtn);
            }
        }
        return sysButtons;
        //导入,打印
    }
}
