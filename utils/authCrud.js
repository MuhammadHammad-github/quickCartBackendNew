const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tryCatchError = require("./tryCatchError");
const response = require("./response");
const SECRET_PHASE = process.env.SECRET_PHASE;

const create = async (res, data, model) => {
  try {
    const { email, password } = data;
    if (!email) return response(res, 400, { message: "Email Required!" });
    if (!password) return response(res, 400, { message: "Password Required!" });
    const item = await model.findOne({ email });
    if (item) return response(res, 409, { message: "Email already exists!" });
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await model.create({
      ...data,
      password: hashedPassword,
    });
    return response(res, 201, { message: "Account Created" });
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const login = async (res, data, model) => {
  try {
    const { email, password } = data;
    if (!email) return response(res, 400, { message: "Email Required!" });
    if (!password) return response(res, 400, { message: "Password Required!" });
    const item = await model.findOne({ email });
    if (!item) return response(res, 404, { message: "Account not found!" });
    const isPasswordCorrect = bcrypt.compareSync(password, item.password);
    if (!isPasswordCorrect)
      return response(res, 401, { message: "Incorrect Credentials!" });
    const authToken = jwt.sign({ id: item._id }, SECRET_PHASE, {
      expiresIn: "30d",
    });
    return response(res, 200, {
      message: "Logged In Successfully",
      authToken,
    });
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const getAccount = async (res, data, model) => {
  try {
    const { id } = data;
    if (!id) return response(res, 404, { message: "Id Not Received" });
    const account = await model.findById(id).select("-password");
    if (!account)
      return response(res, 404, {
        message: "Account Not Found!",
        action: "logout",
      });
    return response(res, 200, { message: "Account Found!", account });
  } catch (error) {
    return tryCatchError(res, error);
  }
};
module.exports = { create, login, getAccount };
