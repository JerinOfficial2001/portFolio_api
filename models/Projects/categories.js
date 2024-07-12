const mongoose = require("mongoose");
const portFolio_ProjectCategoriesSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  category: { type: String, required: true },
  projects: [
    {
      type: mongoose.Types.ObjectId,
      ref: "PortFolio_Projects",
    },
  ],
});
const PortFolio_ProjectCategories = mongoose.model(
  "PortFolio_ProjectCategories",
  portFolio_ProjectCategoriesSchema
);
exports.PortFolio_ProjectCategories = PortFolio_ProjectCategories;
