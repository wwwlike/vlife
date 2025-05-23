package cn.wwwlike.vlife.utils;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;

/**
 * 数字转中文类
 **/
public class NumberChineseFormatterUtils {

	private final static String[] _NUMUPPER = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };

	private final static String[] _SMALLUNIT = { "", "拾","佰","仟"};
	private final static String[] _BIGUNIT = { "","", "万","亿"};
	private final static String[] _AMONTUNIT = { "元","角", "分"};

	public static String amountConvert2Cn(String amount){

		StringBuilder buff = new StringBuilder();

		String[] splits = amount.replaceAll(",", "").split("\\.");
		final String yuan = splits[0];
		//final String jiaofen = splits[1];

		int btyes = yuan.length();
		//分割段数（4位一段，第一段位数<=4）
		int partCounts = btyes%4==0?btyes/4:(btyes/4+1);
		//第一部分长度
		int firstPartLen = btyes%4==0?4:btyes%4;
		//
		String smallNumConvert = smallNumConvert(yuan.substring(0,firstPartLen));
		buff.append(formatAllZore(smallNumConvert,_BIGUNIT[partCounts]));

		for (int i = 1; i < partCounts; i++) {
			String temp = yuan.substring(firstPartLen+i*4-4,firstPartLen+i*4);
			buff.append(formatAllZore(smallNumConvert(temp),_BIGUNIT[partCounts-i]));
		}

		buff.append(_AMONTUNIT[0]);

		return buff.toString().replaceAll("零+", "零");
	}

	private static String formatAllZore(String numConvert,String unit){
		return "零".equals(numConvert)?numConvert:(numConvert+unit);
	}

	/**
	 * 千位计数以内转换处理
	 * @param num 1234
	 * @return
	 */
	private static String smallNumConvert(String num){
		StringBuilder buff = new StringBuilder();

		if(Integer.parseInt(num)==10)
			return "拾";
		if(Integer.parseInt(num)==0)
			return "零";

		char[] arrays = num.toCharArray();

		for (int i = 0; i < arrays.length; i++) {
			int number = Integer.parseInt(String.valueOf(arrays[i]));
			buff.append(_NUMUPPER[number]);
			if(number!=0){
				buff.append(_SMALLUNIT[arrays.length-i-1]);
			}
		}

		String tmp = buff.toString().replaceAll("零+", "零");
		if(tmp.endsWith("零"))
			tmp = tmp.substring(0,tmp.length()-1);
		return tmp;
	}


	public static void main(String[] args) {
		System.out.println(amountConvert2Cn("100.0001"));
	}
}

