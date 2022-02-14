const cloudinary = require("cloudinary");
cloudinary.config(process.env.CLOUDINARY_URL);

const cloudinaryUpload = async (file) => {
  const { tempFilePath } = file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  return secure_url;
};

module.exports = cloudinaryUpload;
