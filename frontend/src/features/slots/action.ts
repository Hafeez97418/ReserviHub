import  Axios  from "axios";
import { AsyncErrHandler, commonHTTPConfig } from "../../lib/utils";
import store from "../../app/store";
import { addSlot, removeSlot, replaceSlots } from "./slice";
import { Interval } from "../../lib/types";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAllSlots = AsyncErrHandler(async () => {
  const businessId = sessionStorage.getItem("businessId");
  const res = await Axios.get(BACKEND_URL + "/api/v1/appointment-interval/" + businessId);
  store.dispatch(replaceSlots(res.data.data));
  return res.data;
});

const getSlotsForUsers = AsyncErrHandler(async (businessId:string) => {
   const res = await Axios.get(
     BACKEND_URL + "/api/v1/appointment-interval/" + businessId
  );
  console.log(res.data);
  
   store.dispatch(replaceSlots(res.data.data));
   return res.data;
})

const createInterval = AsyncErrHandler(async (data: Partial<Interval>) => {
    const res = await Axios.post(
        BACKEND_URL + "/api/v1/appointment-interval/",
        data,
        commonHTTPConfig
    );
    store.dispatch(addSlot(res.data.result));
    return res.data;
});

const deleteInterval = AsyncErrHandler(async (id:string) => {
  const res = await Axios.delete(
    BACKEND_URL + "/api/v1/appointment-interval/" + id,
    commonHTTPConfig
  );
  store.dispatch(removeSlot(id));
  return res.data;
});

export { getAllSlots , createInterval , deleteInterval , getSlotsForUsers};