package cn.wwwlike.form.vo;

//import jdk.nashorn.internal.objects.annotations.Constructor;
import lombok.Data;

/**
 * 关联字段选择的
 */
@Data
public class FieldSelect {
    public String label;
    public String value;
    public FieldSelect( String value,String label) {
        this.label = label;
        this.value = value;
    }
}
