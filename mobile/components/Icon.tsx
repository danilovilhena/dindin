import { icons } from "lucide-react-native";

interface Props {
  name: keyof typeof icons;
  color: string;
  size: number;
}

const Icon = ({ name, color, size }: Props) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} size={size} />;
};

export default Icon;
