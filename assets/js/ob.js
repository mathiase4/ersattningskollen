const $ = (id) => document.getElementById(id);
const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n);

function calcOB(hourly, hours, days, obPct, taxPct) {
  const obPerHour = hourly * obPct; // påslag per timme
  const dailyGross = obPerHour * hours; // dagligt ob-påslag (brutto)
  const totalGross = dailyGross * days;

  const tax = Math.max(0, Math.min(60, taxPct || 0)) / 100;
  const dailyNet = dailyGross * (1 - tax);
  const totalNet = totalGross * (1 - tax);

  return { obPerHour, dailyGross, totalGross, dailyNet, totalNet, obPct };
}

function render(res) {
  $("out").innerHTML = `
    <h3>Resultat</h3>
    <ul>
      <li>OB-påslag per timme: <strong>${fmt(
        res.obPerHour
      )} kr</strong> (${Math.round(res.obPct * 100)}%)</li>
      <li>OB per dag (brutto): <strong>${fmt(res.dailyGross)} kr</strong></li>
      <li>OB totalt (brutto): <strong>${fmt(res.totalGross)} kr</strong></li>
      <li>OB per dag (netto ~): <strong>${fmt(res.dailyNet)} kr</strong></li>
      <li>OB totalt (netto ~): <strong>${fmt(res.totalNet)} kr</strong></li>
    </ul>
  `;
}

function onSubmit(e) {
  e.preventDefault();
  const hourly = parseFloat(($("hourly").value || "0").replace(",", "."));
  const hours = parseInt($("hours").value || "0", 10);
  const days = parseInt($("days").value || "0", 10);
  const obPct = parseFloat($("ob").value || "0");
  const tax = parseFloat(($("tax").value || "0").replace(",", "."));
  if (hourly <= 0 || hours <= 0 || days <= 0) {
    $("out").textContent = "Fyll i timlön, timmar och dagar.";
    return;
  }
  render(calcOB(hourly, hours, days, obPct, tax));
}

function onReset() {
  $("form").reset();
  $("hours").value = 8;
  $("days").value = 5;
  $("tax").value = 30;
  $("out").textContent = "";
}

window.addEventListener("DOMContentLoaded", () => {
  $("form").addEventListener("submit", onSubmit);
  $("resetBtn").addEventListener("click", onReset);
});
