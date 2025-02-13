import { reactive } from "vue";
import type { FormRules } from "element-plus";
const addressValidator = (rule: any, value: any, callback: any) => {
  if (!value) {
    //没有选择的情况
    return callback(new Error("请选择省/市/区"));
  }
  setTimeout(() => {
    if (!value.isComplete) {
      //没有选择完整
      callback(new Error("请完善地址"));
    } else {
      callback();
    }
  }, 100);
};
export const FJRrules = reactive<FormRules>({
  adress: [{ required: true, validator: addressValidator, trigger: "change" }]
});
