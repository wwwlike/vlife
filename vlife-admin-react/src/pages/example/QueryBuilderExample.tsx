//查询过滤器引擎示例
import { FormVo } from "@src/api/Form";
import ConditionView from "@src/components/queryBuilder/component/ConditionView";
import { useAuth } from "@src/context/auth-context";
import { useEffect, useState } from "react";
import QueryBuilder from "../../components/queryBuilder";
export default () => {
  const { getFormInfo } = useAuth();
  const [formVo, setFormVo] = useState<FormVo>();

  const [value, setValue] = useState<string>(
    `[{"where":[{"fieldName":"orderDate","entityName":"orderSale","desc":{"fieldName":"下单日期","opt":"动态范围","value":"今年"},"fieldType":"date","opt":"dynamic","value":["this_year"]},{"fieldName":"sysUserId","entityName":"orderSale","desc":{"fieldName":"销售员","opt":"等于","value":["张三"]},"fieldType":"string","opt":"eq","value":["4028b8818d0b20e6018d0bb08359000b"]}]},{"where":[{"fieldName":"customerId","entityName":"orderSale","desc":{"fieldName":"客户","opt":"等于","value":["北京机场"]},"fieldType":"string","opt":"eq","value":["4028b8818d248fba018d249d20cc000d"]}]}]`
  );
  useEffect(() => {
    getFormInfo({ type: "orderSale" }).then((res) => {
      setFormVo(res);
    });
  }, []);
  return (
    <div className="  flex flex-col items-center   bg-slate-50 ">
      <div className="m-2 font-bold text-xl flex items-center justify-center">
        查询设计器
      </div>
      {formVo && (
        <QueryBuilder
          className=" w-1/2 border bg-white p-4 "
          entityModel={formVo}
          onDataChange={function (conditionJson: string): void {
            setValue(conditionJson);
          }}
          value={value}
        />
      )}
      {value && value.length > 0 && (
        <>
          <div className="m-2 font-bold text-xl flex items-center justify-center">
            条件预览
          </div>
          <div className=" w-1/2 border bg-white p-4 ">
            <ConditionView condition={JSON.parse(value)}></ConditionView>
          </div>
        </>
      )}
    </div>
  );
};
