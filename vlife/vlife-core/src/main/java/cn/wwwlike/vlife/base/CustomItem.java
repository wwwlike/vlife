package cn.wwwlike.vlife.base;

import lombok.Setter;

import javax.persistence.Transient;
import java.util.Date;

/**
 * 历史或第三方系统可不遵循vlife实体模型规范继承此类
 */
@Setter
public abstract class CustomItem  implements Item{
    // 屏蔽字段
    private String status;
    private String createId;
    private String modifyId;
    private Date createDate;
    private Date modifyDate;
    @Transient
    public String getStatus() {
        return status;
    }
    @Transient
    public String getCreateId() {
        return createId;
    }
    @Transient
    public String getModifyId() {
        return modifyId;
    }
    @Transient
    public Date getCreateDate() {
        return createDate;
    }
    @Transient
    public Date getModifyDate() {
        return modifyDate;
    }
}
