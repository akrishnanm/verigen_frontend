'use client';

import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import FileList from './(components)/FileList';
import FileProcessing from './(components)/FileProcessing';


const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<{ filename: string; url: string } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ filename: string; url: string; timestamp: string }[]>([]);

  const handleFileUpload = (files: { filename: string; url: string; timestamp: string }[]) => {
    setUploadedFiles(files);
  };

  const handleFileSelect = (file: { filename: string; url: string }) => {
    setSelectedFile(file);
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
