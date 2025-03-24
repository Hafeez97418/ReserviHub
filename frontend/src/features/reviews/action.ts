import axios from "axios";
import { AsyncErrHandler, commonHTTPConfig } from "../../lib/utils";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const createMyReview = AsyncErrHandler(
  async (
    businessId: string,
    data: { rating: number; review: string }
  ): Promise<any | undefined> => {
    console.log(data);
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/review/${businessId}`,
      data,
      commonHTTPConfig
    );
    return res.data;
  }
);

const getMyReview = AsyncErrHandler(
  async (businessId: string, all: boolean): Promise<any[] | undefined> => {
    const url = all
      ? `${BACKEND_URL}/api/v1/review/all/${businessId}`
      : `${BACKEND_URL}/api/v1/review/${businessId}`;
    const res = await axios.get(url, commonHTTPConfig);
    console.log(`${BACKEND_URL}/api/v1/review/${businessId}`);
    return res.data.reviews;
  }
);

const deleteMyReview = AsyncErrHandler(
  async (businessId: string): Promise<any | undefined> => {
    const res = await axios.delete(
      `${BACKEND_URL}/api/v1/review/${businessId}`,
      commonHTTPConfig
    );
    return res.data;
  }
);

const updateMyReview = AsyncErrHandler(
  async (
    businessId: string,
    data: { rating: number; review: string }
  ): Promise<any[] | undefined> => {
    const res = await axios.put(
      `${BACKEND_URL}/api/v1/review/${businessId}`,
      data,
      commonHTTPConfig
    );
    return res.data.success;
  }
);
export { getMyReview, deleteMyReview, updateMyReview, createMyReview };
