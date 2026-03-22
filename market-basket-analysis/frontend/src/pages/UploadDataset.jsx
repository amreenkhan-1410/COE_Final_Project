import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import api from '../services/api';

const UploadDataset = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/upload/dataset', formData);
      setResult(response.data);
      setError('');
      setFile(null);
    } catch (error) {
      setError(error.response?.data?.detail || error.message || 'Upload failed');
      setResult(null);
    }
    setUploading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-primary">Upload Dataset</h1>
      
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-4">Drag and drop your CSV file here, or click to select</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="bg-primary text-white px-4 py-2 rounded cursor-pointer hover:bg-opacity-90"
        >
          Select File
        </label>
      </div>
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {file && (
        <div className="mt-6 p-4 bg-card rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="w-6 h-6 mr-3 text-primary" />
            <span className="font-medium">{file.name}</span>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 bg-leaf text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Dataset'}
          </button>
        </div>
      )}
      {result && (
        <div className="mt-6 rounded-lg bg-card p-5 shadow">
          <h2 className="text-xl font-semibold text-primary">Training complete</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>Dataset: {result.dataset_name}</p>
            <p>Transactions: {result.transactions_count}</p>
            <p>Products: {result.products_count}</p>
            <p>Association rules: {result.association_rules}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDataset;
