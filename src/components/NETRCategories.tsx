export const PodItemCategories = [
  { key: "1", value: "Baking" },
  { key: "2", value: "Canned" },
  { key: "3", value: "Condiment" },
  { key: "4", value: "Drink" },
  { key: "5", value: "Frozen" },
  { key: "6", value: "Fresh Food" },
  { key: "7", value: "Prepared Food" },
  { key: "8", value: "Produce" },
  { key: "9", value: "Snack" },
  { key: "10", value: "Spice/Herb" },
  { key: "11", value: "Other" },
];

export const PodItemUnits = [
  // { key: "0", value: "", abbrv: "" },
  { key: "1", value: "Pound (lbs.)", abbrv: "lbs" },
  { key: "2", value: "Ounce (oz.)", abbrv: "oz" },
  { key: "3", value: "Milliliter (ml)", abbrv: "ml" },
  { key: "4", value: "Liter (L)", abbrv: "L" },
  { key: "5", value: "Gram (g)", abbrv: "g" },
  { key: "6", value: "Milligram (mg)", abbrv: "mg" },
  { key: "7", value: "Kilogram (kg)", abbrv: "kg" },
  { key: "8", value: "Gallon", abbrv: "gal" },
  { key: "9", value: "Quart (qt)", abbrv: "qt" },
  { key: "10", value: "Pint (pt)", abbrv: "pt" },
  { key: "11", value: "Fluid Ounce (fl. oz)", abbrv: "fl. oz" },
  { key: "12", value: "Cup", abbrv: "c" },
  { key: "13", value: "Container", abbrv: "container" },
  { key: "14", value: "Other", abbrv: "" },
];

export function getUnitByValue(value: string) {
  const selectedUnit = PodItemUnits.find((item) => item.value === value);
  // If no color is found, default to a color or log an error
  if (!selectedUnit) {
    console.error(`No unit found for value: ${value}`);
    return ""; // Default to other or any other fallback color
  }
  return selectedUnit.abbrv;
}
