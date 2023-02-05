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

import cn.wwwlike.common.BaseService;
import cn.wwwlike.sys.api.SysAreaApi;
import cn.wwwlike.sys.dao.SysAreaDao;
import cn.wwwlike.sys.entity.SysArea;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SysAreaService extends BaseService<SysArea, SysAreaDao> {

    /**
     * 给导入的数据加上code和pcode
     */
    public void initCode(){
        List<SysArea> areas=findAll();
        int i=1;
       List<SysArea> roots= areas.stream().filter(area->area.getLevel().equals("1")).collect(Collectors.toList());
        for(SysArea root:roots){
            String rootCode=code(null,i+"");
            i++;
            root.setCode(rootCode);
            dao.save(root);
            List<SysArea> seconds=areas.stream().filter(second->second.getLevel().equals("2")
                    &&second.getAreacode().startsWith(root.getAreacode().substring(0,2))).collect(Collectors.toList());
            int j=1;
            for(SysArea second:seconds){
                second.setPcode(rootCode);
                String secondCode=code(rootCode,j+"");
                second.setCode(secondCode);
                j++;
                dao.save(second);
                List<SysArea> thirds=areas.stream().filter(third->
                                third.getLevel().equals("3")&&
                        third.getAreacode().startsWith(second.getAreacode().substring(0,4))).collect(Collectors.toList());
                int k=1;
                for(SysArea third:thirds){
                    third.setPcode(secondCode);
                    String thirdCode=code(secondCode,k+"");
                    third.setCode(thirdCode);
                    k++;
                    dao.save(third);
                }
            }
        }
    }

    public String code(String rootCode,String i){
        if(rootCode!=null&& rootCode.length()>0){
            rootCode=rootCode+"_";
        }else{
            rootCode="";
        }
        if(i.length()==1){
            return rootCode+"00"+i;
        }else if(i.length()==2){
            return rootCode+"0"+i;
        }else {
            return rootCode+i;
        }

    }

}
