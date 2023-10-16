package cn.wwwlike.vlife.dict;

public enum DateRange {
    TODAY("today"),
    YESTERDAY("yesterday"),
    THIS_WEEK("this_week"),
    LAST_WEEK("last_week"),
    THIS_MONTH("this_month"),
    LAST_MONTH("last_month"),
    THIS_YEAR("this_year"),
    LAST_YEAR("last_year"),
    LAST_7_DAYS("last_7_days"),
    LAST_30_DAYS("last_30_days"),
    LAST_90_DAYS("last_90_days"),
    LAST_1_YEAR("last_1_year");
    private String value;

    DateRange(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}