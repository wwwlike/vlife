package cn.wwwlike.common;

import lombok.Data;
//单个字段批量更新dto
@Data
public class BatchModifyDto {
    public String[] ids;
    public String fieldName;
    public Object value;
}
