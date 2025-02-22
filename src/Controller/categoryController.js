const { Category } = require("../Model/category.model");

// Create Category
module.exports.postCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category Name is required" });
    }

    const category = new Category({ categoryName });
    await category.save();

    return res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Category
module.exports.getCategory = async (req, res) => {
  try {
    const category = await Category.find().sort({ timestamp: -1 });
    return res.status(200).json(category);
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

// Get Trending Categories (Aggregation)
module.exports.getTrendingCategories = async (req, res) => {
  try {
    const trendingCategories = await Category.aggregate([
      { $sort: { subscribeCount: -1 } }, // Sort by highest subscribeCount
      // { $limit: 10 }
    ]);
    
    return res.status(200).json(trendingCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
