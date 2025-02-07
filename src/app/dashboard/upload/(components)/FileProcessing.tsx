import { useState, useEffect } from "react";
import { Box, Button, Typography, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useProcessFileMutation, useProcessOpenLaneFileMutation} from "./upload.api";

interface FileProcessingProps {
  selectedFile: { filename: string; url: string } | null;
}

interface ApiError {
  data?: {
    detail?: string;
  };
  message?: string;
}

export default function FileProcessing({ selectedFile }: FileProcessingProps) {
  const [icarusError, setIcarusError] = useState<string | null>(null);
  const [openlaneError, setOpenlaneError] = useState<string | null>(null);
  const [icarusSuccess, setIcarusSuccess] = useState(false);
  const [openlaneSuccess, setOpenlaneSuccess] = useState(false);
  const [icarusLoading, setIcarusLoading] = useState(false);
  const [openlaneLoading, setOpenlaneLoading] = useState(false);
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fullErrorMessage, setFullErrorMessage] = useState<string | null>(null);
  
  const [processFileIcarus] = useProcessFileMutation();
  const [processFileOpenLane] = useProcessOpenLaneFileMutation();
  
  useEffect(() => {
    if (icarusSuccess && openlaneSuccess) {
      setDownloadEnabled(true);
    } else {
      setDownloadEnabled(false);
    }
  }, [icarusSuccess, openlaneSuccess]);

  const handleProcessFile = async (processor: "icarus" | "openlane") => {
    if (!selectedFile) return;

    const setLoading = processor === "icarus" ? setIcarusLoading : setOpenlaneLoading;
    const setError = processor === "icarus" ? setIcarusError : setOpenlaneError;
    const setSuccess = processor === "icarus" ? setIcarusSuccess : setOpenlaneSuccess;
    const processMutation = processor === "icarus" ? processFileIcarus : processFileOpenLane;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await processMutation({ file_id: selectedFile.filename }).unwrap();

      if (response.status === "success") {
        setSuccess(true);
      } else {
        const errorMessage = extractErrorMessage(response.detail);
        setError(errorMessage || "File processing failed");
        setFullErrorMessage(errorMessage);
        setDialogOpen(true);
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = extractErrorMessage(apiError.data?.detail || "An unknown error occurred");
      setError("Compilation error");
      setFullErrorMessage(errorMessage);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const extractErrorMessage = (detail: string): string => {
    const prefix = "400: Verilog processing failed: ";
    let errorString = detail;
  
    // Remove the prefix if present
    if (errorString.startsWith(prefix)) {
      errorString = errorString.substring(prefix.length);
      try {
        const parsed = JSON.parse(errorString);
        // Extract the 'log' property
        errorString = parsed.detail?.log || errorString;
      } catch (e) {
        console.error("JSON parsing error:", e);
      }
    }

    // Remove unwanted file path parts and replace newlines with a single space
    errorString = errorString.replace(/\/usr\/src\/app\/local_files\//g, "");
    errorString = errorString.replace(/\n/g, "\n");
  
    return errorString;
  };
  
  const handleDownload = () => {
    // Implement the download logic here
    console.log("Download initiated");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        File Processing
      </Typography>
      <Typography variant="body1" gutterBottom>
        Selected File: {selectedFile ? selectedFile.filename : "No file selected"}
      </Typography>
      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={() => handleProcessFile("icarus")} disabled={!selectedFile || icarusLoading} sx={{ mr: 2 }}>
          Icarus
        </Button>
        <Button variant="contained" onClick={() => handleProcessFile("openlane")} disabled={!selectedFile || openlaneLoading}>
          OpenLane
        </Button>
      </Box>
      <Box sx={{ my: 2 }}>
        <Typography variant="body2">Icarus Status:</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {icarusLoading && <LinearProgress sx={{ width: '100%' }} />}
          {icarusSuccess && <CheckCircleOutlineIcon color="success" />}
          {icarusError && <ErrorOutlineIcon color="error" />}
        </Box>
        {icarusError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {icarusError}
          </Typography>
        )}
      </Box>
      <Box sx={{ my: 2 }}>
        <Typography variant="body2">OpenLane Status:</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {openlaneLoading && <LinearProgress sx={{ width: '100%' }} />}
          {openlaneSuccess && <CheckCircleOutlineIcon color="success" />}
          {openlaneError && <ErrorOutlineIcon color="error" />}
        </Box>
        {openlaneError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {openlaneError}
          </Typography>
        )}
      </Box>
      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={handleDownload} disabled={!downloadEnabled}>
          Download
        </Button>
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Error Details</DialogTitle>
        <DialogContent>
          <pre>{fullErrorMessage}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

