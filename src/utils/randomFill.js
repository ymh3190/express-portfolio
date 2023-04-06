const { randomFillSync } = require("crypto");

const random = () => {
  const buf = Buffer.alloc(16);
  return randomFillSync(buf).toString("hex");
};

module.exports = random;
