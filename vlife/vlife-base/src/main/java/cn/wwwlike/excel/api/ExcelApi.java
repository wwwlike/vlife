package cn.wwwlike.excel.api;

import cn.wwwlike.form.dao.FormDao;
import cn.wwwlike.form.entity.FormField;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.bean.ExcelUploadFile;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.excel.service.ExcelService;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.List;

/**
 * 通用导入导出
 */
@RestController
@RequestMapping("/excel")
public class ExcelApi {

    @Autowired
    public ExcelService service;

    @Autowired
    public FormService formService;



    /**
     * 下载导入模板
     */
    @GetMapping("/template/{type}")
    public void template(HttpServletResponse response,@PathVariable String type) throws IOException {
        FormVo formVo=formService.query(FormVo.class,new VlifeQuery<Form>().qw(Form.class).eq("type",type)).get(0);
        Workbook workbook = service.template(formVo);
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        String fileName = formVo.getName()+"(数据导入模版).xlsx";
        String encodedFileName = URLEncoder.encode(fileName, "UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename="+encodedFileName);
        workbook.write(response.getOutputStream());
    }

    /**
     * 数据导出
     */
    @PostMapping("/exportData/{type}")
    public  void exportData(VlifeQuery query){}



    /**
     * 数据导入
     */
    @PostMapping("/importData")
    public Integer importData(ExcelUploadFile data) throws InstantiationException, IllegalAccessException, IOException {
        FormVo formVo=formService.query(FormVo.class,new VlifeQuery<Form>().qw(Form.class).eq("type",data.getEntityType())).get(0);
        InputStream inputStream =data.getFile().getInputStream();
        Workbook workbook = WorkbookFactory.create(inputStream);
        List<Item> dbs=service.excelToItems(formVo,workbook,data.getOverride());
        service.save(dbs,data.getEntityType());
//        VLifeService entityService=service.getService(data.getEntityType());
//        dbs.forEach(item -> {
//            entityService.save(item);
//        });
        inputStream.close();
        return dbs.size();
    }

}
