import mongoose from "mongoose";

// const UserModelSchema = new mongoose.Schema({
//   user: String,
//   ref_count: String,
//   ref_uri: String,
// });

// const UserModel =
//   mongoose.models.UserModel || mongoose.model("reff_data", UserModelSchema);
const UserModel = mongoose.model(
  "reff_data",
  new mongoose.Schema({
    user: String,
    ref_count: String,
    ref_uri: String,
  })
);

export default UserModel;
