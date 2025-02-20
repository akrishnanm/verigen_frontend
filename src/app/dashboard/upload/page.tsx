'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import FileList from './(components)/FileList';
import FileProcessing from './(components)/FileProcessing';
import { StorageUtil } from '@/utils/storage';
import { useFetchUploadedFilesQuery } from './(components)/upload.api';
import useFcmToken from '@/hooks/useFcmToken'; // Import the useFcmToken hook

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

  // Use the useFcmToken hook
  const { dialogOpen, notificationData, handleDialogClose } = useFcmToken();

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
      {/* Dialog box for notifications */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{notificationData?.title}</DialogTitle>
        <DialogContent>
          <Typography component="pre" style={{ whiteSpace: 'pre-wrap' }}>
            {notificationData?.body}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Upload;
