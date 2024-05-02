import fs from "fs";

export const saveData = (data) => {
  const path = "./public/scripts/data/pipeline-data.json";
  console.log(`Writing data to path ${path}`);
  fs.writeFileSync(path, JSON.stringify(data));
};
