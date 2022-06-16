

# V-LIFE是为全面提升研发效能而生的Java快速开发平台。

VLIFE的核心能力是对复杂数据逻辑进行各种应用场景的处理，多维度赋能快速开发，推进研发由重复性基础开发转到业务能力提升、技术攻关方向上来。
 
- [github] [https://github.com/wwwlike/vlife](https://github.com\wwwlike\vlife)
- [技术文档] [http://vlife.wwwlike.cn](http://vlife.wwwlike.cn) 
- [示例demo] [https://github.com/wwwlike/vlife-example](https://github.com/wwwlike/vlife-example)

##  框架关系
![](http://vlife.wwwlike.cn/static/img/relation.png)
* V-LIFE在JPA与QueryDsl基础上封装了能够处理复杂数据逻辑场景的CRUD接口。重复繁琐数据逻辑操作交给vlife完成，可显著降低研发难度。

## 核心能力
- 数据逻辑处理：对各种有关联数据逻辑的保存、查询、删除封装了开箱即用方法（非单表CRUD），其关联操作产生的SQL复杂程度超出想象。
- 模型编程开发：编写模型(DO\VO\DTO\REQ)就能完成项目开发成为现实，研发行云流水。践行低代码。
- 智能代码生成：依据不同的模型可智能分析生成API，Service，Dao(非模板简单生成)。
## 竞品比对
- 市面上使用spring技术栈的Java快速开发平台层出不穷，VLIFE不是造轮子。它专注于模型开发、专注数据逻辑处理能力提升。VLIFE的模型解析器或许比你更了解程序内在得模型关联映射关系。
### 核心优势
- 开发简单，写POJO模型就可以完成开发工作。或许前端同学就能做这项工作。
- 约定、注解、接口都很少，上手可以很快。
- 任何复杂查询都可以通过模型定义和模型间的关联路径来实现 (如表关系：A表->B表<-C表->X表<-N表)(系统可根据路径关系，实现通过N表的字段查询A表的数据)，
### 核心劣势
- VLIFE目前没有成为全家桶架构平台的计划，所以未有涉及到微服务、安全监控、并发分布式这些专注于高可用、容器化、云原生等方面的工作。

## 适合场景
- 提升研发效率：基于以上核心能力，VLIFE完全能够成为信息系统快速开发的核心骨架，轻松提升开发效率和研发质量。
- 减少沟通成本：后端可以很轻松的通过模型设计封装出符合前端需求的数据对象，能让前后端配合更加和谐高效。

## 如何学V-LIFE
- 从两个方面入手可以快速帮助你掌握vlife的平台使用：1掌握模型编写规则、2掌握VlifeService里通用里数据处理的通用逻辑接口。

> 理解模型

- 模型是VLIFE里的重点，在平台里把写入、展示、过滤的POJO类当作“模型”，常见的有；DO和VO/REQ/DT,模型里的字段属性称作元数据。([模型规范](/guide/annotation))

> 了解接口

-  VLifeService与一般Service的显著区别是提供了更多单业务场景之外的又关联逻辑的CRUD接口.


## 联系帮助
- QQ讨论1群：786134846
  ![](http://vlife.wwwlike.cn/static/img/qq_qun_786134846.png)
