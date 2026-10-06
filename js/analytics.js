"use strict";

// Coleta apenas nos domínios de produção, nunca em previews ou localhost.
(() => {
    if (!["caversan.com.br", "www.caversan.com.br"].includes(window.location.hostname)) return;
    if (window.caversanAnalyticsInitialized) return;
    window.caversanAnalyticsInitialized = true;

    const measurementId = "G-1816KJZ7KE";
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(tag);
})();
