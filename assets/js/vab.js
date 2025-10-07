const $ = (id) => document.getElementById(id);
const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n);

function calculate(salary, days, taxPct) {
  const dailySalary = salary / 21.75;
  const vabDailyGross = dailySalary * 0.8;
  const totalGross = vabDailyGross * days;

  const tax = Math.max(0, Math.min(60, taxPct || 0)) / 100;
  const dailyNet = vabDailyGross * (1 - tax);
  const totalNet = totalGross * (1 - tax);

  return { dailySalary, vabDailyGross, totalGross, dailyNet, totalNet };
}

function render(res) {
  $("out").innerHTML = `
    <h3>Resultat</h3>
    <ul>
      <li>Dagslön (estimat): <strong>${fmt(res.dailySalary)} kr</strong></li>
      <li>VAB per dag (brutto): <strong>${fmt(
        res.vabDailyGross
      )} kr</strong></li>
      <li>Totalt VAB (brutto): <strong>${fmt(res.totalGross)} kr</strong></li>
      <li>VAB per dag (netto ~): <strong>${fmt(res.dailyNet)} kr</strong></li>
      <li>Totalt VAB (netto ~): <strong>${fmt(res.totalNet)} kr</strong></li>
    </ul>
  `;
}

function onSubmit(e) {
  e.preventDefault();
  const salary = parseFloat($("salary").value || "0");
  const days = parseInt($("days").value || "0", 10);
  const tax = parseFloat($("tax").value || "0");
  if (salary <= 0 || days <= 0) {
    $("out").textContent = "Fyll i lön och antal dagar.";
    return;
  }
  render(calculate(salary, days, tax));
}

function onReset() {
  $("form").reset();
  $("tax").value = 30;
  $("out").textContent = "";
}

// init
window.addEventListener("DOMContentLoaded", () => {
  $("form").addEventListener("submit", onSubmit);
  $("resetBtn").addEventListener("click", onReset);
});
