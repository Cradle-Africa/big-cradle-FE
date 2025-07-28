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
