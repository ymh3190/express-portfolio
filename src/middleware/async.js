/**
 * 함수를 인자값으로 하여 offload가 있는
 * 콜백함수에서 try catch 반복을 방지하는 기능
 * offload 중 에러가 없다면 결과값이 저장된 주소값을 리턴
 */
const async_ = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default async_;
