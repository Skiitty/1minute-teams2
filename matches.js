/* =========================================================
   1MINUTE — TEAM RECENT MATCHES
   Visual block for the team page.
========================================================= */

(function () {
    "use strict";

    const MATCHES = [
        {
            date: "19 авг.",
            format: "B03",
            status: "upcoming",
            label: "UPCOMING",
            opponent: "KINDEST PPL",
            short: "BE KIND",
            score: "VS",
            logo: "K",
            tone: "upcoming"
        },
        {
            date: "18 авг.",
            format: "B01",
            status: "win",
            label: "WIN",
            opponent: "WS TEAM",
            short: "WS",
            score: "13 : 11",
            logo: "WS",
            tone: "win"
        },
        {
            date: "17 авг.",
            format: "B01",
            status: "loss",
            label: "LOSS",
            opponent: "ZERION TEAM",
            short: "ZER",
            score: "0 : 13",
            logo: "Z",
            tone: "loss"
        },
        {
            date: "16 авг.",
            format: "B01",
            status: "win",
            label: "WIN",
            opponent: "TEAM PATRIOT",
            short: "PTR",
            score: "13 : 0",
            logo: "P",
            tone: "win"
        }
    ];

    function escapeMatchHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderRecentMatches() {
        const teamProfile = document.getElementById("teamProfile");
        if (!teamProfile) return;

        const roster = teamProfile.querySelector(".roster");
        if (!roster) return;

        let section = teamProfile.querySelector(".one-minute-recent-matches");

        if (!section) {
            section = document.createElement("section");
            section.className = "one-minute-recent-matches";
            roster.insertAdjacentElement("afterend", section);
        }

        section.innerHTML = `
            <div class="om-section-head">
                <div class="om-section-title-wrap">
                    <span class="om-yellow-dot"></span>
                    <h2>ПОСЛЕДНИЕ МАТЧИ (${MATCHES.length})</h2>
                </div>
                <a href="#matches" class="om-all-matches">ВСЕ МАТЧИ →</a>
            </div>

            <div class="om-match-list">
                ${MATCHES.map(match => `
                    <article class="om-match-card om-${escapeMatchHTML(match.tone)}">
                        <div class="om-match-top">
                            <div class="om-match-date">
                                ${escapeMatchHTML(match.date)}
                                <span>•</span>
                                ${escapeMatchHTML(match.format)}
                            </div>
                            <div class="om-match-status">
                                ${escapeMatchHTML(match.label)}
                            </div>
                        </div>

                        <div class="om-match-divider"></div>

                        <div class="om-match-main">
                            <div class="om-opponent">
                                <div class="om-opponent-logo">
                                    <span>${escapeMatchHTML(match.logo)}</span>
                                </div>

                                <div class="om-opponent-name">
                                    <span>VS ${escapeMatchHTML(match.short)}</span>
                                    <strong>${escapeMatchHTML(match.opponent)}</strong>
                                </div>
                            </div>

                            <div class="om-score ${match.status === "upcoming" ? "om-score-upcoming" : ""}">
                                ${escapeMatchHTML(match.score)}
                            </div>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;
    }

    function boot() {
        renderRecentMatches();

        const observer = new MutationObserver(function () {
            renderRecentMatches();
        });

        const target = document.getElementById("teamProfile");

        if (target) {
            observer.observe(target, {
                childList: true,
                subtree: true
            });
        } else {
            const bodyObserver = new MutationObserver(function () {
                const profile = document.getElementById("teamProfile");
                if (!profile) return;

                bodyObserver.disconnect();
                renderRecentMatches();

                observer.observe(profile, {
                    childList: true,
                    subtree: true
                });
            });

            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
