import { useState } from 'react';

interface NotificationData {
  title: string;
  body: string;
}

const useDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notificationData, setNotificationData] =
    useState<NotificationData | null>(null);

  const openDialog = (data: NotificationData) => {
    setNotificationData(data);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setNotificationData(null);
  };

  const updateNotificationData = (data: NotificationData) => {
    setNotificationData(data);
    // Don't open the dialog, just update the data
  };

  return {
    dialogOpen,
    notificationData,
    openDialog,
    closeDialog,
    updateNotificationData,
  };
};

export default useDialog;
