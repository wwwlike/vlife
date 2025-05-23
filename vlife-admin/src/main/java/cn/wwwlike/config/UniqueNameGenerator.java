package cn.wwwlike.config;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.AnnotationBeanNameGenerator;
//支持bean类名相同包名不同
public class UniqueNameGenerator extends AnnotationBeanNameGenerator {
 @Override
  public String generateBeanName(BeanDefinition definition, BeanDefinitionRegistry registry) {
     //全限定类名
     String beanName = definition.getBeanClassName();
     return beanName;
   }
}