import { useQueryStates } from "nuqs";
import { modelsParams } from "../params";

export const useModelsParams = () => {
   return useQueryStates(modelsParams);
};