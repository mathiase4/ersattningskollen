const $ = (id) => document.getElementById(id);
const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n);

function calcSemester(hourly, hours, days, ratePct, taxPct) {
  const earned = hourly * hours * days; // intjänad lön
  const rate = Math.max(0, Math.min(50, ratePct || 0)) / 100; // t.ex. 12% = 0.12
  const gross = earned * rate;

  const tax = Math.max(0, Math.min(60, taxPct || 0)) / 100;
  const net = gross * (1 - tax);

  return { earned, gross, net, ratePct };
}

function render(res) {
  $("out").innerHTML = `
    <h3>Resultat</h3>
    <ul>
      <li>Intjänad lön: <strong>${fmt(res.earned)} kr</strong></li>
      <li>Semesterersättning (brutto, ${res.ratePct}%): <strong>${fmt(
    res.gross
  )} kr</strong></li>
      <li>Semesterersättning (netto ~): <strong>${fmt(res.net)} kr</strong></li>
    </ul>
  `;
}

function onSubmit(e) {
  e.preventDefault();
  const hourly = parseFloat(($("hourly").value || "0").replace(",", "."));
  const hours = parseInt($("hours").value || "0", 10);
  const days = parseInt($("days").value || "0", 10);
  const rate = parseFloat(($("rate").value || "0").replace(",", "."));
  const tax = parseFloat(($("tax").value || "0").replace(",", "."));
  if (hourly <= 0 || hours <= 0 || days <= 0) {
    $("out").textContent = "Fyll i timlön, timmar och dagar.";
    return;
  }
  render(calcSemester(hourly, hours, days, rate, tax));
}

function onReset() {
  $("form").reset();
  $("hours").value = 8;
  $("days").value = 22;
  $("rate").value = 12;
  $("tax").value = 30;
  $("out").textContent = "";
}

window.addEventListener("DOMContentLoaded", () => {
  $("form").addEventListener("submit", onSubmit);
  $("resetBtn").addEventListener("click", onReset);
});
