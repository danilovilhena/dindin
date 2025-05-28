import React, { forwardRef } from "react";
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

interface InputProps extends TextInputProps {
  // Any additional props can go here
}

export const Input = forwardRef<RNTextInput, InputProps>((props, ref) => {
  return <RNTextInput ref={ref} style={[styles.input, props.style]} placeholderTextColor={colors.dark.textSecondary} {...props} />;
});

Input.displayName = "Input";

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "DMSans",
    fontWeight: "400",
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
});
