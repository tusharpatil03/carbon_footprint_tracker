import model from "../utils/geminiClient";

export interface CarbonFootprintData {
    userId: string;
    energy: {
        electricity_kwh_per_month: number;
        renewable_percentage: number;
        natural_gas_m3_per_month: number;
    };
    transportation: {
        car: {
            fuel_type: "petrol" | "diesel" | "electric";
            km_per_week: number;
            fuel_efficiency_km_per_l: number;
        };
        public_transport: {
            bus_km_per_week: number;
            train_km_per_week: number;
        };
        flights: {
            short_haul_per_year: number;
            long_haul_per_year: number;
        };
    };
    food: {
        meat_servings_per_week: number;
        dairy_servings_per_week: number;
        plant_based_meals_per_week: number;
        food_waste_kg_per_month: number;
    };
    lifestyle: {
        shopping_spend_per_month_usd: number;
        clothes_new_per_year: number;
        electronics_purchased_per_year: number;
        recycling_rate_percentage: number;
    };
    location: {
        country: string;
        city: string;
    };
}

const userData:CarbonFootprintData = {
    "userId": "u12345",
    "energy": {
        "electricity_kwh_per_month": 350,
        "renewable_percentage": 20,
        "natural_gas_m3_per_month": 25
    },
    "transportation": {
        "car": {
            "fuel_type": "petrol",
            "km_per_week": 120,
            "fuel_efficiency_km_per_l": 14
        },
        "public_transport": {
            "bus_km_per_week": 40,
            "train_km_per_week": 15
        },
        "flights": {
            "short_haul_per_year": 3,
            "long_haul_per_year": 1
        }
    },
    "food": {
        "meat_servings_per_week": 8,
        "dairy_servings_per_week": 6,
        "plant_based_meals_per_week": 5,
        "food_waste_kg_per_month": 2
    },
    "lifestyle": {
        "shopping_spend_per_month_usd": 200,
        "clothes_new_per_year": 12,
        "electronics_purchased_per_year": 2,
        "recycling_rate_percentage": 50
    },
    "location": {
        "country": "India",
        "city": "Pune"
    }
}


export async function getCarbonRecommendations(userData: CarbonFootprintData) {
    const prompt = `
  The user has the following carbon footprint data:
  ${JSON.stringify(userData, null, 2)}

  Based on this, suggest **specific and actionable steps** to reduce carbon emissions.
  Focus on lifestyle changes, energy use, travel, and food choices.
  Keep recommendations practical and easy to follow.
  `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}


// getCarbonRecommendations(userData).then((res)=> {
//     console.log(res);
// })