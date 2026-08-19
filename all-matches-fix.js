/* 1Minute — lightweight all matches handler */
(function () {
    "use strict";

    function openAllMatches(event) {
        const link = event.target.closest(".om-all-matches");
        if (!link) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        history.pushState({}, "", "#matches");
        window.dispatchEvent(new Event("hashchange"));
    }

    function boot() {
        document.addEventListener("click", openAllMatches, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();