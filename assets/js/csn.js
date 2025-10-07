const $ = (id) => document.getElementById(id);
const fmt0 = (n) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n);

function calcCSN({
  bidrag,
  lan,
  hourly,
  hoursPerWeek,
  weeksPerMonth,
  taxPct,
  includeLoan,
}) {
  const jobGross = hourly * hoursPerWeek * weeksPerMonth;
  const tax = Math.max(0, Math.min(60, taxPct || 0)) / 100;
  const jobNet = jobGross * (1 - tax);

  const csnBidrag = Math.max(0, bidrag || 0);
  const csnLan = Math.max(0, lan || 0);

  const totalInclLoan = csnBidrag + (includeLoan ? csnLan : 0) + jobNet;
  const totalExclLoan = csnBidrag + jobNet;

  // ungefärlig nettotimlön
  const netPerHour = hourly * (1 - tax);

  return {
    jobGross,
    jobNet,
    csnBidrag,
    csnLan,
    totalInclLoan,
    totalExclLoan,
    includeLoan,
    netPerHour,
  };
}

function render(res) {
  $("out").innerHTML = `
    <h3>Resultat (per månad)</h3>
    <ul>
      <li>Extrajobb brutto: <strong>${fmt0(res.jobGross)} kr</strong></li>
      <li>Extrajobb netto ~: <strong>${fmt0(res.jobNet)} kr</strong> (≈ ${fmt0(
    res.netPerHour
  )} kr/timme netto)</li>
      <li>CSN-bidrag: <strong>${fmt0(res.csnBidrag)} kr</strong></li>
      <li>CSN-lån: <strong>${fmt0(res.csnLan)} kr</strong></li>
    </ul>
    <h4>Total månadsbudget</h4>
    <ul>
      <li><strong>Exkl. lån:</strong> ${fmt0(res.totalExclLoan)} kr</li>
      <li><strong>Inkl. lån${
        res.includeLoan ? "" : " (avmarkerad)"
      }:</strong> ${fmt0(res.totalInclLoan)} kr</li>
    </ul>
    <p class="muted">Obs: Lån är skuldsättning och återbetalas senare.</p>
  `;
}

function toNum(v) {
  return parseFloat((v || "0").toString().replace(",", "."));
}

function onSubmit(e) {
  e.preventDefault();
  const bidrag = toNum($("csnBidrag").value);
  const lan = toNum($("csnLan").value);
  const hourly = toNum($("hourly").value);
  const hoursPerWeek = parseInt($("hoursPerWeek").value || "0", 10);
  const weeksPerMonth = toNum($("weeksPerMonth").value);
  const taxPct = toNum($("tax").value);
  const includeLoan = $("includeLoan").checked;

  if (hourly <= 0 || hoursPerWeek < 0 || weeksPerMonth <= 0) {
    $("out").textContent = "Fyll i timlön > 0 och rimliga timmar/veckor.";
    return;
  }

  const res = calcCSN({
    bidrag,
    lan,
    hourly,
    hoursPerWeek,
    weeksPerMonth,
    taxPct,
    includeLoan,
  });
  render(res);
}

function onReset() {
  $("form").reset();
  $("hoursPerWeek").value = 10;
  $("weeksPerMonth").value = 4.33;
  $("tax").value = 30;
  $("includeLoan").checked = true;
  $("out").textContent = "";
}

window.addEventListener("DOMContentLoaded", () => {
  $("form").addEventListener("submit", onSubmit);
  $("resetBtn").addEventListener("click", onReset);
});
