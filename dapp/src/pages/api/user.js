import dbConnect from "../../utils/dbConnect";
import UserModel from "../../models/UserModel";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const data = await UserModel.find({});
        res.status(200).json({ success: true, data });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const data = await UserModel.create(req.body);
        res.status(201).json({ success: true, data });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    // Add cases for PUT and DELETE methods as needed
    default:
      res.status(400).json({ success: false });
      break;
  }
}
