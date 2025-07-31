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