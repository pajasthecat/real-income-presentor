import { collectData } from "./collect.js";
import { convertData } from "./convert.js";
import { saveData } from "./persist.js";

const { cpiData, wageData1, wageData2 } = await collectData();

const convertedData = convertData(wageData1, wageData2, cpiData);

saveData(convertedData);
