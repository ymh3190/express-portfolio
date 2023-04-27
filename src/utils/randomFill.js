import { randomFillSync } from "crypto";

/**
 * 버퍼에 메모리 할당 후 hex 문자열로 반환
 */
const random = () => {
  const buf = Buffer.alloc(16);
  return randomFillSync(buf).toString("hex");
};

export default random;
