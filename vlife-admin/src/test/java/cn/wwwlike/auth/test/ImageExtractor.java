package cn.wwwlike.auth.test;

import org.apache.commons.io.IOUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class ImageExtractor {
    public static void main(String[] args) {
        String imgFilePath = "D://file.img"; // 替换为镜像文件的本地路径

        try (InputStream inputStream = new File(imgFilePath).toURI().toURL().openStream()) {
            byte[] imgBytes = IOUtils.toByteArray(inputStream);
            extractImagesFromImg(imgBytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void extractImagesFromImg(byte[] imgBytes) {
        // 解析镜像文件，提取其中的图片
        // 这里需要根据img镜像文件格式进行解析，提取出图片的字节数组或写入到本地文件
        // 可以使用第三方库或自己实现解析逻辑
        // 假设解析逻辑已实现，可以调用下面的方法保存图片到本地文件

        saveImageToFile(imgBytes, "D://image.jpg"); // 替换为保存图片的本地路径
    }

    public static void saveImageToFile(byte[] imageBytes, String outputPath) {
        try (FileOutputStream outputStream = new FileOutputStream(outputPath)) {
            outputStream.write(imageBytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}