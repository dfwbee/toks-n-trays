import { useEffect } from "react";


const TAWK_PROPERTY_ID = "6a9674428a6e1f344847f2ab";
const TAWK_WIDGET_ID = "1k1drc9m0";

export default function TawkChat() {
  useEffect(() => {
    if (TAWK_PROPERTY_ID === "YOUR_PROPERTY_ID") return; // not configured yet
    if (document.getElementById("tawk-script")) return; // already loaded

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);

  return null;
}