'use client';

import { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import FileList from './(components)/FileList';
import FileProcessing from './(components)/FileProcessing';
import { StorageUtil } from '@/utils/storage';
import { useFetchUploadedFilesQuery } from './(components)/upload.api';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<{
    filename: string;
    url: string;
  } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    { filename: string; url: string; timestamp: string }[]
  >([]);

  const accessToken = StorageUtil.get('accessToken');
  const { data: files } = useFetchUploadedFilesQuery(accessToken, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (files) {
      setUploadedFiles(files);
    }
  }, [files]);

  const handleFileUpload = (
    files: { filename: string; url: string; timestamp: string }[]
  ) => {
    setUploadedFiles(files);
  };

  const handleFileSelect = (file: { filename: string; url: string }) => {
    setSelectedFile(file);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
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
