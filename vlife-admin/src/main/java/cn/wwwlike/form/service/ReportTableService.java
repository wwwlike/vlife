package cn.wwwlike.form.service;

import cn.wwwlike.form.dao.ReportTableDao;
import cn.wwwlike.form.entity.ReportItem;
import cn.wwwlike.form.entity.ReportTable;
import cn.wwwlike.form.vo.ReportItemVo;
import cn.wwwlike.form.vo.ReportTableItemVo;
import cn.wwwlike.form.vo.ReportTableVo;
import cn.wwwlike.vlife.bi.ReportQuery;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ReportTableService extends VLifeService<ReportTable, ReportTableDao> {

    @Autowired
    public ReportItemService reportItemService;


    public List<Map> report(ReportQuery req) {
        List<ReportTableItemVo> items = null;
        List<String> itemCode = new ArrayList<>();
        if (req.getReportCode() != null) {
            ReportTableVo vo = query(ReportTableVo.class, QueryWrapper.of(ReportTable.class).eq("code", req.getReportCode())).get(0);
            items = vo.getItems();
            //找到所有统计项和指标项里的形成合集
            for (ReportTableItemVo v : items) {
                if (v.getItem() != null) {
                    itemCode.add(v.getItem().getCode());
                } else if (v.getKpi() != null) {
                    List<ReportItem> list = reportItemService.findByIds(v.getKpi().getReportItemId(), v.getKpi().getReportItemId2());
                    for (ReportItem i : list) {
                        if (!itemCode.contains(i.getCode()))
                            itemCode.add(i.getCode());
                    }
                }
            }
        }
        List<Map> result = new ArrayList<>();
        for (String code : itemCode) {
            ReportItemVo item = reportItemService.query(
                    ReportItemVo.class,
                    QueryWrapper.of(ReportItem.class).eq("code", code)).get(0);
            item.setEntityClz(GlobalData.entityDto(item.getForm().getEntityType()).getClz());
            result = report(result, req.qw(item));
        }
        if (items != null) {
            for (ReportTableItemVo item : items) {
                if (item.getKpi() != null) {
                    for (Map m : result) {
                        m.put(item.getKpi().getCode(), (Double) (m.get(
                                reportItemService.findOne(item.getKpi().getReportItemId()).getCode()
                        )) / (Double) m.get(reportItemService.findOne(item.getKpi().getReportItemId2()).getCode()));
                    }
                }
            }
        }
        return result;
    }


}



