const SUPABASE_URL = "https://wzheavazneaybhmgfntn.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK";

const TEAM_NAME = "1Minute";

const STARTERS = [
    "XXXOLDAR",
    "Hesoko",
    "yoplo",
    "k9yzo",
    "jambo"
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
    } catch {
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

    for (let i = 0; i < players.length; i++) {
        if (normalize(players[i].name) === target) {
            return players[i];
        }
    }

    return null;
}


function getPlayersByNames(names) {
    const result = [];

    for (let i = 0; i < names.length; i++) {
        const player = findPlayer(names[i]);

        if (player) {
            result.push(player);
        }
    }

    return result;
}


/* =========================================================
   LOAD PLAYERS
========================================================= */

async function loadPlayers() {
    try {
        const data = await supabase(
            "players?select=*&order=id.asc"
        );

        if (Array.isArray(data)) {
            players = data;
        } else {
            players = [];
        }

        console.log(
            "Игроки загружены:",
            players
        );

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
    const grid = document.getElementById("grid");

    if (!grid) {
        return;
    }

    const logo = team.logo || "";

    let html = "";

    html += `
        <div class="team-card" onclick="openTeam()">

            <div class="team-top">

                <div class="team-logo">
                    ${
                        logo
                            ? `<img src="${escapeHTML(logo)}" alt="1Minute">`
                            : `<span>1</span>`
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

    grid.innerHTML = html;
}


/* =========================================================
   PLAYER CARD
========================================================= */

function playerCard(player, isSubstitute) {
    const name = player.name || "Player";
    const role = player.role || "Игрок";
    const avatar = player.avatar || "";

    const safeName = String(name)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

    let html = "";

    html += `
        <div
            class="player-card"
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
                                        .charAt(0)
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

                <span>
                    ${escapeHTML(role)}
                </span>

            </div>

            ${
                isSubstitute
                    ? `<div class="player-badge">ЗАМЕНА</div>`
                    : ""
            }

        </div>
    `;

    return html;
}


/* =========================================================
   OPEN TEAM
========================================================= */

function openTeam() {
    const teams = document.getElementById("teams");
    const teamPage = document.getElementById("teamPage");
    const playerPage = document.getElementById("playerPage");

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

    window.location.hash = "teamPage";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   TEAM PROFILE
========================================================= */

function renderTeamProfile() {
    const container = document.getElementById("teamProfile");

    if (!container) {
        return;
    }

    const starters = getPlayersByNames(STARTERS);
    const substitutes = getPlayersByNames(SUBSTITUTES);

    let html = "";

    html += `
        <div class="team-profile">

            <div class="team-profile-header">

                <div class="team-profile-logo">

                    ${
                        team.logo
                            ? `
                                <img
                                    src="${escapeHTML(team.logo)}"
                                    alt="1Minute"
                                >
                              `
                            : `<span>1</span>`
                    }

                </div>

                <div>

                    <div
                        class="eyebrow"
                        style="font-weight:800;"
                    >
                        TEAM
                    </div>

                    <h1>
                        ${escapeHTML(team.name)}
                    </h1>

                    <p>
                        ${escapeHTML(team.description)}
                    </p>

                    <div
                        class="team-profile-status"
                        style="
                            margin-top:12px;
                            display:inline-flex;
                            align-items:center;
                            gap:7px;
                            color:#8ee6ad;
                            background:#0b1710;
                            border:1px solid #21452f;
                            border-radius:6px;
                            padding:5px 9px;
                            font-size:10px;
                            font-weight:800;
                        "
                    >
                        <span>●</span>
                        ACTIVE
                    </div>

                </div>

            </div>


            <div class="roster">

                <div class="section-head">

                    <div>

                        <div class="eyebrow">
                            ROSTER
                        </div>

                        <h2>
                            Основной состав
                        </h2>

                    </div>

                </div>


                <div class="player-grid">

                    ${
                        starters.length === 0
                            ? `
                                <div
                                    class="glass"
                                    style="padding:24px;"
                                >
                                    Игроки пока не загружены.
                                </div>
                              `
                            : starters
                                .map(function(player) {
                                    return playerCard(
                                        player,
                                        false
                                    );
                                })
                                .join("")
                    }

                </div>


                <div class="section-head">

                    <div>

                        <div class="eyebrow">
                            SUBSTITUTES
                        </div>

                        <h2>
                            Замены
                        </h2>

                    </div>

                </div>


                <div class="player-grid">

                    ${
                        substitutes.length === 0
                            ? `
                                <div
                                    class="glass"
                                    style="padding:24px;"
                                >
                                    Замены пока не загружены.
                                </div>
                              `
                            : substitutes
                                .map(function(player) {
                                    return playerCard(
                                        player,
                                        true
                                    );
                                })
                                .join("")
                    }

                </div>

            </div>

        </div>
    `;

    container.innerHTML = html;
}


/* =========================================================
   OPEN PLAYER
========================================================= */

function openPlayerByName(name) {
    const player = findPlayer(name);

    if (!player) {
        console.error(
            "Игрок не найден:",
            name
        );

        return;
    }

    const teams = document.getElementById("teams");
    const teamPage = document.getElementById("teamPage");
    const playerPage = document.getElementById("playerPage");

    if (teams) {
        teams.classList.add("hidden");
    }

    if (teamPage) {
        teamPage.classList.add("hidden");
    }

    hideOtherPages();

    if (playerPage) {
        playerPage.classList.remove("hidden");
    }

    renderPlayerProfile(player);

    window.location.hash = "playerPage";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   PLAYER PROFILE
========================================================= */

function renderPlayerProfile(player) {
    const container = document.getElementById("playerProfile");

    if (!container) {
        return;
    }

    const name = player.name || "Player";
    const role = player.role || "Игрок";
    const country = player.country || "";
    const avatar = player.avatar || "";

    let html = "";

    html += `
        <div class="player-profile">

            <div class="player-profile-avatar">

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
                                    name
                                        .charAt(0)
                                        .toUpperCase()
                                )}
                            </span>
                          `
                }

            </div>

            <div class="eyebrow">
                PLAYER
            </div>

            <h1>
                ${escapeHTML(name)}
            </h1>

            <div class="player-role">
                ${escapeHTML(role)}
            </div>

            ${
                country
                    ? `
                        <p>
                            ${escapeHTML(country)}
                        </p>
                      `
                    : ""
            }


            <div class="player-links">

                ${
                    player.faceit
                        ? `
                            <a
                                class="secondary"
                                href="${escapeHTML(player.faceit)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                FACEIT →
                            </a>
                          `
                        : ""
                }

                ${
                    player.steam
                        ? `
                            <a
                                class="secondary"
                                href="${escapeHTML(player.steam)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Steam →
                            </a>
                          `
                        : ""
                }

            </div>


            <div
                class="player-profile-actions"
                style="
                    margin-top:24px;
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                "
            >

                <button
                    class="edit-btn"
                    onclick="openPlayerEditor('${escapeHTML(
                        name
                    ).replace(/'/g, "\\'")}'
                    )"
                >
                    ✎ Редактировать профиль
                </button>

                <button
                    class="edit-btn"
                    onclick="closePlayer()"
                >
                    ← Вернуться к команде
                </button>

            </div>

        </div>
    `;

    container.innerHTML = html;
}


/* =========================================================
   CLOSE TEAM
========================================================= */

function closeTeam() {
    const teams = document.getElementById("teams");
    const teamPage = document.getElementById("teamPage");
    const playerPage = document.getElementById("playerPage");

    if (teamPage) {
        teamPage.classList.add("hidden");
    }

    if (playerPage) {
        playerPage.classList.add("hidden");
    }

    if (teams) {
        teams.classList.remove("hidden");
    }

    hideOtherPages();

    window.location.hash = "teams";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   CLOSE PLAYER
========================================================= */

function closePlayer() {
    const playerPage = document.getElementById("playerPage");
    const teamPage = document.getElementById("teamPage");

    if (playerPage) {
        playerPage.classList.add("hidden");
    }

    if (teamPage) {
        teamPage.classList.remove("hidden");
    }

    renderTeamProfile();

    window.location.hash = "teamPage";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   HIDE PAGES
========================================================= */

function hideOtherPages() {
    const pages = document.querySelectorAll(
        ".page-section"
    );

    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.add("hidden");
    }
}


/* =========================================================
   FILTER
========================================================= */

function filterTeams() {
    renderTeams();
}


/* =========================================================
   RATING
========================================================= */

function renderRating() {
    const rows = document.getElementById(
        "ratingRows"
    );

    if (!rows) {
        return;
    }

    rows.innerHTML = `
        <tr>
            <td>1</td>

            <td>
                <strong>
                    ${escapeHTML(TEAM_NAME)}
                </strong>
            </td>

            <td>0</td>

            <td>0</td>

            <td>—</td>
        </tr>
    `;
}


/* =========================================================
   MATCHES
========================================================= */

function renderMatches() {
    const container = document.getElementById(
        "matchesList"
    );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div
            class="glass"
            style="
                padding:24px;
                color:#858c98;
            "
        >
            Матчи 1Minute пока не добавлены.
        </div>
    `;
}


/* =========================================================
   TOURNAMENTS
========================================================= */

function renderTournaments() {
    const container = document.getElementById(
        "tournamentsGrid"
    );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div
            class="glass"
            style="
                padding:24px;
                color:#858c98;
            "
        >
            Турниры 1Minute пока не добавлены.
        </div>
    `;
}


/* =========================================================
   PLAYER EDITOR
========================================================= */

function openPlayerEditor(name) {
    const player = findPlayer(name);

    if (!player) {
        alert("Игрок не найден.");

        return;
    }

    const oldName = document.getElementById(
        "playerEditOldName"
    );

    const teamInput = document.getElementById(
        "playerEditTeam"
    );

    const nameInput = document.getElementById(
        "playerEditName"
    );

    const countryInput = document.getElementById(
        "playerEditCountry"
    );

    const roleInput = document.getElementById(
        "playerEditRole"
    );

    const avatarInput = document.getElementById(
        "playerEditAvatar"
    );

    const faceitInput = document.getElementById(
        "playerEditFaceit"
    );

    const steamInput = document.getElementById(
        "playerEditSteam"
    );

    if (oldName) {
        oldName.value = player.name || "";
    }

    if (teamInput) {
        teamInput.value = TEAM_NAME;
    }

    if (nameInput) {
        nameInput.value = player.name || "";
    }

    if (countryInput) {
        countryInput.value = player.country || "";
    }

    if (roleInput) {
        roleInput.value = player.role || "Игрок";
    }

    if (avatarInput) {
        avatarInput.value = player.avatar || "";
    }

    if (faceitInput) {
        faceitInput.value = player.faceit || "";
    }

    if (steamInput) {
        steamInput.value = player.steam || "";
    }

    const modal = document.getElementById(
        "playerEditModal"
    );

    if (modal) {
        modal.classList.remove("hidden");

        document.body.style.overflow = "hidden";
    }
}


/* =========================================================
   CLOSE PLAYER EDITOR
========================================================= */

function closePlayerEditor() {
    const modal = document.getElementById(
        "playerEditModal"
    );

    if (modal) {
        modal.classList.add("hidden");

        document.body.style.overflow = "";
    }
}


/* =========================================================
   SAVE PLAYER
========================================================= */

async function savePlayer(event) {
    event.preventDefault();

    const oldNameElement = document.getElementById(
        "playerEditOldName"
    );

    const newNameElement = document.getElementById(
        "playerEditName"
    );

    const countryElement = document.getElementById(
        "playerEditCountry"
    );

    const roleElement = document.getElementById(
        "playerEditRole"
    );

    const avatarElement = document.getElementById(
        "playerEditAvatar"
    );

    const faceitElement = document.getElementById(
        "playerEditFaceit"
    );

    const steamElement = document.getElementById(
        "playerEditSteam"
    );

    if (
        !oldNameElement ||
        !newNameElement ||
        !countryElement ||
        !roleElement ||
        !avatarElement ||
        !faceitElement ||
        !steamElement
    ) {
        alert(
            "Не найдены поля формы игрока."
        );

        return;
    }

    const oldName =
        oldNameElement.value.trim();

    const newName =
        newNameElement.value.trim();

    const country =
        countryElement.value.trim();

    const role =
        roleElement.value.trim();

    const avatar =
        avatarElement.value.trim();

    const faceit =
        faceitElement.value.trim();

    const steam =
        steamElement.value.trim();

    if (!newName) {
        alert(
            "Введите никнейм игрока."
        );

        return;
    }

    const data = {
        name: newName,
        country: country,
        role: role,
        avatar: avatar,
        faceit: faceit,
        steam: steam
    };

    try {
        await supabase(
            "players?name=eq." +
            encodeURIComponent(oldName),
            {
                method: "PATCH",

                headers: {
                    "Prefer":
                        "return=representation"
                },

                body:
                    JSON.stringify(data)
            }
        );

        await loadPlayers();

        closePlayerEditor();

        renderTeams();

        renderTeamProfile();

        const updatedPlayer =
            findPlayer(newName);

        if (updatedPlayer) {
            renderPlayerProfile(
                updatedPlayer
            );
        }

        alert(
            "Профиль игрока сохранён."
        );

    } catch (error) {
        console.error(
            "Ошибка сохранения:",
            error
        );

        alert(
            "Не удалось сохранить профиль. " +
            "Проверь RLS и структуру таблицы players."
        );
    }
}


/* =========================================================
   TEAM EDITOR
========================================================= */

function openEditor() {
    const title = document.getElementById(
        "editTitle"
    );

    const tag = document.getElementById(
        "editTag"
    );

    const country = document.getElementById(
        "editCountry"
    );

    const logo = document.getElementById(
        "editLogo"
    );

    const faceit = document.getElementById(
        "editFaceit"
    );

    const steam = document.getElementById(
        "editSteam"
    );

    const description = document.getElementById(
        "editDescription"
    );

    if (title) {
        title.value = team.title;
    }

    if (tag) {
        tag.value = team.tag;
    }

    if (country) {
        country.value = team.country;
    }

    if (logo) {
        logo.value = team.logo;
    }

    if (faceit) {
        faceit.value = team.faceit;
    }

    if (steam) {
        steam.value = team.steam;
    }

    if (description) {
        description.value =
            team.description;
    }

    const modal = document.getElementById(
        "editModal"
    );

    if (modal) {
        modal.classList.remove("hidden");

        document.body.style.overflow = "hidden";
    }
}


function closeEditor() {
    const modal = document.getElementById(
        "editModal"
    );

    if (modal) {
        modal.classList.add("hidden");

        document.body.style.overflow = "";
    }
}


/* =========================================================
   NAVIGATION
========================================================= */

function showHashPage() {
    const hash = window.location.hash;

    const teams = document.getElementById(
        "teams"
    );

    const teamPage = document.getElementById(
        "teamPage"
    );

    const playerPage = document.getElementById(
        "playerPage"
    );

    if (teams) {
        teams.classList.add("hidden");
    }

    if (teamPage) {
        teamPage.classList.add("hidden");
    }

    if (playerPage) {
        playerPage.classList.add("hidden");
    }

    hideOtherPages();


    if (
        hash === "#rating" ||
        hash === "#matches" ||
        hash === "#tournaments"
    ) {
        const page =
            document.querySelector(hash);

        if (page) {
            page.classList.remove("hidden");
        }

        updateActiveNavigation(hash);

        return;
    }


    if (hash === "#teamPage") {
        if (teamPage) {
            teamPage.classList.remove("hidden");
        }

        renderTeamProfile();

        updateActiveNavigation(
            "#teams"
        );

        return;
    }


    if (hash === "#playerPage") {
        if (playerPage) {
            playerPage.classList.remove("hidden");
        }

        updateActiveNavigation(
            "#teams"
        );

        return;
    }


    if (teams) {
        teams.classList.remove("hidden");
    }

    updateActiveNavigation(
        "#teams"
    );
}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function updateActiveNavigation(currentHash) {
    const links = document.querySelectorAll(
        ".topbar nav a"
    );

    for (let i = 0; i < links.length; i++) {
        const link = links[i];

        const href =
            link.getAttribute("href");

        if (href === currentHash) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    }
}


/* =========================================================
   INITIALIZATION
========================================================= */

async function init() {
    console.log(
        "1Minute запускается..."
    );

    await loadPlayers();

    renderTeams();

    renderRating();

    renderMatches();

    renderTournaments();

    showHashPage();

    console.log(
        "1Minute готов."
    );
}


/* =========================================================
   EVENTS
========================================================= */

window.addEventListener(
    "hashchange",
    function() {
        showHashPage();
    }
);


document.addEventListener(
    "DOMContentLoaded",
    function() {

        const form =
            document.getElementById(
                "playerEditForm"
            );

        if (form) {
            form.addEventListener(
                "submit",
                savePlayer
            );
        }

        init();
    }
);
