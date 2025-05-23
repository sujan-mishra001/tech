const Blog = require('../models/Blog');
const Snippet = require('../models/Snippet');
const Dataset = require('../models/Dataset');
const File = require('../models/File');
const Book = require('../models/Blog'); // assuming Book model exists
const JupyterProject = require('../models/JupyterProject');

// Get content statistics
exports.getContentStats = async (req, res) => {
  try {
    const [blogs, snippets, datasets, files, books, projects] = await Promise.all([
      Blog.countDocuments(),
      Snippet.countDocuments(),
      Dataset.countDocuments(),
      File.countDocuments(),
      Book.countDocuments(),
      JupyterProject.countDocuments()
    ]);

    res.json({
      blogs,
      snippets,
      datasets,
      files,
      books,
      projects
    });
  } catch (error) {
    console.error('Error getting content stats:', error);
    res.status(500).json({ message: 'Error fetching content statistics' });
  }
};
