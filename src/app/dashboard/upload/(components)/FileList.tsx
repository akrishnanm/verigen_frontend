import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
} from '@mui/material';
import UploadForm from "./UploadForm";

interface FileListProps {
  files: { filename: string; url: string; timestamp: string }[];
  onFileSelect: (fileUrl: string) => void;
  onFileUpload: (files: { filename: string; url: string; timestamp: string }[]) => void;
}

export default function FileList({ files, onFileSelect, onFileUpload }: FileListProps) {
  // Sort files in descending order of their timestamps
  const sortedFiles = [...files].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Uploaded Files
      </Typography>
      <Paper
        elevation={3}
        sx={{
          height: '300px',
          overflow: 'auto',
          mb: 2,
        }}
      >
        <List>
          {sortedFiles.map((file, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton onClick={() => onFileSelect(file.url)}>
                <ListItemText primary={file.filename} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
      <UploadForm onFileUpload={onFileUpload} />
    </Box>
  );
}