/* 1Minute — reliable all matches page */
(function () {
    "use strict";

    const MATCHES = [
        { date: "19 авг.", mode: "B03", status: "ПРЕДСТОЯЩИЕ", opponent: "KINDEST PPL", tag: "BE KIND", score: "VS", cls: "upcoming", url: "" },
        { date: "18 авг.", mode: "B01", status: "ПОБЕДИТЬ", opponent: "WS TEAM", tag: "WS", score: "13 : 11", cls: "win", url: "https://cybershoke.net/ru/match/10943235" },
        { date: "17 авг.", mode: "B01", status: "ПОБЕДИТЬ", opponent: "ZERZERION TEAM", tag: "ZER", score: "13 : 8", cls: "win", url: "https://cybershoke.net/ru/match/10901723" },
        { date: "16 авг.", mode: "B01", status: "ПОБЕДИТЬ", opponent: "TEAM PATRIOT", tag: "PTR", score: "13 : 0", cls: "win", url: "https://cybershoke.net/ru/match/10868408" }
    ];

    function esc(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function card(match) {
        const html = `
            <div class="om-match-top">
                <div class="om-match-date">${esc(match.date)}<span>•</span>${esc(match.mode)}</div>
                <div class="om-match-status">${esc(match.status)}</div>
            </div>
            <div class="om-match-divider"></div>
            <div class="om-match-main">
                <div class="om-opponent">
                    <div class="om-opponent-logo"><span>${esc(match.tag)}</span></div>
                    <div class="om-opponent-name">
                        <span>VS ${esc(match.tag)}</span>
                        <strong>${esc(match.opponent)}</strong>
                    </div>
                </div>
                <div class="om-score ${match.cls === "upcoming" ? "om-score-upcoming" : ""}">${esc(match.score)}</div>
            </div>`;

        const cls = `om-match-card om-${match.cls}`;
        return match.url
            ? `<a class="${cls}" href="${esc(match.url)}" target="_blank" rel="noopener noreferrer">${html}</a>`
            : `<article class="${cls}">${html}</article>`;
    }

    function renderAllMatches() {
        const list = document.getElementById("matchesList");
        const page = document.getElementById("matches");
        if (!list || !page) return;

        list.innerHTML = `
            <section class="all-matches-page" style="margin-top:0">
                <div class="om-section-head">
                    <div class="om-section-title-wrap">
                        <span class="om-yellow-dot"></span>
                        <h2>ВСЕ МАТЧИ (4)</h2>
                    </div>
                </div>
                <div class="om-match-list">${MATCHES.map(card).join("")}</div>
            </section>`;
    }

    function openAllMatches(event) {
        const link = event.target.closest(".om-all-matches");
        if (!link) return;
        event.preventDefault();
        event.stopImmediatePropagation();

        document.querySelectorAll("main > .screen").forEach(section => section.classList.add("hidden"));
        document.getElementById("matches")?.classList.remove("hidden");
        renderAllMatches();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function boot() {
        document.addEventListener("click", openAllMatches, true);
        const observer = new MutationObserver(() => {
            if (!document.getElementById("matchesList") || !document.getElementById("matches")?.classList.contains("hidden")) {
                return;
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
