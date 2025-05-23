package cn.wwwlike.vlife.objship.read.tag;

import lombok.Data;

/**
 * 参数tag
 * 目前为启用，
 * 在apiTag里记录了第一个入参类型
 */
@Data
public class ParamTag {
    // 参数名
    public String paramName;
    // 参数类型
    public String paramType;
    //参数之前的注解
    public String paramAnnotation;
}
