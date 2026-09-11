const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadProfileImage = (buffer, userId) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "farmer-detect/profiles",
        public_id: String(userId),
        overwrite: true,
        resource_type: "image",
        transformation: [{ width: 600, height: 600, crop: "fill", gravity: "face", quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    uploadStream.end(buffer);
  });
