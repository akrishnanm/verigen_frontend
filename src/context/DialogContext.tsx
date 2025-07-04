'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import useDialog from '@/hooks/useDialog';
import LogSummaryDialog from '@/components/LogSummaryDialog';

interface NotificationData {
  title: string;
  body: string;
}

interface DialogContextProps {
  dialogOpen: boolean;
  notificationData: NotificationData | null;
  openDialog: (data: NotificationData) => void;
  closeDialog: () => void;
  updateNotificationData: (data: NotificationData) => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const {
    dialogOpen,
    notificationData,
    openDialog,
    closeDialog,
    updateNotificationData,
  } = useDialog();

  return (
    <DialogContext.Provider
      value={{
        dialogOpen,
        notificationData,
        openDialog,
        closeDialog,
        updateNotificationData,
      }}
    >
      {children}
      <LogSummaryDialog
        open={dialogOpen}
        onClose={closeDialog}
        title={notificationData?.title || ''}
        body={notificationData?.body || ''}
      />
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