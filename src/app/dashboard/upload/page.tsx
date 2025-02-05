'use client';

import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import FileList from './(components)/FileList';
import FileProcessing from './(components)/FileProcessing';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  const handleFileUpload = (fileUrl: string) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [fileUrl, ...prevFiles];
      return newFiles.slice(0, 10); // Keep only the 10 most recent files
    });
  };

  const handleFileSelect = (fileUrl: string) => {
    setSelectedFile(fileUrl);
  };


  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          File Processing
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <FileList
              files={uploadedFiles}
              onFileSelect={handleFileSelect}
              onFileUpload={handleFileUpload}
            />
          </Box>
          <Box sx={{ flex: 2 }}>
            <FileProcessing selectedFile={selectedFile} />
          </Box>
        </Box>
      </Box>
    </Container>
);
};

export default Upload;
