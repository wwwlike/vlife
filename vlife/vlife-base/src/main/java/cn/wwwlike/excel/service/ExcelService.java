package cn.wwwlike.excel.service;

import cn.wwwlike.form.dao.FormDao;
import cn.wwwlike.form.entity.Form;
import cn.wwwlike.form.vo.FormFieldVo;
import cn.wwwlike.form.vo.FormVo;
import cn.wwwlike.sys.entity.SysDict;
import cn.wwwlike.sys.service.SysDictService;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.query.QueryWrapper;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class ExcelService {

    @Autowired
    public SysDictService dictService;

    @Autowired
    private ApplicationContext applicationContext;

    public VLifeService getService(String entityType) {
        EntityDto entityDto= GlobalData.entityDto(entityType);
        String packageName=entityDto.getClz().getPackage().getName().replaceAll("\\.([^.]*)$", ".service");
        String beanName = entityDto.getClz().getSimpleName()+"Service";
        return (VLifeService) applicationContext.getBean(packageName+"."+beanName);
    }
    /**
     * 导出指定实体excel模版
     */
    public Workbook template(FormVo formVo) {
        Workbook workbook = new XSSFWorkbook();
        CellStyle dateStyle = workbook.createCellStyle();
        CreationHelper createHelper = workbook.getCreationHelper();
        dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyyy-MM-dd"));
        CellStyle numberCellStyle = workbook.createCellStyle();
        numberCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("#,##0"));
        Sheet sheet = workbook.createSheet(formVo.getName());
        DataValidationHelper validationHelper = sheet.getDataValidationHelper();
        Row headerRow = sheet.createRow(1);
        //列头样式
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        // 设置文字居中
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        // 设置边框
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        // 加粗
        headerStyle.setFont(headerFont);
        // 设置背景色
//        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
//        headerStyle.setFillPattern(FillPattern.SOLID_FILL);
        AtomicInteger i = new AtomicInteger(0);
        //不导入的字段过滤
        List<FormFieldVo> fields = formVo.getFields().stream().filter(
                f -> !f.fieldName.equals("id")
                && f.create_hide!=true //新增时隐藏
                && f.x_hidden!=true  //直接隐藏
        ).collect(Collectors.toList());
        fields.forEach(field -> {
            int a = i.getAndIncrement();
            Cell cell = headerRow.createCell(a);
            cell.setCellStyle(headerStyle);
            cell.setCellValue(field.getTitle().trim());
        });
        AtomicInteger j = new AtomicInteger(0);
        fields.forEach(field -> {
            int titleLength = field.getTitle().length();
            int coloumn = j.getAndIncrement();
            if (field.getFieldType().equals("date")) {
                sheet.setDefaultColumnStyle(coloumn, dateStyle);
            } else if (field.getFieldType().equals("number")) {
                sheet.setDefaultColumnStyle(coloumn, numberCellStyle);
            } else if (field.dictCode != null) {
                List<String> dictTitles = dictService.listByCode(field.dictCode).stream()
                        .map(SysDict::getTitle)
                        .collect(Collectors.toList());
                String[] titlesArray = dictTitles.toArray(new String[0]);
                if (titlesArray.length > 0) {
                    DataValidationConstraint constraint = validationHelper.createExplicitListConstraint(titlesArray);
                    CellRangeAddressList addressList = new CellRangeAddressList(2, 10000, coloumn, coloumn);
                    DataValidation validation = validationHelper.createValidation(constraint, addressList);
                    validation.setShowErrorBox(true);
                    sheet.addValidationData(validation);
                }
            }
            if (titleLength > 6) {
                sheet.setColumnWidth(coloumn, titleLength * 2 * 256);
            } else {
                sheet.setColumnWidth(coloumn, 13 * 256);

            }

        });
//        sheet.setDefaultColumnStyle(0, dateCellStyle):
        return workbook;
    }


    private Row title(Workbook workbook) {
        Sheet sheet = workbook.getSheetAt(0);
        return sheet.getRow(1);
    }

    // 通过中文名称获取表头字段的模型信息
    public List<FormFieldVo> getExcelFields(List<FormFieldVo> all, Workbook workbook) throws IOException {
        List<FormFieldVo> list = new ArrayList<>();
        Row titleRow = title(workbook);
        for (Cell cell : titleRow) {
            Optional<FormFieldVo> optional = all.stream().filter(f -> f.getTitle().trim().equals(cell.getStringCellValue().trim())).findFirst();
            if (optional.isPresent()) {
                list.add(optional.get());
            } else {
                list.add(null);
            }
        }
        workbook.close();
        return list;
    }

    /**
     * excel数据转实体数据
     */
    public List<Item> excelToItems(FormVo form, Workbook workbook,boolean override) throws IOException, InstantiationException, IllegalAccessException {
        List<FormFieldVo> fields = getExcelFields(form.getFields(), workbook);
        Class itemClazz = GlobalData.entityDto(form.getEntityType()).getClz();
        List list = excelToList(itemClazz, fields, workbook);
        List<? extends Item> excelItems = listToItems(list, fields);
        if(override){
            return overrideImport(excelItems,fields,itemClazz);
        }else{
            return skipImport(excelItems,fields,itemClazz);
        }

    }


    /**
     * excel数据解析
     */
    private List<Item> excelToList(Class<Item> entityClz, List<FormFieldVo> fields, Workbook workbook) throws InstantiationException, IllegalAccessException, IOException {
        Sheet sheet = workbook.getSheetAt(0);
        List<Item> items = new ArrayList<>();
        for (Row row : sheet) {
            // Iterate through the cells of each row
            Item item = entityClz.newInstance();
            if (row.getRowNum() > 1) {
                for (Cell cell : row) {
                    int columiIndex = cell.getColumnIndex();
                    FormFieldVo _field = fields.get(columiIndex);
                    switch (cell.getCellType()) {
                        case STRING: {
                            if (_field.getFieldType().equals("string")) {
                                ReflectionUtils.setFieldValue(item, _field.getFieldName(), cell.getStringCellValue());
                            } else if (_field.getFieldType().equals("date")) {
                                ReflectionUtils.setFieldValue(item, _field.getFieldName(), cell.getStringCellValue());
                            }
                            break;
                        }
                        case NUMERIC: {
                            if (_field.getFieldType().equals("number")) {
                                ReflectionUtils.setFieldValue(item, _field.getFieldName(), cell.getNumericCellValue());
                            }else if (_field.getFieldType().equals("string")) {
                                double numericValue = cell.getNumericCellValue();
                                DecimalFormat decimalFormat = new DecimalFormat("#");
                                String text = decimalFormat.format(numericValue);
                                ReflectionUtils.setFieldValue(item, _field.getFieldName(),text);
                            } else if (_field.getFieldType().equals("date") && DateUtil.isCellDateFormatted(cell)) {
                                ReflectionUtils.setFieldValue(item, _field.getFieldName(), cell.getDateCellValue());
                            }
                            break;
                        }
                        case BOOLEAN: {
                            if (_field.getFieldType().equals("boolean")) {
                                ReflectionUtils.setFieldValue(item, _field.getFieldName(), cell.getBooleanCellValue());
                            }
                            break;
                        }
//                    default:
//                        System.out.print("N/A" + "\t");
                    }
                }
                items.add(item);
            }
        }
        workbook.close();
        return items;
    }


    @Autowired
    public FormDao dao;

    /**
     * 提取数据转实体数据
     */
    private List<Item> listToItems(List<Item> list, List<FormFieldVo> fields) {
        List<Item> items =null;
        for (FormFieldVo field : fields) {
            //1. 字典数据转换
            if (field.getDictCode() != null) {
                List<SysDict> dicts = dictService.listByCode(field.dictCode);
                Map<Object, String> map = dicts.stream().collect(Collectors.toMap(SysDict::getTitle, SysDict::getVal));
                items = list.stream().map(item -> {
                    Object dictTitle = ReflectionUtils.getFieldValue(item, field.getFieldName());
                    if (dictTitle != null && map.get(dictTitle) != null) {
                        ReflectionUtils.setFieldValue(item, field.getFieldName(), map.get(dictTitle));
                    } else if (dictTitle != null && map.get(dictTitle) == null) {
                        ReflectionUtils.setFieldValue(item, field.getFieldName(), null);
                    }
                    return item;
                }).collect(Collectors.toList());
            } else if (field.getFieldName().endsWith("Id") && field.getEntityFieldName().equals("id")) {
                //外键数据
                List fkName = list.stream().filter(item -> ReflectionUtils.getFieldValue(item, field.getFieldName()) != null).map(item -> ReflectionUtils.getFieldValue(item, field.getFieldName())).distinct()
                        .collect(Collectors.toList());
                Class fkClazz = GlobalData.entityDto(field.getEntityType()).getClz();
                QueryWrapper qw = QueryWrapper.of(fkClazz);
                qw.in("name", fkName.toArray());
                List fkItems = dao.query(fkClazz, qw, null);
                Map map = (Map) fkItems.stream().collect(Collectors.toMap(item -> ReflectionUtils.getFieldValue(item, "name"), item -> ReflectionUtils.getFieldValue(item, "id")));
                items = list.stream().map(item -> {
                    Object fkTitle = ReflectionUtils.getFieldValue(item, field.getFieldName());
                    if (fkTitle != null && map.get(fkTitle) != null) {
                        ReflectionUtils.setFieldValue(item, field.getFieldName(), map.get(fkTitle));
                    } else if (fkTitle != null && map.get(fkTitle) == null) {
                        ReflectionUtils.setFieldValue(item, field.getFieldName(), null);
                    }
                    return item;
                }).collect(Collectors.toList());
            }
        }
        return items;
    }

    //单个实体覆盖
    public Item  override(Item item,Item db,List<FormFieldVo> fields) {
        fields.forEach(f->{
            ReflectionUtils.setFieldValue(db,f.getFieldName(),ReflectionUtils.getFieldValue(item,f.getFieldName()));
        });
        return db;
    }

    //excel数据内部查重，去除重复数据
    private List<?extends Item> innerRepeatFilter(List<? extends Item> excelItems,List<FormFieldVo> uniqueFields){
        //excel数据去重
        for(FormFieldVo f:uniqueFields){
            List list=new ArrayList();
            Set set=new HashSet();
            for(Item i:excelItems){
                if(set.add(ReflectionUtils.getFieldValue(i,f.getFieldName()))){
                    list.add(i);
                }
            }
            excelItems=list;
        }
        return excelItems;
    }

    /**
     * 1. 可覆盖导入
     * 1.1 与数据库数据比对
     * sheet的每行数据里 是唯一类型的字段 ，组合成or 条件查询,查询结果有以下三种可能性
     *  a. 查询到一条记录，那么该条记录就是要被覆盖的那条记录；
     *  b. 查询到多条记录，则程序其实是不知道覆盖哪条记录的;这条数据过滤掉，后面做成导入失败数据，让用户确定；
     *  c. 查询不到记录，则当前这个Item做为新的记录插入数据库
     * 覆盖导入的效率低一点，每行记录都需要去查重；
     * 1.2 导入数据内部查重（使用第一条数据）
     */
    public List<? extends Item> overrideImport(List<? extends Item> items,List<FormFieldVo> fields,Class<Item> entityClz){
        List<Item> dbItems = new ArrayList<>();
        //唯一的字段
        List<FormFieldVo> uniqueFields = fields.stream().filter(field -> field.isValidate_unique()==true).collect(Collectors.toList());
        if(uniqueFields!=null&&uniqueFields.size()>0){
            for(Item item:items){
                QueryWrapper<? extends  Item> qw=QueryWrapper.of(entityClz);
                qw.or(q->{
                    uniqueFields.forEach(f->{
                        Object val=ReflectionUtils.getFieldValue(item,f.getFieldName());
                        q.eq(val!=null,f.getFieldName(),val);
                    });
                });
                List<? extends  Item> list=dao.query(entityClz,qw,null);
                if(list!=null&&list.size()==1){
                    Item  db=list.get(0);
//                    item覆盖db
                    db=override(item,db,fields);
                    dbItems.add(db);
                } else if(list==null||list.size()==0){
                    dbItems.add(item);
                }else{//size>1
                }
            }
        }else{
            return null;
        }
        return innerRepeatFilter(dbItems,uniqueFields);
    }

    /**
     * 2. 去重导入数据过滤
     *  a. 去除与数据库重复数据
     *  b. 去除excel内部重复数据
     *  规则:有几个唯一列就进行几次in查询，每次in查询把存在于数据库的记录排除掉，剩下的记录做新增操作；
     *  优势：查询效率高， 不足：数据量大in查询会有性能问题，需要优化索引。
     *  excel里有多条相同数据，以第一条为准
     */
    public List<? extends Item> skipImport(List<? extends Item> excelItems,List<FormFieldVo> fields,Class<Item> entityClz){
        //唯一的字段
        List<FormFieldVo> uniqueFields = fields.stream().filter(field -> field.isValidate_unique()==true).collect(Collectors.toList());
        if(uniqueFields!=null&&uniqueFields.size()>0){
            QueryWrapper qw=QueryWrapper.of(entityClz);
            //数据库去重
            for(FormFieldVo f:uniqueFields){
                List list=excelItems.stream().filter(item->ReflectionUtils.getFieldValue(item,f.getFieldName())!=null)
                        .map(item->ReflectionUtils.getFieldValue(item,f.getFieldName())).collect(Collectors.toList());
                qw.in(f.fieldName,list.toArray());
                List skipField= (List) dao.query(entityClz,qw,null).stream().map(item->ReflectionUtils.getFieldValue(item,f.getFieldName())).collect(Collectors.toList());
                //  通过字段f 过滤掉已经重复的行记录数 ; 迭代后可实现导入的数据都是当前数据库里没有的字段的行记录
                excelItems=excelItems.stream().filter(item->!skipField.contains(ReflectionUtils.getFieldValue(item,f.getFieldName()))).collect(Collectors.toList());
            }
            //excel数据去重
            excelItems=innerRepeatFilter(excelItems,uniqueFields);
        }else {
            return null;
        }
        return excelItems;
    }


    public void save(List<Item> items,String entityClz){
        VLifeService entityService=getService(entityClz);
        items.forEach(item -> {
            entityService.save(item);
        });
    }
}



