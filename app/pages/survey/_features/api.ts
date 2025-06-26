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

export const fetchSurveys = async (
  axios: AxiosInstance,
  businessUserId: string,
  page: number
) => {
  try {
    const res = await axios.get(
      `survey-mgt/survey?businessUserId=${businessUserId}&page=${page}&limit=20`
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
  } catch (error: any) {
    const statusCode = error?.response?.status;
    let message = "";
    const customError = new Error(message);
    throw customError;
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
