package cn.wwwlike.sys.api;
import cn.wwwlike.common.DataImpResult;
import cn.wwwlike.form.vo.FormFieldVo;
import cn.wwwlike.sys.entity.SysExcel;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.bean.ExcelUploadFile;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.service.FormService;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.excel.service.ExcelService;
import cn.wwwlike.vlife.core.VLifeApi;
import cn.wwwlike.vlife.query.req.VlifeQuery;
import cn.wwwlike.web.exception.enums.CommonResponseEnum;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.text.ParseException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Excel导入导出
 */
@RestController
@RequestMapping("/excel")
public class ExcelApi extends VLifeApi<SysExcel,ExcelService> {
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
        response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
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

//    /**
//     * 数据导入
//     */
//    @PostMapping("/importData")
//    public Integer importData(ExcelUploadFile data) throws InstantiationException, IllegalAccessException, IOException {
//        FormVo formVo=formService.query(FormVo.class,new VlifeQuery<Form>().qw(Form.class).eq("type",data.getEntityType())).get(0);
//        List<FormFieldVo> uniqueFields = formVo.getFields().stream().filter(field -> field.isValidate_unique()==true).collect(Collectors.toList());
//        CommonResponseEnum.CANOT_CONTINUE.assertNotEmpty(uniqueFields,"当前模型没有设置一个唯一字段");
//        InputStream inputStream =data.getFile().getInputStream();
//        Workbook workbook = WorkbookFactory.create(inputStream);
//        if(service.getExcelFields(formVo.getFields(),  workbook).stream().filter(field -> field==null).count()>0){
//            return -1; //模版里有null字段，模版错误
//        }
//        List<Item> dbs=service.excelToItems(formVo,workbook,data.getOverride(),null);
//        service.save(dbs,data.getEntityType());
//        inputStream.close();
//        return dbs.size();
//    }

    @PostMapping("/importData")
    public DataImpResult importData(ExcelUploadFile data) throws InstantiationException, IllegalAccessException, IOException, ParseException {
        DataImpResult result=new DataImpResult();
        FormVo formVo=formService.query(FormVo.class,new VlifeQuery<Form>().qw(Form.class).eq("type",data.getEntityType())).get(0);
        List<FormFieldVo> uniqueFields = formVo.getFields().stream().filter(field -> field.isValidate_unique()==true).collect(Collectors.toList());
        CommonResponseEnum.CANOT_CONTINUE.assertNotEmpty(uniqueFields,"当前模型没有设置一个唯一字段");
        InputStream inputStream =data.getFile().getInputStream();
        Workbook workbook = WorkbookFactory.create(inputStream);
        if(service.getExcelFields(formVo.getFields(),  workbook).stream().filter(field -> field==null).count()>0){
            result.setMsg("请检查导入数据是否和当前业务匹配");
            result.setResult(false);
            return result;
        }
        result.setTotal(workbook.getSheetAt(0).getLastRowNum()-2);
        List<Item> dbs=service.excelToItems(formVo,workbook,data.getOverride(),result);
        result.setSuccess(dbs.size());
        if(dbs.size()>0){
            result.setResult(true);
        }
        service.setMsg(result);
        service.save(dbs,data.getEntityType());
        inputStream.close();
        return result;
    }

}
