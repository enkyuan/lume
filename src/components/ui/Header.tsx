// TODO: add pressable (with icon) & textProps

import { Pressable, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type HeaderProps = {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "fxd" | "exp";
};

export function Header({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ButtonProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Pressable
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "fxd" ? styles.fxd : undefined,
        type === "exp" ? styles.exp : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  fxd: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  exp: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
