'use client';

import React, { ReactNode } from 'react';
import { Box, LinearProgress, Typography, styled } from '@mui/material';

interface Checkpoint {
  id: number;
  name: string | ReactNode;
  value: number;
}

interface CheckpointProgressBarProps {
  progress: number;
  checkpoints?: Checkpoint[];
}

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 8,
  backgroundColor: theme.palette.grey[100],
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 8,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  },
}));

const CheckpointDot = styled(Box)<{ active: boolean; completed: boolean }>(
  ({ theme, active, completed }) => ({
    position: 'absolute',
    top: -16,
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: completed
      ? '#4caf50'
      : active
        ? '#667eea'
        : theme.palette.grey[200],
    border: `3px solid ${theme.palette.background.paper}`,
    transform: 'translateX(-50%)',
    zIndex: 3,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow:
      completed || active
        ? '0 4px 12px rgba(102, 126, 234, 0.4)'
        : '0 2px 4px rgba(0,0,0,0.1)',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: completed ? 12 : active ? 8 : 6,
      height: completed ? 12 : active ? 8 : 6,
      borderRadius: '50%',
      backgroundColor: completed
        ? '#ffffff'
        : active
          ? 'rgba(255,255,255,0.9)'
          : theme.palette.grey[400],
      transition: 'all 0.3s ease',
    },

    '&:hover': {
      transform: 'translateX(-50%) scale(1.1)',
      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
    },
  })
);

const CheckpointLabel = styled(Typography)<{
  active: boolean;
  completed: boolean;
}>(({ theme, active, completed }) => ({
  position: 'absolute',
  top: 16,
  fontSize: '0.75rem',
  fontWeight: completed ? 600 : active ? 500 : 400,
  color: completed
    ? '#4caf50'
    : active
      ? '#667eea'
      : theme.palette.text.secondary,
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  textShadow: completed || active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',

  '&:hover': {
    color: completed ? '#388e3c' : '#5a67d8',
    transform: 'translateX(-50%) translateY(-2px)',
  },
}));

const PercentageLabel = styled(Box)((
  // { theme }  // Uncomment this line if you want to use theme properties
) => ({
  position: 'absolute',
  right: 0,
  top: -32,
  padding: '4px 12px',
  borderRadius: 16,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    right: 12,
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: '4px solid #764ba2',
  },
}));

const StyledProgressContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  marginBottom: theme.spacing(5),
  padding: theme.spacing(2, 0),
}));

const CheckpointContainer = styled(Box)({
  position: 'relative',
  marginTop: 12,
});

const defaultCheckpoints: Checkpoint[] = [
  { id: 1, name: 'Planning', value: 0 },
  { id: 2, name: 'Design', value: 16.67 },
  { id: 3, name: 'Development', value: 33.33 },
  { id: 4, name: 'Testing', value: 50 },
  { id: 5, name: 'Review', value: 66.67 },
  { id: 6, name: 'Deployment', value: 83.33 },
  { id: 7, name: 'Complete', value: 100 },
];

export default function CheckpointProgressBar({
  progress,
  checkpoints = defaultCheckpoints,
}: CheckpointProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <StyledProgressContainer>
      <PercentageLabel>
        <Typography variant="body2" component="span">
          {Math.round(clampedProgress)}%
        </Typography>
      </PercentageLabel>

      <StyledLinearProgress variant="determinate" value={clampedProgress} />

      <CheckpointContainer>
        {checkpoints.map((checkpoint) => {
          const isCompleted = clampedProgress > checkpoint.value;
          const isActive =
            clampedProgress >= checkpoint.value &&
            clampedProgress < checkpoint.value + 16.67;

          return (
            <React.Fragment key={checkpoint.id}>
              <CheckpointDot
                active={isActive || isCompleted}
                completed={isCompleted}
                style={{ left: `${checkpoint.value}%` }}
              />
              <CheckpointLabel
                active={isActive || isCompleted}
                completed={isCompleted}
                style={{ left: `${checkpoint.value}%` }}
              >
                {checkpoint.name}
              </CheckpointLabel>
            </React.Fragment>
          );
        })}
      </CheckpointContainer>
    </StyledProgressContainer>
  );
}
