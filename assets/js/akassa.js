const $ = (id) => document.getElementById(id);
const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n);

function calculateAkassa(salary, ratePct, days, taxPct) {
  const daily = salary / 21.75;
  const rate = Math.max(0, Math.min(100, ratePct || 0)) / 100;
  const dailyGross = daily * rate;
  const totalGross = dailyGross * days;

  const tax = Math.max(0, Math.min(60, taxPct || 0)) / 100;
  const dailyNet = dailyGross * (1 - tax);
  const totalNet = totalGross * (1 - tax);

  return { daily, dailyGross, totalGross, dailyNet, totalNet, ratePct };
}

function renderAkassa(res) {
  $("out").innerHTML = `
    <h3>Resultat</h3>
    <ul>
      <li>Dagslön (estimat): <strong>${fmt(res.daily)} kr</strong></li>
      <li>Ersättningsprocent: <strong>${res.ratePct}%</strong></li>
      <li>A-kassa per dag (brutto): <strong>${fmt(
        res.dailyGross
      )} kr</strong></li>
      <li>Totalt (brutto): <strong>${fmt(res.totalGross)} kr</strong></li>
      <li>A-kassa per dag (netto ~): <strong>${fmt(
        res.dailyNet
      )} kr</strong></li>
      <li>Totalt (netto ~): <strong>${fmt(res.totalNet)} kr</strong></li>
    </ul>
  `;
}

function onSubmit(e) {
  e.preventDefault();
  const salary = parseFloat(($("salary").value || "0").replace(",", "."));
  const rate = parseFloat(($("rate").value || "0").replace(",", "."));
  const days = parseInt($("days").value || "0", 10);
  const tax = parseFloat(($("tax").value || "0").replace(",", "."));
  if (salary <= 0 || days <= 0) {
    $("out").textContent = "Fyll i lön och antal dagar.";
    return;
  }
  renderAkassa(calculateAkassa(salary, rate, days, tax));
}

function onReset() {
  $("form").reset();
  $("rate").value = 80;
  $("days").value = 22;
  $("tax").value = 30;
  $("out").textContent = "";
}

window.addEventListener("DOMContentLoaded", () => {
  $("form").addEventListener("submit", onSubmit);
  $("resetBtn").addEventListener("click", onReset);
});
