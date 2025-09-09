const multer = require("multer");

const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
// La combinaison multer.diskStorage + callback(null, chemin) qui assure que le backend reçoit et stocke le fichier en binaire (donc on peut envoyer directement fileInput.file[0] dans le formData)
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },
  filename: (req, file, callback) => {
    const filename = file.originalname.split(" ").join("_");
    const filenameArray = filename.split(".");
    filenameArray.pop();
    const filenameWithoutExtention = filenameArray.join(".");
    const extension = MIME_TYPE[file.mimetype];
    callback(null, filenameWithoutExtention + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
