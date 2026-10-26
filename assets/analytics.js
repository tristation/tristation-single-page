// Google Analytics 4 (Firebase project tristation-f0a9d)
(function () {
  var MEASUREMENT_ID = "G-MP8FT4YWDH";

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  // Only report from the production domain, so local testing doesn't pollute the data
  if (!/(^|\.)tristation\.com\.br$/.test(location.hostname)) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);

  // Track clicks on any link (except in-page anchors). Name comes from data-track,
  // falling back to the aria-label or the link text.
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;

    var name = link.getAttribute("data-track") ||
      link.getAttribute("aria-label") ||
      (link.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);

    gtag("event", "link_click", {
      link_name: name,
      link_url: link.href
    });
  });
})();
