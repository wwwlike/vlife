package cn.wwwlike.form.service;

import cn.wwwlike.form.dao.FormEventDao;
import cn.wwwlike.form.entity.FormEvent;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class FormEventService extends VLifeService<FormEvent, FormEventDao> {
}
