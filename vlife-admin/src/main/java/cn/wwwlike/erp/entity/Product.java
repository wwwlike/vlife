package cn.wwwlike.erp.entity;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.bean.DbEntity;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 产品
 */
@Data
@Entity
@Table(name = "erp_product")
public class Product  extends DbEntity {
    /**
     * 产品编号
     */
    public String productNo;
    /**
     * 产品名称
     */
    public String name;
    /**
     * 规格型号
     */
    public String xh;
    /**
     * 产品品牌
     */
    @VField(dictCode = "project_brand")
    public  String brand;
    /**
     * 计量单位
     */
    public  String unit;
    /**
     * 备注
     */
    public String  remark;
    /**
     * 数据标题
     */
    public String title;
}
