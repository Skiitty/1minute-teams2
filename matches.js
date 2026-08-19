/* 1Minute — recent matches block */
(function () {
    "use strict";

    const MATCHES = [
        ["19 авг.", "B03", "UPCOMING", "KINDEST PPL", "BE KIND", "VS", "upcoming", ""],
        ["18 авг.", "B01", "WIN", "WS TEAM", "WS", "13 : 11", "win", "https://cybershoke.net/ru/match/10943235"],
        ["17 авг.", "B01", "", "ZERZERION TEAM", "ZER", "13 : 8", "win", "https://cybershoke.net/ru/match/10901723"],
        ["16 авг.", "B01", "WIN", "TEAM PATRIOT", "PTR", "13 : 0", "win", "https://cybershoke.net/ru/match/10868408"]
    ];

    function esc(v) {
        return String(v ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function styles() {
        if (document.getElementById("oneMinuteRecentMatchesStyles")) return;
        const s = document.createElement("style");
        s.id = "oneMinuteRecentMatchesStyles";
        s.textContent = `
            .one-minute-recent-matches{width:100%;margin-top:18px;padding:18px;border:1px solid #242c34;border-radius:12px;background:linear-gradient(145deg,rgba(15,19,23,.98),rgba(8,11,14,.98));box-shadow:0 25px 70px rgba(0,0,0,.16)}
            .om-section-head{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:12px}
            .om-section-title-wrap{display:flex;align-items:center;gap:9px;min-width:0}
            .om-section-title-wrap h2{margin:0;color:#aeb5bd;font-size:12px;line-height:1;font-weight:650;letter-spacing:-.01em;text-transform:uppercase}
            .om-yellow-dot{width:8px;height:8px;flex:0 0 8px;border-radius:50%;background:#ffc21c}
            .om-all-matches{color:#ffc21c;text-decoration:none;font-size:9px;font-weight:800;white-space:nowrap}
            .om-match-list{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;overflow-x:auto}
            .om-match-card{display:block;text-decoration:none;color:inherit;min-width:0;padding:12px 13px;border:1px solid #242a30;border-radius:9px;background:#090c0f;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease;cursor:pointer}
            .om-match-card:hover{transform:translateY(-2px);border-color:#414951;box-shadow:0 12px 30px rgba(0,0,0,.18)}
            .om-match-card:active{transform:translateY(0) scale(.992)}
            .om-win{border-color:rgba(0,195,135,.48);background:linear-gradient(110deg,rgba(0,70,49,.18),rgba(7,12,12,.96))}
            .om-loss{border-color:rgba(200,30,35,.55);background:linear-gradient(110deg,rgba(65,0,4,.20),rgba(10,7,8,.96))}
            .om-upcoming{border-color:rgba(196,101,0,.68);background:linear-gradient(110deg,rgba(80,42,0,.16),rgba(10,10,9,.96))}
            .om-match-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
            .om-match-date{color:#777f87;font-size:9px;font-weight:600;letter-spacing:.02em;white-space:nowrap}
            .om-match-date span{margin:0 4px;color:#7c8288}
            .om-match-status{padding:4px 6px;border-radius:5px;font-size:7px;line-height:1;font-weight:900;white-space:nowrap}
            .om-win .om-match-status{color:#00d99b;border:1px solid rgba(0,217,155,.55);background:rgba(0,130,90,.17)}
            .om-loss .om-match-status{color:#ff666b;border:1px solid rgba(255,35,45,.65);background:rgba(130,0,8,.18)}
            .om-upcoming .om-match-status{color:#ffb32c;border:1px solid rgba(215,100,0,.75);background:rgba(130,58,0,.18)}
            .om-match-status:empty{display:none}
            .om-match-divider{height:1px;margin:8px 0 9px;background:rgba(255,255,255,.08)}
            .om-match-main{display:flex;align-items:center;justify-content:space-between;gap:9px}
            .om-opponent{min-width:0;display:flex;align-items:center;gap:8px}
            .om-opponent-logo{width:36px;height:36px;flex:0 0 36px;display:flex;align-items:center;justify-content:center;border-radius:6px;border:1px solid #2b3137;background:#0b0e11}
            .om-opponent-logo span{color:#d9dde1;font-size:11px;font-weight:900;letter-spacing:-.05em}
            .om-opponent-name{min-width:0;display:flex;flex-direction:column;gap:2px}
            .om-opponent-name span{color:#777f87;font-size:7px;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
            .om-opponent-name strong{color:#f3f5f7;font-size:10px;font-weight:800;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .om-score{min-width:62px;padding:8px 7px;border:1px solid #292e33;border-radius:7px;background:#151719;color:#f5f6f7;text-align:center;font-size:14px;line-height:1;font-weight:900;white-space:nowrap}
            .om-score-upcoming{min-width:47px}
            @media(max-width:950px){
                .om-match-list{grid-template-columns:repeat(2,minmax(0,1fr))}
            }
            @media(max-width:700px){
                .one-minute-recent-matches{margin-top:18px;padding:14px 12px;border-radius:10px}
                .om-section-title-wrap h2{font-size:12px}.om-yellow-dot{width:8px;height:8px;flex-basis:8px}
                .om-all-matches{font-size:9px;padding-top:2px}
                .om-match-list{grid-template-columns:1fr;gap:9px}
                .om-match-card{padding:12px 12px;border-radius:9px}
                .om-match-date{font-size:10px}.om-match-status{padding:6px 7px;font-size:8px}.om-match-divider{margin:9px 0 10px}
                .om-match-main{gap:9px}.om-opponent{gap:9px}.om-opponent-logo{width:42px;height:42px;flex-basis:42px;border-radius:7px}
                .om-opponent-logo span{font-size:12px}.om-opponent-name span{font-size:8px}.om-opponent-name strong{font-size:11px}
                .om-score{min-width:72px;padding:9px 8px;border-radius:7px;font-size:15px}.om-score-upcoming{min-width:52px}
            }
        `;
        document.head.appendChild(s);
    }

    function render() {
        const profile = document.getElementById("teamProfile");
        if (!profile) return;

        const roster = profile.querySelector(".roster");
        if (!roster) return;

        if (profile.querySelector(".one-minute-recent-matches")) return;

        const section = document.createElement("section");
        section.className = "one-minute-recent-matches";

        section.innerHTML = `
            <div class="om-section-head">
                <div class="om-section-title-wrap">
                    <span class="om-yellow-dot"></span>
                    <h2>ПОСЛЕДНИЕ МАТЧИ (${MATCHES.length})</h2>
                </div>
                <a href="#matches" class="om-all-matches">ВСЕ МАТЧИ →</a>
            </div>
            <div class="om-match-list">
                ${MATCHES.map(m => {
                    const inner = `
                        <div class="om-match-top">
                            <div class="om-match-date">${esc(m[0])}<span>•</span>${esc(m[1])}</div>
                            <div class="om-match-status">${esc(m[2])}</div>
                        </div>
                        <div class="om-match-divider"></div>
                        <div class="om-match-main">
                            <div class="om-opponent">
                                <div class="om-opponent-logo"><span>${esc(m[4])}</span></div>
                                <div class="om-opponent-name">
                                    <span>VS ${esc(m[4])}</span>
                                    <strong>${esc(m[3])}</strong>
                                </div>
                            </div>
                            <div class="om-score ${m[2] === "UPCOMING" ? "om-score-upcoming" : ""}">${esc(m[5])}</div>
                        </div>
                    `;
                    return m[7]
                        ? `<a class="om-match-card om-${m[6]}" href="${esc(m[7])}" target="_blank" rel="noopener noreferrer">${inner}</a>`
                        : `<article class="om-match-card om-${m[6]}">${inner}</article>`;
                }).join("")}
            </div>
        `;

        roster.insertAdjacentElement("afterend", section);
    }

    function boot() {
        styles();
        render();

        const bodyObserver = new MutationObserver(function () {
            render();
        });

        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
