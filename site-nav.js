/* 1MINUTE — NAVIGATION + MICRO INTERACTIONS */
(function () {
    "use strict";

    function init() {
        const topbar = document.querySelector(".topbar");
        const nav = topbar?.querySelector("nav");
        if (!topbar || !nav) return;

        const style = document.createElement("style");
        style.textContent = `
            /* ---- Clean top navigation ---- */
            .topbar nav { gap: 10px; }
            .topbar nav a { min-width: 0; }

            /* ---- Remove the filter buttons completely ---- */
            #teams-list .filters { display: none !important; }

            /* ---- Center the hero ---- */
            #teams .hero {
                min-height: 520px;
                max-width: 1180px;
                margin: 0 auto;
                padding: 70px 20px 90px;
                text-align: center;
                align-items: center;
            }
            #teams .hero .eyebrow,
            #teams .hero h1,
            #teams .hero p { width: 100%; text-align: center; }
            #teams .hero h1 {
                max-width: 1120px;
                margin: 16px auto 22px;
                font-size: clamp(50px, 7.2vw, 94px);
                line-height: .91;
                letter-spacing: -.075em;
            }
            #teams .hero p {
                max-width: 780px;
                margin: 0 auto;
            }
            #teams .hero-actions {
                justify-content: center;
            }

            /* ---- Center the team directory/card ---- */
            #teams-list {
                width: 100%;
                justify-content: center;
                text-align: center;
                margin-top: 5px;
            }
            #teams-list > div:first-child {
                width: 100%;
                text-align: center;
            }
            #grid.team-grid {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #grid .team-card {
                width: min(920px, 100%);
                min-height: 170px;
                text-align: left;
            }

            /* ---- Player cards: light, compact EFL style ---- */
            .player-grid {
                grid-template-columns: repeat(5, minmax(0, 1fr));
                gap: 16px;
            }
            .player-card {
                min-height: 250px;
                padding: 18px 18px 13px;
                border: 1px solid #242424;
                border-radius: 9px;
                background: #090909;
                box-shadow: none;
                font-weight: 500;
            }
            .player-card:hover {
                transform: translateY(-4px);
                border-color: #3a3a3a;
                box-shadow: 0 14px 36px rgba(0,0,0,.28);
            }
            .player-avatar {
                width: 60px;
                height: 60px;
                flex: 0 0 60px;
                margin: 2px auto 14px;
                border-radius: 9px;
                border: 1px solid #292929;
                background: #050505;
                box-shadow: none;
            }
            .player-card h3 {
                font-size: 14px;
                font-weight: 800;
                letter-spacing: -.015em;
            }
            .player-role {
                margin-top: 8px;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 8px;
                font-weight: 800;
            }
            .player-country {
                margin-top: 6px;
                font-size: 8px;
                font-weight: 700;
            }
            .player-links {
                margin-top: auto;
                padding-top: 12px;
                gap: 6px;
                border-top: 1px solid #1f1f1f;
            }
            .player-links a {
                min-height: 28px;
                padding: 6px 5px;
                border-radius: 4px;
                background: #080808;
                border: 1px solid #2a2a2a;
                font-size: 8px;
                font-weight: 800;
            }
            .player-links a:hover {
                background: #111;
                border-color: #444;
                transform: translateY(-1px);
            }

            /* ---- Press animation ---- */
            .is-pressed { transform: scale(.965) !important; }

            @media (max-width: 1050px) {
                .topbar nav a { padding: 0 9px; font-size: 10px; }
                .player-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
            }
            @media (max-width: 760px) {
                #teams .hero {
                    min-height: 440px;
                    padding: 55px 6px 70px;
                }
                #teams .hero h1 { font-size: clamp(42px, 11vw, 62px); }
                #teams .hero p { font-size: 12px; }
                #grid .team-card { width: 100%; }
                .player-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
                .player-card { min-height: 230px; padding: 14px 12px 12px; }
                .player-avatar { width: 58px; height: 58px; flex-basis: 58px; }
            }
            @media (max-width: 430px) {
                .player-grid { grid-template-columns: 1fr; }
                #teams .hero h1 { font-size: 41px; }
            }
        `;
        document.head.appendChild(style);

        nav.innerHTML = `
            <a href="#teams" data-nav="home">ГЛАВНАЯ</a>
            <a href="#teams-list" data-nav="teams" class="nav-with-count">TEAMS <b>55</b></a>
            <a href="#tournaments" data-nav="tournaments">TOURNAMENTS</a>
        `;

        function showPage(target) {
            const id = target === "tournaments" ? "tournaments" : "teams";

            document.querySelectorAll("main > .screen").forEach(section => {
                section.classList.add("hidden");
            });

            document.getElementById(id)?.classList.remove("hidden");

            if (target === "teams") {
                document.getElementById("teams-list")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } else {
                document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            nav.querySelectorAll("a").forEach(link => {
                link.classList.toggle("active", link.dataset.nav === target);
            });

            document.body.classList.remove("menu-open");
        }

        nav.addEventListener("click", function (event) {
            const link = event.target.closest("a[data-nav]");
            if (!link) return;

            event.preventDefault();
            showPage(link.dataset.nav);
        });

        document.addEventListener("pointerdown", function (event) {
            const target = event.target.closest(
                "button, .primary, .secondary, .player-card, .team-card, .back"
            );
            if (!target) return;

            target.classList.remove("is-pressed");
            requestAnimationFrame(() => target.classList.add("is-pressed"));
            setTimeout(() => target.classList.remove("is-pressed"), 180);
        }, { passive: true });

        nav.querySelector('[data-nav="home"]')?.classList.add("active");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
