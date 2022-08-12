package cn.wwwlike.oa.service;

import cn.wwwlike.oa.dao.AccountDao;
import cn.wwwlike.oa.entity.Account;
import cn.wwwlike.vlife.core.VLifeService;
import org.springframework.stereotype.Service;

@Service
public class AccountService extends VLifeService<Account, AccountDao> {
}
