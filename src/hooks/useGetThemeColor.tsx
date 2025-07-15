import { useTheme } from "@/components/ui/theme/ThemeProvider";

export default function useGetThemeColor(dark?: string, light?: string) {
  const { colorScheme } = useTheme();

  const getColor = (dark2?: string, light2?: string) => {
    if (colorScheme === "dark") {
      return light2 || light || "#F5E8D8";
    }
    return dark2 || dark || "#1A1A1A";
  };

  const getIconColor = (dark2?: string, light2?: string) => {
    if (colorScheme === "dark") {
      return light2 || light || "#F5E8D8";
    }
    return dark2 || dark || "#1A1A1A";
  };

  return { getColor, getIconColor, theme: colorScheme };
}
