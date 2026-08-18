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
    }
];

const defaultPlayers = {
    "1M Academy": [
        {
            name: "XXXOLDAR",
            country: "Russia",
            role: "Anchor",
            avatar: "",
            faceit: "",
            steam: "",
            status: "main"
        },
        {
            name: "Hesoko",
            country: "Russia",
            role: "Sniper",
            avatar: "",
            faceit: "",
            steam: "",
            status: "main"
        },
        {
            name: "yoplo",
            country: "Russia",
            role: "Entry",
            avatar: "",
            faceit: "",
            steam: "",
            status: "main"
        },
        {
            name: "k9yzo",
            country: "Russia",
            role: "Rifle",
            avatar: "",
            faceit: "",
            steam: "",
            status: "main"
        },
        {
            name: "jambo",
            country: "Russia",
            role: "IGL + Support",
            avatar: "",
            faceit: "",
            steam: "",
            status: "main"
        },
        {
            name: "lqq69",
            country: "Russia",
            role: "Rifle",
            avatar: "",
            faceit: "",
            steam: "",
            status: "sub"
        },
        {
            name: "ChapsTea",
            country: "Russia",
            role: "Anchor",
            avatar: "",
            faceit: "",
            steam: "",
            status: "sub"
        }
    ]
};


// =====================================================
// СБРАСЫВАЕМ СТАРЫЙ СОСТАВ ИЗ LOCALSTORAGE
// =====================================================

let players = JSON.parse(
    localStorage.getItem("1minute-players") || "null"
);

const correctNames = [
    "XXXOLDAR",
    "Hesoko",
    "yoplo",
    "k9yzo",
    "jambo",
    "lqq69",
    "ChapsTea"
];

if (!players || !players["1M Academy"]) {

    players = JSON.parse(
        JSON.stringify(defaultPlayers)
    );

} else {

    players["1M Academy"] =
        players["1M Academy"].filter(function(player) {

            return correctNames.includes(player.name);

        });

    correctNames.forEach(function(name) {

        const exists =
            players["1M Academy"].some(function(player) {
                return player.name === name;
            });

        if (!exists) {

            const original =
                defaultPlayers["1M Academy"].find(function(player) {
                    return player.name === name;
                });

            if (original) {
                players["1M Academy"].push(
                    JSON.parse(JSON.stringify(original))
                );
            }

        }

    });

}

localStorage.setItem(
    "1minute-players",
    JSON.stringify(players)
);


// =====================================================
// ESC
// =====================================================

function esc(value) {

    return String(value || "").replace(
        /[&<>"']/g,
        function(char) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];

        }
    );

}


// =====================================================
// НАВИГАЦИЯ
// =====================================================

function showSection(id) {

    document
        .querySelectorAll(".screen")
        .forEach(function(screen) {

            screen.classList.add("hidden");

        });

    const section =
        document.getElementById(id);

    if (section) {

        section.classList.remove("hidden");

    }

    document
        .querySelectorAll("nav a")
        .forEach(function(link) {

            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                "#" + id
            ) {

                link.classList.add("active");

            }

        });

    window.scrollTo(0, 0);
}


function handleNavigation() {

    const hash =
        decodeURIComponent(
            location.hash.substring(1)
        );

    if (hash.startsWith("player/")) {

        const parts =
            hash.substring(7).split("/");

        if (parts.length >= 2) {

            openPlayer(
                parts[0],
                parts[1]
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

    if (
        hash === "teams" ||
        hash === "rating" ||
        hash === "matches" ||
        hash === "tournaments"
    ) {

        showSection(hash);

        return;
    }

    showSection("teams");
}


window.addEventListener(
    "hashchange",
    handleNavigation
);


// =====================================================
// КОМАНДЫ
// =====================================================

function renderTeams(list = teams) {

    const grid =
        document.getElementById("grid");

    if (!grid) return;

    grid.innerHTML =
        list.map(function(team) {

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


function filterTeams(type, button) {

    document
        .querySelectorAll(".filters button")
        .forEach(function(btn) {

            btn.classList.remove("selected");

        });

    if (button) {
        button.classList.add("selected");
    }

    if (type === "all") {

        renderTeams(teams);

    } else {

        renderTeams(
            teams.filter(function(team) {
                return team.status === type;
            })
        );

    }

}


// =====================================================
// СТРАНИЦА КОМАНДЫ
// =====================================================

function openTeam(name) {

    const team =
        teams.find(function(team) {
            return team.name === name;
        });

    if (!team) return;

    document
        .querySelectorAll(".screen")
        .forEach(function(screen) {
            screen.classList.add("hidden");
        });

    const page =
        document.getElementById("teamPage");

    if (!page) return;

    page.classList.remove("hidden");

    const list =
        players[team.name] || [];

    const main =
        list.filter(function(player) {
            return player.status === "main";
        });

    const subs =
        list.filter(function(player) {
            return player.status === "sub";
        });


    function playerCard(player) {

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
                        ?
                        `<img
                            src="${esc(player.avatar)}"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                                border-radius:8px;
                            "
                        >`
                        :
                        esc(
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

    }


    document.getElementById(
        "teamProfile"
    ).innerHTML = `

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
                                target="_blank"
                                href="${esc(team.faceit)}"
                            >
                                FACEIT ↗
                            </a>

                            <a
                                class="link"
                                target="_blank"
                                href="${esc(team.steam)}"
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
                                team.wins /
                                team.matches *
                                100
                            )}%
                        </b>
                        <small>Win rate</small>
                    </div>

                </div>

            </div>


            <div class="profile-grid">

                <div class="panel">

                    <h3>
                        Основной состав
                    </h3>

                    ${main.map(playerCard).join("")}

                </div>


                <div class="panel">

                    <h3>
                        О команде
                    </h3>

                    <p
                        style="
                            color:#858c98;
                            line-height:1.7;
                            font-size:13px;
                        "
                    >
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


            <div
                class="panel"
                style="margin-top:20px;"
            >

                <h3>
                    Замены
                </h3>

                ${subs.map(playerCard).join("")}

            </div>

        </div>
    `;


    location.hash =
        "team/" +
        encodeURIComponent(team.name);

    window.scrollTo(0, 0);
}


function closeTeam() {

    location.hash = "teams";

}


// =====================================================
// ИГРОК
// =====================================================

function openPlayer(teamName, playerName) {

    const team =
        teams.find(function(team) {
            return team.name === teamName;
        });

    if (!team) return;


    const list =
        players[teamName] || [];

    const player =
        list.find(function(player) {
            return player.name === playerName;
        });

    if (!player) return;


    document
        .querySelectorAll(".screen")
        .forEach(function(screen) {
            screen.classList.add("hidden");
        });


    const page =
        document.getElementById("playerPage");

    if (!page) return;

    page.classList.remove("hidden");


    document.getElementById(
        "playerProfile"
    ).innerHTML = `

        <div class="profile">

            <div class="profile-hero">

                <div class="profile-top">

                    <div class="profile-logo">

                        ${
                            player.avatar
                            ?
                            `<img
                                src="${esc(player.avatar)}"
                                style="
                                    width:100%;
                                    height:100%;
                                    object-fit:cover;
                                    border-radius:16px;
                                "
                            >`
                            :
                            esc(
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
                            ◉ ${esc(player.country)}
                        </div>

                        <div class="role">
                            ${esc(player.role)}
                        </div>

                        <div class="links">

                            ${
                                player.faceit
                                ?
                                `<a
                                    class="link"
                                    target="_blank"
                                    href="${esc(player.faceit)}"
                                >
                                    FACEIT ↗
                                </a>`
                                :
                                ""
                            }

                            ${
                                player.steam
                                ?
                                `<a
                                    class="link"
                                    target="_blank"
                                    href="${esc(player.steam)}"
                                >
                                    Steam ↗
                                </a>`
                                :
                                ""
                            }

                        </div>


                        <div style="margin-top:16px;">

                            <button
                                class="edit-btn"
                                onclick="openPlayerEditor(
                                    '${esc(teamName)}',
                                    '${esc(player.name)}'
                                )"
                            >
                                ✎ Редактировать профиль
                            </button>

                        </div>

                    </div>

                </div>


                <div class="profile-stats">

                    <div class="stat">
                        <b>
                            ${esc(team.name)}
                        </b>
                        <small>Команда</small>
                    </div>

                    <div class="stat">
                        <b>
                            ${esc(player.role)}
                        </b>
                        <small>Роль</small>
                    </div>

                    <div class="stat">
                        <b>
                            ${esc(player.country)}
                        </b>
                        <small>Страна</small>
                    </div>

                    <div class="stat">
                        <b>CS2</b>
                        <small>Дисциплина</small>
                    </div>

                </div>

            </div>


            <div class="profile-grid">

                <div class="panel">

                    <h3>
                        Профиль игрока
                    </h3>

                    <p
                        style="
                            color:#858c98;
                            line-height:1.8;
                            font-size:13px;
                        "
                    >

                        Никнейм:
                        <b>${esc(player.name)}</b>

                        <br>

                        Роль:
                        <b>${esc(player.role)}</b>

                        <br>

                        Страна:
                        <b>${esc(player.country)}</b>

                    </p>

                </div>


                <div class="panel">

                    <h3>
                        Команда
                    </h3>

                    <p
                        style="
                            color:#858c98;
                            line-height:1.8;
                            font-size:13px;
                        "
                    >
                        ${esc(team.name)}
                        <br>
                        ${esc(team.country)}
                    </p>

                    <button
                        class="edit-btn"
                        onclick="openTeam(
                            '${esc(team.name)}'
                        )"
                    >
                        ← Открыть команду
                    </button>

                </div>

            </div>

        </div>
    `;


    location.hash =
        "player/" +
        encodeURIComponent(teamName) +
        "/" +
        encodeURIComponent(playerName);

    window.scrollTo(0, 0);
}


function closePlayer() {

    const hash =
        decodeURIComponent(
            location.hash.substring(1)
        );

    if (hash.startsWith("player/")) {

        const parts =
            hash.substring(7).split("/");

        if (parts[0]) {

            location.hash =
                "team/" +
                encodeURIComponent(parts[0]);

            return;

        }

    }

    location.hash = "teams";
}


// =====================================================
// РЕДАКТИРОВАНИЕ ИГРОКА
// =====================================================

function openPlayerEditor(teamName, oldName) {

    const list =
        players[teamName] || [];

    const player =
        list.find(function(player) {
            return player.name === oldName;
        });

    if (!player) return;


    const modal =
        document.getElementById(
            "playerEditModal"
        );

    if (!modal) return;


    document.getElementById(
        "playerEditOldName"
    ).value = player.name;


    document.getElementById(
        "playerEditTeam"
    ).value = teamName;


    document.getElementById(
        "playerEditName"
    ).value = player.name;


    document.getElementById(
        "playerEditCountry"
    ).value = player.country || "";


    document.getElementById(
        "playerEditRole"
    ).value = player.role || "Игрок";


    document.getElementById(
        "playerEditAvatar"
    ).value = player.avatar || "";


    document.getElementById(
        "playerEditFaceit"
    ).value = player.faceit || "";


    document.getElementById(
        "playerEditSteam"
    ).value = player.steam || "";


    modal.classList.remove("hidden");
}


function closePlayerEditor() {

    const modal =
        document.getElementById(
            "playerEditModal"
        );

    if (modal) {

        modal.classList.add("hidden");

    }

}


// =====================================================
// СОХРАНЕНИЕ ИГРОКА
// =====================================================

const playerEditForm =
    document.getElementById(
        "playerEditForm"
    );


if (playerEditForm) {

    playerEditForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const teamName =
                document.getElementById(
                    "playerEditTeam"
                ).value;


            const oldName =
                document.getElementById(
                    "playerEditOldName"
                ).value;


            const list =
                players[teamName] || [];


            const player =
                list.find(function(player) {
                    return player.name === oldName;
                });


            if (!player) return;


            player.name =
                document.getElementById(
                    "playerEditName"
                ).value.trim();


            player.country =
                document.getElementById(
                    "playerEditCountry"
                ).value.trim();


            player.role =
                document.getElementById(
                    "playerEditRole"
                ).value;


            player.avatar =
                document.getElementById(
                    "playerEditAvatar"
                ).value.trim();


            player.faceit =
                document.getElementById(
                    "playerEditFaceit"
                ).value.trim();


            player.steam =
                document.getElementById(
                    "playerEditSteam"
                ).value.trim();


            localStorage.setItem(
                "1minute-players",
                JSON.stringify(players)
            );


            closePlayerEditor();


            openPlayer(
                teamName,
                player.name
            );

        }
    );

}


// =====================================================
// РЕЙТИНГ
// =====================================================

function renderRating() {

    const rows =
        document.getElementById(
            "ratingRows"
        );

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


// =====================================================
// МАТЧИ
// =====================================================

function renderMatches() {

    const list =
        document.getElementById(
            "matchesList"
        );

    if (!list) return;


    list.innerHTML = `

        <div class="match">

            <div>

                <div class="match-name">
                    1M Academy
                </div>

                <div class="date">
                    Матчи скоро появятся
                </div>

            </div>

            <div class="score">
                — : —
            </div>

        </div>

    `;
}


// =====================================================
// ТУРНИРЫ
// =====================================================

function renderTournaments() {

    const grid =
        document.getElementById(
            "tournamentsGrid"
        );

    if (!grid) return;


    grid.innerHTML = `

        <div class="tournament">

            <span class="status">
                Скоро
            </span>

            <h3>
                1Minute Championship
            </h3>

            <p>
                Информация о турнирах появится позже.
            </p>

        </div>

    `;
}


// =====================================================
// START
// =====================================================

renderTeams();
renderRating();
renderMatches();
renderTournaments();

handleNavigation();
