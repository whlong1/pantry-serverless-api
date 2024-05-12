const imageAnalysisPrompt = `
Please analyze the food item in the provided photo. 
The details of the identified food item should be returned in JSON format, adhering to the schema defined below using TypeScript:

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
  estimatedCaloriesPerServing: number;
  estimatedProteinGramsPerServing: number;
  estimatedCarbGramsPerServing: number;
  estimatedFatGramsPerServing: number;
  possibleAllergens: Allergen[]; 
  isIngredient: boolean;
}  
`;

const expandedProperties = `
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

  interface Food {
    name: string;
    estimatedWeightInGrams: number;
    estimatedServingSizeInGrams: number;
    estimatedCaloriesPerServing: number;
    estimatedProteinGramsPerServing: number;
    estimatedCarbGramsPerServing: number;
    estimatedFatGramsPerServing: number;
    possibleAllergens: Allergen[]; 
    isIngredient: boolean;
    isGMO: boolean;
    isOrganic: boolean;
    isGlutenFree: boolean;
    isVegan: boolean;
    storage: StorageCondition;
    isPreparationRequired: boolean;
    category: FoodCategory;
    shelfLifeDays: number;
    isCooked: boolean;
    estimatedNumberOfServings: number;
    servingTemperature: 'Hot' | 'Cold' | 'Room' | 'Frozen';
    brand: string | 'Not Available';
    packagingType: 'Plastic' | 'Glass' | 'Paper' | 'Metal' | 'None';
    cuisineType: 'Italian' | 'Mexican' | 'Chinese' | 'Indian' | 'American' | 'Other';
  }  
`

export default imageAnalysisPrompt