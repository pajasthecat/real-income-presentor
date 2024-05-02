const mapWageData = (wageDate) =>
  wageDate.data.map(({ key, values }) => {
    const valuesInt = values.map((v) => parseInt(v));
    const keysInt = key.map((k) => parseInt(k));
    const [_, per50, per10, per25, per75, per90] = valuesInt;
    return {
      year: keysInt[2],
      per10,
      per25,
      per50,
      per75,
      per90,
    };
  });

const mapCpiData = (cpiData) =>
  cpiData.data
    .map(({ key, values }) => {
      const [cpi] = values.map((v) => parseInt(v));
      const [year, month] = key[0].split("M").map((_) => parseInt(_));

      return { cpi, year, month };
    })
    .reduce((result, item) => {
      (result[item.year] = result[item.year] || []).push(item);
      return result;
    }, {});

const groupCpiData = (cpiResult) =>
  Object.keys(cpiResult)
    .map((key) => {
      const rest = cpiResult[key];
      const cpiPerMonth = rest.map((_) => ({
        cpi: _.cpi,
        month: _.month,
      }));
      return { year: parseInt(key), cpiPerMonth };
    })
    .map(({ year, cpiPerMonth }) => {
      const averageCpi =
        cpiPerMonth.map((m) => m.cpi).reduce((a, b) => a + b, 0) /
        cpiPerMonth.length;

      return { year, cpiPerMonth, averageCpi };
    });

const mergeData = (groupedCpiResult, wageData) =>
  groupedCpiResult.map((cpiResult) => {
    const { year, ...cpiRest } = cpiResult;

    const match = wageData.find((wage) => wage.year === year);

    if (match) {
      const { year: yearIncome, ...incomeDistribution } = match;

      return { year, incomeDistribution, cpi: cpiRest };
    }
    return { year, incomeDistribution: null, cpi: cpiRest };
  });

export const convertData = (wageSpread1, wageSpread2, cpiData) => {
  console.log("Mapping data");

  const wageData = mapWageData(wageSpread1)
    .concat(mapWageData(wageSpread2))
    .sort((first, second) => first.year - second.year);

  const mappedCpiData = mapCpiData(cpiData);
  const groupedCpiResult = groupCpiData(mappedCpiData);

  return mergeData(groupedCpiResult, wageData);
};
