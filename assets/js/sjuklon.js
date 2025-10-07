const $ = (id) => document.getElementById(id);
const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n);

function calculateSick(salary, days, taxPct) {
  const daily = salary / 21.75;
  const sickDailyGross = daily * 0.8; // enkel modell (utan karensavdrag)
  const totalGross = sickDailyGross * days;

  const tax = Math.max(0, Math.min(60, taxPct || 0)) / 100;
  const dailyNet = sickDailyGross * (1 - tax);
  const totalNet = totalGross * (1 - tax);

  return { daily, sickDailyGross, totalGross, dailyNet, totalNet };
}

function renderSick(res) {
  $("out").innerHTML = `
    <h3>Resultat</h3>
    <ul>
      <li>Dagslön (estimat): <strong>${fmt(res.daily)} kr</strong></li>
      <li>Sjuklön per dag (brutto): <strong>${fmt(
        res.sickDailyGross
      )} kr</strong></li>
      <li>Totalt (brutto): <strong>${fmt(res.totalGross)} kr</strong></li>
      <li>Sjuklön per dag (netto ~): <strong>${fmt(
        res.dailyNet
      )} kr</strong></li>
      <li>Totalt (netto ~): <strong>${fmt(res.totalNet)} kr</strong></li>
    </ul>
  `;
}

function onSubmit(e) {
  e.preventDefault();
  const salary = parseFloat(($("salary").value || "0").replace(",", "."));
  const days = parseInt($("days").value || "0", 10);
  const tax = parseFloat(($("tax").value || "0").replace(",", "."));
  if (salary <= 0 || days <= 0) {
    $("out").textContent = "Fyll i lön och antal dagar.";
    return;
  }
  renderSick(calculateSick(salary, days, tax));
}

function onReset() {
  $("form").reset();
  $("tax").value = 30;
  $("out").textContent = "";
}

window.addEventListener("DOMContentLoaded", () => {
  $("form").addEventListener("submit", onSubmit);
  $("resetBtn").addEventListener("click", onReset);
});
