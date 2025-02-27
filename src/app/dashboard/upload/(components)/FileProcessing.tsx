import { useState, useEffect } from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import 'react-toastify/dist/ReactToastify.css';
import {
  useProcessFileMutation,
  useProcessOpenLaneFileMutation,
} from './upload.api';
import useFcmToken from '@/hooks/useFcmToken'; // Import the useFcmToken hook

interface FileProcessingProps {
  selectedFile: { filename: string; url: string } | null;
}

export default function FileProcessing({ selectedFile }: FileProcessingProps) {
  const [icarusError, setIcarusError] = useState<boolean>(false);
  const [openlaneError, setOpenlaneError] = useState<boolean>(false);
  const [icarusSuccess, setIcarusSuccess] = useState<boolean>(false);
  const [openlaneSuccess, setOpenlaneSuccess] = useState<boolean>(false);
  const [icarusLoading, setIcarusLoading] = useState(false);
  const [openlaneLoading, setOpenlaneLoading] = useState(false);
  const [downloadEnabled, setDownloadEnabled] = useState(false);

  const [processFileIcarus] = useProcessFileMutation();
  const [processFileOpenLane] = useProcessOpenLaneFileMutation();

  // Use the useFcmToken hook
  const {
    token: fcmToken,
    dialogOpen,
    notificationData,
    handleDialogClose,
  } = useFcmToken();

  useEffect(() => {
    if (notificationData) {
      if (notificationData.body.includes('Status - error')) {
        setIcarusError(true);
        setIcarusSuccess(false);
      } else if (notificationData.body.includes('Status - success')) {
        setIcarusSuccess(true);
        setIcarusError(false);
      }
    }
  }, [notificationData]);

  useEffect(() => {
    if (openlaneSuccess) {
      setDownloadEnabled(true);
    } else {
      setDownloadEnabled(false);
    }
  }, [icarusSuccess, openlaneSuccess]);

  const handleProcessFile = async (processor: 'icarus' | 'openlane') => {
    if (!selectedFile) return;
    const setLoading =
      processor === 'icarus' ? setIcarusLoading : setOpenlaneLoading;
    const setError = processor === 'icarus' ? setIcarusError : setOpenlaneError;
    const setSuccess =
      processor === 'icarus' ? setIcarusSuccess : setOpenlaneSuccess;
    const processMutation =
      processor === 'icarus' ? processFileIcarus : processFileOpenLane;

    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      await processMutation({
        file_id: selectedFile.filename,
        fcm_token: fcmToken, // Include the FCM token in the API call
      }).unwrap();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unknown error occurred during file processing';
      setError(true);
      console.error(errorMessage); // Log the error to the console
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Implement the download logic here
    console.log('Download initiated');
  };

  return (
    <>
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: 4,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          File Processing
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Selected File:{' '}
          <strong>
            {selectedFile ? selectedFile.filename : 'No file selected'}
          </strong>
        </Typography>

        <Box sx={{ my: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleProcessFile('icarus')}
            disabled={!selectedFile || icarusLoading}
            startIcon={<CheckCircleOutlineIcon />}
          >
            Icarus
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleProcessFile('openlane')}
            disabled={!selectedFile || openlaneLoading}
            startIcon={<CheckCircleOutlineIcon />}
          >
            OpenLane
          </Button>
        </Box>

        {/* Icarus Status */}
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2">Icarus Status</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icarusLoading && <LinearProgress sx={{ flex: 1 }} />}
            {icarusSuccess && <CheckCircleOutlineIcon color="success" />}
            {icarusError && <ErrorOutlineIcon color="error" />}
          </Box>
          {icarusError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Compilation error
            </Typography>
          )}
        </Box>

        {/* OpenLane Status */}
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2">OpenLane Status</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {openlaneLoading && <LinearProgress sx={{ flex: 1 }} />}
            {openlaneSuccess && <CheckCircleOutlineIcon color="success" />}
            {openlaneError && <ErrorOutlineIcon color="error" />}
          </Box>
          {openlaneError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {openlaneError}
            </Typography>
          )}
        </Box>

        {/* Download Button */}
        <Box sx={{ my: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleDownload}
            disabled={!downloadEnabled}
          >
            Download
          </Button>
        </Box>
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
}
