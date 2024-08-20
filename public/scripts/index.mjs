const data = await (await fetch("../scripts/data/pipeline-data.json")).json();

import {
  getIncomeData,
  round,
  formatAndRoundCurrency,
} from "../scripts/src/incomeService.mjs";

const setStartSalaryLabel = (startYear) =>
  (document.getElementById(
    "startSalaryLabel"
  ).innerHTML = `Månadslön år ${startYear}, i SEK.`);

const setCurrentSalaryLabel = () =>
  (document.getElementById("currentSalaryLabel").innerHTML =
    "Nuvarande månadslön, i SEK.");

const setStartSalaryLabelValidationError = (startYear) =>
  (document.getElementById(
    "startSalaryLabel"
  ).innerHTML = `Månadslön år  ${startYear}, in SEK. (Vänligen uppge en siffra)`);

const setCurrentSalaryLabelValidationError = () =>
  (document.getElementById(
    "currentSalaryLabel"
  ).innerHTML = `Nuvarande månadslön, i SEK. (Vänligen uppge en siffra)`);

const setTableHeaders = (startYear) => {
  document.getElementById(
    "incomeDistStart"
  ).innerHTML = `Din plats i inkomstfördelning ${startYear}`;

  document.getElementById(
    "startSalaryInTodaysCurrencyLabel"
  ).innerHTML = `Din startlön beräknat i dagens penningvärde.`;

  document.getElementById(
    "todayWageInThenCurrencyLabel"
  ).innerHTML = `Din lön nu beräknat i ${startYear} års penningvärde`;

  setStartSalaryLabel(startYear);

  setCurrentSalaryLabel();
};

export const parseIntFromCurrency = (price) =>
  Number(price.replace(/[^0-9\.]+/g, ""));

const setStartValues = () => {
  const startYear = document.getElementById("startYear");

  setTableHeaders(startYear.value);
};

const validateInput = (startIncome, todayIncome, startYear) => {
  if (isNaN(startIncome)) {
    setStartSalaryLabelValidationError(startYear);
    return;
  }

  if (isNaN(todayIncome)) {
    setCurrentSalaryLabelValidationError();
    return;
  }

  setCurrentSalaryLabel();

  setStartSalaryLabel(startYear);
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
    document.getElementById(start).innerHTML = "Du var här  ";
  }
  if (today) {
    const oldToday = localStorage.getItem("today");
    localStorage.setItem("today", today);
    if (oldToday) document.getElementById(`${oldToday}_now`).innerHTML = "";
    document.getElementById(`${today}_now`).innerHTML = "Du är här";
  }
};

const formatInput = (event) => {
  if (!event?.target?.value) return;
  event.target.value = formatAndRoundCurrency(event?.target.value);
};

const form = document.querySelector("#dataForm");

form.addEventListener("submit", (event) => {
  const startYearInput = document.getElementById("startYear");
  const startSalary = document.getElementById("startSalary");
  const currentSalary = document.getElementById("currentSalary");

  setTableHeaders(startYearInput.value);

  event.preventDefault();

  const startYear = parseInt(startYearInput.value);
  const startIncome = parseIntFromCurrency(startSalary.value);
  const todayIncome = parseIntFromCurrency(currentSalary.value);

  validateInput(startIncome, todayIncome, startYearInput.value);

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

  const elementToZoomInto = document.getElementById("elementToScroll");

  elementToZoomInto.scrollIntoView({ behavior: "smooth" });
});

document
  .getElementById("startYear")
  .addEventListener("change", (event) =>
    setStartSalaryLabel(event.target.value)
  );

document
  .getElementById("currentSalary")
  .addEventListener("focusout", formatInput.bind());

document
  .getElementById("startSalary")
  .addEventListener("focusout", formatInput.bind());

setStartValues();
