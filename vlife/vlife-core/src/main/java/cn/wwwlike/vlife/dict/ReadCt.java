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

package cn.wwwlike.vlife.dict;
import cn.wwwlike.vlife.utils.ReflectionUtils;

import javax.inject.Named;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

/**
 * 字典解析
 */
public class ReadCt {

    public static List<DictVo> getSysDict(){
        return read(CT.class,VCT.class);
    }

    /**
     * 通过类和值返回中文名称
     * @param value
     * @return
     */
    public static String getLabel(Class outer,Class inner,Object value){
        try{
        Object sub=Class.forName(outer.getName()+"$"+inner.getSimpleName()).newInstance();
        Field[] dictDetail=sub.getClass().getFields();
        for(Field field:dictDetail){
            Named temp=field.getAnnotation(Named.class);
            Object val=  ReflectionUtils.getFieldValue(sub,field.getName());
            if(val.toString().equals(value.toString())){
                return temp.value();
            }
        }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return "";
    }
    /**
     * 根据class读字典类的信息
     * @param clazz
     * @return
     */
    public static List<DictVo> read(Class... clazz){
        List<DictVo> vos=new ArrayList<>();
        try {
            for(Class clz:clazz){
                Class innerClazz[]=clz.getDeclaredClasses();
                DictVo vo=null;
                for(Class dictType:innerClazz){
                    String innerName=dictType.getSimpleName();
                    Object sub=Class.forName(clz.getName()+"$"+innerName).newInstance();
                    Named obj=sub.getClass().getAnnotation(Named.class);
                    vo=new DictVo(innerName,obj.value(),true);
                    vos.add(vo);
                    Field[] dictDetail=sub.getClass().getFields();
                    int i=1;
                    for(Field field:dictDetail){
                        Named temp=field.getAnnotation(Named.class);
                        Object val=  ReflectionUtils.getFieldValue(sub,field.getName());
                        String title=temp.value();
                        vo=new DictVo(innerName,val.toString(),title,false,i);
                        vos.add(vo);
                        i++;
                    }
                }
            }
            }catch (Exception ex){
                ex.printStackTrace();
            }
        return vos;
    }
}
