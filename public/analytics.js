(function () {
  console.log("Analytics script loaded");
  function generateUUID() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  const session_duration = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  const now = Date.now();

  let visitorId = localStorage.getItem("webtrack_visitor_id");
  const pageViewId = crypto.randomUUID();
  let sessionTime = localStorage.getItem("webtrack_session_time");

  if (!visitorId || now - sessionTime > session_duration) {
    if (visitorId) {
      localStorage.removeItem("webtrack_visitor_id");
      localStorage.removeItem("webtrack_session_time");
    }
    visitorId = generateUUID();
    localStorage.setItem("webtrack_visitor_id", visitorId);
    localStorage.setItem("webtrack_session_time", now);
  } else {
    console.log("Existing visitor: ", visitorId);
  }

  const script = document.currentScript;
  const trackerOrigin = script?.src ? new URL(script.src, window.location.href).origin : window.location.origin;
  const trackEndpoint = new URL("/api/track", trackerOrigin).href;

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
    pageViewId,
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

  fetch(trackEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let activeStartTime = Math.floor(Date.now() / 1000);
  let totalActiveTime = 0;

  window.addEventListener("pagehide", () => {
    const exitTime = Math.floor(Date.now() / 1000);

    totalActiveTime += Math.floor(Date.now() / 1000) - activeStartTime;

    const blob = new Blob(
      [
        JSON.stringify({
          type: "exit",
          pageViewId,
          websiteId,
          domain,
          exitTime,
          totalActiveTime,
          visitorId,
          exitUrl: window.location.href,
        }),
      ],
      { type: "application/json" },
    );

    navigator.sendBeacon(trackEndpoint, blob);
  });

})();
