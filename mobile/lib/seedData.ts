import { databaseService } from "./database";
import { CreateCategoryInput } from "@/types/category";

const SAMPLE_CATEGORIES: CreateCategoryInput[] = [
  {
    name: "Alimentação",
    icon: "Utensils",
    color: "red",
    type: "gasto",
  },
  {
    name: "Transporte",
    icon: "Car",
    color: "blue",
    type: "gasto",
  },
  {
    name: "Casa",
    icon: "House",
    color: "green",
    type: "gasto",
  },
  {
    name: "Saúde",
    icon: "Heart",
    color: "pink",
    type: "gasto",
  },
  {
    name: "Lazer",
    icon: "Gamepad2",
    color: "purple",
    type: "gasto",
  },
];

export async function seedCategories() {
  try {
    // Check if categories already exist
    const existingCategories = await databaseService.getCategories();

    if (existingCategories.length > 0) {
      return;
    }

    // Create sample categories
    for (const categoryData of SAMPLE_CATEGORIES) {
      await databaseService.createCategory(categoryData);
    }
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}
