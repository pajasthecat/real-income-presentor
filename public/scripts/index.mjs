const data = await (await fetch("../scripts/data/pipeline-data.json")).json();

import {
  getIncomeData,
  round,
  formatAndRoundCurrency,
} from "../scripts/src/incomeService.mjs";

const setTableHeaders = (startYear) => {
  document.getElementById(
    "incomeDistStart"
  ).innerHTML = `Income distribution in ${startYear}`;

  document.getElementById(
    "startSalaryInTodaysCurrencyLabel"
  ).innerHTML = `Equivalent to your start salary in todays SEK.`;

  document.getElementById(
    "todayWageInThenCurrencyLabel"
  ).innerHTML = `Your salary today calculated in ${startYear} SEK`;

  document.getElementById(
    "startSalaryLabel"
  ).innerHTML = `Monthly wage in ${startYear} SEK:`;
};

const setStartValues = () => {
  const startYear = document.getElementById("startYear");

  setTableHeaders(startYear.value);
};

const validateInput = (startIncome, todayIncome) => {
  if (isNaN(startIncome)) {
    document.getElementById("startSalaryLabel").innerHTML =
      "Your monthly salary when starting working: (Please provide a number)";
    return;
  }

  if (isNaN(todayIncome)) {
    document.getElementById("currentSalaryLabel").innerHTML =
      "Your monthly salary today: (Please provide a number)";
    return;
  }

  document.getElementById("currentSalaryLabel").innerHTML =
    "Monthly salary now:";

  document.getElementById("startSalaryLabel").innerHTML =
    "Monthly salary when starting working:";
};

const setTableValues = (incomeData) => {
  const {
    percentile: { start, today },
    wage: {
      nominal: { nominalWageIncrease, nominalWageIncreaseInPercent },
      real: { realWageIncrease, realWageIncreaseInPercent },
      normalizedSalaries: {
        startSalaryInTodaysCurrency,
        salaryTodayInThenCurrency,
      },
    },
  } = incomeData;

  document.getElementById("realWagePer").innerHTML = `${
    100 * round(realWageIncreaseInPercent)
  } %`;

  document.getElementById("realWage").innerHTML = `${formatAndRoundCurrency(
    realWageIncrease
  )} kr`;

  document.getElementById("nominalWagePer").innerHTML = `${round(
    100 * nominalWageIncreaseInPercent
  )} %`;

  document.getElementById("nominalWage").innerHTML = `${formatAndRoundCurrency(
    nominalWageIncrease
  )} kr`;

  document.getElementById(
    "startSalaryInTodaysCurrency"
  ).innerHTML = `${formatAndRoundCurrency(startSalaryInTodaysCurrency)} kr`;

  document.getElementById(
    "todayWageInThenCurrency"
  ).innerHTML = `${formatAndRoundCurrency(salaryTodayInThenCurrency)} kr`;

  if (start) {
    const oldStart = localStorage.getItem("start");
    localStorage.setItem("start", start);
    if (oldStart) document.getElementById(oldStart).innerHTML = "";
    document.getElementById(start).innerHTML = "You were here";
  }
  if (today) {
    const oldToday = localStorage.getItem("today");
    localStorage.setItem("today", today);
    if (oldToday) document.getElementById(`${oldToday}_now`).innerHTML = "";
    document.getElementById(`${today}_now`).innerHTML = "You are here";
  }
};

const form = document.querySelector("#dataForm");

form.addEventListener("submit", (event) => {
  const startYearInput = document.getElementById("startYear");
  const startSalary = document.getElementById("startSalary");
  const currentSalary = document.getElementById("currentSalary");

  setTableHeaders(startYearInput.value);

  event.preventDefault();

  const startYear = parseInt(startYearInput.value);
  const startIncome = parseInt(startSalary.value);
  const todayIncome = parseInt(currentSalary.value);

  validateInput(startIncome, todayIncome);

  const incomeData = getIncomeData(
    {
      startYear,
      startIncome,
      todayYear: 2022,
      todayIncome,
    },
    data
  );

  setTableValues(incomeData);
});

setStartValues();
