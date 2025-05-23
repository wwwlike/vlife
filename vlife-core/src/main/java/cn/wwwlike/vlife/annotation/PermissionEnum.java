package cn.wwwlike.vlife.annotation;

public enum PermissionEnum {
    single, //将无需单独授权的接口改为独立授权 例：`/sysUser/save/userDto` 原本无需授权；因为存在`/sysUser/save`已经授权了，
    noAuth, //免授权 实现将原本需要授权的接口改为免授权
    extend //默认方式 继承授权，有pcode则是不需要单独设置授权,没有pcode则是single
}