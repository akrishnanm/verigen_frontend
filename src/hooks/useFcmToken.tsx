'use client';
import { useState, useEffect, useRef } from 'react';
import { fetchToken, messaging } from '@/firebase';
import { onMessage, Unsubscribe } from 'firebase/messaging';
import { useRouter } from 'next/navigation';
import { useDialogContext } from '../context/DialogContext'; // Import the useDialogContext hook

async function getNotificationPermissionAndToken() {
  // Step 1: Check if Notifications are supported in the browser.
  if (!('Notification' in window)) {
    console.info('This browser does not support desktop notification');
    return null;
  }

  // Step 2: Check if permission is already granted.
  if (Notification.permission === 'granted') {
    return await fetchToken();
  }

  // Step 3: If permission is not denied, request permission from the user.
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return await fetchToken();
    }
  }

  console.log('Notification permission not granted.');
  return null;
}

const useFcmToken = () => {
  const router = useRouter(); // Initialize the router for navigation.
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null); // State to store the notification permission status.
  const [token, setToken] = useState<string | null>(null); // State to store the FCM token.
  const retryLoadToken = useRef(0); // Ref to keep track of retry attempts.
  const isLoading = useRef(false); // Ref to keep track if a token fetch is currently in progress.
  const {
    dialogOpen,
    notificationData,
    openDialog,
    closeDialog,
    updateNotificationData,
  } = useDialogContext(); // Use the useDialogContext hook
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); // State to store the download URL.

  const loadToken = async () => {
    // Step 4: Prevent multiple fetches if already fetched or in progress.
    if (isLoading.current) return;

    isLoading.current = true; // Mark loading as in progress.
    const token = await getNotificationPermissionAndToken(); // Fetch the token.

    // Step 5: Handle the case where permission is denied.
    if (Notification.permission === 'denied') {
      setNotificationPermissionStatus('denied');
      console.info(
        '%cPush Notifications issue - permission denied',
        'color: green; background: #c7c7c7; padding: 8px; font-size: 20px'
      );
      isLoading.current = false;
      return;
    }
    // Step 6: Retry fetching the token if necessary. (up to 3 times)
    // This step is typical initially as the service worker may not be ready/installed yet.
    if (!token) {
      if (retryLoadToken.current >= 3) {
        alert('Unable to load token, refresh the browser');
        console.info(
          '%cPush Notifications issue - unable to load token after 3 retries',
          'color: green; background: #c7c7c7; padding: 8px; font-size: 20px'
        );
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.error('An error occurred while retrieving token. Retrying...');
      isLoading.current = false;
      await loadToken();
      return;
    }

    setToken(token);
    isLoading.current = false;
  };

  const cleanNotificationData = (title: string, body: string) => {
    // Example cleanup: Remove extra whitespace, unwanted prefixes, etc.
    title = title.trim();
    body = body.replace(/\/usr\/src\/app\/local_files\//g, '').trim();

    // Extract and format log messages
    const logMessages = body
      .split('\n')
      .map((line) => {
        const match = line.match(/(.*): (.*)/);
        if (match) {
          return `${match[1]}: ${match[2]}`;
        }
        return line;
      })
      .join('\n');
    console.log('Notification data cleaned:', { title, body: logMessages });

    // Extract URL from the notification body
    const urlMatch = body.match(/URL: (https?:\/\/[^\s]+)/);
    const url = urlMatch ? urlMatch[1] : null;
    if (url) {
      setDownloadUrl(url);
    }
    console.log('Download URL:', url);
    return { title, body: logMessages };
  };

  useEffect(() => {
    // Step 8: Initialize token loading when the component mounts.
    if ('Notification' in window) {
      loadToken();
    }
  });

  useEffect(() => {
    const setupListener = async () => {
      if (!token) return; // Exit if no token is available.

      console.log(`onMessage registered with token ${token}`);
      const m = await messaging();
      if (!m) return;

      // Step 9: Register a listener for incoming FCM messages.
      const unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== 'granted') return;

        console.log('Foreground push notification received:', payload);
        const link = payload.fcmOptions?.link || payload.data?.link;
        const { title, body } = cleanNotificationData(
          payload.notification?.title || 'New message',
          payload.notification?.body || 'This is a new message'
        );

        // Determine if this notification should show a dialog
        const shouldShowDialog =
          body.includes('Status - error') || // Icarus error
          body.includes('Status - success') || // Icarus success
          body.includes('OpenLane flow - error') || // OpenLane error with logs
          body.includes('Log Summary'); // OpenLane completion with logs

        // Always update notification data for progress tracking
        if (shouldShowDialog) {
          openDialog({ title, body });
        } else {
          // For checkpoint progress notifications, just update the data without opening dialog
          updateNotificationData({ title, body });
        }

        // --------------------------------------------
        // Disable this if you only want toast notifications.
        const n = new Notification(
          payload.notification?.title || 'New message',
          {
            body: payload.notification?.body || 'This is a new message',
            data: link ? { url: link } : undefined,
          }
        );
        // Step 10: Handle notification click event to navigate to a link if present.
        n.onclick = (event) => {
          event.preventDefault();
          const link = (event.target as Notification)?.data?.url;
          if (link) {
            router.push(link);
          } else {
            console.log('No link found in the notification payload');
          }
        };
        // --------------------------------------------
      });

      return unsubscribe;
    };

    let unsubscribe: Unsubscribe | null = null;

    setupListener().then((unsub) => {
      if (unsub) {
        unsubscribe = unsub;
      }
    });

    // Step 11: Cleanup the listener when the component unmounts.
    return () => unsubscribe?.();
  }, [token, router, openDialog, closeDialog, updateNotificationData]);

  return {
    dialogOpen,
    notificationData,
    handleDialogClose: closeDialog,
    token,
    notificationPermissionStatus,
    downloadUrl,
  };
};

export default useFcmToken;
