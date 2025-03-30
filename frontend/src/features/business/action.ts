import axios from "axios";
import { AsyncErrHandler, commonHTTPConfig } from "../../lib/utils";
import { logout } from "../auth/action";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAllBusinesses = AsyncErrHandler(
  async (skip: number, limit: number, name?: string) => {
    const findByName = name && name?.length > 0 ? `&name=${name}` : "";
    const res = await axios.get(
      BACKEND_URL + `/api/v1/business?skip=${skip}&limit=${limit}${findByName}`
    );
    return res.data;
  }
);

const getBusinessByAi = AsyncErrHandler(async (prompt) => {
  if (prompt.length <= 0) {
    prompt = "none";
  }
  const res = await axios.get(
    BACKEND_URL + `/api/v1/business/search/ai?prompt=${prompt}`
  );
  return res.data;
});

const createBusiness = AsyncErrHandler(async (data) => {
  const res = await axios.post(
    BACKEND_URL + "/api/v1/business",
    data,
    commonHTTPConfig
  );
  return res.data;
});

const getMyBusiness = AsyncErrHandler(async () => {
  const res = await axios.get(
    BACKEND_URL + "/api/v1/business/personal",
    commonHTTPConfig
  );
  return res.data;
});

const getAnalytics = AsyncErrHandler(async () => {
  const res = await axios.get(
    BACKEND_URL + "/api/v1/analytics",
    commonHTTPConfig
  );
  return res.data;
});

const updateBusiness = AsyncErrHandler(async (data) => {
  const res = await axios.put(
    BACKEND_URL + "/api/v1/business",
    data,
    commonHTTPConfig
  );
  return res.data;
});

const deleteBusiness = AsyncErrHandler(async () => {
  const res = await axios.delete(
    BACKEND_URL + "/api/v1/business",
    commonHTTPConfig
  );
  await logout();
  return res.data;
});

const uploadImage = AsyncErrHandler(async (data: FormData) => {
  const res = await axios.post(BACKEND_URL + "/api/v1/image", data, {
    withCredentials: true,
  });

  return res.data;
});

const deleteImage = AsyncErrHandler(async () => {
   const res = await axios.delete(BACKEND_URL + "/api/v1/image",  commonHTTPConfig);
   return res.data;
})

const getAdvice = AsyncErrHandler(async (businessId) => {
  const res = await axios.get(
    BACKEND_URL + `/api/v1/business/advice/ai/${businessId}`,
    commonHTTPConfig
  );
  return res.data.result;
})

const getCustomers = AsyncErrHandler(async (intervalId) => {
  const res = await axios.get(
    BACKEND_URL + `/api/v1/business/arrivals/${intervalId}`,
    commonHTTPConfig
  );  
  return res.data;
});

export {
  getAllBusinesses,
  getBusinessByAi,
  createBusiness,
  getMyBusiness,
  getAnalytics,
  updateBusiness,
  deleteBusiness,
  uploadImage,
  deleteImage,
  getAdvice,
  getCustomers
};
