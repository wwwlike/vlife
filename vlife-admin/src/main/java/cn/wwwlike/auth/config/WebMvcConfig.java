package cn.wwwlike.auth.config;
import cn.wwwlike.web.converter.DateJacksonConverter;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperFactoryBean;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

import java.text.SimpleDateFormat;
import java.util.List;

@Configuration
public class WebMvcConfig {
    @Bean
    public DateJacksonConverter dateJacksonConverter() {
        return new DateJacksonConverter();
    }


    @Bean//post body能接收 日期类型；
    public Jackson2ObjectMapperFactoryBean jackson2ObjectMapperFactoryBean(
            @Autowired DateJacksonConverter dateJacksonConverter) {
        Jackson2ObjectMapperFactoryBean jackson2ObjectMapperFactoryBean = new Jackson2ObjectMapperFactoryBean();
        jackson2ObjectMapperFactoryBean.setDeserializers(dateJacksonConverter);
        return jackson2ObjectMapperFactoryBean;
    }

    @Bean
    MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter(@Autowired ObjectMapper objectMapper) {
        MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd")); // HH:mm:ss
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);//允许提交json没有的字段
        mappingJackson2HttpMessageConverter.setObjectMapper(objectMapper);  // 设置objectMapper
        return mappingJackson2HttpMessageConverter;
    }
}
