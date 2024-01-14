package cn.vlife.erp.entity;
import cn.wwwlike.vlife.annotation.VClazz;
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
     * 标题
     */
    public String name;
    /**
     * 产品名称
     */
    public String title;
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
     * 产品分类
     */
    @VField(dictCode = "product_type")
    public String type;
//    /**
//     * 当前售价
//     */
//    public Double price;
//    /**
//     * 当前成本价格
//     */
//    public Double  total;


}
