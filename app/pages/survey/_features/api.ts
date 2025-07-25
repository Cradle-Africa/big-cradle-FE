import { FlutterWavePaymentSubmit, Survey } from "@/app/lib/type";
import { AxiosInstance } from "axios";

export const createSurvey = async (axios: AxiosInstance, data: Survey) => {
  try {
    const res = await axios.post(`/survey-mgt/survey`, data);
    return res.data;
  } catch (error: any) {
    const statusCode = error?.response?.status;
    let message = error?.response?.message || error?.response?.data?.message || error?.message || "An unexpected error occurred";

    switch (statusCode) {
      case 400:
        if (Array.isArray(message)) {
          message = message.join('\n');
        }
        break;

      default:
        message = "An unexpected error occurred";
    }

    const customError = new Error(message);
    throw customError;
  }
};

export const updateSurvey = async (axios: AxiosInstance, data: Survey) => {
  try {
    const res = await axios.put(`/survey-mgt/survey`, data);
    return res.data;
  } catch (error: any) {
    const statusCode = error?.response?.status;
    let message = "";

    switch (statusCode) {
      case 400:
        if (Array.isArray(message)) {
          message = message.join('\n');
        }
        break;

      default:
        message = "An unexpected error occurred";
    }

    const customError = new Error(message);
    throw customError;
  }
};

export const fetchSurveys = async (
  axios: AxiosInstance,
  page: number,
  limit: number,
  businessUserId: string | null | undefined,
  search: string,
  startDate: string,
  endDate: string,
) => {
  try {
    let res: any = {};
    if (businessUserId) {
      res = await axios.get(
        `survey-mgt/survey?businessUserId=${businessUserId}&search=${search}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`
      );
    } else {
      res = await axios.get(
        `survey-mgt/super-admin-all-survey?search=${search}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`
      );
    }
    return res.data;
  } catch (error: any) {
    const statusCode = error?.response?.status;
    let message = "";

    switch (statusCode) {
      case 409:
        message = "Conflict";
        break;

      default:
        message = "An unexpected error occurred";
    }

    const customError = new Error(message);
    throw customError;
  }
};

export const fetchSurveysAnalytics = async (
  axios: AxiosInstance,
  businessUserId: string
) => {
  try {
    const res = await axios.get(
      `survey-mgt/survey-dashboard-analytics?businessUserId=${businessUserId}`
    );
    return res.data;
  } catch (error: any) {
    const statusCode = error?.response?.status;
    let message = "";

    switch (statusCode) {
      case 409:
        message = "Conflict";
        break;

      default:
        message = "An unexpected error occurred";
    }

    const customError = new Error(message);
    throw customError;
  }
};

export const fetchSurvey = async (axios: AxiosInstance, surveyId: string) => {
  try {
    const res = await axios.get(`/survey-mgt/survey/${surveyId}`);
    return res.data;
  } catch (error: any) {
    const statusCode = error?.response?.status;
    let message = "";

    switch (statusCode) {
      case 409:
        message = "Conflict";
        break;

      default:
        message = "An unexpected error occurred";
    }

    const customError = new Error(message);
    throw customError;
  }
};

export const verifySurvey = async (axios: AxiosInstance, txRef: string) => {
  try {
    const res = await axios.get(
      `/survey-mgt/verify-survey-payment?tx_ref=${txRef}`
    );
    return res.data;
  } finally {
  }
};

export const surveyPay = async (
  axios: AxiosInstance,
  data: FlutterWavePaymentSubmit
) => {
  try {
    const res = await axios.post(`/payments/flutterwave/initialize`, data);
    return res.data;
  } catch (error: any) {
    const statusCode = error?.response?.status;
    let message = "";

    switch (statusCode) {
      case 409:
        message = "Conflict";
        break;

      default:
        message = "An unexpected error occurred";
    }

    const customError = new Error(message);
    throw customError;
  }
};

export const fetchSurveyDataEntries = async (
  axios: AxiosInstance,
  queryParams?: {
    businessUserId?: string;
    page?: number;
    surveyId?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
) => {
  try {
    const params = {
      businessUserId: queryParams?.businessUserId,
      page: queryParams?.page || 1,
      surveyId: queryParams?.surveyId,
      limit: queryParams?.limit || 10,
      startDate: queryParams?.startDate,
      endDate: queryParams?.endDate
    };

    const res = await axios.get(`/survey-mgt/survey-entries`, { params });

    return res.data;
  } catch (error: any) {
    console.error("Error fetching survey entries:", error);
    return { data: [], pagination: {} };
  }
};


export const activateSurvey = async (axios: AxiosInstance, id: string) => {
    try {
        const response = await axios.put(`/survey-mgt/survey/${id}/activate`);
        return response.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.message;

        switch (statusCode) {
            case 400:
                message = error?.response?.data?.message || 'Invalid request';
                break;
            case 401:
                message = 'Unauthorized';
                break;
            case 404:
                message = 'Survey not found';
                break;
            default:
                message = 'An unexpected error occurred';
        }

        throw new Error(message);
    }
};


export const suspendSurvey = async (axios: AxiosInstance, id: string) => {
    try {
        const response = await axios.put(`/survey-mgt/survey/${id}/suspend`);
        return response.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.message;

        switch (statusCode) {
            case 400:
                message = error?.response?.data?.message || 'Invalid request';
                break;
            case 401:
                message = 'Unauthorized';
                break;
            case 404:
                message = 'Survey not found';
                break;
            default:
                message = 'An unexpected error occurred';
        }

        throw new Error(message);
    }
};


export const analyseSurveyData = async (
  axios: AxiosInstance,
  surveyId: string,
) => {
  try {
    const url = `/survey-mgt/survey-entries-analytics?surveyId=${surveyId}`;

    const res = await axios.get(url);
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "An unexpected error occurred";

    return Promise.reject({ message });
  }
};