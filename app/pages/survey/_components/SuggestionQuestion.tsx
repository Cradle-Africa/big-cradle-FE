import axios from "@/app/lib/axios";
import { CountryAndCity, DataPointForm } from "@/app/lib/type";
import { toCamelCase } from "@/app/utils/caseFormat";
import toast from "react-hot-toast";

export const fetchSuggestedQuestions = async (
  surveyName: string,
  surveyDescription: string,
  sector: string,
  surveyGoal: string,
  startDate: string,
  endDate: string,
  locationAndDemographic: string[],
  gender: string[],
  countriesAndCities: CountryAndCity[],
  setForm: React.Dispatch<React.SetStateAction<DataPointForm>>,
) => {
  toast.loading("Generating suggested questions...");
  try {
    const suggestionQuestionsPayload = {
      surveyName,
      sector,
      startDate,
      endDate,
      surveyGoal,
      surveyDescription,
      surveyLocations: countriesAndCities.map((v) => ({
        country: v.country,
        state: v.state,
        city: v.city,
      })),
      ageDemographics: locationAndDemographic,
      gender,
    };

    const { data } = await axios.post(
      "/survey-mgt/generate-survey-questions",
      suggestionQuestionsPayload
    );

    if (Array.isArray(data?.questions)) {
      setForm((prev) => {
        const existingKeys = new Set(prev.field.map((f) => f.key));

        const formatted = data.questions
          .map((q: any) => ({
            label: (q.label || "").replace(/\\?"?,?$/, ""), // clean up messy trailing characters
            key: toCamelCase(q.label || "question"),
            type: q.type || "text",
            required: q.required ?? false,
            options: q.options || [],
          }))
          .filter((q: any) => !existingKeys.has(q.key)); // prevent duplicates field

        if (formatted.length > 0) {
          toast.dismiss();
          toast.success(`${formatted.length} new suggested question(s) added.`);
          return {
            ...prev,
            field: [...prev.field, ...formatted],
          };
        } else {
          toast.dismiss();
          toast("No new unique questions to add.", { icon: "ℹ️" });
          return prev;
        }
      });
    } else {
      toast.dismiss();
      toast.error("Unexpected format of suggested questions");
    }
  } catch (error: any) {
    toast.dismiss();
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch suggested questions";
    console.log(message);
    toast.error(message);
  }
};
