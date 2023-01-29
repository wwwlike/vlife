package cn.wwwlike.oa.req;

import cn.wwwlike.oa.entity.OaNews;
import cn.wwwlike.vlife.query.req.PageQuery;
import lombok.Data;

@Data
public class OaNewsPageReq extends PageQuery<OaNews> {
    public String title;
    public String newsType;
}
