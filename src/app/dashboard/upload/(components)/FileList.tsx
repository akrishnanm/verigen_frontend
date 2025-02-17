import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import UploadForm from './UploadForm';

interface FileListProps {
  files: { filename: string; url: string; timestamp: string }[];
  onFileSelect: (file: { filename: string; url: string }) => void;
  onFileUpload: (
    files: { filename: string; url: string; timestamp: string }[]
  ) => void;
}

export default function FileList({
  files,
  onFileSelect,
  onFileUpload,
}: FileListProps) {
  // Sort files in descending order of their timestamps
  const sortedFiles = [...files].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: 4,
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Upload Files
      </Typography>
      <List
        sx={{
          height: 300,
          overflowY: 'auto',
          mb: 2,
          borderRadius: 2,
          bgcolor: 'background.default',
        }}
      >
        {sortedFiles.map((file, index) => (
          <ListItem disablePadding key={index}>
            <ListItemButton
              onClick={() => onFileSelect(file)}
              sx={{
                px: 2,
                '&:hover': { bgcolor: 'action.hover' },
                '&.Mui-selected, &.Mui-selected:hover': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ListItemText primary={file.filename} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <UploadForm onFileUpload={onFileUpload} />
    </Box>
  );
}
