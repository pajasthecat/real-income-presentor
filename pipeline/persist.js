import fs from "fs";

export const saveData = (data) => {
  fs.writeFileSync("./public/data/data1.json", JSON.stringify(data));
};
