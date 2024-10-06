import React, { useEffect, useState, useCallback, useMemo } from "react";
import Scrollbars from "react-custom-scrollbars";
import classNames from "classnames";
import {
  Avatar,
  Button,
  Cascader,
  Dropdown,
  Input,
  Modal,
  Select,
  Tag,
} from "@douyinfe/semi-ui";
import {
  listFormDto,
  save,
  publish,
  Form,
  remove,
  FormDto,
} from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import BtnResourcesToolBar from "@src/components/button/component/BtnResourcesToolBar";
import SelectIcon from "@src/components/SelectIcon";
import { VF } from "@src/dsl/VF";
import { extractChineseCharacters, uncapFirst } from "@src/util/func";
import * as tinyPinyin from "tiny-pinyin";
import _ from "lodash";

const javaType = [
  {
    label: "字符串",
    value: "string",
    length: [
      { label: "32", value: 32 },
      { label: "100", value: 100 },
      { label: "255", value: 255 },
      { label: "2000", value: 2000 },
    ],
  },
  { label: "长文本", value: "text" },
  { label: "整数", value: "long" },
  { label: "小数", value: "double" },
  { label: "布尔", value: "boolean" },
  { label: "日期", value: "date" },
];

const order = [
  { label: "升", value: "asc" },
  { label: "降", value: "desc" },
];

/**
 * 数据表维护
 */
export default () => {
  const { menu, allMenus, clearModelInfo } = useAuth();
  const [tables, setTables] = useState<FormDto[]>(); //所有数据表
  const [currApp, setCurrApp] = useState<string>(); //当前应用
  // 当前正在编辑的表单id
  const [currFormId, setCurrFormId] = useState<string>();
  //1. 当前编辑的版本 editorForm
  const [editorForm, setEditorForm] = useState<Partial<FormDto>>();
  //2. 正在使用的版本(最近一次的发布版本)
  const [publishForm, setPublishForm] = useState<Partial<FormDto>>();
  //3. 最近一次保存时候的数据
  const [_unpublishForm, setUnpublishForm] = useState<string>();

  //设置当前表单的上次保存数据
  useEffect(() => {
    if (currFormId && tables) {
      const table = tables?.find((t) => t.id === currFormId);
      if (table?.unpublishForm) {
        //最新的
        setUnpublishForm(table.unpublishForm);
        setEditorForm({ ...JSON.parse(table.unpublishForm) });
      } else {
        setUnpublishForm(undefined);
        setEditorForm(_.cloneDeep({ ...table, unpublishForm: undefined }));
        // setEditorForm({ ...table, unpublishForm: undefined });
      }
      if (table?.state === "1") {
        setPublishForm({ ...table, unpublishForm: undefined });
      } else {
        setPublishForm(undefined);
      }
    }
  }, [currFormId, tables]);

  //三种场景下判断是否有改动
  const formChange = useMemo((): boolean => {
    if (_unpublishForm) {
      //1. 有保存痕迹
      return _unpublishForm !== JSON.stringify(editorForm);
    } else if (publishForm) {
      //2. 已经发型正式版(无保存痕迹)
      return JSON.stringify(editorForm) !== JSON.stringify(publishForm);
    } else {
      //3. 无保存无保存,只要有行数据就是有改动
      return editorForm?.fields && editorForm?.fields?.length > 0
        ? true
        : false;
    }
  }, [editorForm, publishForm, _unpublishForm]);

  //外键select数据结构
  const appFkEntitys = useMemo(() => {
    return allMenus
      .filter((m) => m.app)
      .map((m) => {
        return {
          label: m.name,
          value: m.id,
          children: tables
            ?.filter((t) => t.sysMenuId === m.id && t.id !== editorForm?.id)
            .map((t) => ({
              label: t.name,
              value: t.type,
            })),
        };
      });
  }, [allMenus, tables, editorForm]);

  const load = useCallback((): Promise<any> => {
    return listFormDto().then((res) => {
      setTables(
        //&& t.custom === true
        res.data?.filter((t) => t.itemType === "entity" && t.sysMenuId)
      );
      return res.data;
    });
  }, []);

  //可用app列表
  const apps = useMemo(() => {
    return allMenus
      .filter((m) => m.app)
      .map((m) => {
        return {
          name: m.name,
          node: "item",
          id: m.id,
          onClick: () => {
            setCurrApp(m.id);
            setEditorForm(undefined);
          },
          children: tables?.filter(
            (t) => t.sysMenuId === m.id && t?.custom === true
          ),
        };
      })
      .filter((t) => t.children && t.children.length > 0);
  }, [allMenus, tables]);

  //tables加载完成之后设置默认的当前应用和表单
  useEffect(() => {
    if (!tables) {
      load();
    } else if (apps && !currApp) {
      setCurrApp(apps?.[0]?.id);
    } else if (currApp && !currFormId) {
      setCurrFormId(apps.find((a) => a.id === currApp)?.children?.[0]?.id);
    }
  }, [currApp, apps, currFormId, tables]);

  const addBtn = (
    <BtnResourcesToolBar
      className="absolute right-10"
      btns={[
        {
          icon: <i className="icon-add_circle" />,
          title: "创建表",
          actionType: "create",
          model: "form",
          reaction: [
            VF.then("sysMenuId").title("归属应用"),
            VF.then("type").title("表单标识").description("驼峰法命名"),
            VF.then("name").title("表单名称").description("中文名称"),
            VF.then("custom").value(true).hide(),
            VF.then("itemType").value("entity"),
            VF.then("entityType").value((formData: any) => formData.type),
            VF.then("title").value((formData: any) => formData.name),
            VF.then("formDesc", "helpDoc", "prefixNo").hide(),
          ],
          onSaveBefore: (data: Form) => {
            data.type = uncapFirst(data.type);
            data.entityType = uncapFirst(data.entityType);
            return data;
          },
          saveApi: save,
          onSubmitFinish: (res) => {
            load().then((_tables) => {
              const _editorForm = _tables.find(
                (t: FormDto) => t.id === res?.id
              );
              setCurrApp(_editorForm.sysMenuId);
              setEditorForm({ ..._editorForm });
            });
          },
        },
      ]}
    />
  );
  //设置指定行指定列的数据值
  const setTableCell = useCallback(
    (line: number, fieldName: string, value: any) => {
      setEditorForm((_editorForm) => {
        return {
          ..._editorForm,
          fields: _editorForm?.fields?.map((f: any, i) => {
            if (i === line) {
              f[fieldName] = value;
            }
            return f;
          }),
        };
      });
    },
    []
  );

  //清除失效的排序
  const clearOrders = useCallback(() => {
    setEditorForm((_editorForm) => {
      const fieldNames = _editorForm?.fields?.map((f) => f.fieldName);
      const _orders = _editorForm?.orders
        ?.split(",")
        .filter((o: string) => {
          return fieldNames?.includes(o.split("_")[0]);
        })
        .join(",");
      return { ..._editorForm, orders: _orders === "" ? undefined : _orders };
    });
  }, [editorForm]);
  return (
    <div className=" flex relative flex-col px-2 h-full ">
      {editorForm?.unpublishForm}

      {/* {JSON.stringify(editorForm)} */}

      <div className="flex flex-1 space-x-2 ">
        <div className=" w-52 bg-white border rounded-md ">
          <div className=" flex items-center px-4 py-2 h-16 w-full  border-b mb-2 border-dashed border-gray-400">
            <div className=" bg-blue-500 rounded h-7 w-7 flex justify-center items-center  mr-4">
              <i className="text-xl text-white icon-access_time " />
            </div>
            <div className=" flex-1 flex-col flex ">
              <span className="font-bold">{menu?.name}</span>
              <div className=" text-gray-400 text-sm">
                {apps.find((t) => t.id === currApp)?.name || apps?.[0]?.name}
              </div>
            </div>
            <div className="w-4 items-center justify-center">
              {
                //@ts-ignore
                <Dropdown menu={apps}>
                  <i className=" icon-menu" />
                </Dropdown>
              }
            </div>
          </div>
          <Scrollbars autoHide={true}>
            {tables
              ?.filter(
                (t) =>
                  t.sysMenuId === (currApp || apps?.[0]?.id) &&
                  t.custom === true
              )
              ?.map((formDto: FormDto) => {
                return (
                  <div
                    key={formDto.id}
                    onClick={() => {
                      // ;
                      // const _change = () => {
                      //   setEditorForm(
                      //     tab?.unpublishForm
                      //       ? JSON.parse(tab?.unpublishForm)
                      //       : tab
                      //   );
                      // };
                      if (formDto.id !== editorForm?.id) {
                        if (formChange) {
                          Modal.confirm({
                            title: "你确定要切换么?",
                            content: "切换后当前表单的修改将丢失",
                            onOk: () => {
                              setCurrFormId(formDto.id);
                            },
                          });
                        } else {
                          setCurrFormId(formDto.id);
                        }
                      }
                    }}
                    className={` ${classNames({
                      "border-l-2 border-blue-500 bg-slate-50":
                        formDto.id === editorForm?.id,
                    })} h-11 text-sm  flex items-center pl-4 space-x-4   text-slate-700 hover:bg-slate-50 cursor-pointer`}
                  >
                    <span
                      className={`text-xl ${classNames({
                        "text-slate-300": formDto.id !== editorForm?.id,
                        "text-blue-500": formDto.id === editorForm?.id,
                      })}`}
                    >
                      <SelectIcon read value={formDto.icon} />
                    </span>
                    <span>
                      {formDto.name} {formDto.type}
                      {formDto.unpublishFields && `(待发布)`}
                    </span>
                  </div>
                );
              })}
          </Scrollbars>
        </div>
        <div className=" w-full h-full flex flex-col relative  flex-1 p-2 bg-white border rounded-md text-center">
          {editorForm ? (
            <>
              <div className="pb-2 relative flex space-x-2 ">
                <BtnResourcesToolBar
                  key={editorForm.id}
                  btns={[
                    {
                      title: "加字段",
                      actionType: "create",
                      icon: <i className="icon-task_add-02" />,
                      onClick: () => {
                        //@ts-ignore
                        setEditorForm((_editorForm) => {
                          return _editorForm?.fields &&
                            _editorForm?.fields?.length > 0
                            ? {
                                ...editorForm,
                                fields: [
                                  ..._editorForm.fields,
                                  { javaType: "string", dbLength: 100 },
                                ],
                              }
                            : {
                                ...editorForm,
                                fields: [{ javaType: "string", dbLength: 100 }],
                              };
                        });
                      },
                    },
                    {
                      title: "保存",
                      multiple: false,
                      disabledTooltip: "当前没有内容改动",
                      disabled: !formChange,
                      //全部有值才能保存
                      // usableMatch: (form: FormDto) => {
                      //   return form.fields.filter(
                      //     (f) =>
                      //       f.javaType?.length > 0 &&
                      //       f.fieldName?.length > 0 &&
                      //       f.title?.length > 0
                      //   ).length === form.fields.length
                      //     ? true
                      //     : "字段名/字段标识不能为空";
                      // },
                      datas: editorForm,
                      icon: <i className="  icon-save" />,
                      onSaveBefore: (d) => {
                        return {
                          ...tables?.find((t) => t.id === d.id),
                          unpublishForm: JSON.stringify(d),
                        };
                      },
                      saveApi: save,
                      onSubmitFinish: (data: Form) => {
                        load().then((_tables) => {
                          setUnpublishForm(data.unpublishForm);
                        });
                      },
                    },

                    {
                      title: "撤销", // 有缓存_unpublishForm,formChange为true,则撤销回滚到上次保存状态
                      multiple: false,
                      disabledHide: true,
                      tooltip: "取消所有未保存的改动",
                      submitConfirm: "你确定取消本次所有改动么?",
                      //满足旗下一种条件则不能撤销
                      disabled:
                        !formChange ||
                        editorForm.state === null ||
                        editorForm.state === undefined,
                      datas: editorForm,
                      icon: <i className=" icon-redo" />,
                      saveApi: () => {
                        const _table = tables?.find(
                          (t) => t.id === editorForm.id
                        );
                        if (_table) {
                          setEditorForm(
                            _table.unpublishForm
                              ? JSON.parse(_table.unpublishForm)
                              : _.cloneDeep({
                                  ..._table,
                                  unpublishForm: undefined,
                                })
                          );
                        }
                      },
                    },
                    {
                      title: "回滚", // 有缓存_unpublishForm,formChange为true,则撤销回滚到上次发布状态，从未发布过的保存不能回滚
                      multiple: false,
                      disabledHide: true,
                      tooltip: "撤回所有已保存未发布的改动",
                      submitConfirm: "数据表状态将回到上次发布的状态",
                      disabled:
                        formChange ||
                        _unpublishForm === undefined ||
                        publishForm === undefined,
                      datas: editorForm,
                      icon: <i className=" icon-backspace" />,
                      onSaveBefore: (d) => {
                        return {
                          ...tables?.find((t) => t.id === d.id),
                          unpublishForm: undefined,
                        };
                      },
                      saveApi: save,
                      onSubmitFinish: (data: Form) => {
                        load().then((_tables) => {
                          setUnpublishForm(undefined);
                        });
                      },
                    },
                    //  回滚
                    {
                      title: "发布",
                      actionType: "save",
                      disabledHide: false,
                      tooltip: `发布后将在test源码包下生成该模型的crud后端代码`,
                      submitConfirm: "发布完成后需要重启后台服务",
                      multiple: false,
                      disabled: formChange || _unpublishForm === undefined,
                      datas: editorForm,
                      icon: <i className=" icon-calendar-check" />,
                      onSaveBefore: (_unpublishFields: FormDto) => {
                        const formDto = {
                          ...editorForm,
                          _unpublishForm: undefined, //待发布置空
                        };
                        return formDto;
                      },
                      saveApi: publish,
                      onSubmitFinish: (data) => {
                        setTables((_tables) =>
                          _tables?.map((t) => (t.id === data.id ? data : t))
                        );
                        setEditorForm(data);
                        //缓存模型刷新
                        clearModelInfo();
                      },
                    },
                    {
                      title: "删除",
                      disabledHide: true,
                      submitConfirm: true,
                      disabled: editorForm.state === "1",
                      datas: editorForm.id,
                      icon: <i className="  icon-delete" />,
                      saveApi: remove,
                      onSubmitFinish: (data) => {
                        load().then((d) => {
                          setEditorForm(undefined);
                        });
                      },
                    },
                  ]}
                />

                {addBtn}
              </div>
              <div>
                {/* {JSON.stringify(orderFields?.map((f) => f.listOrder))} */}
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="">
                    <tr className=" text-center text-sm">
                      <th className="px-2 py-2 w-16 font-mediu border  bg-blue-50 border-blue-300">
                        序号
                      </th>
                      <th className=" py-2 w-48    border bg-blue-50 border-blue-300 ">
                        字段名称
                      </th>
                      <th className=" py-2 w-48 border bg-blue-50 border-blue-300 ">
                        是否外键
                      </th>
                      <th className=" py-2 w-48  font-bold   border bg-blue-50 border-blue-300 ">
                        字段标识
                      </th>
                      <th className=" py-2 w-48   font-bold  border bg-blue-50 border-blue-300 ">
                        字段类型
                      </th>
                      <th className="py-2 w-48  font-bold  border bg-blue-50 border-blue-300 ">
                        字段精度
                      </th>
                      <th className="py-2 w-48  font-bold  border bg-blue-50 border-blue-300 ">
                        查询排序
                      </th>
                      <th className="px-6 py-2   font-bold border bg-blue-50 border-blue-300 ">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {editorForm.fields?.map((f, index_i) => {
                      return !f.fieldName ||
                        ![
                          "id",
                          "status",
                          "createId",
                          "modifyId",
                          "createDate",
                          "modifyDate",
                        ].includes(f.fieldName) ? (
                        <tr key={f.id || `temp_${index_i}`}>
                          <td className="px-6 py-1 whitespace-nowrap border text-center border-gray-300">
                            {editorForm.fields &&
                              editorForm.fields
                                ?.filter(
                                  (field) =>
                                    !field.fieldName ||
                                    ![
                                      "id",
                                      "status",
                                      "createId",
                                      "modifyId",
                                      "createDate",
                                      "modifyDate",
                                    ].includes(field.fieldName)
                                )
                                .indexOf(f) + 1}
                          </td>
                          <td className="px-6  whitespace-nowrap border border-gray-300">
                            <Input
                              size="small"
                              placeholder="字段名称"
                              className=" w-full"
                              value={f.title}
                              onChange={(v) => {
                                setTableCell(index_i, "title", v);
                                const pinyinArr = tinyPinyin
                                  .convertToPinyin(
                                    extractChineseCharacters(v),
                                    "-",
                                    true
                                  )
                                  .split("-")
                                  .map((item) => item[0])
                                  .join("");
                                const record = editorForm?.fields?.find(
                                  (d, _index) => _index === index_i
                                );
                                const fieldName = record?.fieldName;
                                const id = record?.id;
                                const _fieldName = id
                                  ? fieldName
                                  : fieldName
                                  ? fieldName ===
                                      pinyinArr.substring(
                                        0,
                                        fieldName.length
                                      ) ||
                                    pinyinArr ===
                                      fieldName.substring(0, pinyinArr.length)
                                    ? pinyinArr
                                    : pinyinArr && pinyinArr.length > 0
                                    ? fieldName
                                    : undefined
                                  : pinyinArr;
                                setTableCell(index_i, "fieldName", _fieldName);
                                clearOrders();
                              }}
                            />
                          </td>
                          <td className="px-6  whitespace-nowrap border border-gray-300">
                            {f.id ? (
                              (f.entityType &&
                                f.entityType !== editorForm.type &&
                                tables?.find((t) => t.type === f.entityType)
                                  ?.title) ||
                              "否"
                            ) : (
                              <Cascader
                                size="small"
                                className=" w-full"
                                treeData={appFkEntitys}
                                showClear={true}
                                leafOnly={true}
                                onChange={(v: any) => {
                                  setTableCell(
                                    index_i,
                                    "entityType",
                                    v.length !== 0 ? v?.[1] : undefined
                                  );
                                  setTableCell(
                                    index_i,
                                    "fieldName",
                                    v.length !== 0 ? v?.[1] + "Id" : undefined
                                  );
                                  setTableCell(
                                    index_i,
                                    "title",
                                    v.length !== 0
                                      ? tables?.find((t) => t.type === v?.[1])
                                          ?.title
                                      : undefined
                                  );
                                  setTableCell(
                                    index_i,
                                    "dbLength",
                                    v.length !== 0 ? 32 : undefined
                                  );
                                  setTableCell(
                                    index_i,
                                    "javaType",
                                    v.length !== 0 ? "string" : undefined
                                  );
                                  clearOrders();
                                }}
                                value={
                                  f.entityType &&
                                  f.entityType !== editorForm.type &&
                                  editorForm.sysMenuId
                                    ? [
                                        tables?.find(
                                          (t) => t.type === f.entityType
                                        )?.sysMenuId || "",
                                        f.entityType,
                                      ]
                                    : []
                                }
                                placeholder="外键表关联"
                              />
                            )}
                          </td>
                          <td className="px-6  whitespace-nowrap border border-gray-300">
                            {(editorForm?.fields?.[index_i].entityType &&
                              editorForm?.fields?.[index_i].entityType !==
                                editorForm.type) ||
                            f.id ? (
                              `${editorForm?.fields?.[index_i]?.fieldName}`
                            ) : (
                              <Input
                                size="small"
                                placeholder="字段标识"
                                onChange={(e) => {
                                  setTableCell(index_i, "fieldName", e);
                                  clearOrders();
                                }}
                                value={f.fieldName}
                              />
                            )}
                          </td>

                          <td className="px-6  whitespace-nowrap border border-gray-300">
                            {(editorForm?.fields?.[index_i].entityType &&
                              editorForm?.fields?.[index_i].entityType !==
                                editorForm.type) ||
                            f.id ? (
                              `${
                                javaType.find(
                                  (_type) =>
                                    _type.value ===
                                    editorForm?.fields?.[index_i].javaType
                                )?.label
                              }`
                            ) : (
                              <Select
                                size="small"
                                placeholder="字段类型"
                                className=" w-full"
                                value={f.javaType}
                                optionList={javaType}
                                onChange={(e) => {}}
                              />
                            )}
                          </td>
                          <td className="px-6  whitespace-nowrap border border-gray-300">
                            {javaType.find(
                              (t) =>
                                t.value ===
                                editorForm?.fields?.[index_i].javaType
                            )?.length && (
                              <Select
                                size="small"
                                value={f.dbLength}
                                optionList={javaType
                                  .find(
                                    (t) =>
                                      t.value ===
                                      editorForm?.fields?.[index_i].javaType
                                  )
                                  ?.length?.filter(
                                    (d) =>
                                      !f.id ||
                                      !f.dbLength ||
                                      d.value >= f.dbLength
                                  )}
                                placeholder="字段长度"
                                className=" w-full"
                                onChange={(e) => {
                                  setTableCell(
                                    index_i,
                                    "dbLength",
                                    e?.toString()
                                  );
                                }}
                              />
                            )}
                          </td>
                          <td className="px-6  whitespace-nowrap border border-gray-300">
                            <div className="flex w-full space-x-1 justify-center items-center ">
                              {f.fieldName && (
                                <>
                                  <i className=" icon-h5_sort text-xs" />
                                  {order.map((o) => {
                                    return (
                                      <Tag
                                        key={f.fieldName + o.value}
                                        color={`${
                                          editorForm.orders
                                            ?.split(",")
                                            .find(
                                              (_o) =>
                                                _o ===
                                                f.fieldName + "_" + o.value
                                            )
                                            ? "blue"
                                            : "white"
                                        }`}
                                        onClick={() => {
                                          let orders =
                                            editorForm?.orders?.split(",") ||
                                            [];
                                          if (
                                            orders?.includes(
                                              f.fieldName + "_" + o.value
                                            )
                                          ) {
                                            const index = orders.indexOf(
                                              f.fieldName + "_" + o.value
                                            );
                                            orders?.splice(index, 1);
                                          } else if (
                                            orders?.find((o) =>
                                              o.startsWith(f.fieldName + "_")
                                            )
                                          ) {
                                            orders = orders?.map((item) => {
                                              if (
                                                item.startsWith(
                                                  f.fieldName + "_"
                                                )
                                              ) {
                                                return o.value === "asc"
                                                  ? f.fieldName + "_" + "asc"
                                                  : f.fieldName + "_" + "desc";
                                              } else {
                                                return item;
                                              }
                                            });
                                          } else {
                                            orders?.push(
                                              f.fieldName + "_" + o.value
                                            );
                                          }

                                          setEditorForm((_editorForm) => {
                                            return {
                                              ..._editorForm,
                                              orders:
                                                orders !== null &&
                                                orders.length > 0
                                                  ? orders?.join(",")
                                                  : undefined,
                                            };
                                          });
                                        }}
                                      >
                                        {o.label}
                                      </Tag>
                                    );
                                  })}

                                  {editorForm.orders &&
                                    editorForm.orders.split(",")?.length > 1 &&
                                    editorForm.orders
                                      .split(",")
                                      .find((_order) =>
                                        _order.startsWith(f.fieldName + "_")
                                      ) && (
                                      <Avatar
                                        className=" text-sm "
                                        size="extra-extra-small"
                                        style={{ margin: 4 }}
                                        alt="User"
                                      >
                                        {editorForm.orders
                                          .split(",")
                                          .indexOf(f.fieldName + "_desc") !==
                                          -1 &&
                                          editorForm.orders
                                            .split(",")
                                            .indexOf(f.fieldName + "_desc") + 1}
                                        {editorForm.orders
                                          .split(",")
                                          .indexOf(f.fieldName + "_asc") !==
                                          -1 &&
                                          editorForm.orders
                                            .split(",")
                                            .indexOf(f.fieldName + "_asc") + 1}
                                      </Avatar>
                                    )}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6  whitespace-nowrap border border-gray-300 text-center">
                            <Button
                              onClick={() => {
                                setEditorForm((_editorForm) => {
                                  return {
                                    ..._editorForm,
                                    fields: _editorForm?.fields?.filter(
                                      (f, index_j) => index_i !== index_j
                                    ),
                                  };
                                });
                                clearOrders();
                              }}
                              size="small"
                            >
                              {f.id ? "删除" : "取消"}
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        ""
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="w-full">请选择或者添加一张表 {addBtn}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
