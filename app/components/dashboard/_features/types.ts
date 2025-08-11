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

export type SuperAdminSummaryResponse = {
  totalBusinessUsers: number;
  totalAdminUsers: number;
  totalResearchers: number;
  totalTransactions: number;
  totalSurveys: number;
  totalDataPoints: number;
  totalCredit: number;
  totalDebit: number;
};

export type SurveySummaryResponse = {
  totalSurveys: string;
  completedSurveys: string;
  ongoingSurveys: string;
}

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type CreatedDataPipelines = {
  count: number;
} & (
    | { date: string }      // daily
    | { weekly: string }    // weekly
    | { monthly: string }   // monthly
    | { yearly: string }    // yearly
  );

export type CreatedSurveys = {
  count: number;
} & (
    | { date: string }      // daily
    | { weekly: string }    // weekly
    | { monthly: string }   // monthly
    | { yearly: string }    // yearly
  );


export type TopResearcherType = {
  entryCount: number;
  researcherId: string;
  researcherFirstName: string;
  researcherLastName: string;
};
  
export type topLocationType = {
  entryCount: number,
  longitude: number,
  latitude: number,
  country: string,
  state: string,
  city: string
};

export type TopBusinessType = {
  entryCount: number;
  researcherId: string;
  businessFirstName: string;
  businessLastName: string;
}
