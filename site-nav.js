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
            .site-section-back { margin: 0 0 22px !important; }
            @media (max-width: 760px) { .site-section-back { margin-bottom: 16px !important; } }
        `;
        document.head.appendChild(style);

        nav.innerHTML = `
            <a href="#teams-list" data-nav="teams" class="nav-with-count">TEAMS <b>55</b></a>
            <a href="#matches" data-nav="matches">ВСЕ МАТЧИ</a>
            <a href="#tournaments" data-nav="tournaments">TOURNAMENTS</a>
        `;

        let sectionHistory = [];
        let currentSection = "teams";

        function protectRecentMatches() {
            const profile = document.getElementById("teamProfile");
            if (!profile || profile.dataset.matchesGuard === "1") return;
            profile.dataset.matchesGuard = "1";
            let template = null;
            const sync = () => {
                const existing = profile.querySelector(".one-minute-recent-matches");
                if (existing) { template = existing.cloneNode(true); return; }
                const roster = profile.querySelector(".roster");
                if (roster && template && !profile.querySelector(".one-minute-recent-matches")) {
                    roster.insertAdjacentElement("afterend", template.cloneNode(true));
                }
            };
            const observer = new MutationObserver(() => requestAnimationFrame(sync));
            observer.observe(profile, { childList: true, subtree: true });
            sync();
        }

        function protectAllMatches() {
            const matchesList = document.getElementById("matchesList");
            if (!matchesList || matchesList.dataset.matchesGuard === "1") return;
            matchesList.dataset.matchesGuard = "1";
            const observer = new MutationObserver(() => {
                if (!matchesList.querySelector(".all-matches-page") && typeof window.renderAllOneMinuteMatches === "function") {
                    window.renderAllOneMinuteMatches();
                }
            });
            observer.observe(matchesList, { childList: true, subtree: true });
        }

        function rememberSection(target) {
            if (!target || target === currentSection) return;
            sectionHistory.push(currentSection);
            if (sectionHistory.length > 30) sectionHistory.shift();
            currentSection = target;
        }

        function injectBackButton(screenId) {
            const screen = document.getElementById(screenId);
            if (!screen || screen.querySelector(".site-section-back")) return;
            const back = document.createElement("button");
            back.type = "button";
            back.className = "back site-section-back";
            back.textContent = "← Вернуться назад";
            back.addEventListener("click", () => {
                const previous = sectionHistory.pop() || "teams";
                navigateTo(previous, false);
            });
            screen.insertBefore(back, screen.firstElementChild);
        }

        function renderAllMatchesPage() {
            if (typeof window.renderAllOneMinuteMatches === "function") window.renderAllOneMinuteMatches();
            document.getElementById("matches")?.classList.remove("hidden");
        }

        function navigateTo(target, remember = true) {
            if (remember) rememberSection(target);

            if (target === "matches") {
                document.querySelectorAll("main > .screen").forEach(section => section.classList.add("hidden"));
                renderAllMatchesPage();
                const matches = document.getElementById("matches");
                matches?.classList.remove("hidden");
                injectBackButton("matches");
                protectAllMatches();
                nav.querySelectorAll("a").forEach(link => link.classList.toggle("active", link.dataset.nav === "matches"));
                document.body.classList.remove("menu-open");
                return;
            }

            if (target === "teams") {
                document.querySelectorAll("main > .screen").forEach(s => s.classList.add("hidden"));
                document.getElementById("teams")?.classList.remove("hidden");
                document.getElementById("teams-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else if (target === "tournaments") {
                document.querySelectorAll("main > .screen").forEach(s => s.classList.add("hidden"));
                document.getElementById("tournaments")?.classList.remove("hidden");
                injectBackButton("tournaments");
                document.getElementById("tournaments")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            nav.querySelectorAll("a").forEach(link => link.classList.toggle("active", link.dataset.nav === target));
            document.body.classList.remove("menu-open");
        }

        nav.addEventListener("click", function (event) {
            const link = event.target.closest("a[data-nav]");
            if (!link) return;
            event.preventDefault();
            history.pushState({}, "", link.getAttribute("href"));
            navigateTo(link.dataset.nav, true);
        });

        document.addEventListener("click", function (event) {
            const recentMatchesLink = event.target.closest(".om-all-matches");
            if (recentMatchesLink) {
                event.preventDefault();
                history.pushState({}, "", "#matches");
                navigateTo("matches", true);
            }
        });

        function handleRouteFromHash() {
            const hash = (window.location.hash || "").replace(/^#/, "");
            if (hash === "matches") navigateTo("matches", false);
            else if (hash === "tournaments") navigateTo("tournaments", false);
            else if (hash === "teams" || hash === "teams-list" || !hash) navigateTo("teams", false);
        }

        window.addEventListener("hashchange", handleRouteFromHash);
        window.addEventListener("popstate", handleRouteFromHash);

        document.addEventListener("pointerdown", function (event) {
            const target = event.target.closest("button, .primary, .secondary, .player-card, .team-card, .back");
            if (!target) return;
            target.classList.remove("is-pressed");
            requestAnimationFrame(() => target.classList.add("is-pressed"));
            setTimeout(() => target.classList.remove("is-pressed"), 180);
        }, { passive: true });

        nav.querySelector('[data-nav="teams"]')?.classList.add("active");

        setTimeout(() => {
            protectRecentMatches();
            protectAllMatches();
            handleRouteFromHash();
        }, 0);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
})();