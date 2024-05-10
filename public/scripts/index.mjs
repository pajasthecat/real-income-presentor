const data = await (await fetch("../scripts/data/pipeline-data.json")).json();

import {
  getIncomeData,
  round,
  formatAndRoundCurrency,
} from "../scripts/src/incomeService.mjs";

const currentSalaryPlaceholder = "Current monthly salary, in SEK.";
const startSalaryPlaceholder = "Monthly salary when starting working, in SEK.";

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

  const currentSalary = document.getElementById("currentSalary");
  const startSalary = document.getElementById("startSalary");

  currentSalary.placeholder = currentSalaryPlaceholder;
  currentSalary.size = currentSalaryPlaceholder.length - 5;

  startSalary.size = startSalaryPlaceholder.length - 5;
  startSalary.placeholder = startSalaryPlaceholder;
};

const setStartValues = () => {
  const startYear = document.getElementById("startYear");

  setTableHeaders(startYear.value);
};

const validateInput = (startIncome, todayIncome) => {
  const currentSalary = document.getElementById("currentSalary");
  const startSalary = document.getElementById("startSalary");

  if (isNaN(startIncome)) {
    const startSalaryValidationPlaceholder = `${startSalaryPlaceholder} (Please provide a number)`;
    startSalary.placeholder = startSalaryValidationPlaceholder;
    startSalary.size = startSalaryValidationPlaceholder.length;
    startSalary.value = "";

    return;
  }

  if (isNaN(todayIncome)) {
    const currentValidationSalaryPlaceholder = `${currentSalaryPlaceholder} (Please provide a number)`;
    currentSalary.placeholder = currentValidationSalaryPlaceholder;
    currentSalary.size = currentValidationSalaryPlaceholder.length;
    currentSalary.value = null;
    return;
  }

  currentSalary.placeholder = currentSalaryPlaceholder;
  currentSalary.size = currentSalary.value.length;

  startSalary.size = startSalary.value.length;
  startSalary.placeholder = startSalaryPlaceholder;
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
