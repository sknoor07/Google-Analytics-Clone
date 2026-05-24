(function () {
  console.log("Analytics script loaded");
  function generateUUID() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  let visitorId = localStorage.getItem("webtrack_visitor_id");
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem("webtrack_visitor_id", visitorId);
  }

  const script = document.currentScript;

  const websiteId = script.getAttribute("data-website-id");
  const domain = script.getAttribute("data-domain");
  const entryTime = Math.floor(Date.now() / 1000);
  const referrer = document?.referrer || "Direct";

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source");
  const utmMedium = urlParams.get("utm_medium");
  const utmCampaign = urlParams.get("utm_campaign");
  const RefParams = window.location.href.split("?")[1] || "";

  const data = {
    type: "entry",
    websiteId: websiteId,
    domain: domain,
    entryTime: entryTime,
    referrer: referrer,
    url: window.location.href,
    visitorId: visitorId,
    urlParams: urlParams.toString(),
    utmSource: utmSource,
    utmMedium: utmMedium,
    utmCampaign: utmCampaign,
    RefParams: RefParams,
  };

  fetch("http://localhost:3000/api/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let activeStartTime = Math.floor(Date.now()/1000);
  let totalActiveTime = 0;

  window.addEventListener("pagehide", () => {
    const exitTime = Math.floor(Date.now()/1000);

    totalActiveTime += Math.floor(Date.now()/1000) - activeStartTime;

    const blob = new Blob(
      [
        JSON.stringify({
          type: "exit",
          websiteId,
          domain,
          exitTime,
          totalActiveTime,
          visitorId,
        }),
      ],
      { type: "application/json" },
    );

    navigator.sendBeacon("http://localhost:3000/api/track", blob);
  });

  //window.addEventListener("pagehide", handleExit);
})();
