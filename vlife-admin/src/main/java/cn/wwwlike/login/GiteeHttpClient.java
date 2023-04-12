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

package cn.wwwlike.login;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URISyntaxException;

@Component
public class GiteeHttpClient {
    /**
     * 获取Access Token
     * post
     */
    public static JSONObject getAccessToken(String url) throws IOException {
        HttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);
//        httpPost.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36");
        HttpResponse response = client.execute(httpPost);
        HttpEntity entity = response.getEntity();
        if (null != entity) {
            String result = EntityUtils.toString(entity, "UTF-8");
            return JSONObject.parseObject(result);
        }
        httpPost.releaseConnection();
        return null;
    }

    /**
     * 获取用户信息
     * get
     */
    public static JSONObject getUserInfo1(String url) throws IOException {
        JSONObject jsonObject = null;
        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(url);
        httpGet.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36");
        HttpResponse response = client.execute(httpGet);
        HttpEntity entity = response.getEntity();

        if (entity != null) {
            String result = EntityUtils.toString(entity, "UTF-8");
            jsonObject = JSONObject.parseObject(result);
        }

        httpGet.releaseConnection();

        return jsonObject;
    }

//    https://gitee.com/api/v5/user
    /**
     * 获取授权用户的资料
     * gitee get方式获取用户信息
     */
    public static JSONObject getUserInfo(String token,String url) throws IOException, URISyntaxException {
        JSONObject jsonObject = null;
        CloseableHttpClient client = HttpClients.createDefault();
        URIBuilder builder = new URIBuilder(url);
        builder.setParameter("access_token", token);
        HttpGet httpGet = new HttpGet(builder.build());
        httpGet.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36");
        HttpResponse response = client.execute(httpGet);
        HttpEntity entity = response.getEntity();
        if (entity != null) {
            String result = EntityUtils.toString(entity, "UTF-8");
            jsonObject = JSONObject.parseObject(result);
        }
        httpGet.releaseConnection();
        return jsonObject;
    }


    public static JSONArray getArray(String token,String url) throws IOException, URISyntaxException {
        JSONArray jsonArray = null;
        CloseableHttpClient client = HttpClients.createDefault();
        URIBuilder builder = new URIBuilder(url);
        builder.setParameter("access_token", token);
        HttpGet httpGet = new HttpGet(builder.build());
        httpGet.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36");
        HttpResponse response = client.execute(httpGet);
        HttpEntity entity = response.getEntity();
        if (entity != null) {
            String result = EntityUtils.toString(entity, "UTF-8");
            jsonArray = JSONObject.parseArray(result);
        }
        httpGet.releaseConnection();
        return jsonArray;
    }


    public static JSONObject put(String token,String url,JSONObject json) throws IOException, URISyntaxException {
        JSONObject jsonObject = null;
        CloseableHttpClient client = HttpClients.createDefault();
        URIBuilder builder = new URIBuilder(url);
        builder.setParameter("access_token", token);
        json.keySet().forEach((k)->{
            builder.setParameter(k,json.getString(k));
        });
        HttpPut httpPut = new HttpPut(builder.build());
        httpPut.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36");
        HttpResponse response = client.execute(httpPut);
        HttpEntity entity = response.getEntity();
        if (entity != null) {
            String result = EntityUtils.toString(entity, "UTF-8");
            jsonObject = JSONObject.parseObject(result);
        }
        httpPut.releaseConnection();
        return jsonObject;
    }


    public static JSONObject post(String token,String url,JSONObject json) throws IOException, URISyntaxException {
        JSONObject jsonObject = null;
        CloseableHttpClient client = HttpClients.createDefault();
        URIBuilder builder = new URIBuilder(url);
        builder.setParameter("access_token", token);
        json.keySet().forEach((k)->{
            builder.setParameter(k,json.getString(k));
        });
        HttpPost httpPost = new HttpPost(builder.build());
        httpPost.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36");
        HttpResponse response = client.execute(httpPost);
        HttpEntity entity = response.getEntity();
        if (entity != null) {
            String result = EntityUtils.toString(entity, "UTF-8");
            jsonObject = JSONObject.parseObject(result);
        }
        httpPost.releaseConnection();
        return jsonObject;
    }
}
