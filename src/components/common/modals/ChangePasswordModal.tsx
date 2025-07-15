"use client";

import {
  Modal,
  PasswordInput,
  Button,
  Group,
  Stack,
  Alert,
} from "@mantine/core";
import { FiAlertCircle, FiCheck, FiLock } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordModal({
  opened,
  onClose,
}: ChangePasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<PasswordFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<PasswordFormData> = {};

    if (formData.currentPassword.length < 8) {
      newErrors.currentPassword = "Current password is required";
    }

    if (formData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.patch("/api/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Change Password"
      size="md"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Alert
            icon={<FiAlertCircle size={16} />}
            title="Security Information"
            color="orange"
            variant="light"
          >
            Choose a strong password that you haven't used elsewhere. Your
            password should be at least 8 characters long.
          </Alert>

          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
            required
            value={formData.currentPassword}
            onChange={(e) =>
              handleInputChange("currentPassword", e.target.value)
            }
            error={errors.currentPassword}
            leftSection={<FiLock size={16} />}
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            required
            value={formData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            error={errors.newPassword}
            leftSection={<FiLock size={16} />}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            error={errors.confirmPassword}
            leftSection={<FiLock size={16} />}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              leftSection={<FiCheck size={16} />}
              color="orange"
            >
              Change Password
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
