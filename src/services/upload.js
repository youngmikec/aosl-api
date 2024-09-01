import cloudinary from '../config/cloudinary.js';
const module = 'Upload'

export const uploadImage = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: 'aosl-images'
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        return result;
    } catch (error) {
        throw new Error(`${module} Error! Try uploading another image`);
    }
}