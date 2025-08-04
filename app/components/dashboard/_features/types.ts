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
  totalDataPoints: string;
  totalFields: string;
  totalEntries: string;
};

export type TopSurveyType = {
  responseCount: number;
  surveyId: string;
  surveyName: string;
};

type DataPipelineEntry = {
  count: number;
  dataPointId: string;
  dataPointName: string;
};

export type TopPipelineDataResponse = {
  success: boolean;
  message: string;
  data: DataPipelineEntry[];
};

export interface EntryVolumeItem {
	count: number;
	dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
	hourOfDay: number; // 0–23
}

export interface EntryVolumeResponse {
	success: boolean;
	message: string;
	data: EntryVolumeItem[];
}
