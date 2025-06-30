import { FlutterWavePaymentSubmit, Survey } from "@/app/lib/type";
import { AxiosInstance } from "axios";

export const createSurvey = async (axios: AxiosInstance, data: Survey) => {
  try {
    const res = await axios.post(`/survey-mgt/survey`, data);
    return res.data;
  } catch (error: any) {
    const statusCode = error?.response?.status;
    let message = "";

    switch (statusCode) {
      case 400:
        message = "The Survey with this name already exist. Use another name";
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
        message = "The Survey with this name already exist. Use another name";
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
  page: string,
  businessUserId: string | null | undefined,
) => {
  try {
    let res: any = {};
    if (businessUserId) {
      res = await axios.get(
        `survey-mgt/survey?businessUserId=${businessUserId}&page=${page}&limit=10`
      );
    } else {
      res = await axios.get(
        `survey-mgt/super-admin-all-survey?page=${page}&limit=10`
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
