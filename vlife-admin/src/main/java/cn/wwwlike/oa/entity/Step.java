package cn.wwwlike.oa.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 项目阶段
 * @author xiaoyu
 * @date 2022/6/17
 */
@Data
@Table(name = "sys_step")
@Entity
public class Step extends DbEntity {
}
