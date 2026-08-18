const teams = [
    {
        name: "1M Academy",
        tag: "1MA",
        country: "Russia",
        status: "active",
        rank: 1,
        matches: 28,
        wins: 22,
        points: 2140,
        faceit: "https://www.faceit.com/",
        steam: "https://steamcommunity.com/",
        description: "Молодой состав 1Minute."
    },
    {
        name: "Velocity",
        tag: "VL",
        country: "Netherlands",
        status: "active",
        rank: 2,
        matches: 27,
        wins: 20,
        points: 2070,
        faceit: "https://www.faceit.com/",
        steam: "https://steamcommunity.com/",
        description: "Состав с агрессивным стилем."
    },
    {
        name: "NightFox",
        tag: "NF",
        country: "Germany",
        status: "active",
        rank: 3,
        matches: 30,
        wins: 19,
        points: 1985,
        faceit: "https://www.faceit.com/",
        steam: "https://steamcommunity.com/",
        description: "Тактическая команда."
    }
];

function esc(value) {
    return String(value || "").replace(/[&<>"']/g, function(c) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c];
    });
}

function renderTeams() {
    const grid = document.getElementById("grid");

    grid.innerHTML = teams.map(function(team) {
        return `
            <article class="team-card" onclick="openTeam('${esc(team.name)}')">

                <div class="team-top">

                    <div class="team-logo">
                        ${esc(team.tag)}
                    </div>

                    <div>

                        <div class="team-name">
                            ${esc(team.name)}
                        </div>

                        <div class="team-country">
                            ◉ ${esc(team.country)}
                        </div>

                    </div>

                </div>

                <div class="team-bottom">

                    <span>
                        #${team.rank} · ${team.points} ELO
                    </span>

                    <span class="status active">
                        ACTIVE
                    </span>

                </div>

            </article>
        `;
    }).join("");
}

function filterTeams(type, button) {

    document
        .querySelectorAll(".filters button")
        .forEach(function(btn) {
            btn.classList.remove("selected");
        });

    button.classList.add("selected");

    const result =
        type === "all"
            ? teams
            : teams.filter(function(team) {
                return team.status === type;
            });

    const grid = document.getElementById("grid");

    grid.innerHTML = result.map(function(team) {
        return `
            <article
                class="team-card"
                onclick="openTeam('${esc(team.name)}')"
            >

                <div class="team-top">

                    <div class="team-logo">
                        ${esc(team.tag)}
                    </div>

                    <div>

                        <div class="team-name">
                            ${esc(team.name)}
                        </div>

                        <div class="team-country">
                            ◉ ${esc(team.country)}
                        </div>

                    </div>

                </div>

                <div class="team-bottom">

                    <span>
                        #${team.rank} · ${team.points} ELO
                    </span>

                    <span class="status active">
                        ACTIVE
                    </span>

                </div>

            </article>
        `;
    }).join("");
}

function openTeam(name) {

    const team = teams.find(function(team) {
        return team.name === name;
    });

    if (!team) {
        alert("Команда не найдена");
        return;
    }

    document
        .querySelectorAll(".screen")
        .forEach(function(screen) {
            screen.classList.add("hidden");
        });

    document
        .getElementById("teamPage")
        .classList.remove("hidden");

    document.getElementById("teamProfile").innerHTML = `

        <div class="profile">

            <div class="profile-hero">

                <div class="profile-top">

                    <div class="profile-logo">
                        ${esc(team.tag)}
                    </div>

                    <div>

                        <h1>
                            ${esc(team.name)}
                        </h1>

                        <div class="profile-country">
                            ◉ ${esc(team.country)}
                            · Активная команда
                        </div>

                        <div class="links">

                            <a
                                class="link"
                                href="${esc(team.faceit)}"
                                target="_blank"
                            >
                                FACEIT ↗
                            </a>

                            <a
                                class="link"
                                href="${esc(team.steam)}"
                                target="_blank"
                            >
                                Steam ↗
                            </a>

                        </div>

                    </div>

                </div>

                <div class="profile-stats">

                    <div class="stat">
                        <b>#${team.rank}</b>
                        <small>Место</small>
                    </div>

                    <div class="stat">
                        <b>${team.points}</b>
                        <small>ELO</small>
                    </div>

                    <div class="stat">
                        <b>${team.matches}</b>
                        <small>Матчей</small>
                    </div>

                    <div class="stat">
                        <b>${Math.round(team.wins / team.matches * 100)}%</b>
                        <small>Win rate</small>
                    </div>

                </div>

            </div>

            <div class="profile-grid">

                <div class="panel">

                    <h3>
                        Состав
                    </h3>

                    <div class="player">
                        <div class="mini">S1</div>
                        <div>
                            <b>s1mple</b>
                            <div class="role">Капитан</div>
                        </div>
                    </div>

                    <div class="player">
                        <div class="mini">EL</div>
                        <div>
                            <b>electroNic</b>
                            <div class="role">Игрок</div>
                        </div>
                    </div>

                    <div class="player">
                        <div class="mini">B1</div>
                        <div>
                            <b>b1t</b>
                            <div class="role">Игрок</div>
                        </div>
                    </div>

                    <div class="player">
                        <div class="mini">PE</div>
                        <div>
                            <b>Perfecto</b>
                            <div class="role">Игрок</div>
                        </div>
                    </div>

                    <div class="player">
                        <div class="mini">AX</div>
                        <div>
                            <b>Ax1Le</b>
                            <div class="role">Игрок</div>
                        </div>
                    </div>

                </div>

                <div class="panel">

                    <h3>
                        О команде
                    </h3>

                    <p style="color:#858c98;line-height:1.7;font-size:13px">
                        ${esc(team.description)}
                    </p>

                    <div class="date">
                        Победы: ${team.wins}
                        ·
                        Поражения: ${team.matches - team.wins}
                    </div>

                </div>

            </div>

        </div>
    `;

    location.hash = "team/" + encodeURIComponent(team.name);

    window.scrollTo(0, 0);
}

function closeTeam() {

    document
        .querySelectorAll(".screen")
        .forEach(function(screen) {
            screen.classList.add("hidden");
        });

    document
        .getElementById("teams")
        .classList.remove("hidden");

    location.hash = "teams";

    window.scrollTo(0, 0);
}

function renderRating() {

    const rows = document.getElementById("ratingRows");

    if (!rows) return;

    rows.innerHTML = teams.map(function(team) {
        return `
            <tr>
                <td>#${team.rank}</td>
                <td><b>${esc(team.name)}</b></td>
                <td>${team.matches}</td>
                <td>${team.wins}</td>
                <td><b>${team.points}</b></td>
            </tr>
        `;
    }).join("");
}

function renderMatches() {

    const box = document.getElementById("matchesList");

    if (!box) return;

    box.innerHTML = `
        <div class="match">
            <div>
                <div class="match-name">
                    1M Academy — Velocity
                </div>
                <div class="date">
                    Сегодня
                </div>
            </div>
            <div class="score">
                16 : 12
            </div>
        </div>
    `;
}

function renderTournaments() {

    const box = document.getElementById("tournamentsGrid");

    if (!box) return;

    box.innerHTML = `
        <div class="tournament">
            <span class="status">
                Активный
            </span>

            <h3>
                1Minute Championship #12
            </h3>

            <p>
                128 команд · 1Minute
            </p>
        </div>
    `;
}

renderTeams();
renderRating();
renderMatches();
renderTournaments();

window.addEventListener("hashchange", function() {

    const hash = decodeURIComponent(
        location.hash.substring(1)
    );

    if (hash.startsWith("team/")) {
        openTeam(hash.substring(5));
    }

});
