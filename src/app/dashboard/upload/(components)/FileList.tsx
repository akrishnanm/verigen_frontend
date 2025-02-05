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
    files: string[];
    onFileSelect: (fileUrl: string) => void;
    onFileUpload: (fileName: string) => void;
  }
export default function FileList({onFileSelect, files}: FileListProps) {

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
          {files.map((fileUrl, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton onClick={() => onFileSelect(fileUrl)}>
                <ListItemText primary={fileUrl} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    <UploadForm onFileUpload={(fileUrl: string) => console.log(fileUrl)} />
    </Box>
  );
}