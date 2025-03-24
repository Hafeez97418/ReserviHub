import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAllBusinesses = async (skip: number, limit: number, name?: string) => {
  const findByName = name && name?.length > 0 ? `&name=${name}` : "";
  try {
    const res = await axios.get(
      BACKEND_URL + `/api/v1/business?skip=${skip}&limit=${limit}${findByName}`
    );    
    return res.data;
  } catch (error) {
    return error;
  }
};

const getBusinessByAi = async () => {
  
}

export default getAllBusinesses;
