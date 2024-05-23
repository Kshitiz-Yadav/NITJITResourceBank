const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true },
  upvotes: { type: [String], default: [] },
  downvotes: { type: [String], default: [] },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
