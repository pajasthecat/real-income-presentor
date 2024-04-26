import data from "./resources/data.json" assert { type: "json" };
import { getIncomeData, round } from "./src/incomeService.js";

const setTableHeader = (startYear) =>
  (document.getElementById(
    "incomeDistStart"
  ).innerHTML = `Where where you in the income distribution in ${startYear}?`);

const setStartValues = () => {
  const startYear = document.getElementById("startYear");

  setTableHeader(startYear.value);
};

const validateInput = (startIncome, todayIncome) => {
  if (isNaN(startIncome)) {
    document.getElementById("startSalaryLabel").innerHTML =
      "Your monthly wage when starting working: (Please provide a number)";
    return;
  }

  if (isNaN(todayIncome)) {
    document.getElementById("currentSalaryLabel").innerHTML =
      "Your monthly wage today: (Please provide a number)";
    return;
  }

  document.getElementById("currentSalaryLabel").innerHTML = "Monthly wage now:";

  document.getElementById("startSalaryLabel").innerHTML =
    "Monthly wage when starting working:";
};

const setTableValues = (incomeData) => {
  const {
    percentile: { start, today },
    wage: {
      nominal: { nominalWageIncrease, nominalWageIncreaseInPercent },
      real: { realWageIncrease, realWageIncreaseInPercent },
    },
  } = incomeData;

  document.getElementById("realWagePer").innerHTML = `${
    100 * round(realWageIncreaseInPercent)
  } %`;

  document.getElementById("realWage").innerHTML = `${round(
    realWageIncrease
  )} kr`;

  document.getElementById("nominalWagePer").innerHTML = `${round(
    100 * nominalWageIncreaseInPercent
  )} %`;

  document.getElementById("nominalWage").innerHTML = `${round(
    nominalWageIncrease
  )} kr`;

  if (start) {
    const oldStart = localStorage.getItem("start");
    localStorage.setItem("start", start);
    if (oldStart) document.getElementById(oldStart).innerHTML = "";
    document.getElementById(start).innerHTML = "X";
  }
  if (today) {
    const oldToday = localStorage.getItem("today");
    localStorage.setItem("today", today);
    if (oldToday) document.getElementById(`${oldToday}_now`).innerHTML = "";
    document.getElementById(`${today}_now`).innerHTML = "X";
  }
};

const form = document.querySelector("#dataForm");

form.addEventListener("submit", (event) => {
  const startYearInput = document.getElementById("startYear");
  const startSalary = document.getElementById("startSalary");
  const currentSalary = document.getElementById("currentSalary");

  setTableHeader(startYearInput.value);

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
