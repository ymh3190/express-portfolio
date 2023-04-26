import { randomFillSync } from "crypto";

const random = () => {
  const buf = Buffer.alloc(16);
  return randomFillSync(buf).toString("hex");
};

export default random;
