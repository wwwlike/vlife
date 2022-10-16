package cn.wwwlike.form.service;

import cn.wwwlike.form.dao.FormFieldDao;
import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class FormFieldService extends VLifeService<FormField, FormFieldDao> {
}
