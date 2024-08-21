import { collectData } from "./collect.js";
import { convertData } from "./convert.js";
import { saveData } from "./persist.js";

const { cpiData, wageDataSSYK, wageDataSSYK2012, wageDataSSYK2012an } =
  await collectData();

const convertedData = convertData(
  { wageDataSSYK, wageDataSSYK2012, wageDataSSYK2012an },
  cpiData
);

saveData(convertedData);
