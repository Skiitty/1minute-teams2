/* 1MINUTE — NEW NAVIGATION / MICRO-INTERACTIONS */
(function () {
    "use strict";

    function init() {
        const topbar = document.querySelector(".topbar");
        const nav = topbar?.querySelector("nav");
        if (!topbar || !nav) return;

        nav.innerHTML = `
            <a href="#teams" data-nav="home">ГЛАВНАЯ</a>
            <a href="#teams-list" data-nav="teams" class="nav-with-count">TEAMS <b>55</b></a>
            <a href="#players" data-nav="players">PLAYERS</a>
            <a href="#rating" data-nav="rating">РЕЙТИНГ</a>
            <a href="#tournaments" data-nav="tournaments">TOURNAMENTS</a>
            <a href="#matches" data-nav="matches">МАТЧИ</a>
        `;

        const playersSection = document.createElement("section");
        playersSection.id = "players";
        playersSection.className = "screen page-section hidden directory-screen";
        playersSection.innerHTML = `
            <div class="section-head directory-head">
                <div><div class="eyebrow">PLAYERS</div><h2>Игроки</h2></div>
                <span class="directory-count" id="directoryPlayerCount">0 PLAYERS</span>
            </div>
            <div id="directoryPlayers" class="player-grid directory-player-grid"></div>
        `;
        document.querySelector("main")?.appendChild(playersSection);

        function showPage(target) {
            const targets = {home:"teams",teams:"teams",players:"players",rating:"rating",tournaments:"tournaments",matches:"matches"};
            const id = targets[target] || "teams";

            document.querySelectorAll("main > .screen").forEach(s => s.classList.add("hidden"));

            if (target === "home" || target === "teams") {
                document.getElementById("teams")?.classList.remove("hidden");
                document.getElementById("teams-list")?.scrollIntoView({behavior:"smooth",block:"start"});
            } else {
                document.getElementById(id)?.classList.remove("hidden");
                document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
            }

            nav.querySelectorAll("a").forEach(a => a.classList.toggle("active", a.dataset.nav === target));
            document.body.classList.remove("menu-open");
        }

        nav.addEventListener("click", function (event) {
            const link = event.target.closest("a[data-nav]");
            if (!link) return;
            event.preventDefault();
            showPage(link.dataset.nav);
        });

        document.addEventListener("pointerdown", function (event) {
            const button = event.target.closest("button, .primary, .secondary, .player-card, .team-card, .filters button, .back");
            if (!button) return;
            button.classList.remove("is-pressed");
            requestAnimationFrame(() => button.classList.add("is-pressed"));
            setTimeout(() => button.classList.remove("is-pressed"), 180);
        }, {passive:true});

        function refreshPlayers() {
            const grid = document.getElementById("directoryPlayers");
            const count = document.getElementById("directoryPlayerCount");
            if (!grid || typeof players === "undefined") return false;
            const list = players.filter(p => p && p.active !== false);
            if (count) count.textContent = `${list.length} PLAYERS`;
            grid.innerHTML = list.map(player => {
                const name = String(player.name || "Player");
                const initials = name.slice(0,2).toUpperCase();
                const avatar = player.avatar ? `<img src="${String(player.avatar).replace(/"/g,'&quot;')}" alt="">` : `<span>${initials}</span>`;
                const safeName = name.replace(/\\/g,"\\\\").replace(/'/g,"\\'");
                return `<article class="player-card directory-card" onclick="openPlayerByName('${safeName}')"><div class="player-avatar">${avatar}</div><h3>${name.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</h3><div class="player-role">${String(player.role || "Игрок")}</div><div class="directory-card-meta">${String(player.country || "Russia")}</div></article>`;
            }).join("");
            return true;
        }

        window.refresh1MinutePlayersDirectory = refreshPlayers;
        const directoryTimer = setInterval(() => { if (refreshPlayers()) clearInterval(directoryTimer); }, 500);
        setTimeout(() => clearInterval(directoryTimer), 12000);
        nav.querySelector('[data-nav="home"]')?.classList.add("active");
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
    else init();
})();
