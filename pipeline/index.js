import { writeFileSync } from "fs";

const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");

const data = await response.json();

console.log({ data });

writeFileSync("public/scripts/data/pipeline-data.json", JSON.stringify(data));
