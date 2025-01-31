'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Container,
  Button,
  Typography,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Alert,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useUploadFileMutation } from './upload.api'; // Import the useUploadFileMutation hook

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DropZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function FileUploadPage() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFile] = useUploadFileMutation();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#303030',
            paper: mode === 'light' ? '#ffffff' : '#424242',
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const validateFile = (file: File) => {
    if (file.name.endsWith('.v')) {
      setFile(file);
      setSuccess('File selected successfully');
      setError(null);
    } else {
      setFile(null);
      setError('Invalid file type. Please upload a .v file.');
      setSuccess(null);
    }
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        validateFile(selectedFile);
      }
    },
    []
  );

  const handleDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      validateFile(droppedFile);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (file) {
      try {
        const response = await uploadFile({
          file,
        }).unwrap();
        console.log('File uploaded successfully:', response);
        setSuccess('File uploaded successfully');
        setFile(null);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Error uploading file');
      }
    } else {
      setError('Please select a file before uploading');
    }
  }, [file, uploadFile]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4, position: 'relative' }}>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{ position: 'absolute', top: -40, right: 0 }}
            aria-label={
              mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
              Upload File
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please select only .v file to upload
            </Typography>

            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <DropZone
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                  backgroundColor: isDragging
                    ? 'action.hover'
                    : 'background.paper',
                  mb: 2,
                }}
              >
                <CloudUploadIcon
                  sx={{ fontSize: 48, mb: 2, color: 'primary.main' }}
                />
                <Typography variant="h6" gutterBottom>
                  Drag & Drop a file to upload
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
                <Button component="label" variant="contained" sx={{ mt: 2 }}>
                  Select File
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                    accept=".v"
                  />
                </Button>
              </DropZone>

              {file && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Selected file: {file.name}
                </Typography>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}

              <Button
                onClick={handleUpload}
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={!file}
                fullWidth
              >
                Upload File
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
