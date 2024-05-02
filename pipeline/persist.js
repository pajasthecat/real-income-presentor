import fs from "fs";

export const saveData = (data) => {
  fs.writeFileSync(
    "./public/scripts/data/pipeline-data.json",
    JSON.stringify(data)
  );
};
