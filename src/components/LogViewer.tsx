import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Chip,
  Divider,
  Grid,
  useTheme,
  alpha,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface LogData {
  [key: string]: string;
}

interface LogViewerProps {
  logData: LogData;
}

const LogViewer: React.FC<LogViewerProps> = ({ logData }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>('error.log');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Determine if log has content worth showing
  const hasContent = (content: string) => {
    return content !== 'No relevant data found in log' && content.trim() !== '';
  };

  // Sort logs by priority: error, warning, other logs
  const sortedLogs = Object.entries(logData).sort((a, b) => {
    if (a[0].includes('error')) return -1;
    if (b[0].includes('error')) return 1;
    if (a[0].includes('warning')) return -1;
    if (b[0].includes('warning')) return 1;
    return a[0].localeCompare(b[0]);
  });

  const getIcon = (logName: string, content: string) => {
    if (!hasContent(content)) return <InfoIcon color="disabled" />;
    if (logName.includes('error')) return <ErrorIcon color="error" />;
    if (logName.includes('warning')) return <WarningIcon color="warning" />;
    if (logName.includes('synthesis') || logName.includes('lint'))
      return <CodeIcon color="info" />;
    if (
      content.includes('No critical errors') ||
      content.includes('completed without') ||
      content.includes('no errors') ||
      content.includes('0 violations')
    )
      return <CheckCircleIcon color="success" />;
    return <InfoIcon color="info" />;
  };

  const getSeverity = (
    logName: string,
    content: string
  ): 'error' | 'warning' | 'info' | 'success' | 'default' => {
    if (!hasContent(content)) return 'default';
    if (logName.includes('error')) return 'error';
    if (logName.includes('warning')) return 'warning';
    if (
      content.includes('No critical errors') ||
      content.includes('completed without') ||
      content.includes('no errors') ||
      content.includes('0 violations')
    )
      return 'success';
    return 'info';
  };

  const formatLogContent = (content: string, logName: string) => {
    if (content === 'No relevant data found in log') {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          No relevant data found in log
        </Typography>
      );
    }

    // Handle content that might be truncated
    const isTruncated =
      content.includes('[Content truncated]') ||
      content.endsWith('...') ||
      content.endsWith('…');

    // Remove the truncation marker for display
    if (isTruncated) {
      content = content.replace(' [Content truncated]', '');
    }

    // Helper function to render text with bold formatting
    const renderTextWithBold = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Remove the ** markers and render as bold
          const boldText = part.slice(2, -2);
          return (
            <strong key={index} style={{ fontWeight: 600 }}>
              {boldText}
            </strong>
          );
        }
        return part;
      });
    };

    // Split by bullet points more intelligently - only split on * that start a new line/point
    // This regex splits on * that are at the beginning or after newline/whitespace
    const bulletPattern = /(?:^|\n)\s*\*\s*/;
    const contentWithBullets = content
      .split(bulletPattern)
      .filter((item) => item.trim());

    const itemId = `${logName}-content`;
    const isExpanded = expandedItems[itemId] || false;

    if (contentWithBullets.length <= 1) {
      // If there's no bullet points, just show the plain text with bold formatting
      return (
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {!isExpanded && content.length > 300 ? (
            <>
              {renderTextWithBold(content.substring(0, 300))}...
              <Button
                onClick={() => toggleItemExpansion(itemId)}
                sx={{ ml: 1, textTransform: 'none' }}
                size="small"
                startIcon={<MoreHorizIcon />}
              >
                Show more
              </Button>
            </>
          ) : (
            <>
              {renderTextWithBold(content)}
              {content.length > 300 && (
                <Button
                  onClick={() => toggleItemExpansion(itemId)}
                  sx={{ ml: 1, textTransform: 'none' }}
                  size="small"
                >
                  Show less
                </Button>
              )}
            </>
          )}
        </Typography>
      );
    }

    // For content with bullet points - display each item with bold formatting support
    return (
      <Box>
        {isTruncated && (
          <Typography
            variant="caption"
            color="warning.main"
            sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}
          >
            ⚠️ This log content was truncated in the original data
          </Typography>
        )}

        <Box
          component="ul"
          sx={{
            pl: 2,
            m: 0,
            listStyleType: 'disc',
          }}
        >
          {contentWithBullets.map((item, index) => {
            // Skip empty items
            if (!item.trim()) return null;

            // Try to identify if this is a warning or error message
            const isWarning = item.toLowerCase().includes('warning');
            const isError = item.toLowerCase().includes('error');
            const isSuccess =
              item.toLowerCase().includes('success') ||
              item.toLowerCase().includes('completed') ||
              item.toLowerCase().includes('no violations');

            let textColor = theme.palette.text.primary;
            if (isWarning) textColor = theme.palette.warning.main;
            if (isError) textColor = theme.palette.error.main;
            if (isSuccess) textColor = theme.palette.success.main;

            // Handle collapsible long items
            const itemUniqueId = `${logName}-item-${index}`;
            const isItemExpanded = expandedItems[itemUniqueId] || false;
            const isLongItem = item.length > 100;

            return (
              <Typography
                component="li"
                variant="body2"
                key={index}
                sx={{
                  mb: 1.5,
                  color: textColor,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: alpha(textColor, 0.05),
                  borderLeft: `4px solid ${alpha(textColor, 0.3)}`,
                  position: 'relative',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {isLongItem && !isItemExpanded ? (
                  <>
                    {renderTextWithBold(item.substring(0, 100).trim())}...
                    <Button
                      onClick={() => toggleItemExpansion(itemUniqueId)}
                      size="small"
                      sx={{ ml: 1, textTransform: 'none' }}
                    >
                      Show more
                    </Button>
                  </>
                ) : (
                  <>
                    {renderTextWithBold(item.trim())}
                    {isLongItem && (
                      <Button
                        onClick={() => toggleItemExpansion(itemUniqueId)}
                        size="small"
                        sx={{ mt: 1, textTransform: 'none' }}
                      >
                        Show less
                      </Button>
                    )}
                  </>
                )}
              </Typography>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Get a summary of the number of logs with issues
  const getLogSummary = () => {
    const errors = sortedLogs.filter(
      ([name, content]) => name.includes('error') && hasContent(content)
    ).length;
    const warnings = sortedLogs.filter(
      ([name, content]) => name.includes('warning') && hasContent(content)
    ).length;
    const okLogs = sortedLogs.filter(
      ([, content]) =>
        content.includes('No critical errors') ||
        content.includes('completed without') ||
        content.includes('no errors')
    ).length;

    return (
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {errors > 0 && (
          <Grid item>
            <Chip
              icon={<ErrorIcon />}
              label={`${errors} Error${errors > 1 ? 's' : ''}`}
              color="error"
              variant="outlined"
            />
          </Grid>
        )}
        {warnings > 0 && (
          <Grid item>
            <Chip
              icon={<WarningIcon />}
              label={`${warnings} Warning${warnings > 1 ? 's' : ''}`}
              color="warning"
              variant="outlined"
            />
          </Grid>
        )}
        {okLogs > 0 && (
          <Grid item>
            <Chip
              icon={<CheckCircleIcon />}
              label={`${okLogs} Passed`}
              color="success"
              variant="outlined"
            />
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 3px 14px ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}
      >
        Log Analysis
      </Typography>

      {getLogSummary()}

      {sortedLogs.map(([logName, content]) => {
        const severity = getSeverity(logName, content);
        const severityColor =
          severity === 'default'
            ? theme.palette.grey[400]
            : theme.palette[severity].main;

        return (
          <Accordion
            key={logName}
            expanded={expanded === logName}
            onChange={handleChange(logName)}
            sx={{
              mb: 1.5,
              '&:before': { display: 'none' },
              borderLeft: `4px solid ${severityColor}`,
              boxShadow: hasContent(content) ? 1 : 0,
              opacity: hasContent(content) ? 1 : 0.7,
              borderRadius: '4px !important',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                borderRadius: 1,
                '&.Mui-expanded': {
                  minHeight: 48,
                  backgroundColor: `${alpha(severityColor, 0.08)}`,
                },
                '&:hover': {
                  backgroundColor: `${alpha(severityColor, 0.05)}`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  width: '100%',
                }}
              >
                {getIcon(logName, content)}
                <Typography sx={{ fontWeight: 500, flexGrow: 1 }}>
                  {logName.replace('.log', '')}
                </Typography>
                <Chip
                  size="small"
                  label={
                    severity === 'error'
                      ? 'Error'
                      : severity === 'warning'
                        ? 'Warning'
                        : severity === 'success'
                          ? 'Success'
                          : 'Info'
                  }
                  color={severity}
                  sx={{ height: 24, ml: 'auto' }}
                  variant={severity === 'default' ? 'outlined' : 'filled'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                px: 2,
                py: 2,
                bgcolor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <Divider sx={{ mb: 2 }} />
              {formatLogContent(content, logName)}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
};

export default LogViewer;
