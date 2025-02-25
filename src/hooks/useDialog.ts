import { useState } from 'react';

interface NotificationData {
  title: string;
  body: string;
}

const useDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationData | null>(null);

  const openDialog = (data: NotificationData) => {
    setNotificationData(data);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setNotificationData(null);
  };

  return {
    dialogOpen,
    notificationData,
    openDialog,
    closeDialog,
  };
};

export default useDialog;