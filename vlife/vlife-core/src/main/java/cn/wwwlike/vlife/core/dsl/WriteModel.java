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

package cn.wwwlike.vlife.core.dsl;

import cn.wwwlike.vlife.base.IdBean;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.dict.VCT;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.FieldDto;
import cn.wwwlike.vlife.objship.read.GlobalData;
import cn.wwwlike.vlife.utils.GenericsUtils;
import cn.wwwlike.vlife.utils.ReflectionUtils;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.jpa.impl.JPAUpdateClause;
import lombok.Getter;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static cn.wwwlike.vlife.core.dsl.QueryHelper.getItemEntityPath;

@Getter
public class WriteModel<T extends Item> implements WModel<T> {

    private JPAQueryFactory factory;

    public JPAUpdateClause updateClause;

    public void resetClause() {
        this.updateClause =factory.update(main);
    }

    /**
     * 查询结果vo的clz类型
     */
    private Class<? extends IdBean> saveClz;

    private Class<T> entityClz;
    /**
     * 查询主表dsl的path表达式
     */
    private EntityPathBase main;

    private BeanDto saveDto;

    public WriteModel(JPAQueryFactory factory, Class<? extends SaveBean> saveBeanClz) {
        this.factory=factory;
        this.entityClz = Item.class.isAssignableFrom(saveBeanClz)?(Class<T>) saveBeanClz :GenericsUtils.getGenericType(saveBeanClz);
        main = getItemEntityPath(entityClz);
        this.saveClz = saveBeanClz;
        this.updateClause = factory.update(main);
        this.saveDto =Item.class.isAssignableFrom(saveBeanClz)?GlobalData.entityDto(entityClz): GlobalData.saveDto(saveBeanClz);
    }



    @Override
    public JPAUpdateClause getUpdateClause() {
        return this.updateClause;
    }

    /**
     * 将dto转换成
     *
     * @param saveBean 要保存的对象
     * @param <E>      转换成实体类
     * @return
     */
    @Override
    public <E extends SaveBean<T>> T dtoToEntity(E saveBean) {
        T t = null;
        try {
            t = entityClz.newInstance();
            List<FieldDto> fields = saveDto.filter(VCT.ITEM_TYPE.BASIC);
            for (FieldDto field : fields) {
                Object val = ReflectionUtils.getFieldValue(saveBean, field.getFieldName());
                ReflectionUtils.setFieldValue(t, field.getEntityFieldName(), val);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            return t;
        }

    }

    /**
     * update的简单where条件
     *
     * @param expressions
     * @return
     */
    @Override
    public WModel where(BooleanExpression... expressions) {
        getUpdateClause().where(expressions);
        return this;
    }


    private <E extends IdBean> WModel setVals(E bean, boolean fieldsIsIgnore,String... fields) {
        List<FieldDto> basic = saveDto.filter(VCT.ITEM_TYPE.BASIC);
        Map<Path, Object> map = new HashMap<>();
        boolean isItem=bean instanceof Item?true:false;
        for (FieldDto fieldDto : basic) {
            try{
                String entityName=isItem?fieldDto.getFieldName():fieldDto.getEntityFieldName();
                Boolean isIgnore=fields==null?false:(Arrays.stream(fields).filter(str->{
                    return entityName.equals(str);
                }).count()>0);
                if (!entityName.equals("id")&&isIgnore==!fieldsIsIgnore) {
                    map.put(getPath(entityName),
                            ReflectionUtils.getFieldValue(bean, fieldDto.getFieldName())
                    );
                }
            }catch (Exception ex){
                ex.printStackTrace();
            }
        }
        if(bean.getId()!=null){
            setUpdateClauseVal(map);
        }else{

        }
        return this;
    }

    @Override
    public <E extends IdBean> WModel setValWithAssign(E bean, String... assigns) {
        return setVals(bean,false,assigns);
    }

    /**
     * 将bean里的值取出来设置到map里等待querydsl进行save
     * bean是item使用fieldName,saveBean使用 entityFieldName
     * @param ignores 排除不处理的字段
     */
    @Override
    public <E extends IdBean> WModel setVal(E bean, String... ignores) {
        return setVals(bean,true,ignores);
    }

    @Override
    public <E extends IdBean> WModel setVal(E bean) {
        return setVal(bean,null);
    }

    @Override
    public <E extends IdBean> WModel setVal(String fieldName, Object val) {
        this.getUpdateClause().set(getPath(fieldName), val);
        return this;
    }

    /**
     * 赋值条件设置
     *
     * @param valMap
     * @return
     */
    @Override
    public WModel setUpdateClauseVal(Map<Path, Object> valMap) {
        for (Path key : valMap.keySet()) {
            this.getUpdateClause().set(key, valMap.get(key));
        }
        return this;
    }


    public Path getPath(Function fieldName) {
        return null;
    }

    public Path getPath(String fieldName) {
        Path<?> fieldPath = (Path) ReflectionUtils.getFieldValue(main, fieldName);
        return fieldPath;
    }


}
