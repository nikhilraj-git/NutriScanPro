import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { isValidImageFile } from '@/lib/utils';

interface UploadSectionProps {
  onImageUpload: (image: File) => void;
  onAnalyzeClick: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageUpload, onAnalyzeClick }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!isValidImageFile(file)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPG, PNG)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setUploadedImage(e.target.result);
        setSelectedFile(file);
        onImageUpload(file);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload, toast]);

  const removeImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedImage(null);
    setSelectedFile(null);
  }, []);

  const triggerFileUpload = useCallback(() => {
    if (!uploadedImage) {
      document.getElementById('file-upload')?.click();
    }
  }, [uploadedImage]);

  return (
    <section className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Food Label Image</h3>
        
        <div 
          className={`drop-zone rounded-lg p-8 text-center cursor-pointer ${isDragging ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileUpload}
        >
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          
          {!uploadedImage ? (
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mb-2 text-sm font-medium text-gray-700">Drag and drop an image or click to select</p>
              <p className="text-xs text-gray-500">Supported formats: JPG, PNG</p>
            </div>
          ) : (
            <div>
              <img src={uploadedImage} className="max-h-64 mx-auto rounded" alt="Food label preview" />
              <button 
                className="mt-3 text-sm text-red-500 hover:text-red-700"
                onClick={removeImage}
              >
                Remove image
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button 
            className="bg-primary hover:bg-green-600 text-white py-2 px-6 rounded-md font-medium transition-colors flex items-center justify-center min-w-[150px]"
            onClick={onAnalyzeClick}
            disabled={!selectedFile}
          >
            Analyze Label
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
