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

package cn.wwwlike.vlife.objship.read;

import cn.wwwlike.vlife.base.IModel;
import cn.wwwlike.vlife.base.IPage;
import cn.wwwlike.vlife.base.Item;
import cn.wwwlike.vlife.base.SaveBean;
import cn.wwwlike.vlife.base.VoBean;
import cn.wwwlike.vlife.bean.DbEntity;
import cn.wwwlike.vlife.objship.dto.BeanDto;
import cn.wwwlike.vlife.objship.dto.EntityDto;
import cn.wwwlike.vlife.utils.GenericsUtils;

import java.util.List;

import static cn.wwwlike.vlife.dict.VCT.ITEM_TYPE.*;

/**
 * 非do,req,save,vo的模型读取
 */
public class BeanRead extends ItemReadTemplate<BeanDto> {
    private static BeanRead INSTANCE = null;

    private BeanRead(List<EntityDto> info) {
        this.infos = info;
    }

    public static BeanRead getInstance(List<EntityDto> info) {
        if (INSTANCE == null) {
            INSTANCE = new BeanRead(info);
        }
        return INSTANCE;
    }

    /**
     * 读取一vo类的信息
     *
     * @param s
     * @return
     */
    public BeanDto readInfo(Class s) {
        BeanDto dto = null;
        if (!VoBean.class.isAssignableFrom(s)&&!SaveBean.class.isAssignableFrom(s)&&!IPage.class.isAssignableFrom(s)
                &&!DbEntity.class.isAssignableFrom(s) && IModel.class.isAssignableFrom(s)
        ) {
            dto = new BeanDto();
            superRead(dto, s);
            dto.setItemType(BEAN);
            Class entityClz = GenericsUtils.getGenericType(s);
            if (entityClz!= null && Item.class.isAssignableFrom(entityClz)) {
                dto.setEntityType(entityClz.getSimpleName());
            }
        }
        return dto;
    }

    /**
     * save里注入的对象
     * 要么是 save对象，要么是基础数据对象,打平类型的不行
     */
    public void relation() {
        super.beanDtos=readAll;
    }

}
