import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ToastContainer, toast } from 'react-toastify';
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

  const { token: fcmToken, notificationData } = useFcmToken(); // Get the FCM token and notification data from the useFcmToken hook

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
    setError(null);
    setSuccess(false);

    try {
      await processMutation({
        file_id: selectedFile.filename,
        fcm_token: fcmToken, // Include the FCM token in the API call
      }).unwrap();
    } catch (error) {
      const errorMessage = error.message ||'An unknown error occurred during file processing';
      setError('Compilation error');
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Implement the download logic here
    console.log('Download initiated');
  };

  return (
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

      {/* Toast Container */}
      <ToastContainer />
    </Box>
  );
}
