package cn.wwwlike.sys.vo;

import com.squareup.javapoet.ClassName;
import lombok.Data;

@Data
public class TabVo {
    //页签的模型type
    public String  modelType;
    //页签id
    public String tabId;
    //页签授权对象
    public String[] visits;
}
