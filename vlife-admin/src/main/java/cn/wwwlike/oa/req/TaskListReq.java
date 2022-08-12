package cn.wwwlike.oa.req;

import cn.wwwlike.oa.entity.Task;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import lombok.Data;

import java.util.List;

/**
 * 任务过滤
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
public class TaskListReq extends VlifeQuery<Task> {
    /**
     * 项目id
     */
    public String projectId;
    /**
     * 进度范围
     */
    public List<Double> progress;
    /**
     * 任务名称
     */
    @VField(opt = Opt.like)
    public String name;
    /**
     * 任务状态
     */
    public String state;



}
