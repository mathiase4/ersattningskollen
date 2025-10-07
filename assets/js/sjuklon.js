const $ = (id) => document.getElementById(id);
const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n);
const toNum = (v) => parseFloat((v ?? "0").toString().replace(",", "."));

// Förenklad sjuklön: 80% av dagslön (MVP – utan karens/avtalsdetaljer)
function calculateSick({ mode, salaryInput, days, taxPct }) {
  // Om månadslön: räkna om till dagslön, annars använd inmatad dagslön
  const daily = mode === "månad" ? salaryInput / 21.75 : salaryInput;

  const sickDailyGross = daily * 0.8;
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

function onModeChange() {
  const mode = $("mode").value;
  const label = $("salaryLabel");
  const salary = $("salary");

  if (mode === "månad") {
    label.textContent = "Månadslön (brutto)";
    salary.step = "100";
    if (!salary.placeholder || salary.placeholder.includes("1000")) {
      salary.placeholder = "t.ex. 28000";
    }
  } else {
    label.textContent = "Dagslön (brutto)";
    salary.step = "1";
    salary.placeholder = "t.ex. 1000";
  }
}

function onSubmit(e) {
  e.preventDefault();
  const mode = $("mode").value;
  const salaryInput = toNum($("salary").value);
  const days = parseInt($("days").value || "0", 10);
  const taxPct = toNum($("tax").value);

  if (salaryInput <= 0 || days <= 0) {
    $("out").textContent = "Fyll i lön (>0) och antal dagar (>0).";
    return;
  }
  renderSick(calculateSick({ mode, salaryInput, days, taxPct }));
}

function onReset() {
  $("form").reset();
  $("tax").value = 30;
  $("out").textContent = "";
  $("mode").value = "månad";
  onModeChange();
}

window.addEventListener("DOMContentLoaded", () => {
  $("form").addEventListener("submit", onSubmit);
  $("resetBtn").addEventListener("click", onReset);
  $("mode").addEventListener("change", onModeChange);
  onModeChange(); // init label/placeholder
});
