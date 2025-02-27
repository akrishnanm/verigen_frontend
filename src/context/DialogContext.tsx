'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';
import useDialog from '@/hooks/useDialog';

interface NotificationData {
  title: string;
  body: string;
}

interface DialogContextProps {
  dialogOpen: boolean;
  notificationData: NotificationData | null;
  openDialog: (data: NotificationData) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const { dialogOpen, notificationData, openDialog, closeDialog } = useDialog();

  return (
    <DialogContext.Provider
      value={{ dialogOpen, notificationData, openDialog, closeDialog }}
    >
      {children}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{notificationData?.title}</DialogTitle>
        <DialogContent>
          <Typography component="pre" style={{ whiteSpace: 'pre-wrap' }}>
            {notificationData?.body}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
};
