package cn.wwwlike.oa.service;

import cn.wwwlike.oa.dao.DeptDao;
import cn.wwwlike.oa.entity.Dept;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class DeptService extends VLifeService<Dept, DeptDao> {
}
