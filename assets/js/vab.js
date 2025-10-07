const $ = (id) => document.getElementById(id);
const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n);

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

function toNum(v) {
  return parseFloat((v ?? "0").toString().replace(",", "."));
}

function calculate({ mode, salaryInput, days, taxPct }) {
  // Om månadslön: räkna om till dagslön, annars använd inmatad dagslön
  const dailySalary = mode === "månad" ? salaryInput / 21.75 : salaryInput;
  const vabDailyGross = dailySalary * 0.8;
  const totalGross = vabDailyGross * days;

  const tax = Math.max(0, Math.min(60, taxPct || 0)) / 100;
  const dailyNet = vabDailyGross * (1 - tax);
  const totalNet = totalGross * (1 - tax);

  return { dailySalary, vabDailyGross, totalGross, dailyNet, totalNet };
}

function render(res) {
  const text = `VAB-resultat
Dagslön (estimat): ${fmt(res.dailySalary)} kr
VAB per dag (brutto): ${fmt(res.vabDailyGross)} kr
Totalt VAB (brutto): ${fmt(res.totalGross)} kr
VAB per dag (netto ~): ${fmt(res.dailyNet)} kr
Totalt VAB (netto ~): ${fmt(res.totalNet)} kr`;

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

  // spara texten för kopiering och aktivera knappen
  $("out").dataset.copy = text;
  $("copyBtn").disabled = false;
}

function onModeChange() {
  const mode = $("mode").value;
  const label = $("salaryLabel");
  const salary = $("salary");

  if (mode === "månad") {
    label.textContent = "Månadslön (brutto)";
    salary.step = "100";
    salary.placeholder = "t.ex. 28000";
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
    $("out").textContent = "Fyll i lön och antal dagar.";
    return;
  }
  render(calculate({ mode, salaryInput, days, taxPct }));
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
  onModeChange(); // init
});
