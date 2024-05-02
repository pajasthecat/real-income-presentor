const getCpiData = async () => {
  const response = await fetch(
    "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101A/KPItotM",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: [
          {
            code: "ContentsCode",
            selection: {
              filter: "item",
              values: ["000004VU"],
            },
          },
        ],
        response: {
          format: "json",
        },
      }),
    }
  );

  return await response.json();
};

const getWageData = async () => {
  const response = await fetch(
    "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0110/AM0110A/LoneSpridSektorYrk4A",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: [
          {
            code: "Sektor",
            selection: {
              filter: "item",
              values: ["0"],
            },
          },
          {
            code: "Yrke2012",
            selection: {
              filter: "item",
              values: ["0000"],
            },
          },
          {
            code: "Kon",
            selection: {
              filter: "item",
              values: ["1+2"],
            },
          },
        ],
        response: {
          format: "json",
        },
      }),
    }
  );

  return await response.json();
};

const getWageData2 = async () => {
  const response = await fetch(
    "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0110/AM0110A/LoneSpridSektorYrk4",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: [
          {
            code: "Sektor",
            selection: {
              filter: "item",
              values: ["0"],
            },
          },
          {
            code: "Yrke",
            selection: {
              filter: "item",
              values: ["0000"],
            },
          },
          {
            code: "Kon",
            selection: {
              filter: "item",
              values: ["1+2"],
            },
          },
        ],
        response: {
          format: "json",
        },
      }),
    }
  );

  return await response.json();
};

export const collectData = async () => {
  console.log("Fetching data");
  const cpiData = await getCpiData();
  const wageData1 = await getWageData();
  const wageData2 = await getWageData2();

  return { cpiData, wageData1, wageData2 };
};
