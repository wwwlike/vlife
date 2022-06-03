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

package cn.wwwlike.vlife.bean;

import com.querydsl.core.types.Path;
import com.querydsl.core.types.PathMetadata;
import com.querydsl.core.types.dsl.DateTimePath;
import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.core.types.dsl.StringPath;

import javax.annotation.Generated;

import static com.querydsl.core.types.PathMetadataFactory.forVariable;


/**
 * QDbEntity is a Querydsl query type for DbEntity
 */
@Generated("com.querydsl.codegen.SupertypeSerializer")
public class QDbEntity extends EntityPathBase<DbEntity> {

    public static final QDbEntity dbEntity = new QDbEntity("dbEntity");
    private static final long serialVersionUID = 1705005278L;
    public final DateTimePath<java.util.Date> createDate = createDateTime("createDate", java.util.Date.class);

    public final StringPath id = createString("id");

    public final DateTimePath<java.util.Date> modifyDate = createDateTime("modifyDate", java.util.Date.class);

    public final StringPath status = createString("status");

    public QDbEntity(String variable) {
        super(DbEntity.class, forVariable(variable));
    }

    public QDbEntity(Path<? extends DbEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QDbEntity(PathMetadata metadata) {
        super(DbEntity.class, metadata);
    }

}

