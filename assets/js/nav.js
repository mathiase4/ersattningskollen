// markerar aktuell sida i nav automatiskt
(function () {
  const here = location.pathname.split("/").pop() || "index.html";
  // hitta alla nav-länkar och jämför filnamn
  document.querySelectorAll(".navbar a[href]").forEach((a) => {
    const file = a.getAttribute("href").split("/").pop();
    if (file === here) a.setAttribute("aria-current", "page");
  });
})();
