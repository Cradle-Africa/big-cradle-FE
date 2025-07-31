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

export type FlywheelSummaryResponse = {
  totalDataPoint: string;
  completedDataPoint: string;
  ongoingDataPoint: string;
};

export type TopSurveyType = {
  responseCount: number;
  surveyId: string;
  surveyName: string;
};
