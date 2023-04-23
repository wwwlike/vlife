package cn.wwwlike.common;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;

public class BusinessNumberGenerator {
    private static final String PREFIX = "BN-"; // 编号前缀
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMdd"); // 日期格式
    private static final int LENGTH = 10; // 编号总位数

    private static AtomicLong sequence = new AtomicLong(1); // 自增序列

    // 生成业务编号
    public static synchronized String generate(String keyword) {
        String dateStr = DATE_FORMAT.format(new Date()); // 获取当前日期字符串，格式为 yyyyMMdd
        long seq = sequence.getAndIncrement(); // 获取下一个自增序列
        StringBuilder sb = new StringBuilder(LENGTH);
        sb.append(PREFIX)
            .append(keyword)
            .append(dateStr)
            .append(String.format("%04d", seq % 10000)); // 将自增序列补充为4位数字

//        if (sb.length() > LENGTH) {
//            throw new RuntimeException("编号超过限制长度");
//        }
        return sb.toString();
    }
}