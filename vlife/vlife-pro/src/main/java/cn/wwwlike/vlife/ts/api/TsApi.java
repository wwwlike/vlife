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

package cn.wwwlike.vlife.ts.api;

import cn.wwwlike.vlife.ts.ReadTitle;
import cn.wwwlike.vlife.ts.template.TsFile;
import cn.wwwlike.vlife.utils.FileUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 前端代码同步接口
 */
@RestController
@RequestMapping("/ts")
public class TsApi {
    /**
     * 指定实体TS代码预览
     */
    @PostMapping("/code/{type}")
    public String codeSync(@RequestParam("file") MultipartFile file, @PathVariable String type, HttpServletRequest request) throws IOException {
        InputStream is = file.getInputStream();
        String  json = FileUtil.getFileContent(is);
        return ReadTitle.tsCode(json,type);
    }

}
