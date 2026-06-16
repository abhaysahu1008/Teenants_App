const ai = require("../services/gemini.service");

const analyzeRoommateCompatibility = async (applicantBio, tenantsBios) => {
  try {
    const prompt = `
You are a roommate compatibility expert.

Applicant Bio:
${applicantBio}

Current Roommates:
${tenantsBios.join("\n\n")}

Analyze lifestyle compatibility.

Return ONLY valid JSON.

Do not include markdown.
Do not include code blocks.
Do not include explanations.

{
  "score": 0,
  "pros": [],
  "conflicts": [],
  "summary": ""
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleanedResponse = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedResponse);

    if (typeof result.score !== "number") {
      throw new Error("Invalid AI response");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = analyzeRoommateCompatibility;
