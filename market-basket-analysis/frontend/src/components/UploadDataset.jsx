import { useState } from 'react';
import api from '../services/api';

const UploadDataset = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/upload/dataset', formData);
      alert('Upload successful');
    } catch (error) {
      alert('Upload failed');
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadDataset;