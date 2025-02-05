import { useState, useEffect} from "react"
import { Box, Button, Typography, LinearProgress, Alert } from "@mui/material"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

interface FileProcessingProps {
  selectedFile: string | null
}

export default function FileProcessing({ selectedFile }: FileProcessingProps) {
  const [icarusProgress, setIcarusProgress] = useState(0)
  const [openlaneProgress, setOpenlaneProgress] = useState(0)
  const [icarusError, setIcarusError] = useState<string | null>(null)
  const [openlaneError, setOpenlaneError] = useState<string | null>(null)
  const [icarusSuccess, setIcarusSuccess] = useState(false)
  const [openlaneSuccess, setOpenlaneSuccess] = useState(false)
  const [downloadEnabled, setDownloadEnabled] = useState(false);

  useEffect(() => {
    if (icarusSuccess && openlaneSuccess) {
      setDownloadEnabled(true);
    } else {
      setDownloadEnabled(false);
    }
  }, [icarusSuccess, openlaneSuccess]);

  const processFile = async (processor: "icarus" | "openlane") => {
    if (!selectedFile) return

    const setProgress = processor === "icarus" ? setIcarusProgress : setOpenlaneProgress
    const setError = processor === "icarus" ? setIcarusError : setOpenlaneError
    const setSuccess = processor === "icarus" ? setIcarusSuccess : setOpenlaneSuccess

    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/process-file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: selectedFile, processor }),
      })

      if (!response.ok) {
        throw new Error("File processing failed")
      }

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      setProgress(100)
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      setProgress(0)
    }
  }
  
  const handleDownload = () => {
    // Implement the download logic here
    console.log("Download initiated");
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        File Processing
      </Typography>
      <Typography variant="body1" gutterBottom>
        Selected File: {selectedFile || "No file selected"}
      </Typography>
      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={() => processFile("icarus")} disabled={!selectedFile} sx={{ mr: 2 }}>
          Icarus
        </Button>
        <Button variant="contained" onClick={() => processFile("openlane")} disabled={!selectedFile}>
          OpenLane
        </Button>
      </Box>
      <Box sx={{ my: 2 }}>
        <Typography variant="body2">Icarus Progress:</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <LinearProgress variant="determinate" value={icarusProgress} />
          </Box>
          {icarusSuccess && <CheckCircleOutlineIcon color="success" className="animate-success" />}
          {icarusError && <ErrorOutlineIcon color="error" className="animate-error" />}
        </Box>
        {icarusError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {icarusError}
          </Alert>
        )}
      </Box>
      {(icarusError || openlaneError) && (
        <Alert severity="error" sx={{ my: 2 }}>
          An error occurred during file processing. Please try again.
        </Alert>
      )}
      <Box sx={{ my: 2 }}>
        <Typography variant="body2">OpenLane Progress:</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <LinearProgress variant="determinate" value={openlaneProgress} />
          </Box>
          {openlaneSuccess && <CheckCircleOutlineIcon color="success" className="animate-success" />}
          {openlaneError && <ErrorOutlineIcon color="error" className="animate-error" />}
        </Box>
        {openlaneError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {openlaneError}
          </Alert>
        )}
      </Box>
      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={handleDownload} disabled={!downloadEnabled}>
          Download
        </Button>
      </Box>
    </Box>
  );
}

