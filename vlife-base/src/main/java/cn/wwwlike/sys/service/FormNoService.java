/*
 *  vlife http://github.com/wwwlike/vlife
 *
 *  Copyright (C)  2018-2022 vlife
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package cn.wwwlike.sys.service;
import cn.wwwlike.sys.dao.FormNoDao;
import cn.wwwlike.sys.entity.FormNo;
import cn.wwwlike.vlife.core.VLifeService;
import cn.wwwlike.vlife.dict.VCT;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class FormNoService extends VLifeService<FormNo, FormNoDao> {

    //流水号补齐
    private  String formatNumberWithZeros(int number, int length) throws IllegalArgumentException {
        String numberStr = String.valueOf(number);
        if (numberStr.length() > length) {
            throw new IllegalArgumentException("数字 '" + number + "' 的长度 " + numberStr.length() + " 超过允许的长度 " + length + ".");
        }
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = numberStr.length(); i < length; i++) {
            stringBuilder.append('0');
        }
        stringBuilder.append(numberStr);
        return stringBuilder.toString();
    }

    /**
     * 流水号重置
     * 根据日期类型发生改变后流水号清空
     */
    private List<FormNo> snReset(List<FormNo> formNos,boolean snLastNext){
        Optional<FormNo> dateRule=formNos.stream().filter(d->d.getType().equals("d")).findFirst();//日期规则
        FormNo snRule=formNos.stream().filter(d->d.getType().equals("ls")).findFirst().get();//流水规则
        if(dateRule.isPresent()){
            FormNo dateFormNo=dateRule.get();
            String dateLast=dateFormNo.getDateLast();
            String currDate=DateFormatUtils.format(new Date(),(dateFormNo.getDateType()));
            if(!currDate.equals(dateLast)){
                //日期与格式不匹配流水号需要重置
                snRule.setSnLast(null);
                dateFormNo.setDateLast(currDate);
            }
        }
        return formNos;
    }

    /**
     * 流水号规则建立在表单模型的字段上，
     * 1. 流水号必须有一个
     * 2. 日期序号多多智能有一个
     * 3. fixed固定字符可以有多个
     * 需要注意：同一个模型的不同菜单会存在多个表单模型。那么该表单的相同字段的流水号规则就不一样了(需要给出方案)
     * 1. 日期有变动，则序号从初始序号重新开始
     */
    public String getNo(String formFieldId,boolean snLastNext){
        List<FormNo> formNos = find("formFieldId", formFieldId);
        formNos.sort((Comparator.comparing(FormNo::getSort)));
        formNos=snReset(formNos,snLastNext);
        StringBuffer no=new StringBuffer();
        for(FormNo formNo:formNos){
            if(VCT.FormNoType.FIXED.equals(formNo.getType())){
                no.append(formNo.getStaticText());
            }
            if(VCT.FormNoType.LS.equals(formNo.getType())){
                int currNo=formNo.getSnLast()==null?formNo.getSnStart()==null?1: formNo.getSnStart():(formNo.getSnLast()+1);
                no.append(formatNumberWithZeros(currNo,formNo.getSnLength()==null?3:formNo.getSnLength()));
                if(snLastNext){
                    formNo.setSnLast(currNo);
                    save(formNo);//更新流水号
                }
            }
            if(VCT.FormNoType.D.equals(formNo.getType())){
                no.append(DateFormatUtils.format(new Date(),(formNo.getDateType())));
            }
        }
        return no.toString();
    }
}
