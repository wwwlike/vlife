package cn.wwwlike.vlife.bean;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

//上传的文件信息
@Data
public class ExcelUploadFile {
    public String entityType;
    public MultipartFile file;
    public Boolean override;
}
