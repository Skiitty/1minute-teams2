// ======================================================
// 1MINUTE — APP.JS
// ======================================================

const SUPABASE_URL =
    "https://wzheavazneaybhmgfntn.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK";


// ======================================================
// КОМАНДЫ
// ======================================================

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


// ======================================================
// ИГРОКИ
// ======================================================

let players = {
    "1M Academy": []
};


// Эти два игрока ВСЕГДА являются заменами
const SUBSTITUTE_NAMES = [
    "lqq69",
    "ChapsTea"
];


// ======================================================
// ЭКРАНИРОВАНИЕ
// ======================================================

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


// ======================================================
// ОПРЕДЕЛЕНИЕ СТАТУСА ИГРОКА
// ======================================================

function getPlayerStatus(name) {

    if (
        SUBSTITUTE_NAMES.includes(
            String(name || "")
        )
    ) {

        return "sub";

    }

    return "main";
}


// ======================================================
// ЗАГРУЗКА ИГРОКОВ ИЗ SUPABASE
// ======================================================

async function loadPlayers() {

    try {

        console.log(
            "Загрузка игроков из Supabase..."
        );


        const response = await fetch(
            SUPABASE_URL +
            "/rest/v1/players?select=*&order=id.asc",
            {
                method: "GET",

                headers: {
                    "apikey": SUPABASE_KEY,

                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Supabase HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Игроки получены:",
            data
        );


        players["1M Academy"] =
            data.map(function (player) {

                return {

                    id:
                        player.id,

                    name:
                        player.name ||
                        "Игрок",

                    country:
                        player.country ||
                        "Russia",

                    role:
                        player.role ||
                        "Игрок",

                    avatar:
                        player.avatar ||
                        "",

                    faceit:
                        player.faceit ||
                        "",

                    steam:
                        player.steam ||
                        "",

                    // ВАЖНО:
                    // status из базы НЕ используется
                    status:
                        getPlayerStatus(
                            player.name
                        )

                };

            });


        console.log(
            "Основной состав:",
            players["1M Academy"].filter(
                function (player) {
                    return player.status === "main";
                }
            )
        );


        console.log(
            "Замены:",
            players["1M Academy"].filter(
                function (player) {
                    return player.status === "sub";
                }
            )
        );


        renderTeams();


        handleNavigation();


    } catch (error) {

        console.error(
            "Ошибка загрузки игроков:",
            error
        );


        players["1M Academy"] = [];


        renderTeams();

    }

}


// ======================================================
// НАВИГАЦИЯ
// ======================================================

function showSection(id) {

    document
        .querySelectorAll(".screen")
        .forEach(function (screen) {

            screen.classList.add("hidden");

        });


    const section =
        document.getElementById(id);


    if (section) {

        section.classList.remove("hidden");

    }


    document
        .querySelectorAll("nav a")
        .forEach(function (link) {

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


// ======================================================
// КОМАНДЫ
// ======================================================

function renderTeams() {

    const grid =
        document.getElementById("grid");


    if (!grid) return;


    grid.innerHTML =
        teams.map(function (team) {

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
                            #${team.rank}
                            ·
                            ${team.points} ELO
                        </span>

                        <span class="status active">
                            ACTIVE
                        </span>

                    </div>

                </article>

            `;

        }).join("");

}


// ======================================================
// ФИЛЬТР КОМАНД
// ======================================================

function filterTeams(type, button) {

    document
        .querySelectorAll(".filters button")
        .forEach(function (btn) {

            btn.classList.remove(
                "selected"
            );

        });


    if (button) {

        button.classList.add(
            "selected"
        );

    }


    if (type === "all") {

        renderTeams();

    } else {

        renderTeams(
            teams.filter(function (team) {

                return team.status === type;

            })
        );

    }

}


// ======================================================
// ОТКРЫТЬ КОМАНДУ
// ======================================================

function openTeam(name) {

    const team =
        teams.find(function (item) {

            return item.name === name;

        });


    if (!team) return;


    document
        .querySelectorAll(".screen")
        .forEach(function (screen) {

            screen.classList.add(
                "hidden"
            );

        });


    const page =
        document.getElementById(
            "teamPage"
        );


    if (!page) return;


    page.classList.remove(
        "hidden"
    );


    const list =
        players[team.name] || [];


    const mainPlayers =
        list.filter(function (player) {

            return player.status === "main";

        });


    const substitutePlayers =
        list.filter(function (player) {

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

                    <div class="date">
                        ${esc(player.country)}
                    </div>

                </div>

            </div>

        `;

    }


    const mainHTML =
        mainPlayers.length > 0

        ?

        mainPlayers
            .map(playerCard)
            .join("")

        :

        `
            <p style="
                color:#858c98;
                font-size:13px;
            ">
                Основной состав пока не добавлен.
            </p>
        `;


    const substitutesHTML =
        substitutePlayers.length > 0

        ?

        substitutePlayers
            .map(playerCard)
            .join("")

        :

        `
            <p style="
                color:#858c98;
                font-size:13px;
            ">
                Замены пока не добавлены.
            </p>
        `;


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

                        <b>
                            #${team.rank}
                        </b>

                        <small>
                            Место
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            ${team.points}
                        </b>

                        <small>
                            ELO
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            ${team.matches}
                        </b>

                        <small>
                            Матчей
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            ${Math.round(
                                team.wins /
                                team.matches *
                                100
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
                        Основной состав
                    </h3>

                    ${mainHTML}

                </div>


                <div class="panel">

                    <h3>
                        О команде
                    </h3>

                    <p style="
                        color:#858c98;
                        line-height:1.7;
                        font-size:13px;
                    ">
                        ${esc(
                            team.description
                        )}
                    </p>


                    <div class="date">
                        Победы:
                        ${team.wins}

                        ·

                        Поражения:
                        ${team.matches -
                        team.wins}
                    </div>

                </div>

            </div>


            <div
                class="panel"
                style="
                    margin-top:20px;
                "
            >

                <h3>
                    Замены
                </h3>

                ${substitutesHTML}

            </div>

        </div>

    `;


    location.hash =
        "team/" +
        encodeURIComponent(
            team.name
        );


    window.scrollTo(0, 0);
}


// ======================================================
// ЗАКРЫТЬ КОМАНДУ
// ======================================================

function closeTeam() {

    location.hash =
        "teams";

}


// ======================================================
// ОТКРЫТЬ ИГРОКА
// ======================================================

function openPlayer(
    teamName,
    playerName
) {

    const team =
        teams.find(function (item) {

            return item.name === teamName;

        });


    if (!team) return;


    const list =
        players[teamName] || [];


    const player =
        list.find(function (item) {

            return item.name === playerName;

        });


    if (!player) {

        console.error(
            "Игрок не найден:",
            playerName
        );

        return;

    }


    document
        .querySelectorAll(".screen")
        .forEach(function (screen) {

            screen.classList.add(
                "hidden"
            );

        });


    const page =
        document.getElementById(
            "playerPage"
        );


    if (!page) return;


    page.classList.remove(
        "hidden"
    );


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
                                src="${esc(
                                    player.avatar
                                )}"
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
                                    .substring(
                                        0,
                                        2
                                    )
                                    .toUpperCase()
                            )
                        }

                    </div>


                    <div>

                        <h1>
                            ${esc(
                                player.name
                            )}
                        </h1>


                        <div class="profile-country">
                            ◉ ${esc(
                                player.country
                            )}
                        </div>


                        <div class="role">
                            ${esc(
                                player.role
                            )}
                        </div>


                        <div class="links">

                            ${
                                player.faceit

                                ?

                                `<a
                                    class="link"
                                    target="_blank"
                                    href="${esc(
                                        player.faceit
                                    )}"
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
                                    href="${esc(
                                        player.steam
                                    )}"
                                >
                                    Steam ↗
                                </a>`

                                :

                                ""
                            }

                        </div>


                        <div style="
                            margin-top:16px;
                        ">

                            <button
                                class="edit-btn"
                                onclick="openPlayerEditor(
                                    '${esc(
                                        teamName
                                    )}',
                                    '${esc(
                                        player.name
                                    )}'
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
                            ${esc(
                                team.name
                            )}
                        </b>

                        <small>
                            Команда
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            ${esc(
                                player.role
                            )}
                        </b>

                        <small>
                            Роль
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            ${esc(
                                player.country
                            )}
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
                        font-size:13px;
                    ">

                        Никнейм:
                        <b>
                            ${esc(
                                player.name
                            )}
                        </b>

                        <br>

                        Роль:
                        <b>
                            ${esc(
                                player.role
                            )}
                        </b>

                        <br>

                        Страна:
                        <b>
                            ${esc(
                                player.country
                            )}
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
                        font-size:13px;
                    ">

                        ${esc(
                            team.name
                        )}

                        <br>

                        ${esc(
                            team.country
                        )}

                    </p>


                    <button
                        class="edit-btn"
                        onclick="openTeam(
                            '${esc(
                                team.name
                            )}'
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
        encodeURIComponent(
            teamName
        ) +
        "/" +
        encodeURIComponent(
            player.name
        );


    window.scrollTo(0, 0);
}


// ======================================================
// ЗАКРЫТЬ ИГРОКА
// ======================================================

function closePlayer() {

    const hash =
        decodeURIComponent(
            location.hash.substring(1)
        );


    if (
        hash.startsWith(
            "player/"
        )
    ) {

        const parts =
            hash.substring(7)
                .split("/");


        if (parts[0]) {

            location.hash =
                "team/" +
                encodeURIComponent(
                    parts[0]
                );

            return;

        }

    }


    location.hash =
        "teams";
}


// ======================================================
// РЕДАКТИРОВАНИЕ ИГРОКА
// ======================================================

function openPlayerEditor(
    teamName,
    playerName
) {

    const list =
        players[teamName] || [];


    const player =
        list.find(function (item) {

            return item.name === playerName;

        });


    if (!player) return;


    const modal =
        document.getElementById(
            "playerEditModal"
        );


    if (!modal) return;


    document.getElementById(
        "playerEditOldName"
    ).value =
        player.name;


    document.getElementById(
        "playerEditTeam"
    ).value =
        teamName;


    document.getElementById(
        "playerEditName"
    ).value =
        player.name;


    document.getElementById(
        "playerEditCountry"
    ).value =
        player.country || "";


    document.getElementById(
        "playerEditRole"
    ).value =
        player.role || "Игрок";


    document.getElementById(
        "playerEditAvatar"
    ).value =
        player.avatar || "";


    document.getElementById(
        "playerEditFaceit"
    ).value =
        player.faceit || "";


    document.getElementById(
        "playerEditSteam"
    ).value =
        player.steam || "";


    modal.classList.remove(
        "hidden"
    );
}


// ======================================================
// ЗАКРЫТЬ РЕДАКТОР
// ======================================================

function closePlayerEditor() {

    const modal =
        document.getElementById(
            "playerEditModal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


// ======================================================
// СОХРАНЕНИЕ ИГРОКА В SUPABASE
// ======================================================

const playerEditForm =
    document.getElementById(
        "playerEditForm"
    );


if (playerEditForm) {

    playerEditForm.addEventListener(
        "submit",
        async function (event) {

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


            const newName =
                document.getElementById(
                    "playerEditName"
                ).value.trim();


            const country =
                document.getElementById(
                    "playerEditCountry"
                ).value.trim();


            const role =
                document.getElementById(
                    "playerEditRole"
                ).value;


            const avatar =
                document.getElementById(
                    "playerEditAvatar"
                ).value.trim();


            const faceit =
                document.getElementById(
                    "playerEditFaceit"
                ).value.trim();


            const steam =
                document.getElementById(
                    "playerEditSteam"
                ).value.trim();


            try {

                const response =
                    await fetch(

                        SUPABASE_URL +
                        "/rest/v1/players?id=eq." +
                        encodeURIComponent(
                            player.id
                        ),

                        {
                            method: "PATCH",

                            headers: {

                                "apikey":
                                    SUPABASE_KEY,

                                "Authorization":
                                    "Bearer " +
                                    SUPABASE_KEY,

                                "Content-Type":
                                    "application/json",

                                "Prefer":
                                    "return=minimal"

                            },

                            body:
                                JSON.stringify({

                                    name:
                                        newName,

                                    country:
                                        country,

                                    role:
                                        role,

                                    avatar:
                                        avatar,

                                    faceit:
                                        faceit,

                                    steam:
                                        steam

                                })

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "HTTP " +
                        response.status
                    );

                }


                player.name =
                    newName;


                player.country =
                    country;


                player.role =
                    role;


                player.avatar =
                    avatar;


                player.faceit =
                    faceit;


                player.steam =
                    steam;


                // После изменения ника
                // заново определяем замену

                player.status =
                    getPlayerStatus(
                        newName
                    );


                closePlayerEditor();


                openPlayer(
                    teamName,
                    newName
                );


            } catch (error) {

                console.error(
                    "Ошибка сохранения:",
                    error
                );


                alert(
                    "Не удалось сохранить игрока."
                );

            }

        }
    );

}


// ======================================================
// РЕЙТИНГ
// ======================================================

function renderRating() {

    const rows =
        document.getElementById(
            "ratingRows"
        );


    if (!rows) return;


    rows.innerHTML =
        teams.map(function (team) {

            return `

                <tr>

                    <td>
                        #${team.rank}
                    </td>

                    <td>
                        <b>
                            ${esc(
                                team.name
                            )}
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


// ======================================================
// МАТЧИ
// ======================================================

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


// ======================================================
// ТУРНИРЫ
// ======================================================

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
                Информация о турнирах
                появится позже.
            </p>

        </div>

    `;

}


// ======================================================
// ЗАПУСК
// ======================================================

renderTeams();

renderRating();

renderMatches();

renderTournaments();

loadPlayers();
