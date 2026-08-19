/* 1Minute — ALL MATCHES navigation */
(function () {
    "use strict";

    function showAllMatches() {
        document.querySelectorAll("main > .screen").forEach(section => section.classList.add("hidden"));

        const matchesPage = document.getElementById("matches");
        if (!matchesPage) return;
        matchesPage.classList.remove("hidden");

        if (typeof window.renderAllOneMinuteMatches === "function") {
            window.renderAllOneMinuteMatches();
        }

        const list = document.getElementById("matchesList");
        if (list) list.classList.remove("hidden");

        document.querySelectorAll(".topbar nav a[data-nav]").forEach(link => {
            link.classList.toggle("active", link.dataset.nav === "matches");
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function openAllMatches(event) {
        const link = event.target.closest(".om-all-matches");
        if (!link) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        history.pushState({}, "", "#matches");
        showAllMatches();
    }

    function handleHash() {
        if (window.location.hash === "#matches") showAllMatches();
    }

    function boot() {
        document.addEventListener("click", openAllMatches, true);
        window.addEventListener("hashchange", handleHash);
        handleHash();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();