'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
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
    <>
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3 }}>
        File Processing Dashboard
      </Typography>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FileList
              files={uploadedFiles}
              onFileSelect={handleFileSelect}
              onFileUpload={handleFileUpload}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <FileProcessing selectedFile={selectedFile} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Upload;
