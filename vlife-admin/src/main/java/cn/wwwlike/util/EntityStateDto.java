package cn.wwwlike.util;

import lombok.Data;

import java.util.List;

/**
 * 采购单状态更新dto
 */
@Data
public class EntityStateDto {
    public List<String> ids;
    public String state;
}
