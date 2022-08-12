package cn.wwwlike.oa.req;

import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import cn.wwwlike.vlife.query.tran.YearExpressTran;
import lombok.Data;

import java.util.List;

/**
 * 项目分页查询条件
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
public class ProjectPageReq extends PageQuery<Project> {

    public String account_deptId;
    /**
     * 项目类型
     */
    public List<String> type;
    /**
     * 根据负责人id查询
     */
    public String accountId;

    /**
     * 根据参与人Id查询(默认都需要传入)
     */
    public String projectAccount_accountId;
    /**
     * 项目状态
     */
    public String state;
    /**
     * 项目名称
     */
    @VField(opt = Opt.like)
    public String name;

    /**
     * 项目开始年度
     */
    @VField(tran = YearExpressTran.class,pathName = "planDate")
    public Integer year;

}
