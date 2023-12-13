/**
 * 关联模型信息展示
 */

import GroupLabel from "@src/components/form/component/GroupLabel";
import { useNavigate } from "react-router-dom";
import { modelForm } from "..";

export interface RelationModelPorps {
  modelForm: modelForm;
}

export default ({ modelForm }: RelationModelPorps) => {
  const { vo, dto, req, bean } = modelForm;
  const navigate = useNavigate();
  const className =
    " group relative h-20 flex flex-col justify-center items-center  border border-dashed rounded-md mb-2 hover:bg-blue-50 cursor-pointer ";

  const designClassName = "absolute bottom-0 right-1 hidden group-hover:block";

  return (
    <div className=" space-y-2 ">
      <GroupLabel
        text={`表单模型(${(dto?.length || 0) + 1})`}
        icon={<i className="icon-form-templates" />}
      />
      <div className=" grid gap-2  grid-cols-3">
        <div className={`${className}`}>
          <p>{modelForm.title}</p>
          <p>{modelForm.type}</p>
          <div
            className={`${designClassName}`}
            onClick={() => {
              navigate(
                `/sysConf/formDesign/${modelForm.type}?fullTitle=表单设计`
              );
            }}
          >
            配置
          </div>
        </div>

        {dto?.map((d) => {
          return (
            <div key={`dto${d.type}`} className={`${className}`}>
              <p>{d.title}</p>
              <p>{d.type}</p>
              <div
                className={`${designClassName}`}
                onClick={() => {
                  navigate(`/sysConf/formDesign/${d.type}?fullTitle=表单设计`);
                }}
              >
                配置
              </div>
            </div>
          );
        })}
      </div>
      <GroupLabel
        text={`列表模型(${(vo?.length || 0) + 1})`}
        icon={<i className="icon-table" />}
      />
      <div className=" grid gap-2  grid-cols-3">
        <div className={`${className}`}>
          <p>{modelForm.title}</p>
          <p>{modelForm.type}</p>
          <div
            className={`${designClassName}`}
            onClick={() => {
              navigate(
                `/sysConf/tableDesign/${modelForm.type}?fullTitle=列表设计`
              );
            }}
          >
            配置
          </div>
        </div>

        {vo?.map((d) => {
          return (
            <div key={`vo${d.type}`} className={`${className}`}>
              <p>{d.title}</p>
              <p>{d.type}</p>
              <div
                className={`${designClassName}`}
                onClick={() => {
                  navigate(`/sysConf/tableDesign/${d.type}?fullTitle=列表设计`);
                }}
              >
                配置
              </div>
            </div>
          );
        })}
      </div>

      <GroupLabel
        text={`查询模型(${req?.length})`}
        icon={<i className="icon-filter_list" />}
      />
      <div className=" grid   gap-2  grid-cols-3">
        {req?.map((d) => {
          return (
            <div key={`req${d.type}`} className={`${className}`}>
              <p>{d.title}</p>
              <p>{d.type}</p>
              <div
                className={`${designClassName}`}
                onClick={() => {
                  navigate(
                    `/sysConf/formDesign/${d.type}?fullTitle=查询条件设计`
                  );
                }}
              >
                配置
              </div>
            </div>
          );
        })}
      </div>
      <GroupLabel
        desc="仅实现IModel接口的模型"
        text={`其他模型(${req?.length})`}
        icon={<i className="icon-filter_list" />}
      />
      <div className=" grid   gap-2  grid-cols-3">
        {bean?.map((d) => {
          return (
            <div key={`bean${d.type}`} className={`${className}`}>
              <p>{d.title}</p>
              <p>{d.type}</p>
              <div
                className={`${designClassName}`}
                onClick={() => {
                  navigate(
                    `/sysConf/formDesign/${d.type}?fullTitle=表单设计器`
                  );
                }}
              >
                配置
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
