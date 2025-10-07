const $ = (id) => document.getElementById(id);
const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n);
const toNum = (v) => parseFloat((v ?? "0").toString().replace(",", "."));

// mode: "månad" -> räkna om till dagslön, "dag" -> använd direkt
function calcAkassa({ mode, salaryInput, ratePct, days, taxPct }) {
  const dailySalary = mode === "månad" ? salaryInput / 21.75 : salaryInput;

  const rate = Math.max(0, Math.min(100, ratePct || 0)) / 100;
  const dailyGross = dailySalary * rate;
  const totalGross = dailyGross * days;

  const tax = Math.max(0, Math.min(60, taxPct || 0)) / 100;
  const dailyNet = dailyGross * (1 - tax);
  const totalNet = totalGross * (1 - tax);

  return { dailySalary, dailyGross, totalGross, dailyNet, totalNet, ratePct };
}

function render(res) {
  $("out").innerHTML = `
    <h3>Resultat</h3>
    <ul>
      <li>Dagslön (estimat): <strong>${fmt(res.dailySalary)} kr</strong></li>
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

function onModeChange() {
  const mode = $("mode").value;
  const label = $("salaryLabel");
  const salary = $("salary");

  if (mode === "månad") {
    label.textContent = "Månadslön (brutto)";
    salary.step = "100";
    if (!salary.placeholder || salary.placeholder.includes("1000")) {
      salary.placeholder = "t.ex. 23000";
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
  const ratePct = toNum($("rate").value);
  const days = parseInt($("days").value || "0", 10);
  const taxPct = toNum($("tax").value);

  if (salaryInput <= 0 || days <= 0) {
    $("out").textContent = "Fyll i lön (>0) och antal dagar (>0).";
    return;
  }
  render(calcAkassa({ mode, salaryInput, ratePct, days, taxPct }));
}

function onReset() {
  $("form").reset();
  $("rate").value = 80;
  $("days").value = 22;
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
