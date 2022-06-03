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

package cn.wwwlike.plugins.generator;

import cn.wwwlike.vlife.base.Item;

public class GeneratorUtils {
    /**
     * 判断他的类是否已经有了
     *
     * @param clz
     * @param type
     * @return
     */
    public boolean clzExist(ClassLoader loader, Class<? extends Item> clz, CLZ_TYPE type) {
        String packageName = clz.getPackage().getName();
        int index = packageName.lastIndexOf("entity");
        String className = null;
        if (type == CLZ_TYPE.API) {
            className = packageName.substring(0, index) + "api." + clz.getSimpleName() + "Api";
        } else if (type == CLZ_TYPE.SERVICE) {
            className = packageName.substring(0, index) + "service." + clz.getSimpleName() + "Service";
        } else if (type == CLZ_TYPE.DAO) {
            className = packageName.substring(0, index) + "dao." + clz.getSimpleName() + "Dao";
        } else if (type == CLZ_TYPE.VITEM) {
            className = packageName.substring(0, index) + "item." + clz.getSimpleName() + "Item";
        }
        if (className != null) {
            try {
                loader.loadClass(className);
            } catch (Exception ex) {
                return false;
            }
            return true;
        }
        return false;
    }

    enum CLZ_TYPE {API, DAO, SERVICE, VITEM, DICT}

}
