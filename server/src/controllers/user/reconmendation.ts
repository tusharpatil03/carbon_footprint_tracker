import { Request, Response } from "express";
import { getCarbonRecommendations } from "../../services/recomendation";

export const recomendation = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const recommendations = await getCarbonRecommendations(userData);

        res.json({ recommendations });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
}