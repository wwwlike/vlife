package cn.wwwlike.sys.common;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

//资源分类
@Data
public class ResourcesType {
    //接口访问路径前缀
    public String pathPrefix ;
    //标题
    public String title;
    //图标
    public String icon;

    public ResourcesType (String pathPrefix,String title,String icon){
        this.pathPrefix=pathPrefix;
        this.title=title;
        this.icon=icon;
    }

    public static List<ResourcesType> resourcesTypeList(){
        List<ResourcesType> types=new ArrayList<>();
        types.add(new ResourcesType("add","新增","IconSave"));
        types.add(new ResourcesType("save","编辑","IconSave"));
        types.add(new ResourcesType("edit","修改","IconSave"));
        types.add(new ResourcesType("remove","删除","IconDelete"));
        //list 一般是查询全部， 不纳入到权限管理中
        types.add(new ResourcesType("page","查询","IconListView"));
        types.add(new ResourcesType("detail","详情","IconExternalOpen"));
        types.add(new ResourcesType("import","导入","IconImport"));
        types.add(new ResourcesType("export","导出","IconExport"));
        types.add(new ResourcesType("print","打印","IconPrint"));
        types.add(new ResourcesType("sync","同步","IconSync"));
        return types;
    }

}
