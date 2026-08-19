/* 1MINUTE — NAVIGATION + MICRO INTERACTIONS */
(function () {
    "use strict";

    function init() {
        const topbar = document.querySelector(".topbar");
        const nav = topbar?.querySelector("nav");
        if (!topbar || !nav) return;

        const style = document.createElement("style");
        style.textContent = `
            .topbar nav { gap: 10px; }
            .topbar nav a { min-width: 0; }
            #teams-list .filters { display: none !important; }

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
            #teams .hero p { max-width: 780px; margin: 0 auto; }
            #teams .hero-actions { justify-content: center; }

            #teams-list {
                width: 100%;
                justify-content: center;
                text-align: center;
                margin-top: 5px;
            }
            #teams-list > div:first-child { width: 100%; text-align: center; }
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

            /* Clear visual gap before the substitutes block */
            #teamPage .substitutes-title-spacer {
                margin-top: 44px !important;
                padding-top: 2px !important;
            }
            #teamPage .substitutes-title-spacer.substitutes-has-dot {
                display: flex !important;
                align-items: center;
                gap: 9px;
            }
            #teamPage .substitutes-title-spacer.substitutes-has-dot::before {
                content: "";
                width: 9px;
                height: 9px;
                flex: 0 0 9px;
                border-radius: 50%;
                background: #ffc21c;
            }
            #teamPage .substitutes-title-spacer .substitutes-label::before,
            #teamPage .substitutes-title-spacer .substitutes-label::after {
                content: none !important;
                display: none !important;
            }

            /* Compact player cards */
            .player-grid {
                grid-template-columns: repeat(5, minmax(0, 1fr));
                gap: 16px;
            }
            .player-card {
                min-height: 205px;
                height: auto;
                padding: 12px 13px 9px;
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
                width: 54px;
                height: 54px;
                flex: 0 0 54px;
                margin: 1px auto 8px;
                border-radius: 8px;
                border: 1px solid #292929;
                background: #050505;
                box-shadow: none;
            }
            .player-card h3 {
                margin: 0;
                font-size: 13px;
                line-height: 1.05;
                font-weight: 800;
                letter-spacing: -.015em;
            }
            .player-role {
                margin-top: 3px;
                padding: 3px 7px;
                border-radius: 4px;
                font-size: 8px;
                line-height: 1;
                font-weight: 800;
            }
            .player-country {
                margin-top: 2px;
                font-size: 8px;
                line-height: 1.05;
                font-weight: 700;
            }
            .player-links {
                margin-top: 7px;
                padding-top: 7px;
                gap: 5px;
                border-top: 1px solid #1f1f1f;
            }
            .player-links a {
                min-height: 24px;
                padding: 5px 5px;
                border-radius: 4px;
                background: #080808;
                border: 1px solid #2a2a2a;
                font-size: 8px;
                line-height: 1;
                font-weight: 800;
            }
            .player-links a:hover { background: #111; border-color: #444; transform: translateY(-1px); }

            /* PLAYER PROFILE */
            #playerPage .player-profile-avatar,
            #playerPage .player-profile-avatar img { border-radius: 14px !important; }
            #playerPage .player-profile-avatar { overflow: hidden; }

            #playerPage .player-profile-actions {
                display: flex !important;
                flex-wrap: wrap;
                justify-content: center;
                gap: 8px;
                margin-top: 24px !important;
            }
            #playerPage .player-profile-actions a,
            #playerPage .player-profile-actions button,
            #playerPage .player-profile-actions .primary,
            #playerPage .player-profile-actions .secondary,
            #playerPage .player-profile-actions .edit-btn {
                appearance: none !important;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                min-height: 38px;
                padding: 9px 14px !important;
                border: 1px solid #2b2b2b !important;
                border-radius: 8px !important;
                background: #0d0d0d !important;
                color: #d7d7d7 !important;
                text-decoration: none !important;
                font-size: 10px;
                font-weight: 800;
                line-height: 1;
                cursor: pointer;
                box-shadow: none !important;
                transition: transform .18s ease, background .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease;
            }
            #playerPage .player-profile-actions a:hover,
            #playerPage .player-profile-actions button:hover,
            #playerPage .player-profile-actions .primary:hover,
            #playerPage .player-profile-actions .secondary:hover,
            #playerPage .player-profile-actions .edit-btn:hover {
                background: #171717 !important;
                border-color: #444 !important;
                color: #fff !important;
                transform: translateY(-2px);
                box-shadow: 0 10px 28px rgba(0,0,0,.28) !important;
            }
            #playerPage .player-profile-actions .danger,
            #playerPage .player-profile-actions .remove-btn,
            #playerPage .player-profile-actions [class*="danger"] {
                background: #120909 !important;
                border-color: rgba(210,60,60,.38) !important;
                color: #ff8b8b !important;
            }
            #playerPage .back {
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                min-height: 36px;
                padding: 8px 13px !important;
                border: 1px solid #292929 !important;
                border-radius: 8px !important;
                background: #0d0d0d !important;
                color: #aaa !important;
                text-decoration: none !important;
                transition: transform .18s ease, background .2s ease, border-color .2s ease, color .2s ease;
            }
            #playerPage .back:hover {
                background: #151515 !important;
                border-color: #414141 !important;
                color: #fff !important;
                transform: translateX(-2px);
            }

            .is-pressed { transform: scale(.965) !important; }

            @media (max-width: 1050px) {
                .topbar nav a { padding: 0 9px; font-size: 10px; }
                .player-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
            }
            @media (max-width: 760px) {
                #teams .hero { min-height: 440px; padding: 55px 6px 70px; }
                #teams .hero h1 { font-size: clamp(42px, 11vw, 62px); }
                #teams .hero p { font-size: 12px; }
                #grid .team-card { width: 100%; }
                .player-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
                .player-card { min-height: 192px; padding: 11px 10px 8px; }
                .player-avatar { width: 52px; height: 52px; flex-basis: 52px; margin-bottom: 8px; }
                #playerPage .player-profile-avatar { width: 150px; height: 150px; border-radius: 13px !important; }
                #playerPage .player-profile-avatar img { border-radius: 13px !important; }
                #playerPage .player-profile-actions { gap: 8px; }
                #playerPage .player-profile-actions a,
                #playerPage .player-profile-actions button { flex: 1 1 145px; }
            }
            @media (max-width: 430px) {
                .player-grid { grid-template-columns: 1fr; }
                #teams .hero h1 { font-size: 41px; }
            }
        `;
        document.head.appendChild(style);

        function spaceSubstitutes() {
            const page = document.getElementById("teamPage");
            if (!page) return;

            page.querySelectorAll("*").forEach(el => {
                if (el.children.length > 0) return;
                const raw = (el.textContent || "").trim();
                const text = raw.toUpperCase();

                if (text === "SUBSTITUTES" || text === "ЗАМЕНЫ") {
                    if (text === "SUBSTITUTES") {
                        el.textContent = "ЗАМЕНА";
                    }
                    el.classList.add("substitutes-label");

                    const block = el.closest(
                        "section, .section, .roster-block, .roster-group, .roster-section, div"
                    ) || el;
                    block.classList.add("substitutes-title-spacer", "substitutes-has-dot");

                    /* Remove existing small circle markers in the heading wrapper. */
                    Array.from(block.children).forEach(child => {
                        if (child === el) return;
                        const rect = child.getBoundingClientRect();
                        const radius = getComputedStyle(child).borderRadius;
                        if (rect.width <= 20 && rect.height <= 20 && /50%/.test(radius)) {
                            child.remove();
                        }
                    });
                }
            });
        }

        nav.innerHTML = `
            <a href="#teams" data-nav="home">ГЛАВНАЯ</a>
            <a href="#teams-list" data-nav="teams" class="nav-with-count">TEAMS <b>55</b></a>
            <a href="#tournaments" data-nav="tournaments">TOURNAMENTS</a>
        `;

        function showPage(target) {
            const id = target === "tournaments" ? "tournaments" : "teams";
            document.querySelectorAll("main > .screen").forEach(section => section.classList.add("hidden"));
            document.getElementById(id)?.classList.remove("hidden");
            if (target === "teams") {
                document.getElementById("teams-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            nav.querySelectorAll("a").forEach(link => link.classList.toggle("active", link.dataset.nav === target));
            document.body.classList.remove("menu-open");
        }

        nav.addEventListener("click", function (event) {
            const link = event.target.closest("a[data-nav]");
            if (!link) return;
            event.preventDefault();
            showPage(link.dataset.nav);
        });

        document.addEventListener("pointerdown", function (event) {
            const target = event.target.closest("button, .primary, .secondary, .player-card, .team-card, .back");
            if (!target) return;
            target.classList.remove("is-pressed");
            requestAnimationFrame(() => target.classList.add("is-pressed"));
            setTimeout(() => target.classList.remove("is-pressed"), 180);
        }, { passive: true });

        const observer = new MutationObserver(spaceSubstitutes);
        observer.observe(document.body, { childList: true, subtree: true });
        spaceSubstitutes();

        nav.querySelector('[data-nav="home"]')?.classList.add("active");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
