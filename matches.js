/* =========================================================
   1MINUTE — TEAM RECENT MATCHES
   Visual block for the team page.
========================================================= */

(function () {
    "use strict";

    const MATCHES = [
        { date: "19 авг.", format: "B03", status: "upcoming", label: "UPCOMING", opponent: "KINDEST PPL", short: "BE KIND", score: "VS", logo: "K", tone: "upcoming" },
        { date: "18 авг.", format: "B01", status: "win", label: "WIN", opponent: "WS TEAM", short: "WS", score: "13 : 11", logo: "WS", tone: "win" },
        { date: "17 авг.", format: "B01", status: "loss", label: "LOSS", opponent: "ZERION TEAM", short: "ZER", score: "0 : 13", logo: "Z", tone: "loss" },
        { date: "16 авг.", format: "B01", status: "win", label: "WIN", opponent: "TEAM PATRIOT", short: "PTR", score: "13 : 0", logo: "P", tone: "win" }
    ];

    function escapeMatchHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function injectStyles() {
        if (document.getElementById("oneMinuteRecentMatchesStyles")) return;

        const style = document.createElement("style");
        style.id = "oneMinuteRecentMatchesStyles";
        style.textContent = `
            .one-minute-recent-matches {
                width: 100%;
                margin-top: 22px;
                padding: 26px;
                border: 1px solid #242c34;
                border-radius: 13px;
                background: linear-gradient(145deg, rgba(15,19,23,.98), rgba(8,11,14,.98));
                box-shadow: 0 25px 70px rgba(0,0,0,.16);
            }

            .om-section-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                margin-bottom: 20px;
            }

            .om-section-title-wrap {
                display: flex;
                align-items: center;
                gap: 11px;
                min-width: 0;
            }

            .om-section-title-wrap h2 {
                margin: 0;
                color: #f3f5f7;
                font-size: 27px;
                line-height: 1;
                font-weight: 900;
                letter-spacing: -.035em;
            }

            .om-yellow-dot {
                width: 15px;
                height: 15px;
                flex: 0 0 15px;
                border-radius: 50%;
                background: #ffc21c;
                box-shadow: 0 0 18px rgba(255,194,28,.16);
            }

            .om-all-matches {
                color: #ffc21c;
                text-decoration: none;
                font-size: 11px;
                font-weight: 900;
                white-space: nowrap;
                transition: opacity .2s ease;
            }

            .om-all-matches:hover { opacity: .75; }

            .om-match-list {
                display: grid;
                gap: 14px;
            }

            .om-match-card {
                padding: 22px 24px;
                border: 1px solid #242a30;
                border-radius: 12px;
                background: #090c0f;
                transition: transform .2s ease, border-color .2s ease, background .2s ease;
            }

            .om-match-card:hover {
                transform: translateY(-2px);
            }

            .om-match-card.om-win {
                border-color: rgba(0, 195, 135, .48);
                background: linear-gradient(110deg, rgba(0,70,49,.18), rgba(7,12,12,.96));
            }

            .om-match-card.om-loss {
                border-color: rgba(200, 30, 35, .55);
                background: linear-gradient(110deg, rgba(65,0,4,.20), rgba(10,7,8,.96));
            }

            .om-match-card.om-upcoming {
                border-color: rgba(196, 101, 0, .68);
                background: linear-gradient(110deg, rgba(80,42,0,.16), rgba(10,10,9,.96));
            }

            .om-match-top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
            }

            .om-match-date {
                color: #777f87;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: .03em;
            }

            .om-match-date span {
                margin: 0 7px;
                color: #7c8288;
            }

            .om-match-status {
                padding: 8px 13px;
                border-radius: 7px;
                font-size: 10px;
                line-height: 1;
                font-weight: 900;
                white-space: nowrap;
            }

            .om-win .om-match-status {
                color: #00d99b;
                border: 1px solid rgba(0,217,155,.55);
                background: rgba(0,130,90,.17);
            }

            .om-loss .om-match-status {
                color: #ff666b;
                border: 1px solid rgba(255,35,45,.65);
                background: rgba(130,0,8,.18);
            }

            .om-upcoming .om-match-status {
                color: #ffb32c;
                border: 1px solid rgba(215,100,0,.75);
                background: rgba(130,58,0,.18);
            }

            .om-match-divider {
                height: 1px;
                margin: 16px 0 18px;
                background: rgba(255,255,255,.08);
            }

            .om-match-main {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
            }

            .om-opponent {
                min-width: 0;
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .om-opponent-logo {
                width: 62px;
                height: 62px;
                flex: 0 0 62px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                border: 1px solid #2b3137;
                background: #0b0e11;
                overflow: hidden;
            }

            .om-opponent-logo span {
                color: #d9dde1;
                font-size: 18px;
                font-weight: 900;
                letter-spacing: -.05em;
            }

            .om-opponent-name {
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .om-opponent-name span {
                color: #777f87;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: .08em;
                text-transform: uppercase;
            }

            .om-opponent-name strong {
                color: #f3f5f7;
                font-size: 17px;
                font-weight: 900;
                letter-spacing: -.02em;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .om-score {
                min-width: 120px;
                padding: 13px 17px;
                border: 1px solid #292e33;
                border-radius: 10px;
                background: #151719;
                color: #f5f6f7;
                text-align: center;
                font-size: 21px;
                line-height: 1;
                font-weight: 900;
                letter-spacing: .02em;
                white-space: nowrap;
            }

            .om-score-upcoming {
                min-width: 80px;
            }

            @media (max-width: 700px) {
                .one-minute-recent-matches {
                    margin-top: 18px;
                    padding: 18px 14px;
                    border-radius: 11px;
                }

                .om-section-head {
                    align-items: flex-start;
                    margin-bottom: 15px;
                }

                .om-section-title-wrap h2 {
                    font-size: 21px;
                }

                .om-yellow-dot {
                    width: 12px;
                    height: 12px;
                    flex-basis: 12px;
                }

                .om-all-matches {
                    font-size: 9px;
                    padding-top: 4px;
                }

                .om-match-card {
                    padding: 15px 14px;
                    border-radius: 10px;
                }

                .om-match-date {
                    font-size: 11px;
                }

                .om-match-status {
                    padding: 7px 9px;
                    font-size: 8px;
                }

                .om-match-divider {
                    margin: 12px 0 14px;
                }

                .om-match-main {
                    gap: 10px;
                }

                .om-opponent {
                    gap: 11px;
                }

                .om-opponent-logo {
                    width: 48px;
                    height: 48px;
                    flex-basis: 48px;
                    border-radius: 8px;
                }

                .om-opponent-logo span {
                    font-size: 14px;
                }

                .om-opponent-name span {
                    font-size: 8px;
                }

                .om-opponent-name strong {
                    font-size: 13px;
                }

                .om-score {
                    min-width: 88px;
                    padding: 11px 9px;
                    border-radius: 8px;
                    font-size: 16px;
                }

                .om-score-upcoming {
                    min-width: 58px;
                }
            }
        `;

        document.head.appendChild(style);
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
                            <div class="om-match-status">${escapeMatchHTML(match.label)}</div>
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
        injectStyles();
        renderRecentMatches();

        let observer;
        const startObserving = function () {
            const target = document.getElementById("teamProfile");
            if (!target) return false;

            observer = new MutationObserver(function () {
                renderRecentMatches();
            });

            observer.observe(target, {
                childList: true,
                subtree: true
            });

            renderRecentMatches();
            return true;
        };

        if (startObserving()) return;

        const bodyObserver = new MutationObserver(function () {
            if (startObserving()) {
                bodyObserver.disconnect();
            }
        });

        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
