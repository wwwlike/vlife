/**
 * 工具类函数非hooks
 */
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";

/**
 * 去除结尾的o
 */
export const removeEnds0 = (value: string) => {
  return value.replace(/(0+)$/g, "");
};

/**
 * 把空的值的key删除掉,时解构进来的就回结构出去(...)
 * @param object
 * @returns
 */
export const cleanObject = (object?: { [key: string]: unknown }) => {
  // Object.assign({}, object)
  if (!object) {
    return {};
  }
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};
/**
 * 检索是否是子数据
 * 根据itree的规范，
 * 42_01是42的子数据，42_01_01是42的孙子
 */
export const checkSubData = (data: string, checkData: string): boolean => {
  if (
    checkData.startsWith(data + "_") && //以父类开头
    checkData.substring(data.length + 1).indexOf("_") === -1 //剩余部分不包含下划线
  ) {
    return true;
  }
  return false;
};
/**
 * 传入一个对象，和键集合，返回对应的对象中的键值对
 * @param obj
 * @param keys
 */
export const subset = <
  O extends { [key in string]: unknown },
  K extends keyof O
>(
  obj: O,
  keys: K[]
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K)
  );
  return Object.fromEntries(filteredEntries) as Pick<O, K>;
};
