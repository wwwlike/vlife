import { FormVo } from "@src/api/Form";
import { VF } from "@src/dsl/VF";
import FormPage from "@src/pages/common/formPage";
export default ({
  formVo,
  onDataChange,
  className,
}: {
  className?: string;
  formVo: FormVo;
  onDataChange: (formVo: FormVo) => void;
}) => {
  return (
    <div className="w-full relative p-4 flex justify-center items-center">
      <FormPage
        className="w-1/3 mt-8"
        type="form"
        fontBold
        formData={formVo}
        reaction={[
          VF.result(formVo.typeParentsStr?.split(",")?.includes("INo"))
            .then("prefixNo")
            .show(),
        ]}
        onDataChange={(model) => {
          onDataChange({
            ...formVo,
            name: model.name,
            prefixNo: model.prefixNo,
            formDesc: model.formDesc,
            helpDoc: model.helpDoc,
          });
        }}
      />
    </div>
  );
};
