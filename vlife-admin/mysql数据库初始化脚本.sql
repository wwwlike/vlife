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

 Date: 18/08/2022 11:32:00
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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of oa_project
-- ----------------------------
INSERT INTO `oa_project` VALUES ('40288a8182a9b75e0182a9b8bd200028', '2022-08-17 10:53:52.798000', '1', '2022-08-17 10:54:31.781000', '1', '0', '项目B', '001', '2022-08-18 00:00:00.000000', '3', '40288a8182a0e0690182a176c89b0000', '1');
INSERT INTO `oa_project` VALUES ('40288a8182a9dab80182a9dbee4c0028', '2022-08-17 11:32:19.148000', '1', '2022-08-17 11:32:28.995000', '1', '0', '2', '2', '2022-08-17 00:00:00.000000', '3', '40288a81828ad2b801828ad66e790004', '1');
INSERT INTO `oa_project` VALUES ('40288a8182aa01ad0182aa02d59e0028', '2022-08-17 12:14:48.734000', '1', '2022-08-17 12:15:40.752000', '1', '0', '项目AAAA', '001', '2022-08-19 00:00:00.000000', '1', '40288a81828ad2b801828ad66e790004', '1');
INSERT INTO `oa_project` VALUES ('40288a8182ab30610182ab34328f0000', '2022-08-17 17:48:21.000000', '40288a8182a656740182a659f4d10001', NULL, NULL, '1', '项目A', 'ABC', '2022-08-17 00:00:00.000000', '3', '40288a8182aa0f470182ab0c46f60001', '1');

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
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `level` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_area
-- ----------------------------
INSERT INTO `sys_area` VALUES ('40288a81828ac3bf01828acf55930024', '2022-08-11 10:50:19.923000', '1', NULL, NULL, '1', '420000', '1', '湖北省', NULL);
INSERT INTO `sys_area` VALUES ('40288a818290fd6e01829280701b00b4', '2022-08-12 22:41:07.099000', '1', '2022-08-12 22:41:17.931000', '1', '1', '420100', '2', '武汉市', '420000');
INSERT INTO `sys_area` VALUES ('40288a818290fd6e01829280f98400b5', '2022-08-12 22:41:42.276000', '1', NULL, NULL, '1', '420200', '2', '宜昌市', '420000');
INSERT INTO `sys_area` VALUES ('40288a818290fd6e01829281549800b6', '2022-08-12 22:42:05.592000', '1', NULL, NULL, '1', '420106', '3', '武昌区', '420100');

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
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_org_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES ('40288a81828b2ed401828b30a62c0000', '2022-08-11 12:36:37.540000', NULL, '1', '销售部', '1', NULL, 'WHHX', '40288a81828ad2b801828ad66e790004');

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
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb5c0000', '2022-08-17 12:13:48.750000', '1', NULL, NULL, '1', 'STATE', b'0', b'1', '业务状态', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb660001', '2022-08-17 12:13:48.772000', '1', NULL, NULL, '1', 'STATE', b'0', b'1', '作废', '0');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb670002', '2022-08-17 12:13:48.774000', '1', NULL, NULL, '1', 'STATE', b'0', b'1', '正常', '1');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb690003', '2022-08-17 12:13:48.776000', '1', NULL, NULL, '1', 'STATE', b'0', b'1', '暂存', '2');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb690004', '2022-08-17 12:13:48.777000', '1', NULL, NULL, '1', 'STATUS', b'0', b'1', '数据状态', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6a0005', '2022-08-17 12:13:48.778000', '1', NULL, NULL, '1', 'STATUS', b'0', b'1', '删除', '0');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6a0006', '2022-08-17 12:13:48.778000', '1', NULL, NULL, '1', 'STATUS', b'0', b'1', '正常', '1');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6b0007', '2022-08-17 12:13:48.778000', '1', NULL, NULL, '1', 'SYSRESOURCES_TYPE', b'0', b'1', '资源类型', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6c0008', '2022-08-17 12:13:48.779000', '1', NULL, NULL, '1', 'SYSRESOURCES_TYPE', b'0', b'1', '菜单', '1');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6c0009', '2022-08-17 12:13:48.780000', '1', NULL, NULL, '1', 'SYSRESOURCES_TYPE', b'0', b'1', '接口', '2');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6d000a', '2022-08-17 12:13:48.781000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '删除方式', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6d000b', '2022-08-17 12:13:48.781000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '物理删除', 'delete');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6e000c', '2022-08-17 12:13:48.782000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '逻辑删除', 'remove');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6e000d', '2022-08-17 12:13:48.782000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '关联清除', 'clear');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb6f000e', '2022-08-17 12:13:48.783000', '1', NULL, NULL, '1', 'DELETE_TYPE', b'0', b'1', '不关联操作', 'nothing');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb71000f', '2022-08-17 12:13:48.785000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '数据类型', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb720010', '2022-08-17 12:13:48.785000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '基础数据类型', 'basic');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb720011', '2022-08-17 12:13:48.786000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '集合', 'list');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb720012', '2022-08-17 12:13:48.786000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '主键列表', 'IDS');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb730013', '2022-08-17 12:13:48.786000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '实体类', 'entity');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb730014', '2022-08-17 12:13:48.787000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', 'VO对象', 'vo');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb740015', '2022-08-17 12:13:48.788000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '提交对象', 'save');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb750016', '2022-08-17 12:13:48.788000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', '查询对象', 'req');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb760017', '2022-08-17 12:13:48.789000', '1', NULL, NULL, '1', 'ITEM_TYPE', b'0', b'1', 'API对象', 'api');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb780018', '2022-08-17 12:13:48.791000', '1', NULL, NULL, '1', 'ITEM_STATE', b'0', b'1', '业务状态', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb790019', '2022-08-17 12:13:48.792000', '1', NULL, NULL, '1', 'ITEM_STATE', b'0', b'1', '正常', '1');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb7a001a', '2022-08-17 12:13:48.794000', '1', NULL, NULL, '1', 'ITEM_STATE', b'0', b'1', '异常', '-1');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb7c001b', '2022-08-17 12:13:48.795000', '1', NULL, NULL, '1', 'ITEM_STATE', b'0', b'1', '待处理', '0');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb7e001c', '2022-08-17 12:13:48.797000', '1', NULL, NULL, '1', 'ORG_TYPE', b'1', b'1', '机构分类', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb7e001d', '2022-08-17 12:13:48.798000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '地区类型', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb7f001e', '2022-08-17 12:13:48.798000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '省', '1');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb7f001f', '2022-08-17 12:13:48.799000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '市/州', '2');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb800020', '2022-08-17 12:13:48.799000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '县/区', '3');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb800021', '2022-08-17 12:13:48.800000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '乡镇/街', '4');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb800022', '2022-08-17 12:13:48.800000', '1', NULL, NULL, '1', 'AREA_LEVEL', b'1', b'1', '村/社区', '5');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb810023', '2022-08-17 12:13:48.800000', '1', NULL, NULL, '1', 'PROJECT_STATE', b'1', b'1', '项目阶段', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa01eb810024', '2022-08-17 12:13:48.801000', '1', NULL, NULL, '1', 'USER_TYPE', b'1', b'1', '用户类型', NULL);
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa0216020025', '2022-08-17 12:13:59.682000', '1', NULL, NULL, '1', 'PROJECT_STATE', b'1', b'0', '待启动', '1');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa022d240026', '2022-08-17 12:14:05.604000', '1', NULL, NULL, '1', 'PROJECT_STATE', b'1', b'0', '进行中', '2');
INSERT INTO `sys_dict` VALUES ('40288a8182aa01ad0182aa024b9d0027', '2022-08-17 12:14:13.405000', '1', NULL, NULL, '1', 'PROJECT_STATE', b'1', b'0', '已完成', '3');

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
INSERT INTO `sys_group` VALUES ('group1', NULL, NULL, '1', '管理员', NULL, '1', NULL);
INSERT INTO `sys_group` VALUES ('group2', NULL, NULL, '1', '员工', NULL, '1', NULL);

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
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `enable_date` datetime(6) NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_area_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_org
-- ----------------------------
INSERT INTO `sys_org` VALUES ('40288a81828ad2b801828ad66e790004', '2022-08-11 10:58:05.048000', '1', '2022-08-11 11:03:38.833000', '1', '1', 'ORG001', '2022-08-10 00:00:00.000000', '武汉宏兴', '40288a81828ac3bf01828acf55930024', '4');
INSERT INTO `sys_org` VALUES ('40288a8182aa0f470182ab0c46f60001', '2022-08-17 17:04:44.789000', '1', NULL, NULL, '1', '420101', '2022-08-17 00:00:00.000000', '武汉卓尔', '40288a818290fd6e01829280701b00b4', '4');
INSERT INTO `sys_org` VALUES ('40288a8182aa0f470182ab0cc6370002', '2022-08-17 17:05:17.367000', '1', NULL, NULL, '1', '002', '2022-08-18 00:00:00.000000', '武汉三镇', '40288a818290fd6e01829281549800b6', '3');

-- ----------------------------
-- Table structure for sys_reources
-- ----------------------------
DROP TABLE IF EXISTS `sys_reources`;
CREATE TABLE `sys_reources`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `modify_date` datetime(6) NULL DEFAULT NULL,
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `pcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `request_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sys_role_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `relation_ids` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `modify_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `only_menu` bit(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_reources
-- ----------------------------
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0773ec00000', '2022-08-15 15:45:45.655000', NULL, '1', 'sysRole', NULL, '角色管理', '', NULL, NULL, '1', '', NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a077cb100001', '2022-08-15 15:46:21.583000', '2022-08-15 16:55:58.023000', '1', 'sysRole:page', NULL, '查询', 'sysRole', NULL, NULL, '2', '/sysRole/page', NULL, '1', '1', b'1');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b30bca000d', '2022-08-15 16:51:04.777000', '2022-08-15 16:51:22.932000', '1', 'sysResources', NULL, '资源管理', NULL, NULL, NULL, '1', NULL, NULL, '1', '1', NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b3b2fc000e', '2022-08-15 16:51:47.580000', NULL, '1', 'sysGroup', NULL, '权限组管理', NULL, NULL, NULL, '1', '', NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b3fb49000f', '2022-08-15 16:52:06.089000', NULL, '1', 'sysDict', NULL, '字典管理', NULL, NULL, NULL, '1', NULL, NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b438e50010', '2022-08-15 16:52:21.860000', NULL, '1', 'sysUser', NULL, '用户管理', NULL, NULL, NULL, '1', NULL, NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b472b70011', '2022-08-15 16:52:36.663000', NULL, '1', 'sysOrg', NULL, '机构管理', NULL, NULL, NULL, '1', NULL, NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b4b7310012', '2022-08-15 16:52:54.192000', NULL, '1', 'sysArea', NULL, '地区管理', NULL, NULL, NULL, '1', NULL, NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b4f4440013', '2022-08-15 16:53:09.827000', NULL, '1', 'sysDept', NULL, '部门管理', NULL, NULL, NULL, '1', NULL, NULL, '1', NULL, NULL);
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b614d90014', '2022-08-15 16:54:23.704000', '2022-08-15 17:08:34.101000', '1', 'sysResources:save', NULL, '保存', 'sysResources', NULL, 'role1', '2', '/sysResources/save', NULL, '1', '1', b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b6dc720015', '2022-08-15 16:55:14.801000', NULL, '1', 'sysResources:page', NULL, '查询', 'sysResources', NULL, NULL, '2', '/sysResources/page', NULL, '1', NULL, b'1');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b767350016', '2022-08-15 16:55:50.324000', NULL, '1', 'sysGroup:page', NULL, '查询', 'sysGroup', NULL, NULL, '2', '/sysGroup/page', NULL, '1', NULL, b'1');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b7f29d0017', '2022-08-15 16:56:26.012000', NULL, '1', 'sysUser:page', NULL, '查询', 'sysUser', NULL, NULL, '2', '/sysUser/page', NULL, '1', NULL, b'1');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b84f980018', '2022-08-15 16:56:49.816000', NULL, '1', 'sysDict:page', NULL, '查询', 'sysDict', NULL, NULL, '2', '/sysDict/page', NULL, '1', NULL, b'1');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b8c55e0019', '2022-08-15 16:57:19.965000', NULL, '1', 'sysOrg:page', NULL, '查询', 'sysOrg', NULL, NULL, '2', '/sysOrg/page', NULL, '1', NULL, b'1');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b9086f001a', '2022-08-15 16:57:37.134000', '2022-08-15 16:57:59.348000', '1', 'sysDept:page', NULL, '查询', 'sysDept', NULL, NULL, '2', '/sysDept/page', NULL, '1', '1', b'1');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0b9c167001b', '2022-08-15 16:58:24.486000', NULL, '1', 'sysArea:page', NULL, '查询', 'sysArea', NULL, NULL, '2', '/sysArea/page', NULL, '1', NULL, b'1');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0baea3f001c', '2022-08-15 16:59:40.479000', NULL, '1', 'sysResources:remove', NULL, '删除', 'sysResources', NULL, 'role1', '2', '/sysResources/remove', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080011', NULL, NULL, '1', 'sysGroup:remove', NULL, '删除', 'sysGroup', NULL, 'role1', '2', '/sysGroup/remove', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080012', NULL, NULL, '1', 'sysDict:remove', NULL, '删除', 'sysDict', NULL, 'role2', '2', '/sysDict/remove', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080013', NULL, NULL, '1', 'sysUser:remove', NULL, '删除', 'sysUser', NULL, 'role2', '2', '/sysUser/remove', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080014', NULL, NULL, '1', 'sysArea:remove', NULL, '删除', 'sysArea', NULL, 'role2', '2', '/sysArea/remove', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080015', NULL, NULL, '1', 'sysOrg:remove', NULL, '删除', 'sysOrg', NULL, 'role2', '2', '/sysOrg/remove', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec080016', NULL, NULL, '1', 'sysDept:remove', NULL, '删除', 'sysDept', NULL, 'role2', '2', '/sysDept/remove', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0bbec08001d', '2022-08-15 17:00:46.471000', NULL, '1', 'sysRole:remove', NULL, '删除', 'sysRole', NULL, 'role3', '2', '/sysRole/remove', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c050ef001e', '2022-08-15 17:05:34.447000', '2022-08-15 17:08:48.825000', '1', 'sysRole:save', NULL, '保存', 'sysRole', NULL, 'role1', '2', '/sysRole/save', NULL, '1', '1', b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c6c158001f', '2022-08-15 17:12:36.439000', NULL, '1', 'sysUser:save', NULL, '保存', 'sysUser', NULL, 'role2', '2', '/sysUser/save', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90020', '2022-08-15 17:13:57.241000', NULL, '1', 'sysDict:save', NULL, '保存', 'sysDict', NULL, 'role2', '2', '/sysDict/save', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90021', NULL, NULL, '1', 'sysDept:save', NULL, '保存', 'sysDept', NULL, 'role2', '2', '/sysDept/save', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90022', NULL, NULL, '1', 'sysOrg:save', NULL, '保存', 'sysOrg', NULL, 'role2', '2', '/sysOrg/save', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90023', NULL, NULL, '1', 'sysArea:save', NULL, '保存', 'sysArea', NULL, 'role2', '2', '/sysArea/save', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a06fc40182a0c7fcf90024', NULL, NULL, '1', 'sysGroup:save', NULL, '保存', 'sysGroup', NULL, 'role1', '2', '/sysGroup/save', NULL, '1', NULL, b'0');
INSERT INTO `sys_reources` VALUES ('40288a8182a0e0690182a232e9130006', '2022-08-15 23:50:21.715000', '2022-08-15 23:56:09.714000', '1', 'sysDict:sync', NULL, '字典同步', 'sysDict', NULL, 'role3', '2', '/sysDict/sync', NULL, '1', '1', b'0');

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
INSERT INTO `sys_role` VALUES ('role1', '2022-08-15 15:49:16.310000', NULL, '1', '业务管理', '', '1', NULL);
INSERT INTO `sys_role` VALUES ('role2', '2022-08-15 15:49:35.681000', NULL, '1', '系统管理', NULL, '1', NULL);
INSERT INTO `sys_role` VALUES ('role3', NULL, NULL, '1', '超级权限', NULL, '1', NULL);

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
INSERT INTO `sys_role_group` VALUES ('2', NULL, NULL, '1', 'group1', 'role2', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('3', NULL, NULL, '1', 'group2', 'role1', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('4', NULL, NULL, '1', 'group2', 'role2', '1', NULL);
INSERT INTO `sys_role_group` VALUES ('5', NULL, NULL, '1', 'group1', 'role3', '1', NULL);

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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('1', NULL, '2022-08-17 16:58:27.263000', '1', '', '超级管理员', '{F4T9t2BE3HCvD9khLCxL/nyib/AdM1WqR/tMx5eJJ2k=}f0afa783ba7607063606fdb43c2e55fb', '1', 'group1', '1234567', 'manage', '2', '1', '1', '40288a81828ad2b801828ad66e790004');
INSERT INTO `sys_user` VALUES ('40288a8182a656740182a659f4d10001', '2022-08-16 19:11:29.489000', '2022-08-17 16:59:02.318000', '1', NULL, '管理员', '{F4T9t2BE3HCvD9khLCxL/nyib/AdM1WqR/tMx5eJJ2k=}f0afa783ba7607063606fdb43c2e55fb', '1', 'group2', NULL, 'admin', NULL, '1', '1', '40288a8182a02bad0182a03079f90000');
INSERT INTO `sys_user` VALUES ('40288a8182aa0f470182ab099cc40000', '2022-08-17 17:01:50.126000', NULL, '0', NULL, 'yw', NULL, NULL, 'group1', NULL, 'md', NULL, '40288a8182a656740182a659f4d10001', NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
