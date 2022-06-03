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

package cn.wwwlike.autoconfiguration;

import cn.wwwlike.autoconfiguration.dict.CheckModel;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 类说明
 *
 * @author dlc
 * @date 2022/5/29
 */
@ConfigurationProperties(prefix = "vlife")
@Getter
public class VlifeProperties {

    private CheckModel checkModel;
    /**
     * 扫描包路径的根节点
     */
    private String packroot;

    public VlifeProperties setCheckModel(CheckModel checkModel) {
        this.checkModel = checkModel;
        return this;
    }

    public VlifeProperties setPackroot(String packroot) {
        this.packroot = packroot;
        return this;
    }
}
