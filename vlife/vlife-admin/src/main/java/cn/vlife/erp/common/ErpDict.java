package cn.vlife.erp.common;

import javax.inject.Named;

/**
 * erp内置字典
 */
public class ErpDict {

    @Named("采购单状态")
    public static final class order_purchase_state {
        @Named("待付款")
        public final static String pay = "1";
        @Named("已付款")
        public final static String paid = "2";
        @Named("已入库")
        public final static String received= "3";
        @Named("已作废")
        public final static String cancel= "4";
    }

    @Named("销售单状态")
    public static final class order_sale_state {
        @Named("进行中")
        public final static String pay = "1";
        @Named("已收款")
        public final static String paid = "2";
        @Named("交付中")
        public final static String send= "3";
        @Named("已完成")
        public final static String finish= "4";
//        @Named("退货中")
//        public final static String back= "5";
//        @Named("已退款")
//        public final static String backFinish= "6";
        @Named("已作废")
        public final static String cancel= "7";
    }

    @Named("发货单状态")
    public static final class order_send_state {
        @Named("进行中")
        public final static String send = "1";
        @Named("已发货")
        public final static String finish = "2";
        @Named("已退货")
        public final static String backFinish= "3";
    }








}
