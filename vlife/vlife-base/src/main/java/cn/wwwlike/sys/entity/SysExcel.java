package cn.wwwlike.sys.entity;

import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table
@Data
public class SysExcel extends DbEntity {
    //类型
    public String entityType;
    //文件名
    public String fileName;
    //上传人
    public String sysUserId;
    //上传文件
    public String sysFileId;

}
