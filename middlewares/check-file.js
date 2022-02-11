const checkFile = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).send({ msg: "No files were uploaded." });
  }

  next();
};

module.exports = checkFile;
