"use client";

import { useUser } from "@/hooks/useUser";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Stack,
  Textarea,
  Alert,
} from "@mantine/core";
import { FiAlertCircle, FiCheck } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface EditProfileModalProps {
  opened: boolean;
  onClose: () => void;
}

interface ProfileFormData {
  name: string;
  phoneNumber: string;
  country: string;
  timezone: string;
  bio: string; 
}

export default function EditProfileModal({
  opened,
  onClose,
}: EditProfileModalProps) {
  const { user, refetchUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    phoneNumber: "",
    country: "",
    timezone: "",
    bio: "", 
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  useEffect(() => {
    if (user && opened) {
      setFormData({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        country: user.country || "",
        timezone: user.timezone || "",
        bio: user.bio || "", 
      });
      setErrors({});
    }
  }, [user, opened]);

  const validateForm = () => {
    const newErrors: Partial<ProfileFormData> = {};

    if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setIsLoading(true);
    try {
      const updateData = {
        name: formData.name,
        phoneNumber: formData.phoneNumber || undefined,
        country: formData.country || undefined,
        timezone: formData.timezone || undefined,
        bio: formData.bio || undefined,
   
      };

      const response = await axios.patch("/api/user/profile", updateData);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        await refetchUser();
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Profile"
      size="md"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Alert
            icon={<FiAlertCircle size={16} />}
            title="Profile Information"
            color="blue"
            variant="light"
          >
            Update your personal information below. Your email and role cannot
            be changed.
          </Alert>

          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
          />

          <TextInput
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            error={errors.phoneNumber}
          />

          <TextInput
            label="Country"
            placeholder="Enter your country"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
          />

          <TextInput
            label="Timezone"
            placeholder="e.g., America/New_York"
            value={formData.timezone}
            onChange={(e) => handleInputChange("timezone", e.target.value)}
          />

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            rows={3}
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              leftSection={<FiCheck size={16} />}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
