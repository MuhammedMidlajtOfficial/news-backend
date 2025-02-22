const { default: mongoose } = require("mongoose");
const { News } = require("../Model/news.model");

// Create News Article
module.exports.postNews = async (req, res) => {
  try {
    const { title, content, category, image } = req.body
    const io = req.io;

    if(!title || !content || !category){
      return res.status(409).json({ message:"Title, Category & Content are required" })
    }

    const news = new News({ title, content, category});
    await news.save();

    // io.emit("receiveNews", news); // Send news to all clients in real-time

    return res.status(201).json(news);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports.getNews = async (req, res) => {
  try {
    const { category, sortBy, order, page = 1, limit = 10, search } = req.query;

    const filter = { status: true }; // Only fetch active news
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortField = sortBy || 'timestamp';

    const news = await News.find(filter)
      .populate('category') // Populate category details
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCount = await News.countDocuments(filter);

    return res.status(200).json({
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / limit),
      data: news,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getTrendingNews = async (req, res) => {
  try {
    const { category, search, sortBy, order, page = 1, limit = 10 } = req.query;

    const matchStage = { status: true }; // Fetch only active news
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const sortField = sortBy || "views"; // Default sorting by views
    const sortOrder = order === "asc" ? 1 : -1;

    const trendingNews = await News.aggregate([
      { $match: matchStage }, // Apply filters
      { $sort: { [sortField]: sortOrder, likes: -1 } }, // Sort dynamically
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
    ]);

    const totalCount = await News.countDocuments(matchStage);

    return res.status(200).json({
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / limit),
      data: trendingNews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
