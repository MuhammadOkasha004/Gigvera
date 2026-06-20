import { useState } from 'react';
import api from '../api/axios';

const useCloudinaryUpload = (folder = 'gigvera') => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await api.post(`/provider/profile/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      setUploading(false);
      return data.user?.profileImageUrl || data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setUploading(false);
      return null;
    }
  };

  return { upload, uploading, progress, error };
};

export default useCloudinaryUpload;
