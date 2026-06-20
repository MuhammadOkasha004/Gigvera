import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaImage } from 'react-icons/fa';

const ImageUpload = ({ onUpload, currentImage = '' }) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    await onUpload(file);
    setUploading(false);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
        isDragActive ? 'border-gig-teal bg-teal-50' : 'border-gray-300 hover:border-gig-teal'
      }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {isDragActive ? (
            <FaImage className="mx-auto text-gig-teal mb-2" size={40} />
          ) : (
            <FaCloudUploadAlt className="mx-auto text-gray-400 mb-2" size={40} />
          )}
          <p className="text-gray-600 text-sm font-medium">
            {isDragActive ? 'Drop your image here' : 'Drag & drop your thumbnail image'}
          </p>
          <p className="text-gray-400 text-xs mt-1">JPG, PNG, GIF up to 5MB</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
