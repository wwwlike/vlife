package cn.wwwlike.vlife.annotation;

import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.DataExpressTran;

import java.lang.annotation.*;

import static cn.wwwlike.vlife.dict.Constants.DEFAULT_ORDER_TYPE;

/**
 * VF的API上的注解，在约定之外增加灵活性
 * 暂未接入到模型解析里
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
public @interface VMethod {

    //(待)配置接口的上级接口，那么该接口可不参与系统配置；如save保存，启用停用都始于保存

    /**
     *  接口权限启用方式
     */
    PermissionEnum permission() default  PermissionEnum.extend;
}

