export type SentimentResponse = {
  success: boolean;
  message: string;
  data: {
    positive: number;
    neutral: number;
    negative: number;
  };
};

export type PiItem = { name: string; value: number; color: string };

export type EntryStat = {
  _id: string | null;
  responseCount: number;
  fieldId: string | null;
}

export type  TopSurveyType = {
  responseCount: number;
  surveyId: string;
  surveyName: string;
};
