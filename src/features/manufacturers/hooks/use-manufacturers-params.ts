import { useQueryStates } from "nuqs";
import { manufacturersParams } from "../params";

export const useManufacturersParams = () => {
   return useQueryStates(manufacturersParams);
};