/*
 Navicat MySQL Data Transfer

 Source Server         : benji
 Source Server Type    : MySQL
 Source Server Version : 50733
 Source Host           : localhost:3306
 Source Schema         : auth

 Target Server Type    : MySQL
 Target Server Version : 50733
 File Encoding         : 65001

 Date: 14/09/2022 15:43:10
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for oa_project
-- ----------------------------
DROP TABLE IF EXISTS `oa_project`;
CREATE TABLE `oa_project`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `project_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `start_date` datetime(6) NULL DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_org_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_area_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_dept_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `customer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of oa_project
-- ----------------------------
INSERT INTO `oa_project` VALUES ('40288a818336fbf7018336fcec420000', '2022-09-13 21:14:48.764000', '1', NULL, NULL, '1', '1', '1', '2022-09-14 00:00:00.000000', '3', '40288a81828ad2b801828ad66e790004', '40288a8183360b430183361702df003c', '40288a81828ac3bf01828acf55930024', NULL, '2');

-- ----------------------------
-- Table structure for sys_area
-- ----------------------------
DROP TABLE IF EXISTS `sys_area`;
CREATE TABLE `sys_area`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `level` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `areacode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_area
-- ----------------------------
INSERT INTO `sys_area` VALUES ('1', NULL, NULL, NULL, NULL, '1', '3', '汉口', '420107', '42_01_07', NULL);
INSERT INTO `sys_area` VALUES ('2', NULL, NULL, NULL, NULL, '1', '3', '点都区', '420206', '42_02_06', NULL);
INSERT INTO `sys_area` VALUES ('40288a81828ac3bf01828acf55930024', '2022-08-11 10:50:19.923000', '1', NULL, NULL, '1', '1', '湖北省', '420000', '42', NULL);
INSERT INTO `sys_area` VALUES ('40288a818290fd6e01829280701b00b4', '2022-08-12 22:41:07.099000', '1', '2022-08-12 22:41:17.931000', '1', '1', '2', '武汉市', '420100', '42_01', NULL);
INSERT INTO `sys_area` VALUES ('40288a818290fd6e01829280f98400b5', '2022-08-12 22:41:42.276000', '1', NULL, NULL, '1', '2', '宜昌市', '420200', '42_02', NULL);
INSERT INTO `sys_area` VALUES ('40288a818290fd6e01829281549800b6', '2022-08-12 22:42:05.592000', '1', NULL, NULL, '1', '3', '武昌区', '420106', '42_01_06', NULL);

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_org_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES ('40288a81828b2ed401828b30a62c0000', '2022-08-11 12:36:37.540000', NULL, '1', '销售部', '1', NULL, '40288a81828ad2b801828ad66e790004', NULL, NULL);

-- ----------------------------
-- Table structure for sys_dict
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict`;
CREATE TABLE `sys_dict`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `edit` bit(1) NULL DEFAULT NULL,
  `sys` bit(1) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `val` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dict
-- ----------------------------
INSERT INTO `sys_dict` VALUES ('40288a8182a5aa3b0182a5d33bee0120', '2022-08-16 16:44:20.333000', '1', NULL, NULL, '1', 'ORG_TYPE', b'1', b'0', '事业单位', '1');
INSERT INTO `sys_dict` VALUES ('40288a8182a5aa3b0182a5d383420121', '2022-08-16 16:44:38.593000', '1', NULL, NULL, '1', 'ORG_TYPE', b'1', b'0', '外资企业', '2');
INSERT INTO `sys_dict` VALUES ('40288a8182a5aa3b0182a5d3ac5f0122', '2022-08-16 16:44:49.119000', '1', NULL, NULL, '1', 'ORG_TYPE', b'1', b'0', '私营企业', '3');
INSERT INTO `sys_dict` VALUES ('40288a8182a5aa3b0182a5d3e3270123', '2022-08-16 16:45:03.143000', '1', '2022-08-16 16:45:30.736000', '1', '1', 'ORG_TYPE', b'1', b'0', '上市公司', '4');
INSERT INTO `sys_dict` VALUES ('40288a8182a64a8d0182a64b70050000', '2022-08-16 18:55:37.967000', '1', NULL, NULL, '1', 'USER_TYPE', b'1', b'0', '员工', '1');
INSERT INTO `sys_dict` VALUES ('40288a8182a64a8d0182a64bb4580001', '2022-08-16 18:55:55.479000', '1', NULL, NULL, '1', 'USER_TYPE', b'1', b'0', '项目经理', '2');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa0216020025', '2022-08-17 12:13:59.682000', '1', NULL, NULL, '1', 'PROJECT_STATE', b'1', b'0', '待启动', '1');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa022d240026', '2022-08-17 12:14:05.604000', '1', NULL, NULL, '1', 'PROJECT_STATE', b'1', b'0', '进行中', '2');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa024b9d0027', '2022-08-17 12:14:13.405000', '1', NULL, NULL, '1', 'PROJECT_STATE', b'1', b'0', '已完成', '3');
INSERT INTO `sys_dict` VALUES ('40288a8182f6d84b0182f7e4fc520002', '2022-09-01 15:12:35.408000', '1', '2022-09-01 15:13:04.513000', '1', '1', 'USER_TYPE', b'1', b'0', '老板', '3');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607a10000', '2022-09-13 10:38:08.283000', '1', NULL, NULL, '1', 'STATE', b'0', b'1', '业务状态', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607a70001', '2022-09-13 10:38:08.295000', '1', NULL, NULL, '1', 'STATE', b'0', b'1', '作废', '0');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607a70002', '2022-09-13 10:38:08.295000', '1', NULL, NULL, '1', 'STATE', b'0', b'1', '正常', '1');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607a80003', '2022-09-13 10:38:08.295000', '1', NULL, NULL, '1', 'STATE', b'0', b'1', '停用', '2');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607a80004', '2022-09-13 10:38:08.296000', '1', NULL, NULL, '1', 'STATUS', b'0', b'1', '数据状态', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607a80005', '2022-09-13 10:38:08.296000', '1', NULL, NULL, '1', 'STATUS', b'0', b'1', '删除', '0');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607a80006', '2022-09-13 10:38:08.296000', '1', NULL, NULL, '1', 'STATUS', b'0', b'1', '正常', '1');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607a90007', '2022-09-13 10:38:08.296000', '1', NULL, NULL, '1', 'DATA_FILTER_TYPE', b'0', b'1', '过滤方式', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607a90008', '2022-09-13 10:38:08.297000', '1', NULL, NULL, '1', 'DATA_FILTER_TYPE', b'0', b'1', '本级', '1');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607aa0009', '2022-09-13 10:38:08.297000', '1', NULL, NULL, '1', 'DATA_FILTER_TYPE', b'0', b'1', '本级下级', '2');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ab000a', '2022-09-13 10:38:08.298000', '1', NULL, NULL, '1', 'SYSRESOURCES_TYPE', b'0', b'1', '资源类型', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ab000b', '2022-09-13 10:38:08.299000', '1', NULL, NULL, '1', 'SYSRESOURCES_TYPE', b'0', b'1', '菜单', '1');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ab000c', '2022-09-13 10:38:08.299000', '1', NULL, NULL, '1', 'SYSRESOURCES_TYPE', b'0', b'1', '接口', '2');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ab000d', '2022-09-13 10:38:08.299000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '删除方式', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ab000e', '2022-09-13 10:38:08.299000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '物理删除', 'delete');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ad000f', '2022-09-13 10:38:08.300000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '逻辑删除', 'remove');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ad0010', '2022-09-13 10:38:08.301000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '关联清除', 'clear');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ad0011', '2022-09-13 10:38:08.301000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '不关联操作', 'nothing');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ad0012', '2022-09-13 10:38:08.301000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '数据类型', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ae0013', '2022-09-13 10:38:08.301000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '基础数据类型', 'basic');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ae0014', '2022-09-13 10:38:08.302000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '集合', 'list');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ae0015', '2022-09-13 10:38:08.302000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '主键列表', 'IDS');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607ae0016', '2022-09-13 10:38:08.302000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '实体类', 'entity');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607af0017', '2022-09-13 10:38:08.302000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', 'VO对象', 'vo');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607af0018', '2022-09-13 10:38:08.303000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '提交对象', 'save');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607af0019', '2022-09-13 10:38:08.303000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '查询对象', 'req');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b0001a', '2022-09-13 10:38:08.303000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', 'API对象', 'api');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b0001b', '2022-09-13 10:38:08.304000', '1', NULL, NULL, '1', 'ITEM_STATE', b'0', b'1', '业务状态', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b0001c', '2022-09-13 10:38:08.304000', '1', NULL, NULL, '1', 'ITEM_STATE', b'0', b'1', '正常', '1');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b0001d', '2022-09-13 10:38:08.304000', '1', NULL, NULL, '1', 'ITEM_STATE', b'0', b'1', '异常', '-1');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b0001e', '2022-09-13 10:38:08.304000', '1', NULL, NULL, '1', 'ITEM_STATE', b'0', b'1', '待处理', '0');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b2001f', '2022-09-13 10:38:08.305000', '1', NULL, NULL, '1', 'ORG_TYPE', b'1', b'1', '机构分类', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b20020', '2022-09-13 10:38:08.306000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '地区类型', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b20021', '2022-09-13 10:38:08.306000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '省', '1');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b30022', '2022-09-13 10:38:08.306000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '市/州', '2');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b30023', '2022-09-13 10:38:08.307000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '县/区', '3');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b30024', '2022-09-13 10:38:08.307000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '乡镇/街', '4');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b30025', '2022-09-13 10:38:08.307000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '村/社区', '5');
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b30026', '2022-09-13 10:38:08.307000', '1', NULL, NULL, '1', 'PROJECT_STATE', b'1', b'1', '项目阶段', NULL);
INSERT INTO `sys_dict` VALUES ('40288a818334b357018334b607b30027', '2022-09-13 10:38:08.307000', '1', NULL, NULL, '1', 'USER_TYPE', b'1', b'1', '用户类型', NULL);

-- ----------------------------
-- Table structure for sys_filter
-- ----------------------------
DROP TABLE IF EXISTS `sys_filter`;
CREATE TABLE `sys_filter`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `entity_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_filter
-- ----------------------------
INSERT INTO `sys_filter` VALUES ('40288a8183376edf0183376f3e7f0000', '2022-09-13 23:19:40.921000', '1', NULL, NULL, '1', 'sysDept', '科室部门');
INSERT INTO `sys_filter` VALUES ('40288a8183376edf0183376f3e980006', '2022-09-13 23:19:40.952000', '1', NULL, NULL, '1', 'project', '项目管理');
INSERT INTO `sys_filter` VALUES ('40288a8183376edf0183376f3ea6000c', '2022-09-13 23:19:40.966000', '1', NULL, NULL, '1', 'sysUser', '用户表');
INSERT INTO `sys_filter` VALUES ('40288a81833a880201833a8fda6d0003', '2022-09-14 13:54:09.643000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', 'sysOrg', '机构');
INSERT INTO `sys_filter` VALUES ('40288a81833ad35701833ad3ea740000', '2022-09-14 15:08:30.191000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', 'sysArea', '行政区划');

-- ----------------------------
-- Table structure for sys_filter_detail
-- ----------------------------
DROP TABLE IF EXISTS `sys_filter_detail`;
CREATE TABLE `sys_filter_detail`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `field_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_filter_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `def_filter` bit(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_filter_detail
-- ----------------------------
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e880001', '2022-09-13 23:19:40.935000', '1', NULL, NULL, '1', 'id', '查看本部门创建的数据', '40288a8183376edf0183376f3e7f0000', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e880002', '2022-09-13 23:19:40.936000', '1', NULL, NULL, '1', 'id', '查看本部门和下级部门创建的数据', '40288a8183376edf0183376f3e7f0000', '2', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e890003', '2022-09-13 23:19:40.937000', '1', NULL, NULL, '1', 'createId', '查看本用户创建的科室部门数据', '40288a8183376edf0183376f3e7f0000', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e890004', '2022-09-13 23:19:40.937000', '1', NULL, NULL, '1', 'sysOrgId', '查看本机构创建的科室部门数据', '40288a8183376edf0183376f3e7f0000', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e890005', '2022-09-13 23:19:40.937000', '1', NULL, NULL, '1', 'sysOrgId', '查看本机构和下级机构的创建的科室部门数据', '40288a8183376edf0183376f3e7f0000', '2', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e990007', '2022-09-13 23:19:40.952000', '1', NULL, NULL, '1', 'createId', '查看本用户创建的项目管理数据', '40288a8183376edf0183376f3e980006', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e9a0008', '2022-09-13 23:19:40.954000', '1', NULL, NULL, '1', 'sysOrgId', '查看本机构创建的项目管理数据', '40288a8183376edf0183376f3e980006', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e9a0009', '2022-09-13 23:19:40.954000', '1', NULL, NULL, '1', 'sysOrgId', '查看本机构和下级机构的创建的项目管理数据', '40288a8183376edf0183376f3e980006', '2', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e9a000a', '2022-09-13 23:19:40.954000', '1', NULL, NULL, '1', 'sysAreaId', '查看本地区创建的项目管理数据', '40288a8183376edf0183376f3e980006', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3e9b000b', '2022-09-13 23:19:40.955000', '1', NULL, NULL, '1', 'sysAreaId', '查看本地区和下级地区的创建的项目管理数据', '40288a8183376edf0183376f3e980006', '2', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3ea7000d', '2022-09-13 23:19:40.966000', '1', NULL, NULL, '1', 'createId', '查看本用户创建的用户表数据', '40288a8183376edf0183376f3ea6000c', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3ea7000e', '2022-09-13 23:19:40.967000', '1', NULL, NULL, '1', 'sysOrgId', '查看本机构创建的用户表数据', '40288a8183376edf0183376f3ea6000c', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a8183376edf0183376f3ea7000f', '2022-09-13 23:19:40.967000', '1', NULL, NULL, '1', 'sysOrgId', '查看本机构和下级机构的创建的用户表数据', '40288a8183376edf0183376f3ea6000c', '2', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a81833a880201833a8fda6f0004', '2022-09-14 13:54:09.645000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', 'createId', '查看本用户创建的机构数据', '40288a81833a880201833a8fda6d0003', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a81833a880201833a8fda6f0005', '2022-09-14 13:54:09.647000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', 'id', '查看本机构创建的数据', '40288a81833a880201833a8fda6d0003', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a81833a880201833a8fda700006', '2022-09-14 13:54:09.648000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', 'id', '查看本机构和下级机构创建的数据', '40288a81833a880201833a8fda6d0003', '2', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a81833a880201833a8fda730007', '2022-09-14 13:54:09.649000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', 'sysAreaId', '查看本地区创建的机构数据', '40288a81833a880201833a8fda6d0003', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a81833a880201833a8fda740008', '2022-09-14 13:54:09.651000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', 'sysAreaId', '查看本地区和下级地区的创建的机构数据', '40288a81833a880201833a8fda6d0003', '2', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a81833ad35701833ad3ea7c0001', '2022-09-14 15:08:30.203000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', 'createId', '查看本用户创建的行政区划数据', '40288a81833ad35701833ad3ea740000', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a81833ad35701833ad3ea7d0002', '2022-09-14 15:08:30.204000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', 'id', '查看本地区创建的数据', '40288a81833ad35701833ad3ea740000', '1', '1', NULL);
INSERT INTO `sys_filter_detail` VALUES ('40288a81833ad35701833ad3ea7d0003', '2022-09-14 15:08:30.205000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', 'id', '查看本地区和下级地区创建的数据', '40288a81833ad35701833ad3ea740000', '2', '1', NULL);

-- ----------------------------
-- Table structure for sys_filter_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_filter_group`;
CREATE TABLE `sys_filter_group`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_filter_detail_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_group_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_filter_group
-- ----------------------------
INSERT INTO `sys_filter_group` VALUES ('40288a81833791950183379896e50000', '2022-09-14 00:04:50.528000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', '40288a8183376edf0183376f3ea7000f', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833791950183379896f20001', '2022-09-14 00:04:50.545000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', '40288a8183376edf0183376f3e890005', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833949d3018339530eb20000', '2022-09-14 08:08:08.100000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a8183376edf0183376f3ea7000f', 'group1');
INSERT INTO `sys_filter_group` VALUES ('40288a81833949d301833953e5390001', '2022-09-14 08:09:03.033000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a8183376edf0183376f3ea7000d', 'group2');
INSERT INTO `sys_filter_group` VALUES ('40288a81833a880201833a8d16560000', '2022-09-14 13:51:08.371000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a8183376edf0183376f3ea7000e', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833a880201833a8d16600001', '2022-09-14 13:51:08.384000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a8183376edf0183376f3e9a0008', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833a880201833a8d16630002', '2022-09-14 13:51:08.387000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a8183376edf0183376f3e890004', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833a880201833a9128a40009', '2022-09-14 13:55:35.204000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', '40288a81833a880201833a8fda6f0005', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833a976c01833a9951830000', '2022-09-14 14:04:29.952000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', '40288a81833a880201833a8fda740008', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833a9c1101833a9ca3fb0000', '2022-09-14 14:08:07.671000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', '40288a81833a880201833a8fda6f0005', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833a9f5801833aa11e270000', '2022-09-14 14:13:01.092000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', '40288a81833a880201833a8fda740008', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833aa15401833aa29fe30000', '2022-09-14 14:14:39.839000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', '40288a81833a880201833a8fda730007', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833aa15401833aa349bc0001', '2022-09-14 14:15:23.324000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', '40288a81833a880201833a8fda700006', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833aa15401833aa3a7970002', '2022-09-14 14:15:47.351000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a81833a880201833a8fda6f0004', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833aa15401833aa3dd120003', '2022-09-14 14:16:01.042000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a81833a880201833a8fda6f0005', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833ab01a01833ab0aeef0000', '2022-09-14 14:30:01.194000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a81833a880201833a8fda700006', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833ab01a01833ab0aef90001', '2022-09-14 14:30:01.209000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a81833a880201833a8fda730007', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833ab01a01833ab0aefc0002', '2022-09-14 14:30:01.212000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a81833a880201833a8fda740008', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833ad35701833ad6813f0004', '2022-09-14 15:11:19.871000', '40288a8182a656740182a659f4d10001', NULL, NULL, '0', '40288a81833ad35701833ad3ea7d0002', '40288a8183360b430183361553530037');
INSERT INTO `sys_filter_group` VALUES ('40288a81833ad35701833ad6f46d0005', '2022-09-14 15:11:49.357000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '40288a81833ad35701833ad3ea7d0003', '40288a8183360b430183361553530037');

-- ----------------------------
-- Table structure for sys_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_group`;
CREATE TABLE `sys_group`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_group
-- ----------------------------
INSERT INTO `sys_group` VALUES ('40288a8183360b430183361492090031', '2022-09-13 17:01:01.321000', '2022-09-13 23:31:10.747000', '1', '管理员', '管理系统基础数据', NULL, NULL);
INSERT INTO `sys_group` VALUES ('40288a8183360b430183361553530037', '2022-09-13 17:01:50.803000', '2022-09-14 15:11:49.335000', '1', '运维人员', '所有操作权限和最大的数据权限', NULL, '40288a8182a656740182a659f4d10001');
INSERT INTO `sys_group` VALUES ('group1', NULL, '2022-09-14 08:08:08.083000', '1', '集团领导', '查看机构和下级机构的数据', NULL, '40288a8182a656740182a659f4d10001');
INSERT INTO `sys_group` VALUES ('group2', NULL, '2022-09-14 08:09:03.027000', '1', '员工', '查看本人数据', NULL, '40288a8182a656740182a659f4d10001');

-- ----------------------------
-- Table structure for sys_org
-- ----------------------------
DROP TABLE IF EXISTS `sys_org`;
CREATE TABLE `sys_org`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `enable_date` datetime(6) NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_area_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `orgcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_org
-- ----------------------------
INSERT INTO `sys_org` VALUES ('40288a81828ad2b801828ad66e790004', '2022-08-11 10:58:05.048000', '1', '2022-08-11 11:03:38.833000', '1', '1', '2022-08-10 00:00:00.000000', '武汉宏兴', '40288a81828ac3bf01828acf55930024', '4', NULL, '001', NULL);
INSERT INTO `sys_org` VALUES ('40288a8182aa0f470182ab0c46f60001', '2022-08-17 17:04:44.789000', '1', NULL, NULL, '1', '2022-08-17 00:00:00.000000', '武汉卓尔', '40288a818290fd6e01829280701b00b4', '4', NULL, '002', NULL);
INSERT INTO `sys_org` VALUES ('40288a8182aa0f470182ab0cc6370002', '2022-08-17 17:05:17.367000', '1', NULL, NULL, '1', '2022-08-18 00:00:00.000000', '武汉三镇', '40288a818290fd6e01829281549800b6', '3', NULL, '004', NULL);
INSERT INTO `sys_org` VALUES ('40288a81832a7e7f01832a7ea5900000', '2022-09-11 11:01:26.519000', '1', '2022-09-11 11:02:27.996000', '1', '1', NULL, 'hehe', NULL, NULL, NULL, '001_001_001', '001_001');
INSERT INTO `sys_org` VALUES ('40288a81832a7e7f01832a7ec1af0001', '2022-09-11 11:01:33.733000', '1', '2022-09-12 10:45:30.438000', '1', '1', NULL, '武汉体院', '40288a818290fd6e01829281549800b6', '4', '点对点', '001_001', '001');
INSERT INTO `sys_org` VALUES ('40288a81832a7e7f01832a7f13ad0002', '2022-09-11 11:01:54.716000', '1', '2022-09-12 10:43:54.801000', '1', '1', NULL, '江大女足', '40288a818290fd6e01829280701b00b4', '2', NULL, '002_001_001', '002_001');
INSERT INTO `sys_org` VALUES ('40288a81832a7e7f01832a8037880003', '2022-09-11 11:03:09.440000', '1', '2022-09-12 10:47:52.954000', '1', '1', '2022-09-14 00:00:00.000000', '三峡大学', '40288a818290fd6e01829280f98400b5', '4', '3333', '002_001', '002');
INSERT INTO `sys_org` VALUES ('40288a81832a7e7f01832a809e3a0004', '2022-09-11 11:03:35.732000', '1', '2022-09-12 10:45:47.177000', '1', '1', NULL, 'heh777e', NULL, NULL, NULL, '001_002', '001');

-- ----------------------------
-- Table structure for sys_reources
-- ----------------------------
DROP TABLE IF EXISTS `sys_reources`;
CREATE TABLE `sys_reources`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `resources_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `resources_pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `request_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `menu_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_reources
-- ----------------------------
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0773ec00000', '2022-08-15 15:45:45.655000', NULL, '1', 'sysRole', NULL, '角色管理', NULL, NULL, NULL, '1', '', '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a077cb100001', '2022-08-15 15:46:21.583000', '2022-09-13 23:32:49.426000', '1', 'sysRole:page', NULL, '查询', NULL, NULL, 'role2', '2', '/sysRole/page', '1', '1', 'sysRole');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b30bca000d', '2022-08-15 16:51:04.777000', '2022-08-15 16:51:22.932000', '1', 'sysResources', NULL, '资源管理', NULL, NULL, NULL, '1', NULL, '1', '1', NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b3b2fc000e', '2022-08-15 16:51:47.580000', NULL, '1', 'sysGroup', NULL, '权限组管理', NULL, NULL, NULL, '1', '', '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b3fb49000f', '2022-08-15 16:52:06.089000', NULL, '1', 'sysDict', NULL, '字典管理', NULL, NULL, NULL, '1', NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b438e50010', '2022-08-15 16:52:21.860000', NULL, '1', 'sysUser', NULL, '用户管理', NULL, NULL, NULL, '1', NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b472b70011', '2022-08-15 16:52:36.663000', NULL, '1', 'sysOrg', NULL, '机构管理', NULL, NULL, NULL, '1', NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b4b7310012', '2022-08-15 16:52:54.192000', NULL, '1', 'sysArea', NULL, '地区管理', NULL, NULL, NULL, '1', NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b4f4440013', '2022-08-15 16:53:09.827000', NULL, '1', 'sysDept', NULL, '部门管理', NULL, NULL, NULL, '1', NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b614d90014', '2022-08-15 16:54:23.704000', '2022-09-13 23:33:35.529000', '1', 'sysResources:save', NULL, '保存', 'sysResources:page', NULL, '40288a8182f310a10182f3a3a5690000', '2', '/sysResources/save', '1', '1', 'sysResources');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b6dc720015', '2022-08-15 16:55:14.801000', '2022-09-13 23:33:35.524000', '1', 'sysResources:page', NULL, '查询', NULL, NULL, '40288a8182f310a10182f3a3a5690000', '2', '/sysResources/page', '1', '1', 'sysResources');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b767350016', '2022-08-15 16:55:50.324000', '2022-09-13 23:32:49.419000', '1', 'sysGroup:page', NULL, '查询', NULL, NULL, 'role2', '2', '/sysGroup/page', '1', '1', 'sysGroup');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b7f29d0017', '2022-08-15 16:56:26.012000', '2022-09-13 23:32:25.978000', '1', 'sysUser:page', NULL, '查询', NULL, NULL, 'role1', '2', '/sysUser/page', '1', '1', 'sysUser');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b84f980018', '2022-08-15 16:56:49.816000', '2022-09-13 23:32:49.412000', '1', 'sysDict:page', NULL, '查询', NULL, NULL, 'role2', '2', '/sysDict/page', '1', '1', 'sysDict');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b8c55e0019', '2022-08-15 16:57:19.965000', '2022-09-13 23:32:49.404000', '1', 'sysOrg:page', NULL, '查询', NULL, NULL, 'role2', '2', '/sysOrg/page', '1', '1', 'sysOrg');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b9086f001a', '2022-08-15 16:57:37.134000', '2022-09-13 23:32:49.398000', '1', 'sysDept:page', NULL, '查询', NULL, NULL, 'role2', '2', '/sysDept/page', '1', '1', 'sysDept');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b9c167001b', '2022-08-15 16:58:24.486000', '2022-09-13 23:32:49.392000', '1', 'sysArea:page', NULL, '查询', NULL, NULL, 'role2', '2', '/sysArea/page', '1', '1', 'sysArea');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0baea3f001c', '2022-08-15 16:59:40.479000', '2022-09-13 23:33:35.518000', '1', 'sysResources:remove', NULL, '删除', 'sysResources:page', NULL, '40288a8182f310a10182f3a3a5690000', '2', '/sysResources/remove', '1', '1', 'sysResources');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080011', NULL, '2022-09-13 23:32:49.434000', '1', 'sysGroup:remove', NULL, '删除', 'sysGroup:page', NULL, 'role2', '2', '/sysGroup/remove', '1', '1', 'sysGroup');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080012', NULL, '2022-09-13 23:32:49.440000', '1', 'sysDict:remove', 'IconDelete', '删除', 'sysDict:page', NULL, 'role2', '2', '/sysDict/remove', '1', '1', 'sysDict');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080013', NULL, '2022-09-13 23:32:25.988000', '1', 'sysUser:remove', 'IconDelete', '删除', 'sysUser:page', NULL, 'role1', '2', '/sysUser/remove', '1', '1', 'sysUser');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080014', NULL, '2022-09-13 23:32:49.448000', '1', 'sysArea:remove', 'IconDelete', '删除', 'sysArea:page', NULL, 'role2', '2', '/sysArea/remove', '1', '1', 'sysArea');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080015', NULL, '2022-09-13 23:32:49.454000', '1', 'sysOrg:remove', 'IconDelete', '删除', 'sysOrg:page', NULL, 'role2', '2', '/sysOrg/remove', '1', '1', 'sysOrg');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080016', NULL, '2022-09-13 23:32:49.460000', '1', 'sysDept:remove', 'IconDelete', '删除', 'sysDept:page', NULL, 'role2', '2', '/sysDept/remove', '1', '1', 'sysDept');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec08001d', '2022-08-15 17:00:46.471000', '2022-09-13 23:32:49.386000', '1', 'sysRole:remove', 'IconDelete', '删除', 'sysRole:page', NULL, 'role2', '2', '/sysRole/remove', '1', '1', 'sysRole');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c050ef001e', '2022-08-15 17:05:34.447000', '2022-09-13 23:32:49.381000', '1', 'sysRole:save', NULL, '保存', 'sysRole:page', NULL, 'role2', '2', '/sysRole/save', '1', '1', 'sysRole');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c6c158001f', '2022-08-15 17:12:36.439000', '2022-09-13 23:32:25.943000', '1', 'sysUser:save', NULL, '保存', 'sysUser:page', NULL, 'role1', '2', '/sysUser/save', '1', '1', 'sysUser');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90020', '2022-08-15 17:13:57.241000', '2022-09-13 23:32:49.375000', '1', 'sysDict:save', NULL, '保存', 'sysDict:page', NULL, 'role2', '2', '/sysDict/save', '1', '1', 'sysDict');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90021', NULL, '2022-09-13 23:32:49.466000', '1', 'sysDept:save', NULL, '保存', 'sysDept:page', NULL, 'role2', '2', '/sysDept/save', '1', '1', 'sysDept');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90022', NULL, '2022-09-13 23:32:49.473000', '1', 'sysOrg:save', NULL, '保存', 'sysOrg:page', NULL, 'role2', '2', '/sysOrg/save', '1', '1', 'sysOrg');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90023', NULL, '2022-09-13 23:32:49.480000', '1', 'sysArea:save', NULL, '保存', 'sysArea:page', NULL, 'role2', '2', '/sysArea/save', '1', '1', 'sysArea');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90024', NULL, '2022-09-13 23:32:49.487000', '1', 'sysGroup:save', NULL, '保存', 'sysGroup:page', NULL, 'role2', '2', '/sysGroup/save', '1', '1', 'sysGroup');
INSERT INTO `sys_reources` VALUES ('40288a8182a0e0690182a232e9130006', '2022-08-15 23:50:21.715000', '2022-09-13 23:33:35.510000', '1', 'sysDict:sync', '', '字典同步', 'sysDict:page', NULL, '40288a8182f310a10182f3a3a5690000', '2', '/sysDict/sync', '1', '1', 'sysDict');
INSERT INTO `sys_reources` VALUES ('40288a8182c8ef200182c8f121dd0000', '2022-08-23 12:23:42.294000', '2022-08-23 21:00:53.891000', '0', 'sysRole:detail:roleEditVo', NULL, '角色详情', NULL, NULL, 'role3', '2', '/sysRole/detail/roleEditVo', '1', '1', 'sysRole');
INSERT INTO `sys_reources` VALUES ('40288a8183354ef40183355110380000', '2022-09-13 13:27:28.563000', NULL, '1', 'sysFilterDetail', NULL, '查询配置', NULL, NULL, NULL, '1', NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8183354ef4018335516c660001', '2022-09-13 13:27:52.166000', '2022-09-13 23:33:35.502000', '1', 'sysFilterDetail:page', NULL, '查询', NULL, NULL, '40288a8182f310a10182f3a3a5690000', '2', '/sysFilterDetail/page', '1', '1', 'sysFilterDetail');
INSERT INTO `sys_reources` VALUES ('40288a8183354ef40183355fb4390002', '2022-09-13 13:43:28.056000', '2022-09-13 23:33:35.496000', '1', 'sysFilterDetail:remove', NULL, '删除', 'sysFilterDetail:page', NULL, '40288a8182f310a10182f3a3a5690000', '2', '/sysFilterDetail/remove', '1', '1', 'sysFilterDetail');
INSERT INTO `sys_reources` VALUES ('40288a8183354ef4018335604e080003', '2022-09-13 13:44:07.432000', '2022-09-13 23:33:35.490000', '1', 'sysFilterDetail:save', NULL, '保存', 'sysFilterDetail:page', NULL, '40288a8182f310a10182f3a3a5690000', '2', '/sysFilterDetail/save', '1', '1', 'sysFilterDetail');
INSERT INTO `sys_reources` VALUES ('40288a81833a105a01833a6a4eb10000', '2022-09-14 13:13:09.034000', NULL, '1', 'project', NULL, '项目管理', NULL, NULL, NULL, '1', NULL, '40288a8182a656740182a659f4d10001', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a81833a105a01833a7008080001', '2022-09-14 13:19:24.167000', '2022-09-14 13:23:22.477000', '1', 'project:page', NULL, '查询', NULL, NULL, 'role1', '2', '/project/page', '40288a8182a656740182a659f4d10001', '40288a8182a656740182a659f4d10001', 'project');
INSERT INTO `sys_reources` VALUES ('40288a81833a105a01833a828aaa0002', '2022-09-14 13:39:37.258000', NULL, '1', 'project:save', NULL, '保存', 'project:page', NULL, 'role1', '2', '/project/save', '40288a8182a656740182a659f4d10001', NULL, 'project');
INSERT INTO `sys_reources` VALUES ('40288a81833a105a01833a82f8f40003', '2022-09-14 13:40:05.492000', NULL, '1', 'project:remove', NULL, '删除', 'project:page', NULL, 'role1', '2', '/project/remove', '40288a8182a656740182a659f4d10001', NULL, 'project');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES ('40288a8182f310a10182f3a3a5690000', '2022-08-31 19:22:44.454000', '2022-09-13 23:33:35.483000', '1', '配置管理', '系统运行的基础数据，权限数据配置信息管理', NULL, NULL);
INSERT INTO `sys_role` VALUES ('role1', '2022-08-15 15:49:16.310000', '2022-09-13 23:32:25.922000', '1', '业务数据管理', '管理业务模块的数据', NULL, NULL);
INSERT INTO `sys_role` VALUES ('role2', '2022-08-15 15:49:35.681000', '2022-09-13 23:32:49.366000', '1', '基础数据管理', '对系统运行的基本数据管理', NULL, NULL);

-- ----------------------------
-- Table structure for sys_role_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_group`;
CREATE TABLE `sys_role_group`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_group_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_group
-- ----------------------------
INSERT INTO `sys_role_group` VALUES ('1', NULL, NULL, '1', 'group1', 'role1', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('3', NULL, NULL, '1', 'group2', 'role1', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('4', NULL, NULL, '0', 'group2', 'role2', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('40288a8182f310a10182f3a45a200001', '2022-08-31 19:23:30.718000', NULL, '0', 'group2', '40288a8182f310a10182f3a3a5690000', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('40288a8183360b430183361492140033', '2022-09-13 17:01:01.332000', NULL, '1', '40288a8183360b430183361492090031', 'role2', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('40288a8183360b430183361553550038', '2022-09-13 17:01:50.805000', NULL, '1', '40288a8183360b430183361553530037', '40288a8182f310a10182f3a3a5690000', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('40288a8183360b4301833615535b0039', '2022-09-13 17:01:50.811000', NULL, '1', '40288a8183360b430183361553530037', 'role2', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('40288a8183360b43018336155360003a', '2022-09-13 17:01:50.815000', NULL, '1', '40288a8183360b430183361553530037', 'role1', '1', NULL);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `idno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_group_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `tel` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `usetype` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_org_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `login_num` int(11) NULL DEFAULT NULL,
  `sys_dept_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('1', NULL, '2022-09-14 10:38:17.750000', '1', '420100192939393333', '管理员', '{F4T9t2BE3HCvD9khLCxL/nyib/AdM1WqR/tMx5eJJ2k=}f0afa783ba7607063606fdb43c2e55fb', '1', 'group1', '138777777777', 'admin', '2', '40288a8182a656740182a659f4d10001', '1', '40288a8182aa0f470182ab0c46f60001', 495, NULL);
INSERT INTO `sys_user` VALUES ('40288a8182a656740182a659f4d10001', '2022-08-16 19:11:29.489000', '2022-09-14 15:13:40.371000', '1', '123', 'VIP', '{F4T9t2BE3HCvD9khLCxL/nyib/AdM1WqR/tMx5eJJ2k=}f0afa783ba7607063606fdb43c2e55fb', '1', '40288a8183360b430183361553530037', '44444', 'manage', '1', '40288a8182a656740182a659f4d10001', '40288a8182a656740182a659f4d10001', '40288a8182aa0f470182ab0c46f60001', 159, NULL);
INSERT INTO `sys_user` VALUES ('40288a81833949d3018339544e5e0002', '2022-09-14 08:09:29.949000', NULL, '1', NULL, '领导', '{F4T9t2BE3HCvD9khLCxL/nyib/AdM1WqR/tMx5eJJ2k=}f0afa783ba7607063606fdb43c2e55fb', '1', 'group1', NULL, 'leader', NULL, '40288a8182a656740182a659f4d10001', NULL, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
