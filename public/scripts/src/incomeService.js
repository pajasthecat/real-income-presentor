export const round = (number) => Math.round(number * 100) / 100;

export const getIncomeData = (income, data) => {
  const percentile = getPercentileData(income, data);

  const wage = getWageData(income, data);

  return {
    percentile,
    wage,
  };
};

const getPercentileData = (income, data) => {
  const { startYear, startIncome, todayIncome, todayYear } = income;

  const today = getPercentile(data, todayIncome, todayYear);
  const start = getPercentile(data, startIncome, startYear);

  return { today, start };
};

const getWageData = (income, data) => {
  const { startYear, startIncome, todayIncome, todayYear } = income;

  const { cpi: cpiStart } = data.find((d) => d.year === startYear);
  const { cpi: cpiToday } = data.find((d) => d.year === todayYear);

  const nominalWageIncrease = todayIncome - startIncome;

  const nominalWageIncreaseInPercent = nominalWageIncrease / startIncome;

  const index = cpiStart.averageCpi / cpiToday.averageCpi;
  const realWageIncrease = index * todayIncome - startIncome;

  const realWageIncreaseInPercent = realWageIncrease / startIncome;

  const salaryTodayInThenCurrency = todayIncome * index;
  const startSalaryInTodaysCurrency = startIncome / index;

  return {
    real: { realWageIncreaseInPercent, realWageIncrease },
    nominal: { nominalWageIncreaseInPercent, nominalWageIncrease },
    normalizedSalaries: {
      startSalaryInTodaysCurrency,
      salaryTodayInThenCurrency,
    },
  };
};

const getPercentile = (data, income, year) => {
  const { incomeDistribution } = data.find((d) => d.year === year);

  return getMatchingPercentile(incomeDistribution, income);
};

const getMatchingPercentile = (incomeDistribution, income) => {
  const keys = Object.keys(incomeDistribution ?? {});

  const matchedIncomeDist = keys
    ?.filter((key) => incomeDistribution[key] <= income)
    ?.slice(-1)[0];

  return matchedIncomeDist !== undefined ? matchedIncomeDist : keys[0];
};
