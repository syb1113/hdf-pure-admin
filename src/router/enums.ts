// 完整版菜单比较多，将 rank 抽离出来，在此方便维护
// 平台规定只有 home 路由的 rank 才能为 0 ，所以后端在返回 rank 的时候需要从非 0 开始
const home = 0,
  doctor = 1,
  hospital = 2,
  drug = 3,
  article = 4,
  able = 5,
  form = 6,
  list = 7,
  result = 8,
  error = 9,
  nested = 11;

export {
  home,
  doctor,
  hospital,
  drug,
  article,
  able,
  form,
  list,
  result,
  error,
  nested
};
