"use client";

import { useUser } from "@/hooks/useUser";
import {
  Modal,
  Switch,
  Button,
  Group,
  Stack,
  Alert,
  Text,
  Divider,
} from "@mantine/core";
import {
  FiAlertTriangle,
  FiCheck,
  FiSettings,
  FiBell,
  FiMail,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLogout } from "@/hooks/useLogout";

interface AccountSettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

interface NotificationSettings {
  pushNotification: boolean;
  emailNotification: boolean;
}

export default function AccountSettingsModal({
  opened,
  onClose,
}: AccountSettingsModalProps) {
  const { user, refetchUser } = useUser();
  const { logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    pushNotification: true,
    emailNotification: true,
  });

  useEffect(() => {
    if (user && opened) {
      setNotifications({
        pushNotification: user.pushNotification ?? true,
        emailNotification: user.emailNotification ?? true,
      });
    }
  }, [user, opened]);

  const handleNotificationUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch("/api/user/profile", notifications);

      if (response.status === 200) {
        toast.success("Notification settings updated!");
        await refetchUser();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to update settings";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await logout();
      toast.success("Logged out from all devices successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Account Settings"
      size="md"
      centered
    >
      <Stack gap="lg">
        {/* Notification Settings */}
        <div>
          <Group mb="sm">
            <FiBell size={18} className="text-blue-600" />
            <Text fw={600} size="lg">
              Notification Preferences
            </Text>
          </Group>

          <Stack
            gap="md"
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <Group justify="space-between">
              <Group gap="xs">
                <FiBell size={16} className="text-gray-600" />
                <div>
                  <Text size="sm" fw={500}>
                    Push Notifications
                  </Text>
                  <Text size="xs" c="dimmed">
                    Receive push notifications on your device
                  </Text>
                </div>
              </Group>
              <Switch
                checked={notifications.pushNotification}
                onChange={(event) =>
                  setNotifications((prev) => ({
                    ...prev,
                    pushNotification: event?.currentTarget?.checked ?? false,
                  }))
                }
              />
            </Group>

            <Group justify="space-between">
              <Group gap="xs">
                <FiMail size={16} className="text-gray-600" />
                <div>
                  <Text size="sm" fw={500}>
                    Email Notifications
                  </Text>
                  <Text size="xs" c="dimmed">
                    Receive notifications via email
                  </Text>
                </div>
              </Group>
              <Switch
                checked={notifications.emailNotification}
                onChange={(event) =>
                  setNotifications((prev) => ({
                    ...prev,
                    emailNotification: event?.currentTarget?.checked ?? false,
                  }))
                }
              />
            </Group>

            <Button
              size="sm"
              variant="light"
              leftSection={<FiCheck size={14} />}
              onClick={handleNotificationUpdate}
              loading={isLoading}
              disabled={
                notifications.pushNotification ===
                  (user?.pushNotification ?? true) &&
                notifications.emailNotification ===
                  (user?.emailNotification ?? true)
              }
            >
              Update Preferences
            </Button>
          </Stack>
        </div>

        <Divider />

        {/* Account Information */}
        <div>
          <Group mb="sm">
            <FiSettings size={18} className="text-green-600" />
            <Text fw={600} size="lg">
              Account Information
            </Text>
          </Group>

          <Stack
            gap="sm"
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
          >
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Account Status
              </Text>
              <Text size="sm" fw={500} c={user?.isVerified ? "green" : "red"}>
                {user?.isVerified ? "Verified" : "Unverified"}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Member Since
              </Text>
              <Text size="sm" fw={500}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Role
              </Text>
              <Text size="sm" fw={500} tt="capitalize">
                {user?.role}
              </Text>
            </Group>
          </Stack>
        </div>

        <Divider />

        {/* Security Actions */}
        <div>
          <Group mb="sm">
            <FiAlertTriangle size={18} className="text-red-600" />
            <Text fw={600} size="lg" c="red">
              Security Actions
            </Text>
          </Group>

          <Alert
            icon={<FiAlertTriangle size={16} />}
            title="Logout from all devices"
            color="red"
            variant="light"
          >
            <Text size="sm" mb="md">
              This will log you out from all devices and sessions. You'll need
              to log in again.
            </Text>
            <Button
              size="sm"
              color="red"
              variant="filled"
              onClick={handleLogoutAllDevices}
            >
              Logout All Devices
            </Button>
          </Alert>
        </div>

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
