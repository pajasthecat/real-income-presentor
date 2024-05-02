import { collectData } from "./collect.js";
import { convertData } from "./convert.js";
import { saveData } from "./persist.js";

const { cpiData, wageData1, wageData2 } = await collectData();

const convertedData = convertData(wageData1, wageData2, cpiData);

saveData(convertedData);
// import { writeFileSync } from "fs";

// const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");

// const data = await response.json();

// console.log({ data });

// writeFileSync("public/scripts/data/pipeline-data.json", JSON.stringify(data));
