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
        description: "Молодой состав 1Minute, который строится вокруг дисциплины и стабильной игры."
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
        description: "Состав с агрессивным стилем и быстрым темпом."
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
        description: "Тактическая команда с упором на командную игру."
    }
];


/* =========================
   ИГРОКИ
========================= */

const players = {

    "1M Academy": [
        {
            name: "s1mple",
            country: "Russia",
            role: "Капитан",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "electroNic",
            country: "Russia",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "b1t",
            country: "Ukraine",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "Perfecto",
            country: "Russia",
            role: "Support",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "Ax1Le",
            country: "Russia",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        }
    ],

    "Velocity": [
        {
            name: "m0NESY",
            country: "Russia",
            role: "AWPer",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "NiKo",
            country: "Bosnia",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "huNter-",
            country: "Bosnia",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "jks",
            country: "Australia",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "malbsMd",
            country: "Guatemala",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        }
    ],

    "NightFox": [
        {
            name: "donk",
            country: "Russia",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "sh1ro",
            country: "Russia",
            role: "AWPer",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "magixx",
            country: "Russia",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "zont1x",
            country: "Russia",
            role: "Rifler",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        },
        {
            name: "chopper",
            country: "Russia",
            role: "IGL",
            avatar: "",
            faceit: "https://www.faceit.com/",
            steam: "https://steamcommunity.com/"
        }
    ]
};


/* =========================
   БЕЗОПАСНЫЙ ТЕКСТ
========================= */

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


/* =========================
   КАРТОЧКА КОМАНДЫ
========================= */

function renderTeams(list = teams) {

    const grid = document.getElementById("grid");

    if (!grid) return;

    grid.innerHTML = list.map(function(team) {

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

                    <span class="status ${team.status}">
                        ${team.status === "active"
                            ? "ACTIVE"
                            : "INACTIVE"}
                    </span>

                </div>

            </article>

        `;

    }).join("");

}


/* =========================
   ФИЛЬТРЫ
========================= */

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


    renderTeams(result);

}


/* =========================
   ОТКРЫТИЕ КОМАНДЫ
========================= */

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


    const teamPlayers = players[team.name] || [];


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
                            ·
                            ${team.status === "active"
                                ? "Активная команда"
                                : "Неактивная команда"}
                        </div>

                        <div class="links">

                            <a
                                class="link"
                                href="${esc(team.faceit)}"
                                target="_blank"
                                rel="noopener"
                            >
                                FACEIT ↗
                            </a>

                            <a
                                class="link"
                                href="${esc(team.steam)}"
                                target="_blank"
                                rel="noopener"
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

                        <b>
                            ${Math.round(
                                team.wins / team.matches * 100
                            )}%
                        </b>

                        <small>
                            Win rate
                        </small>

                    </div>

                </div>

            </div>


            <div class="profile-grid">


                <div class="panel">

                    <h3>
                        Состав
                    </h3>


                    ${
                        teamPlayers.map(function(player) {

                            return `

                                <div
                                    class="player"
                                    onclick="openPlayer(
                                        '${esc(team.name)}',
                                        '${esc(player.name)}'
                                    )"
                                    style="cursor:pointer"
                                >

                                    <div class="mini">

                                        ${
                                            player.avatar
                                                ? `<img
                                                    src="${esc(player.avatar)}"
                                                    style="width:100%;height:100%;object-fit:cover;border-radius:8px"
                                                >`
                                                : esc(
                                                    player.name
                                                        .substring(0, 2)
                                                        .toUpperCase()
                                                )
                                        }

                                    </div>

                                    <div>

                                        <b>
                                            ${esc(player.name)}
                                        </b>

                                        <div class="role">
                                            ${esc(player.role)}
                                        </div>

                                    </div>

                                </div>

                            `;

                        }).join("")
                    }

                </div>


                <div class="panel">

                    <h3>
                        О команде
                    </h3>

                    <p style="
                        color:#858c98;
                        line-height:1.7;
                        font-size:13px
                    ">

                        ${esc(team.description)}

                    </p>

                    <div class="date">

                        Победы:
                        ${team.wins}

                        ·

                        Поражения:
                        ${team.matches - team.wins}

                    </div>

                </div>


            </div>

        </div>

    `;


    location.hash =
        "team/" +
        encodeURIComponent(team.name);


    window.scrollTo(0, 0);

}


/* =========================
   НАЗАД К КОМАНДАМ
========================= */

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


/* =========================
   СТРАНИЦА ИГРОКА
========================= */

function openPlayer(teamName, playerName) {

    const team = teams.find(function(team) {

        return team.name === teamName;

    });


    if (!team) return;


    const teamPlayers =
        players[team.name] || [];


    const player =
        teamPlayers.find(function(player) {

            return player.name === playerName;

        });


    if (!player) {

        alert("Игрок не найден");

        return;

    }


    document
        .querySelectorAll(".screen")
        .forEach(function(screen) {

            screen.classList.add("hidden");

        });


    document
        .getElementById("playerPage")
        .classList.remove("hidden");


    document.getElementById("playerProfile").innerHTML = `

        <div class="profile">

            <div class="profile-hero">


                <div class="profile-top">


                    <div class="profile-logo">

                        ${
                            player.avatar

                                ? `<img
                                    src="${esc(player.avatar)}"
                                    alt=""
                                    style="
                                        width:100%;
                                        height:100%;
                                        object-fit:cover;
                                        border-radius:16px;
                                    "
                                >`

                                : esc(
                                    player.name
                                        .substring(0, 2)
                                        .toUpperCase()
                                )
                        }

                    </div>


                    <div>

                        <h1>
                            ${esc(player.name)}
                        </h1>


                        <div class="profile-country">

                            ◉
                            ${esc(player.country)}

                        </div>


                        <div class="role">

                            ${esc(player.role)}

                        </div>


                        <div class="links">


                            ${
                                player.faceit

                                    ? `<a
                                        class="link"
                                        href="${esc(player.faceit)}"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        FACEIT ↗
                                    </a>`

                                    : ""
                            }


                            ${
                                player.steam

                                    ? `<a
                                        class="link"
                                        href="${esc(player.steam)}"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        Steam ↗
                                    </a>`

                                    : ""
                            }


                        </div>

                    </div>

                </div>


                <div class="profile-stats">


                    <div class="stat">

                        <b>
                            ${esc(team.name)}
                        </b>

                        <small>
                            Команда
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            ${esc(player.role)}
                        </b>

                        <small>
                            Роль
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            ${esc(player.country)}
                        </b>

                        <small>
                            Страна
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            CS2
                        </b>

                        <small>
                            Дисциплина
                        </small>

                    </div>


                </div>


            </div>


            <div class="profile-grid">


                <div class="panel">

                    <h3>
                        Профиль игрока
                    </h3>


                    <p style="
                        color:#858c98;
                        line-height:1.8;
                        font-size:13px
                    ">

                        Никнейм:
                        <b>
                            ${esc(player.name)}
                        </b>

                        <br>

                        Роль:
                        <b>
                            ${esc(player.role)}
                        </b>

                        <br>

                        Страна:
                        <b>
                            ${esc(player.country)}
                        </b>

                    </p>

                </div>


                <div class="panel">

                    <h3>
                        Команда
                    </h3>


                    <p style="
                        color:#858c98;
                        line-height:1.8;
                        font-size:13px
                    ">

                        ${esc(team.name)}

                        <br>

                        ${esc(team.country)}

                    </p>


                    <button
                        class="edit-btn"
                        onclick="openTeam('${esc(team.name)}')"
                    >
                        ← Открыть команду
                    </button>


                </div>


            </div>

        </div>

    `;


    location.hash =
        "player/" +
        encodeURIComponent(team.name) +
        "/" +
        encodeURIComponent(player.name);


    window.scrollTo(0, 0);

}


/* =========================
   НАЗАД ОТ ИГРОКА
========================= */

function closePlayer() {

    const hash =
        decodeURIComponent(
            location.hash.substring(1)
        );


    if (hash.startsWith("player/")) {

        const data =
            hash.substring(7).split("/");


        if (data[0]) {

            openTeam(data[0]);

            return;

        }

    }


    closeTeam();

}


/* =========================
   РЕЙТИНГ
========================= */

function renderRating() {

    const rows =
        document.getElementById("ratingRows");


    if (!rows) return;


    rows.innerHTML =
        teams.map(function(team) {

            return `

                <tr>

                    <td>
                        #${team.rank}
                    </td>

                    <td>
                        <b>
                            ${esc(team.name)}
                        </b>
                    </td>

                    <td>
                        ${team.matches}
                    </td>

                    <td>
                        ${team.wins}
                    </td>

                    <td>
                        <b>
                            ${team.points}
                        </b>
                    </td>

                </tr>

            `;

        }).join("");

}


/* =========================
   МАТЧИ
========================= */

function renderMatches() {

    const box =
        document.getElementById("matchesList");


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


        <div class="match">

            <div>

                <div class="match-name">
                    NightFox — Rebels
                </div>

                <div class="date">
                    Вчера
                </div>

            </div>

            <div class="score">
                13 : 16
            </div>

        </div>

    `;

}


/* =========================
   ТУРНИРЫ
========================= */

function renderTournaments() {

    const box =
        document.getElementById("tournamentsGrid");


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


        <div class="tournament">

            <span class="status">
                Активный
            </span>

            <h3>
                1Minute Pro League S4
            </h3>

            <p>
                32 команды · 1Minute
            </p>

        </div>

    `;

}


/* =========================
   ЗАПУСК
========================= */

renderTeams();

renderRating();

renderMatches();

renderTournaments();


/* =========================
   ПЕРЕХОД ПО ССЫЛКЕ
========================= */

window.addEventListener("hashchange", function() {

    const hash =
        decodeURIComponent(
            location.hash.substring(1)
        );


    if (hash.startsWith("player/")) {

        const data =
            hash.substring(7).split("/");


        if (data.length >= 2) {

            openPlayer(
                data[0],
                data[1]
            );

        }

        return;

    }


    if (hash.startsWith("team/")) {

        openTeam(
            hash.substring(5)
        );

        return;

    }

});
