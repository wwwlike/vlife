package cn.wwwlike.oa.service;

import cn.wwwlike.oa.dao.OaNewsDao;
import cn.wwwlike.oa.entity.OaNews;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class OaNewsService extends VLifeService<OaNews, OaNewsDao> {
}
