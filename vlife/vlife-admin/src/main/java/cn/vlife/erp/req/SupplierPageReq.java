package cn.vlife.erp.req;
import cn.vlife.erp.entity.Supplier;
import cn.wwwlike.vlife.annotation.VField;
import cn.wwwlike.vlife.dict.Opt;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;
import java.util.List;

/**
 * 供应商查询
 */
@Data
public class SupplierPageReq extends PageQuery<Supplier> {
    /**
     * 供应商名称
     */
    @VField(opt = Opt.like)
    public String name;
    /**
     * 供应商类别
     */
    public List<String> type;

}
