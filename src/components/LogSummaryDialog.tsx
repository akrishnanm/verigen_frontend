import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Paper,
} from '@mui/material';
import { parseLogSummary } from '@/utils/parseLogSummary';
import LogViewer from './LogViewer';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface LogSummaryDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
}

const LogSummaryDialog: React.FC<LogSummaryDialogProps> = ({
  open,
  onClose,
  title,
  body,
}) => {
  const theme = useTheme();
  const [parsedLogs, setParsedLogs] = useState<Record<string, string>>({});
  const [parseError, setParseError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Create a theme instance.
  const logViewerTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: theme.palette.primary,
          secondary: theme.palette.secondary,
          error: theme.palette.error,
          warning: theme.palette.warning,
          info: theme.palette.info,
          success: theme.palette.success,
        },
      }),
    [darkMode, theme.palette]
  );

  useEffect(() => {
    // Check if this is a direct log fragment (from a second dialog or user input)
    const isDirectLog =
      body.startsWith('"*') && body.includes('this is the value for the key');

    if (body && (body.includes('Log Summary:') || isDirectLog)) {
      try {
        const parsed = parseLogSummary(body);
        if (parsed.error) {
          console.error('Parse error:', parsed.error);
          setParseError(parsed.error);
          setParsedLogs({});
        } else {
          console.log('Successfully parsed log data:', parsed);
          setParsedLogs(parsed);
          setParseError(null);
        }
      } catch (error) {
        console.error('Error during log parsing:', error);
        setParseError(
          'Failed to parse log data: ' +
            (error instanceof Error ? error.message : String(error))
        );
        setParsedLogs({});
      }
    } else {
      setParsedLogs({});
      setParseError(null);
    }
  }, [body]);

  const hasLogData = Object.keys(parsedLogs).length > 0 && !parseError;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Format raw content for display
  const formatRawContent = (content: string) => {
    // Handle direct log content case
    if (
      content.startsWith('"*') &&
      content.includes('this is the value for the key')
    ) {
      const contentMatch = content.match(/^"(.+?)"\s+'this is/);
      if (contentMatch) {
        return contentMatch[1].replace(/\\n/g, '\n');
      }
    }

    // Extract the log summary part if possible
    const match = content.match(/Log Summary: (.*)/);
    if (match && match[1]) {
      return match[1];
    }

    return content;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <ThemeProvider theme={logViewerTheme}>
        <CssBaseline />
        <DialogTitle
          sx={{
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: logViewerTheme.palette.background.paper,
          }}
        >
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 2,
            backgroundColor: logViewerTheme.palette.background.default,
            maxHeight: '80vh',
          }}
        >
          {parseError && (
            <Alert severity="warning" sx={{ mb: 3 }} variant="filled">
              There was an issue parsing the log data: {parseError}
              <br />
              Displaying raw log data instead.
            </Alert>
          )}

          {parseError &&
            (body.includes('Log Summary:') || body.startsWith('"*')) && (
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  maxHeight: '60vh',
                  overflow: 'auto',
                  border: '1px solid ' + logViewerTheme.palette.divider,
                  backgroundColor: darkMode
                    ? 'rgba(0,0,0,0.1)'
                    : 'rgba(0,0,0,0.02)',
                }}
              >
                <Typography
                  component="pre"
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: logViewerTheme.palette.text.secondary,
                  }}
                >
                  {formatRawContent(body)}
                </Typography>
              </Paper>
            )}

          {!parseError && !hasLogData && (
            <Typography
              component="pre"
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {body}
            </Typography>
          )}

          {hasLogData && (
            <Box sx={{ mt: 2 }}>
              <LogViewer logData={parsedLogs} />
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: logViewerTheme.palette.background.paper,
            py: 2,
          }}
        >
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </ThemeProvider>
    </Dialog>
  );
};

export default LogSummaryDialog;
