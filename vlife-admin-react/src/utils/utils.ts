/**
 * 工具类函数非hooks
 */
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
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

// export const arrayToStr = (arr: any[], ss: string = ",") => {
//   let fh = ",";
//   let str = arr;
//   alert(arr.join(","));
//   arr
//     .map((s, index) => {
//       if (s) {
//         return s;
//       } else {
//         fh = "";
//       }
//     })
//     .join(fh);

//   return str;
// };
