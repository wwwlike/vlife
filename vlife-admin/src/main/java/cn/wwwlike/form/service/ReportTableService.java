package cn.wwwlike.form.service;

import cn.wwwlike.common.BaseService;
import cn.wwwlike.form.dao.ReportTableDao;
import cn.wwwlike.form.entity.ReportItem;
import cn.wwwlike.form.entity.ReportTable;
import cn.wwwlike.form.vo.ReportItemVo;
import cn.wwwlike.form.vo.ReportTableItemVo;
import cn.wwwlike.form.vo.ReportTableVo;
import cn.wwwlike.oa.entity.Project;
import cn.wwwlike.vlife.bi.ReportQuery;
import cn.wwwlike.vlife.bi.ReportWrapper;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class ReportTableService extends BaseService<ReportTable, ReportTableDao> {

    @Autowired
    public ReportItemService reportItemService;

    /**
     * 1. 单个统计项的聚合查询结果
     * 一个聚合函数值(reportItem)的查询
     * @param itemCode
     * @return
     */
    public Object queryOne(String itemCode){
        ReportQuery req =new ReportQuery();
        ReportItemVo item = reportItemService.query(
                ReportItemVo.class,
                QueryWrapper.of(ReportItem.class).eq("code", itemCode)).get(0);
        item.setEntityClz(GlobalData.entityDto(item.getForm().getEntityType()).getClz());
        ReportWrapper rw=req.qw(item);
        //植入权限过滤条件，根据模块查询条件设置；
        rw = addQueryFilter(rw);
        List<Map> result = new ArrayList<>();
        result = report(result, rw);
        return result.get(0).get(itemCode);
    }

    /**
     * 2. 单统计项汇总分组查询
     * ->
     * @param itemCode 统计项编码
     * @param groupBy  分组条件字段
     * @return
     */
    public List<Map> itemReport(String itemCode,String ... groupBy){
        ReportQuery<ReportItem> req=new ReportQuery<ReportItem>();
        req.setReportCode(itemCode);
        req.setGroups(Arrays.asList(groupBy));
        ReportItemVo item = reportItemService.query(
                ReportItemVo.class,
                QueryWrapper.of(ReportItem.class).eq("code", itemCode)).get(0);
//        req.setEntityClz(Project.class);
        item.setEntityClz(Project.class);
        ReportWrapper rw=req.qw(item);
        List<Map> result = report(rw);
        return result;
    }

    /**
     * 报表查询
     */
    public List<Map> report(ReportQuery req) {
        List<ReportTableItemVo> items = null;
        List<String> itemCode = req.getItemCode();
        if (req.getReportCode() != null&& itemCode==null) {
            itemCode=new ArrayList<>();
            ReportTableVo vo = query(ReportTableVo.class, QueryWrapper.of(ReportTable.class).eq("code", req.getReportCode())).get(0);
            items = vo.getItems();
            //找到所有统计项和指标项里的形成合集
            for (ReportTableItemVo v : items) {
                if (v.getItem() != null) {
                    itemCode.add(v.getItem().getCode());
                } else if (v.getKpi() != null) {
                    List<ReportItem> list = reportItemService.findByIds(v.getKpi().getReportItemId(), v.getKpi().getReportItemOtherId());
                    for (ReportItem i : list) {
                        if (!itemCode.contains(i.getCode()))
                            itemCode.add(i.getCode());
                    }
                }
            }
        }
        List<Map> result = new ArrayList<>();
        //遍历查询所有统计项的值，封装到result里
        for (String code : itemCode) {
            ReportItemVo item = reportItemService.query(
                    ReportItemVo.class,
                    QueryWrapper.of(ReportItem.class).eq("code", code)).get(0);
            item.setEntityClz(GlobalData.entityDto(item.getForm().getEntityType()).getClz());
            ReportWrapper rw=req.qw(item);
            //植入权限过滤条件，根据模块查询条件设置；
            rw = addQueryFilter(rw);
            result = report(result, rw);
        }
        //kpi值拼装
        if (items != null) {
            for (ReportTableItemVo item : items) {
                if (item.getKpi() != null) {
                    for (Map m : result) {
                        m.put(item.getKpi().getCode(), Double.parseDouble(m.get(
                                reportItemService.findOne(item.getKpi().getReportItemId()).getCode()
                        )+"") / Double.parseDouble( m.get(reportItemService.findOne(item.getKpi().getReportItemOtherId()).getCode())+""));
                    }
                }
        }
        }
        return result;
    }


}



