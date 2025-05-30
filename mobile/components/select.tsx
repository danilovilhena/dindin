import Icon from "@/components/Icon";
import { colors } from "@/constants/Colors";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export const Select = ({
  className,
  value,
  onValueChange,
  options,
  placeholder,
  renderOption,
  maxHeight,
}: {
  className?: string;
  value: string | null;
  onValueChange: (value: string) => void;
  options: Array<{ id: string; name: string; icon?: string; color?: string }>;
  placeholder: string;
  renderOption?: (option: any) => React.ReactNode;
  maxHeight?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.id === value);

  const closeSelect = () => setIsOpen(false);

  return (
    <View className="relative">
      <TouchableOpacity
        className={`flex-row items-center justify-between p-4 bg-neutral-800 rounded-xl border border-neutral-700 ${className}`}
        onPress={() => setIsOpen(!isOpen)}
      >
        <View className="flex-row items-center flex-1">
          {selectedOption ? (
            renderOption ? (
              renderOption(selectedOption)
            ) : (
              <>
                {selectedOption.icon && (
                  <View
                    className="w-8 h-8 rounded-lg justify-center items-center mr-3"
                    style={{
                      backgroundColor: selectedOption.color || colors.primary,
                    }}
                  >
                    <Icon name={selectedOption.icon as any} size={16} color={colors.white} />
                  </View>
                )}
                <Text className="text-white text-lg font-medium">{selectedOption.name}</Text>
              </>
            )
          ) : (
            <Text className="text-neutral-400 text-base">{placeholder}</Text>
          )}
        </View>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={20} color={colors.dark.textSecondary} />
      </TouchableOpacity>

      {isOpen && (
        <>
          <TouchableWithoutFeedback onPress={closeSelect}>
            <View className="absolute inset-0 z-40" style={{ top: -1000, bottom: -1000, left: -1000, right: -1000 }} />
          </TouchableWithoutFeedback>
          <View className="absolute top-full left-0 right-0 z-50 mt-2 bg-neutral-800 rounded-xl border border-neutral-700 shadow-xl">
            <ScrollView style={maxHeight ? { maxHeight } : undefined}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  className="flex-row items-center p-4 border-b border-neutral-700 last:border-b-0"
                  onPress={() => {
                    onValueChange(option.id);
                    closeSelect();
                  }}
                >
                  {renderOption ? (
                    renderOption(option)
                  ) : (
                    <>
                      {option.icon && (
                        <View
                          className="w-8 h-8 rounded-lg justify-center items-center mr-3"
                          style={{
                            backgroundColor: option.color || colors.primary,
                          }}
                        >
                          <Icon name={option.icon as any} size={16} color={colors.white} />
                        </View>
                      )}
                      <Text className="text-white text-base font-medium">{option.name}</Text>
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};
