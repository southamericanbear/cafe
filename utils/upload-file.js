const path = require("path");
const { v4: uuidV4 } = require("uuid");

const uploadFile = async (
  files,
  validExtensions = ["jpg", "svg", "png", "gif", "jpeg"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const nameSplitted = file.name.split(".");
    const extension = nameSplitted[nameSplitted.length - 1];

    if (!validExtensions.includes(extension)) {
      return reject(
        `The extension ${extension} is not valid, only this extensions are valid ${validExtensions}`
      );
    }

    const tempName = uuidV4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(tempName);
    });
  });
};

module.exports = { uploadFile };
