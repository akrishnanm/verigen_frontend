import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface OpenLaneConfig {
  clock_port: string;
  clock_period: number;
  die_area: string;
  fp_core_util: number;
  pin_configuration: {
    N: string[];
    S: string[];
    E: string[];
    W: string[];
  };
}

interface OpenLaneConfigFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (config: OpenLaneConfig) => void;
}

export default function OpenLaneConfigForm({
  open,
  onClose,
  onSubmit,
}: OpenLaneConfigFormProps) {
  const [config, setConfig] = useState<OpenLaneConfig>({
    clock_port: '',
    clock_period: 10,
    die_area: '0 0 1000 1000',
    fp_core_util: 80,
    pin_configuration: {
      N: [''],
      S: [''],
      E: [''],
      W: [''],
    },
  });

  const handleChange = (
    field: keyof Omit<OpenLaneConfig, 'pin_configuration'>,
    value: string | number
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePinChange = (
    direction: keyof OpenLaneConfig['pin_configuration'],
    index: number,
    value: string
  ) => {
    setConfig((prev) => {
      const pins = [...prev.pin_configuration[direction]];
      pins[index] = value;
      return {
        ...prev,
        pin_configuration: {
          ...prev.pin_configuration,
          [direction]: pins,
        },
      };
    });
  };

  const addPin = (direction: keyof OpenLaneConfig['pin_configuration']) => {
    setConfig((prev) => ({
      ...prev,
      pin_configuration: {
        ...prev.pin_configuration,
        [direction]: [...prev.pin_configuration[direction], ''],
      },
    }));
  };

  const removePin = (
    direction: keyof OpenLaneConfig['pin_configuration'],
    index: number
  ) => {
    setConfig((prev) => {
      const pins = [...prev.pin_configuration[direction]];
      pins.splice(index, 1);
      return {
        ...prev,
        pin_configuration: {
          ...prev.pin_configuration,
          [direction]: pins.length ? pins : [''],
        },
      };
    });
  };

  const handleSubmit = () => {
    onSubmit(config);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>OpenLane Configuration</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Clock Port"
            value={config.clock_port}
            onChange={(e) => handleChange('clock_port', e.target.value)}
            fullWidth
          />

          <TextField
            label="Clock Period"
            type="number"
            value={config.clock_period}
            onChange={(e) =>
              handleChange('clock_period', parseFloat(e.target.value))
            }
            fullWidth
          />

          <TextField
            label="Die Area (format: 'x0 y0 x1 y1')"
            value={config.die_area}
            onChange={(e) => handleChange('die_area', e.target.value)}
            fullWidth
          />

          <TextField
            label="FP Core Utilization (%)"
            type="number"
            value={config.fp_core_util}
            onChange={(e) =>
              handleChange('fp_core_util', parseFloat(e.target.value))
            }
            fullWidth
            inputProps={{ min: 0, max: 100, step: 1 }}
          />

          {['N', 'S', 'E', 'W'].map((direction) => (
            <Box key={direction} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {direction} Pins
              </Typography>

              {config.pin_configuration[
                direction as keyof OpenLaneConfig['pin_configuration']
              ].map((pin, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    label={`Pin ${index + 1}`}
                    value={pin}
                    onChange={(e) =>
                      handlePinChange(
                        direction as keyof OpenLaneConfig['pin_configuration'],
                        index,
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                  <IconButton
                    onClick={() =>
                      removePin(
                        direction as keyof OpenLaneConfig['pin_configuration'],
                        index
                      )
                    }
                    disabled={
                      config.pin_configuration[
                        direction as keyof OpenLaneConfig['pin_configuration']
                      ].length <= 1
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  addPin(direction as keyof OpenLaneConfig['pin_configuration'])
                }
                variant="outlined"
                size="small"
              >
                Add Pin
              </Button>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
