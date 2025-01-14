const response = require("./response");

const tryCatchError = (res, error) => {
  console.error(error);
  return response(res, 500, { message: "Internal Server Error" });
};
module.exports = tryCatchError;
