const SUPABASE_URL = "https://wzheavazneaybhmgfntn.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK";

const TEAM_NAME = "1Minute";

const STARTERS = [
    "Hesoko",
    "sk1pp",
    "k9yzo",
    "XXXOLDAR",
    "yoplo"
];

const SUBSTITUTES = [
    "lqq69",
    "ChapsTea"
];

let players = [];

const team = {
    name: "1Minute",
    title: "1Minute",
    tag: "1M",
    country: "Russia",
    logo: "",
    faceit: "",
    steam: "",
    description: "Профили состава, матчи и статистика 1Minute — всё в одном месте.",
    status: "active"
};


/* =========================================================
   SUPABASE
========================================================= */

async function supabase(path, options) {
    options = options || {};

    const headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json"
    };

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const response = await fetch(
        SUPABASE_URL + "/rest/v1/" + path,
        {
            method: options.method || "GET",
            headers: headers,
            body: options.body
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error(
            "Supabase error:",
            response.status,
            errorText
        );

        throw new Error(errorText);
    }

    const text = await response.text();

    if (!text) {
        return [];
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return [];
    }
}


/* =========================================================
   HELPERS
========================================================= */

function normalize(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}


function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function findPlayer(name) {
    const target = normalize(name);

    return players.find(function(player) {
        return normalize(player.name) === target;
    });
}


function getPlayersByNames(names) {
    return names
        .map(function(name) {
            return findPlayer(name);
        })
        .filter(Boolean);
}


function safeJSString(value) {
    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
}


/* =========================================================
   LOAD PLAYERS
========================================================= */

async function loadPlayers() {

    try {

        const data = await supabase(
            "players?select=*&order=id.asc"
        );

        players =
            Array.isArray(data)
                ? data
                : [];

        return players;

    } catch (error) {

        console.error(
            "Ошибка загрузки игроков:",
            error
        );

        players = [];

        return [];
    }
}


/* =========================================================
   TEAM CARD
========================================================= */

function renderTeams() {

    const grid =
        document.getElementById("grid");

    if (!grid) {
        return;
    }

    grid.innerHTML = `
        <div
            class="team-card"
            onclick="openTeam()"
        >

            <div class="team-top">

                <div class="team-logo">

                    ${
                        team.logo
                            ? `
                                <img
                                    src="${escapeHTML(team.logo)}"
                                    alt="1Minute"
                                >
                              `
                            : `
                                <span>1</span>
                              `
                    }

                </div>


                <div>

                    <div class="team-name">
                        ${escapeHTML(team.name)}
                    </div>

                    <div class="team-country">
                        ${escapeHTML(team.country)}
                    </div>

                </div>

            </div>


            <div class="team-bottom">

                <span>
                    ${escapeHTML(team.tag)}
                </span>

                <span class="status active">
                    ● ACTIVE
                </span>

            </div>

        </div>
    `;
}


/* =========================================================
   PLAYER CARD
========================================================= */

function playerCard(player, isSubstitute) {

    const name =
        player.name || "Player";

    const role =
        player.role || "Игрок";

    const avatar =
        player.avatar || "";

    const faceit =
        player.faceit || "";

    const steam =
        player.steam || "";

    const discord =
        player.discord || "";

    const safeName =
        safeJSString(name);

    const normalizedRole =
        normalize(role);

    const isCaptain =
        normalizedRole.includes("капитан") ||
        normalizedRole.includes("captain") ||
        normalizedRole.includes("igl");


    return `
        <div
            class="player-card ${isSubstitute ? "substitute-card" : ""}"
            onclick="openPlayerByName('${safeName}')"
        >


            <div class="player-avatar">

                ${
                    avatar
                        ? `
                            <img
                                src="${escapeHTML(avatar)}"
                                alt="${escapeHTML(name)}"
                            >
                          `
                        : `
                            <span>
                                ${escapeHTML(
                                    String(name)
                                        .slice(0, 2)
                                        .toUpperCase()
                                )}
                            </span>
                          `
                }

            </div>


            <div class="player-info">

                <h3>
                    ${escapeHTML(name)}
                </h3>


                <div class="player-badges">

                    <span class="player-badge">
                        ${isSubstitute
                            ? "ЗАМЕНА"
                            : "ОСНОВА"}
                    </span>


                    ${
                        isCaptain
                            ? `
                                <span class="player-badge captain">
                                    ♛ КАПИТАН
                                </span>
                              `
                            : ""
                    }

                </div>

            </div>


            <div class="player-links">

                ${
                    steam
                        ? `
                            <a
                                href="${escapeHTML(steam)}"
                                target="_blank"
                                rel="noopener"
                                onclick="event.stopPropagation()"
                            >
                                Steam ↗
                            </a>
                          `
                        : `
                            <span class="link-disabled">
                                Steam
                            </span>
                          `
                }


                ${
                    faceit
                        ? `
                            <a
                                href="${escapeHTML(faceit)}"
                                target="_blank"
                                rel="noopener"
                                onclick="event.stopPropagation()"
                            >
                                FACEIT ↗
                            </a>
                          `
                        : `
                            <span class="link-disabled">
                                FACEIT
                            </span>
                          `
                }


                ${
                    discord
                        ? `
                            <a
                                class="discord-link"
                                href="${escapeHTML(discord)}"
                                target="_blank"
                                rel="noopener"
                                onclick="event.stopPropagation()"
                            >
                                Discord
                            </a>
                          `
                        : ""
                }

            </div>

        </div>
    `;
}


/* =========================================================
   OPEN TEAM
========================================================= */

function openTeam() {

    const teams =
        document.getElementById("teams");

    const teamPage =
        document.getElementById("teamPage");

    const playerPage =
        document.getElementById("playerPage");


    if (teams) {
        teams.classList.add("hidden");
    }


    if (playerPage) {
        playerPage.classList.add("hidden");
    }


    hideOtherPages();


    if (teamPage) {
        teamPage.classList.remove("hidden");
    }


    renderTeamProfile();


    window.location.hash =
        "teamPage";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   TEAM PROFILE
========================================================= */

function renderTeamProfile() {

    const container =
        document.getElementById(
            "teamProfile"
        );

    if (!container) {
        return;
    }


    const starters =
        getPlayersByNames(
            STARTERS
        );


    const substitutes =
        getPlayersByNames(
            SUBSTITUTES
        );


    let startersHTML = "";

    let substitutesHTML = "";


    if (starters.length === 0) {

        startersHTML = `
            <div
                class="glass roster-empty"
                style="padding:24px;"
            >
                Игроки пока не загружены.
            </div>
        `;

    } else {

        startersHTML =
            starters
                .map(function(player) {

                    return playerCard(
                        player,
                        false
                    );

                })
                .join("");
    }


    if (substitutes.length === 0) {

        substitutesHTML = `
            <div
                class="glass roster-empty"
                style="padding:24px;"
            >
                Замены пока не загружены.
            </div>
        `;

    } else {

        substitutesHTML =
            substitutes
                .map(function(player) {

                    return playerCard(
                        player,
                        true
                    );

                })
                .join("");
    }


    container.innerHTML = `

        <div class="team-profile">


            <div class="team-profile-header">


                <div class="team-profile-main">


                    <div class="team-profile-logo">

                        ${
                            team.logo
                                ? `
                                    <img
                                        src="${escapeHTML(team.logo)}"
                                        alt="1Minute"
                                    >
                                  `
                                : `
                                    <span>1M</span>
                                  `
                        }

                    </div>


                    <div class="team-profile-info">

                        <div class="eyebrow">
                            TEAM
                        </div>


                        <h1>
                            ${escapeHTML(
                                team.name
                            )}
                        </h1>


                        <div class="team-meta">

                            <span>
                                TAG:
                                ${escapeHTML(
                                    team.tag
                                )}
                            </span>


                            <span class="tier-badge">
                                TIER 3
                            </span>


                            <span class="team-status">

                                <span>
                                    ●
                                </span>

                                ACTIVE

                            </span>

                        </div>


                        <p>
                            ${escapeHTML(
                                team.description
                            )}
                        </p>

                    </div>

                </div>


                <button
                    class="team-logo-download"
                    type="button"
                    onclick="downloadTeamLogo()"
                >
                    ↓ &nbsp; DOWNLOAD LOGO
                </button>

            </div>


            <div class="roster">


                <div class="roster-title">

                    <div class="roster-title-left">

                        <span
                            class="roster-dot blue"
                        ></span>


                        <h2>
                            ОСНОВНОЙ СОСТАВ
                            (${starters.length})
                        </h2>

                    </div>


                    <span
                        class="roster-label blue-label"
                    >
                        STARTING ROSTER
                    </span>

                </div>


                <div class="player-grid">
                    ${startersHTML}
                </div>


                <div
                    class="roster-title substitutes-title"
                >

                    <div
                        class="roster-title-left"
                    >

                        <span
                            class="roster-dot purple"
                        ></span>


                        <h2>
                            ЗАМЕНА
                            (${substitutes.length})
                        </h2>

                    </div>


                    <span
                        class="roster-label purple-label"
                    >
                        SUBSTITUTES
                    </span>

                </div>


                <div class="player-grid">
                    ${substitutesHTML}
                </div>


            </div>

        </div>
    `;
}


/* =========================================================
   DOWNLOAD TEAM LOGO
========================================================= */

function downloadTeamLogo() {

    if (!team.logo) {

        alert(
            "Логотип команды пока не установлен."
        );

        return;
    }


    const link =
        document.createElement("a");


    link.href =
        team.logo;


    link.download =
        "1Minute-logo";


    link.target =
        "_blank";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();
}


/* =========================================================
   OPEN PLAYER
========================================================= */

function openPlayerByName(name) {

    const player =
        findPlayer(name);


    if (!player) {

        console.error(
            "Игрок не найден:",
            name
        );

        return;
    }


    const teams =
        document.getElementById(
            "teams"
        );


    const teamPage =
        document.getElementById(
            "teamPage"
        );


    const playerPage =
        document.getElementById(
            "playerPage"
        );


    if (teams) {
        teams.classList.add(
            "hidden"
        );
    }


    if (teamPage) {
        teamPage.classList.add(
            "hidden"
        );
    }


    hideOtherPages();


    if (playerPage) {
        playerPage.classList.remove(
            "hidden"
        );
    }


    renderPlayerProfile(
        player
    );


    window.location.hash =
        "playerPage";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   PLAYER PROFILE
========================================================= */

function renderPlayerProfile(player) {

    const container =
        document.getElementById(
            "playerProfile"
        );


    if (!container) {
        return;
    }


    const name =
        player.name || "Player";


    const role =
        player.role || "Игрок";


    const avatar =
        player.avatar || "";


    const faceit =
        player.faceit || "";


    const steam =
        player.steam || "";


    container.innerHTML = `

        <div class="player-profile">


            <div
                class="player-profile-avatar"
            >

                ${
                    avatar
                        ? `
                            <img
                                src="${escapeHTML(
                                    avatar
                                )}"
                                alt="${escapeHTML(
                                    name
                                )}"
                            >
                          `
                        : `
                            <span>
                                ${escapeHTML(
                                    String(name)
                                        .slice(0, 2)
                                        .toUpperCase()
                                )}
                            </span>
                          `
                }

            </div>


            <div class="eyebrow">
                PLAYER PROFILE
            </div>


            <h1>
                ${escapeHTML(name)}
            </h1>


            <div class="player-role">
                ${escapeHTML(role)}
            </div>


            <p>
                Игрок команды
                ${escapeHTML(
                    team.name
                )}
            </p>


            <div class="player-links">

                ${
                    steam
                        ? `
                            <a
                                class="secondary"
                                href="${escapeHTML(
                                    steam
                                )}"
                                target="_blank"
                                rel="noopener"
                            >
                                Steam ↗
                            </a>
                          `
                        : ""
                }


                ${
                    faceit
                        ? `
                            <a
                                class="secondary"
                                href="${escapeHTML(
                                    faceit
                                )}"
                                target="_blank"
                                rel="noopener"
                            >
                                FACEIT ↗
                            </a>
                          `
                        : ""
                }

            </div>


            <div
                class="player-profile-actions"
            >

                <button
                    class="edit-btn"
                    onclick="openPlayerEditor('${safeJSString(name)}')"
                >
                    Редактировать профиль
                </button>

            </div>

        </div>
    `;
}
