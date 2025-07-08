package cn.wwwlike.common;

import cn.wwwlike.config.SecurityConfig;
import cn.wwwlike.sys.entity.Form;
import cn.wwwlike.sys.service.FormService;
import cn.wwwlike.vlife.annotation.PermissionEnum;
import cn.wwwlike.vlife.annotation.VMethod;
import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.bean.PageVo;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.List;

public class VLifeApi<D extends IdBean,S extends VLifeService>{
    @Autowired
    public S service;
    public Class<? extends Item> entityClz;
    public Class<? extends IdBean> modelClz;
    @Autowired
    public FormService formService;
    @PostConstruct
    public void init() throws ClassNotFoundException {
        Class entityClz = GenericsUtils.getSuperClassGenricType(this.getClass());
        this.modelClz = entityClz;
        if(Item.class.isAssignableFrom(entityClz)) {
            this.entityClz = entityClz;
        }else {
            this.entityClz=GenericsUtils.getSuperClassGenricType(entityClz);
        }
    }

    /**
     * 删除
     */
    @DeleteMapping("/remove")
    public List<String> remove(@RequestBody String[] ids) {
        try {
             return service.remove(ids);
        }catch (Exception e){
            List<Form> forms=formService.find("typeClass",e.getMessage());
            CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(forms.size()==0 ,"删除失败：存在关联的数据【"+forms.get(0).getTitle()+"】");
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 新增
     */
    @PostMapping("/create")
    public D create(@RequestBody D entity) {
        if(entity.getId()!=null){
            String createUserId=((DbEntity)service.findOne(entity.getId())).getCreateId();
            if(createUserId!=null){
                String currUserId=SecurityConfig.getCurrUser().getId();
                CommonResponseEnum.CANOT_CONTINUE.assertIsTrue(createUserId.equals(currUserId),"新增接口仅支持创建人进行修改");
            }
        }
        if(entity instanceof SaveBean){
            return (D) service.save((SaveBean)entity,true);
        }else {
            return (D) service.save((DbEntity) entity);
        }
    }

    /**
     * 修改
     * 默认修改dto给的全量数据 isFull->true
     */
    @PostMapping("/edit")
    public D edit(@RequestBody D entity) {
        if(entity instanceof SaveBean){
            return (D) service.save((SaveBean)entity,true);
        }else {
            return (D) service.save((DbEntity) entity);
        }
    }


    /**
     * 查询
     */
    @PostMapping("/page")
    public <Q extends PageQuery> PageVo<D> page(@RequestBody Q req) {
        req.setEntityClz(entityClz);
        if(entityClz==modelClz){
            return service.findPage(req);
        }else{
            return service.queryPage(modelClz,req);
        }
    }

    /**
     * 数据
     */
    @PostMapping("/list")
    @VMethod(
            permission = PermissionEnum.noAuth
    )
    public <Q extends VlifeQuery> List<D> list(@RequestBody Q req) {
        req.setEntityClz(entityClz);
        if(entityClz==modelClz){
            return service.find(req);
        }else{
            return service.query(modelClz,req);
        }
    }

    /**
     * 明细查询
     */
    @GetMapping("/detail/{id}")
    public IdBean detail( @PathVariable String id) {
        if(entityClz==modelClz){
            return service.findOne(id);
        }else{
            return service.queryOne(modelClz,id);
        }
    }
}
