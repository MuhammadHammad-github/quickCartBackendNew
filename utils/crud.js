const response = require("./response");
const tryCatchError = require("./tryCatchError");
const { mappingPaths } = require("./deleteFileFn");
const create = async (res, data, model, directReturn = true) => {
  try {
    console.log(data);
    const newItem = await model.create(data);
    console.log("this is new Item", newItem);
    if (directReturn)
      return response(res, 200, { message: "Created Successfully!" });
    else return newItem;
  } catch (error) {
    if (directReturn) return tryCatchError(res, error);
  }
};
const read = async (res, data, model, populateFields) => {
  try {
    let query = model.find();

    if (Array.isArray(populateFields) && populateFields.length > 0) {
      populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }

    const items = await query;
    return response(res, 200, { message: "Data Fetched!", items });
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const readBy = async (res, query, model, populateFields = []) => {
  try {
    let itemsQuery = model.find(query);

    if (Array.isArray(populateFields) && populateFields.length > 0) {
      populateFields.forEach((field) => {
        itemsQuery = itemsQuery.populate(field);
      });
    }

    const items = await itemsQuery;
    return response(res, 200, { message: "Data Fetched!", items });
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const readTotal = async (res, model, query = {}) => {
  try {
    const totalItems = await model.countDocuments(query);

    return response(res, 200, { message: "Data Fetched!", totalItems });
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const readOne = async (res, data, model) => {
  try {
    const { id } = data;
    if (!id) return response(res, 409, { message: "Id not received" });

    const item = await model.findById(id);
    if (!item) return response(res, 404, { message: "Item not found" });

    return response(res, 200, { message: "Data Fetched!", item });
  } catch (error) {
    return tryCatchError(res, error);
  }
};

const update = async (res, data, model, id, directReturn = true) => {
  try {
    if (!id) return response(res, 409, { message: "Id not received" });

    const item = await model.findById(id);
    if (!item) return response(res, 404, { message: "Item not found" });

    const updateQuery = data.comment
      ? { $push: { comments: data.comment } }
      : { ...data };
    const updatedItem = await model.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });
    if (directReturn)
      return response(res, 200, { message: "Data Updated!", updatedItem });
    else return updatedItem;
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const pushUpdate = async (
  res,
  data,
  model,
  id,
  pushTo,
  directReturn = true
) => {
  try {
    if (!id) {
      if (directReturn)
        return response(res, 409, { message: "Id not received" });
      else return { message: "Id not received", status: 409 };
    }
    if (!data || !pushTo) {
      if (directReturn)
        return response(res, 409, {
          message:
            "Either Data to push or field where data is being pushed is missing",
        });
      else
        return {
          message:
            "Either Data to push or field where data is being pushed is missing",
          status: 409,
        };
    }
    const item = await model.findById(id);
    console.log(item);
    if (!item) {
      if (directReturn)
        return response(res, 404, { message: "Item not found" });
      else return { message: "Item not found", status: 404 };
    }

    const updateQuery = { $push: { [pushTo]: data } };
    const updatedItem = await model.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });
    if (directReturn)
      return response(res, 200, { message: "Data Updated!", updatedItem });
    else return { success: true };
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const pullUpdate = async (
  res,
  data,
  model,
  id,
  pullFrom,
  directReturn = true
) => {
  try {
    if (!id)
      if (directReturn)
        return response(res, 409, { message: "Id not received" });
      else return { message: "Id not received", status: 409, success: false };

    const item = await model.findById(id);

    if (!item)
      if (directReturn)
        return response(res, 404, { message: "Item not found" });
      else return { message: "Item not found", status: 404, success: false };

    const updateQuery = { $pull: { [pullFrom]: data } };
    const updatedItem = await model.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    if (directReturn)
      return response(res, 200, { message: "Data Updated!", updatedItem });
    else return { success: true };
  } catch (error) {
    return tryCatchError(res, error);
  }
};

const deleteItem = async (res, data, model, directReturn = true) => {
  try {
    const { id } = data;
    if (!id) return response(res, 409, { message: "Id not received" });

    const item = await model.findById(id);
    if (!item) return response(res, 404, { message: "Item not found" });
    await model.findByIdAndDelete(id);
    if (directReturn) return response(res, 200, { message: "Item Deleted!" });
    else return;
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const deleteManyItems = async (res, data, model, directReturn = true) => {
  try {
    const { id, deleteBy } = data;
    if (!id) return response(res, 409, { message: "Id not received" });

    const item = await model.deleteMany({ [deleteBy]: id });
    if (directReturn) return response(res, 200, { message: "Items Deleted!" });
    else return;
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const deletingImages = async (
  res,
  req,
  model,
  findBy,
  filterBy,
  field = "image"
) => {
  try {
    console.log("hello");
    const items = await model.find({ [findBy]: filterBy });
    console.log(items);
    const itemImages = items.reduce((acc, item) => {
      const images = Array.isArray(item[field]) ? item[field] : [item[field]];
      return acc.concat(images);
    }, []);
    if (itemImages.length > 0) {
      await mappingPaths(itemImages, req, res);
    }
    return;
  } catch (error) {
    return tryCatchError(res, error);
  }
};
module.exports = {
  create,
  read,
  readOne,
  update,
  deleteItem,
  pushUpdate,
  pullUpdate,
  readBy,
  deleteManyItems,
  deletingImages,
  readTotal,
};
