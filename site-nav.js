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

        function spaceSubstitutes() {}

        nav.innerHTML = `
            <a href="#teams" data-nav="home">ГЛАВНАЯ</a>
            <a href="#teams-list" data-nav="teams" class="nav-with-count">TEAMS <b>55</b></a>
            <a href="#matches" data-nav="matches">ВСЕ МАТЧИ</a>
            <a href="#tournaments" data-nav="tournaments">TOURNAMENTS</a>
        `;

        let sectionHistory = [];
        let currentSection = "home";

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
                const previous = sectionHistory.pop() || "home";
                navigateTo(previous, false);
            });
            screen.insertBefore(back, screen.firstElementChild);
        }

        function renderAllMatchesPage() {
            if (typeof window.renderAllOneMinuteMatches === "function") {
                window.renderAllOneMinuteMatches();
            }
            const matches = document.getElementById("matches");
            if (matches) matches.classList.remove("hidden");
        }

        function navigateTo(target, remember = true) {
            if (remember) rememberSection(target);

            if (target === "matches") {
                document.querySelectorAll("main > .screen").forEach(section => section.classList.add("hidden"));
                renderAllMatchesPage();
                document.getElementById("matches")?.classList.remove("hidden");
                injectBackButton("matches");
                document.getElementById("matches")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
            navigateTo(link.dataset.nav, true);
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
        nav.querySelector('[data-nav="home"]')?.classList.add("active");
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
})();
