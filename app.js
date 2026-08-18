// ===============================
// 1MINUTE TEAMS
// ===============================

// -------------------------------
// TEAMS
// -------------------------------

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
        description:
            "Молодой состав 1Minute, который строится вокруг дисциплины и стабильной игры."
    }
];


// -------------------------------
// PLAYERS
// -------------------------------

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


// -------------------------------
// LOAD PLAYERS
// -------------------------------

let players =
    JSON.parse(
        localStorage.getItem("1minute-players") || "null"
    ) || defaultPlayers;


// -------------------------------
// HELPERS
// -------------------------------

function esc(value) {

    return String(value || "").replace(
        /[&<>"']/g,
        function (char) {

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


// -------------------------------
// SHOW SECTION
// -------------------------------

function showSection(sectionId) {

    document
        .querySelectorAll(".screen")
        .forEach(function (screen) {

            screen.classList.add("hidden");

        });


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.classList.remove("hidden");

    }


    updateActiveNavigation(sectionId);

    window.scrollTo(0, 0);
}


// -------------------------------
// ACTIVE NAVIGATION
// -------------------------------

function updateActiveNavigation(sectionId) {

    document
        .querySelectorAll("nav a")
        .forEach(function (link) {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (href === "#" + sectionId) {

                link.classList.add("active");

            }

        });

}


// -------------------------------
// NAVIGATION
// -------------------------------

function handleNavigation() {

    const hash =
        decodeURIComponent(
            location.hash.slice(1)
        );


    // PLAYER PAGE

    if (hash.startsWith("player/")) {

        const parts =
            hash.slice(7).split("/");


        if (parts.length >= 2) {

            openPlayer(
                parts[0],
                parts[1]
            );

        }

        return;
    }


    // TEAM PAGE

    if (hash.startsWith("team/")) {

        openTeam(
            hash.slice(5)
        );

        return;
    }


    // NORMAL SECTIONS

    if (
        hash === "teams" ||
        hash === "rating" ||
        hash === "matches" ||
        hash === "tournaments"
    ) {

        showSection(hash);

        return;
    }


    // DEFAULT

    showSection("teams");
}


// -------------------------------
// TEAM LIST
// -------------------------------

function renderTeams(list = teams) {

    const grid =
        document.getElementById("grid");

    if (!grid) return;


    grid.innerHTML =
        list.map(function (team) {

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


// -------------------------------
// TEAM FILTER
// -------------------------------

function filterTeams(type, button) {

    document
        .querySelectorAll(".filters button")
        .forEach(function (btn) {

            btn.classList.remove("selected");

        });


    if (button) {

        button.classList.add("selected");

    }


    if (type === "all") {

        renderTeams(teams);

    } else {

        renderTeams(
            teams.filter(function (team) {

                return team.status === type;

            })
        );

    }

}


// -------------------------------
// OPEN TEAM
// -------------------------------

function openTeam(name) {

    const team =
        teams.find(function (item) {

            return item.name === name;

        });


    if (!team) return;


    document
        .querySelectorAll(".screen")
        .forEach(function (screen) {

            screen.classList.add("hidden");

        });


    const teamPage =
        document.getElementById("teamPage");


    if (!teamPage) return;


    teamPage.classList.remove("hidden");


    const teamPlayers =
        players[name] || [];


    const mainPlayers =
        teamPlayers.filter(function (player) {

            return player.status !== "sub";

        });


    const substitutes =
        teamPlayers.filter(function (player) {

            return player.status === "sub";

        });


    const playersHTML =
        mainPlayers.map(function (player) {

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
                                ? `
                                    <img
                                        src="${esc(player.avatar)}"
                                        style="
                                            width:100%;
                                            height:100%;
                                            object-fit:cover;
                                            border-radius:8px
                                        "
                                    >
                                `
                                : esc(
                                    player.name
                                        .slice(0, 2)
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

        }).join("");


    const substitutesHTML =
        substitutes.length
            ? `
                <div class="panel" style="margin-top:20px">

                    <h3>
                        Замены
                    </h3>

                    ${substitutes.map(function (player) {

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
                                            ? `
                                                <img
                                                    src="${esc(player.avatar)}"
                                                    style="
                                                        width:100%;
                                                        height:100%;
                                                        object-fit:cover;
                                                        border-radius:8px
                                                    "
                                                >
                                            `
                                            : esc(
                                                player.name
                                                    .slice(0, 2)
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

                    }).join("")}

                </div>
            `
            : "";


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
                            ${
                                team.status === "active"
                                    ? "Активная команда"
                                    : "Неактивная команда"
                            }
                        </div>


                        <div class="links">

                            ${
                                team.faceit
                                    ? `
                                        <a
                                            class="link"
                                            target="_blank"
                                            href="${esc(team.faceit)}"
                                        >
                                            FACEIT ↗
                                        </a>
                                    `
                                    : ""
                            }


                            ${
                                team.steam
                                    ? `
                                        <a
                                            class="link"
                                            target="_blank"
                                            href="${esc(team.steam)}"
                                        >
                                            Steam ↗
                                        </a>
                                    `
                                    : ""
                            }

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
                            ${
                                team.matches
                                    ? Math.round(
                                        team.wins /
                                        team.matches *
                                        100
                                    )
                                    : 0
                            }%
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

                    ${playersHTML}

                </div>


                <div class="panel">

                    <h3>
                        О команде
                    </h3>

                    <p
                        style="
                            color:#858c98;
                            line-height:1.7;
                            font-size:13px
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


            ${substitutesHTML}

        </div>

    `;


    location.hash =
        "team/" +
        encodeURIComponent(name);


    window.scrollTo(0, 0);

}


// -------------------------------
// CLOSE TEAM
// -------------------------------

function closeTeam() {

    location.hash = "teams";

}


// -------------------------------
// OPEN PLAYER
// -------------------------------

function openPlayer(teamName, playerName) {

    const team =
        teams.find(function (item) {

            return item.name === teamName;

        });


    const list =
        players[teamName] || [];


    const player =
        list.find(function (item) {

            return item.name === playerName;

        });


    if (!team || !player) return;


    document
        .querySelectorAll(".screen")
        .forEach(function (screen) {

            screen.classList.add("hidden");

        });


    const playerPage =
        document.getElementById("playerPage");


    if (!playerPage) return;


    playerPage.classList.remove("hidden");


    document.getElementById("playerProfile").innerHTML = `

        <div class="profile">

            <div class="profile-hero">

                <div class="profile-top">

                    <div class="profile-logo">

                        ${
                            player.avatar
                                ? `
                                    <img
                                        src="${esc(player.avatar)}"
                                        style="
                                            width:100%;
                                            height:100%;
                                            object-fit:cover;
                                            border-radius:16px
                                        "
                                    >
                                `
                                : esc(
                                    player.name
                                        .slice(0, 2)
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
                                    ? `
                                        <a
                                            class="link"
                                            target="_blank"
                                            href="${esc(player.faceit)}"
                                        >
                                            FACEIT ↗
                                        </a>
                                    `
                                    : ""
                            }


                            ${
                                player.steam
                                    ? `
                                        <a
                                            class="link"
                                            target="_blank"
                                            href="${esc(player.steam)}"
                                        >
                                            Steam ↗
                                        </a>
                                    `
                                    : ""
                            }

                        </div>


                        <div style="margin-top:16px">

                            <button
                                class="edit-btn"
                                onclick="openPlayerEditor(
                                    '${esc(team.name)}',
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
                        <b>${esc(team.name)}</b>
                        <small>Команда</small>
                    </div>

                    <div class="stat">
                        <b>${esc(player.role)}</b>
                        <small>Роль</small>
                    </div>

                    <div class="stat">
                        <b>${esc(player.country)}</b>
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
                            font-size:13px
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
                            font-size:13px
                        "
                    >

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
        encodeURIComponent(teamName) +
        "/" +
        encodeURIComponent(playerName);


    window.scrollTo(0, 0);

}


// -------------------------------
// CLOSE PLAYER
// -------------------------------

function closePlayer() {

    const hash =
        decodeURIComponent(
            location.hash.slice(1)
        );


    if (hash.startsWith("player/")) {

        const parts =
            hash.slice(7).split("/");


        if (parts[0]) {

            location.hash =
                "team/" +
                encodeURIComponent(parts[0]);

            return;

        }

    }


    location.hash = "teams";

}


// -------------------------------
// PLAYER EDITOR
// -------------------------------

function openPlayerEditor(teamName, oldName) {

    const list =
        players[teamName] || [];


    const player =
        list.find(function (item) {

            return item.name === oldName;

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


// -------------------------------
// CLOSE PLAYER EDITOR
// -------------------------------

function closePlayerEditor() {

    const modal =
        document.getElementById(
            "playerEditModal"
        );


    if (modal) {

        modal.classList.add("hidden");

    }

}


// -------------------------------
// PLAYER EDIT FORM
// -------------------------------

const playerEditForm =
    document.getElementById(
        "playerEditForm"
    );


if (playerEditForm) {

    playerEditForm.addEventListener(
        "submit",
        function (event) {

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
                list.find(function (item) {

                    return item.name === oldName;

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


// -------------------------------
// RATING
// -------------------------------

function renderRating() {

    const ratingRows =
        document.getElementById(
            "ratingRows"
        );


    if (!ratingRows) return;


    ratingRows.innerHTML =
        teams.map(function (team) {

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


// -------------------------------
// MATCHES
// -------------------------------

function renderMatches() {

    const matches =
        document.getElementById(
            "matchesList"
        );


    if (!matches) return;


    matches.innerHTML = `

        <div class="match">

            <div>

                <div class="match-name">
                    1M Academy — соперник
                </div>

                <div class="date">
                    Скоро
                </div>

            </div>

            <div class="score">
                — : —
            </div>

        </div>

    `;

}


// -------------------------------
// TOURNAMENTS
// -------------------------------

function renderTournaments() {

    const tournaments =
        document.getElementById(
            "tournamentsGrid"
        );


    if (!tournaments) return;


    tournaments.innerHTML = `

        <div class="tournament">

            <span class="status">
                Скоро
            </span>

            <h3>
                1Minute Championship
            </h3>

            <p>
                Информация о турнире появится позже.
            </p>

        </div>

    `;

}


// -------------------------------
// TEAM EDITOR
// -------------------------------

function openEditor(name) {

    const team =
        teams.find(function (item) {

            return item.name === name;

        });


    if (!team) return;


    document.getElementById(
        "editName"
    ).value = team.name;


    document.getElementById(
        "editTitle"
    ).value = team.name;


    document.getElementById(
        "editTag"
    ).value = team.tag;


    document.getElementById(
        "editCountry"
    ).value = team.country;


    document.getElementById(
        "editLogo"
    ).value = team.logo || "";


    document.getElementById(
        "editFaceit"
    ).value = team.faceit || "";


    document.getElementById(
        "editSteam"
    ).value = team.steam || "";


    document.getElementById(
        "editDescription"
    ).value = team.description || "";


    document.getElementById(
        "editModal"
    ).classList.remove("hidden");

}


// -------------------------------
// CLOSE TEAM EDITOR
// -------------------------------

function closeEditor() {

    const modal =
        document.getElementById(
            "editModal"
        );


    if (modal) {

        modal.classList.add("hidden");

    }

}


// -------------------------------
// TEAM EDIT FORM
// -------------------------------

const editForm =
    document.getElementById(
        "editForm"
    );


if (editForm) {

    editForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const oldName =
                document.getElementById(
                    "editName"
                ).value;


            const team =
                teams.find(function (item) {

                    return item.name === oldName;

                });


            if (!team) return;


            team.name =
                document.getElementById(
                    "editTitle"
                ).value.trim();


            team.tag =
                document.getElementById(
                    "editTag"
                ).value.trim()
                .toUpperCase();


            team.country =
                document.getElementById(
                    "editCountry"
                ).value.trim();


            team.logo =
                document.getElementById(
                    "editLogo"
                ).value.trim();


            team.faceit =
                document.getElementById(
                    "editFaceit"
                ).value.trim();


            team.steam =
                document.getElementById(
                    "editSteam"
                ).value.trim();


            team.description =
                document.getElementById(
                    "editDescription"
                ).value.trim();


            localStorage.setItem(
                "1minute-teams",
                JSON.stringify(teams)
            );


            closeEditor();


            renderTeams();


            openTeam(team.name);

        }
    );

}


// -------------------------------
// INITIAL RENDER
// -------------------------------

renderTeams();
renderRating();
renderMatches();
renderTournaments();


// -------------------------------
// HASH NAVIGATION
// -------------------------------

window.addEventListener(
    "hashchange",
    handleNavigation
);


handleNavigation();
