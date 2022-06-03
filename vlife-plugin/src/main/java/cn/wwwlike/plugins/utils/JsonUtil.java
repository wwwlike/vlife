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


package cn.wwwlike.plugins.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class JsonUtil {
    public JsonUtil() {
    }

    public static String toPrettyFormat(String jsonString) {
        try {
            JsonElement jsonElement = new JsonParser().parse(jsonString);
            Gson gson = (new GsonBuilder()).setPrettyPrinting().disableHtmlEscaping().create();
            return gson.toJson(jsonElement);
        } catch (Exception var3) {
            return jsonString;
        }
    }

    public static String toPrettyJson(Object src) {
        Gson gson = (new GsonBuilder()).setPrettyPrinting().disableHtmlEscaping().create();
        return gson.toJson(src);
    }
}
