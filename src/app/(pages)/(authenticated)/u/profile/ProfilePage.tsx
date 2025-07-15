"use client";

import { useUser } from "@/hooks/useUser";
import {
  Avatar,
  Badge,
  Card,
  Group,
  Text,
  Stack,
  Button,
  Grid,
  ActionIcon,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  FiEdit,
  FiMail,
  FiUser,
  FiCalendar,
  FiShield,
  FiDollarSign,
  FiTarget,
  FiLock,
  FiSettings,
} from "react-icons/fi";
import React from "react";
import EditProfileModal from "@/components/common/modals/EditProfileModal";
import ChangePasswordModal from "@/components/common/modals/ChangePasswordModal";
import AccountSettingsModal from "@/components/common/modals/AccountSettingsModal";

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  const [
    editProfileOpened,
    { open: openEditProfile, close: closeEditProfile },
  ] = useDisclosure(false);
  const [
    changePasswordOpened,
    { open: openChangePassword, close: closeChangePassword },
  ] = useDisclosure(false);
  const [
    accountSettingsOpened,
    { open: openAccountSettings, close: closeAccountSettings },
  ] = useDisclosure(false);

  if (isLoading) {
    return (
      <Container size="md" className="py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container size="md" className="py-8">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Text ta="center" c="dimmed" size="lg">
            User not found or not authenticated
          </Text>
        </Card>
      </Container>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "purple";
      case "merchant":
        return "green";
      case "user":
        return "blue";
      default:
        return "gray";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Container size="md" className="py-8">
      <Stack gap="xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <Text c="dimmed" size="lg">
            Manage your account information and settings
          </Text>
        </div>

        {/* Main Profile Card */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Group>
              <Avatar
                src={user?.picture || undefined}
                size={80}
                radius="md"
                color={getRoleBadgeColor(user.role)}
              >
                {user.name?.charAt(0)?.toUpperCase() ||
                  user.email?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div>
                <Text size="xl" fw={600} c="dark">
                  {user.name || "User"}
                </Text>
                <Text c="dimmed" size="sm">
                  {user.email}
                </Text>
                <Badge
                  color={getRoleBadgeColor(user.role)}
                  variant="light"
                  size="sm"
                  mt={4}
                >
                  {user.role?.toUpperCase()}
                </Badge>
              </div>
            </Group>
            <ActionIcon variant="light" size="lg" radius="md">
              <FiEdit size={20} />
            </ActionIcon>
          </Group>
        </Card>

        {/* Information Grid */}
        <Grid>
          {/* Personal Information */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group mb="md">
                <FiUser size={20} className="text-blue-600" />
                <Text fw={600} size="lg">
                  Personal Information
                </Text>
              </Group>
              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed" mb={2}>
                    Full Name
                  </Text>
                  <Text size="md">{user.name || "Not provided"}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb={2}>
                    Email Address
                  </Text>
                  <Group gap="xs">
                    <FiMail size={16} className="text-gray-500" />
                    <Text size="md">{user.email}</Text>
                  </Group>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Account Status */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group mb="md">
                <FiShield size={20} className="text-green-600" />
                <Text fw={600} size="lg">
                  Account Status
                </Text>
              </Group>

              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed" mb={2}>
                    Verification Status
                  </Text>
                  <Badge
                    color={user.isVerified ? "green" : "red"}
                    variant="light"
                  >
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb={2}>
                    Account Created
                  </Text>
                  <Group gap="xs">
                    <FiCalendar size={16} className="text-gray-500" />
                    <Text size="md">{formatDate(user.createdAt!)}</Text>
                  </Group>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb={2}>
                    Last Login
                  </Text>
                  <Text size="md">
                    {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                  </Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb={2}>
                    Account Role
                  </Text>
                  <Badge color={getRoleBadgeColor(user.role)} variant="filled">
                    {user.role?.toUpperCase()}
                  </Badge>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Financial Information */}
          {(user.role === "merchant" || user.role === "admin") && (
            <Grid.Col span={12}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group mb="md">
                  <FiDollarSign size={20} className="text-green-600" />
                  <Text fw={600} size="lg">
                    Financial Overview
                  </Text>
                </Group>
              </Card>
            </Grid.Col>
          )}
        </Grid>

        {/* Action Buttons */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="center" gap="md">
            <Button
              variant="filled"
              size="md"
              leftSection={<FiEdit size={16} />}
              onClick={openEditProfile}
            >
              Edit Profile
            </Button>
            <Button
              variant="light"
              size="md"
              color="orange"
              leftSection={<FiLock size={16} />}
              onClick={openChangePassword}
            >
              Change Password
            </Button>
            <Button
              variant="light"
              size="md"
              color="red"
              leftSection={<FiSettings size={16} />}
              onClick={openAccountSettings}
            >
              Account Settings
            </Button>
          </Group>
        </Card>

        {/* Modals */}
        <EditProfileModal
          opened={editProfileOpened}
          onClose={closeEditProfile}
        />
        <ChangePasswordModal
          opened={changePasswordOpened}
          onClose={closeChangePassword}
        />
        <AccountSettingsModal
          opened={accountSettingsOpened}
          onClose={closeAccountSettings}
        />
      </Stack>
    </Container>
  );
}
