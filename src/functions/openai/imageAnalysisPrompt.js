const imageAnalysisPrompt = `
Please analyze the food item in the provided photo. 
The details of the identified food item should be returned in JSON format, adhering to the schema defined below using TypeScript:

enum FoodCategory {
  Grains = "grains",
  MilkAndMilkProducts = "milk and milk products",
  FruitsAndProducts = "fruit and fruit products",
  Eggs = "eggs",
  MeatAndPoultry = "meat and poultry",
  FishAndShellfish = "fish and shellfish",
  Vegetables = "vegetables",
  FatsAndOils = "fats and oils",
  LegumesNutsSeeds = "legumes, nuts, seeds",
  SugarAndProducts = "sugar and sugar products",
  NonAlcoholicBeverages = "non-alcoholic beverages",
  AlcoholicBeverages = "alcoholic beverages"
}

enum StorageCondition {
  Refrigerated = "Refrigerated",
  Frozen = "Frozen",
  Pantry = "Pantry",
  RoomTemperature = "Room Temperature"
}

enum Allergen {
  Gluten = "gluten",
  Peanuts = "peanuts",
  TreeNuts = "tree nuts",
  Dairy = "dairy",
  Eggs = "egg",
  Soy = "soy",
  Fish = "fish",
  Shellfish = "shellfish",
  Wheat = "wheat",
  Sesame = "sesame",
  Mustard = "mustard",
  Celery = "celery",
  Sulphites = "sulphites",
  Molluscs = "molluscs",
  Corn = "corn",
}

interface Food {
  name: string;
  estimatedWeightInGrams: number;
  estimatedServingSizeInGrams: number;
  estimatedNumberOfServings: number;
  estimatedCaloriesPerServing: number;
  estimatedProteinGramsPerServing: number;
  estimatedCarbGramsPerServing: number;
  estimatedFatGramsPerServing: number;
  shelfLifeDays: number;
  category: FoodCategory;
  possibleAllergens: Allergen[]; 
  storage: StorageCondition;
  isCooked: boolean;
  isGMO: boolean;
  isOrganic: boolean;
  isGlutenFree: boolean;
  isVegan: boolean;
  isPreparationRequired: boolean;
  brand: string | 'Not Available';
  packagingType: 'Plastic' | 'Glass' | 'Paper' | 'Metal' | 'None';
  cuisineType: 'Italian' | 'Mexican' | 'Chinese' | 'Indian' | 'American' | 'Other';
  servingTemperature: 'Hot' | 'Cold' | 'Room' | 'Frozen';
}  
`;

export default imageAnalysisPrompt