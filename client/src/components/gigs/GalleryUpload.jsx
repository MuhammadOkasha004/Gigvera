import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const GalleryUpload = ({ images = [], onChange, maxImages = 4 }) => {
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (images.length + acceptedFiles.length > maxImages) {
      setError(`Maximum ${maxImages} gallery images allowed`);
      return;
    }
    setError('');
    const newImages = [...images, ...acceptedFiles];
    onChange(newImages);
  }, [images, maxImages, onChange]);

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
    setError('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
            <img
              src={typeof img === 'string' ? img : URL.createObjectURL(img)}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <FaTimes size={10} />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragActive ? 'border-gig-teal bg-teal-50' : 'border-gray-300 hover:border-gig-teal'
            }`}
          >
            <input {...getInputProps()} />
            <FaCloudUploadAlt className="text-gray-400 mb-1" size={20} />
            <span className="text-gray-400 text-xs">Add Image</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <p className="text-gray-400 text-xs ml-auto">{images.length}/{maxImages} images</p>
      </div>
    </div>
  );
};

export default GalleryUpload;
