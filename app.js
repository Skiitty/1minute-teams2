/* =========================================================
   1MINUTE — CONFIG
========================================================= */

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

let currentUser = null;
let isAdmin = false;

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
   SUPABASE REST
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
   SUPABASE AUTH
========================================================= */

/*
   ВАЖНО:

   Этот код использует Supabase Auth REST API.

   Сессия хранится в localStorage.
*/

const AUTH_STORAGE_KEY =
    "1minute_supabase_session";


function getStoredSession() {
    try {
        const value =
            localStorage.getItem(AUTH_STORAGE_KEY);

        if (!value) {
            return null;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Ошибка чтения сессии:",
            error
        );

        return null;
    }
}


function saveSession(session) {
    if (!session) {
        localStorage.removeItem(
            AUTH_STORAGE_KEY
        );

        return;
    }

    localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(session)
    );
}


function clearSession() {
    localStorage.removeItem(
        AUTH_STORAGE_KEY
    );

    currentUser = null;
    isAdmin = false;

    updateAdminUI();
}


/* =========================================================
   AUTH REQUEST
========================================================= */

async function authRequest(path, options) {

    options = options || {};

    const headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    };

    if (options.token) {
        headers["Authorization"] =
            "Bearer " + options.token;
    }

    const response = await fetch(
        SUPABASE_URL + "/auth/v1/" + path,
        {
            method: options.method || "GET",
            headers: headers,
            body: options.body
        }
    );

    const text = await response.text();

    let data = {};

    try {
        data = text
            ? JSON.parse(text)
            : {};
    } catch (error) {
        data = {};
    }

    if (!response.ok) {

        console.error(
            "Supabase Auth error:",
            response.status,
            data
        );

        throw new Error(
            data.error_description ||
            data.msg ||
            data.message ||
            "Ошибка авторизации"
        );
    }

    return data;
}


/* =========================================================
   CHECK AUTH
========================================================= */

async function checkAuth() {

    const session =
        getStoredSession();

    if (!session || !session.access_token) {

        currentUser = null;
        isAdmin = false;

        updateAdminUI();

        return null;
    }

    try {

        const user =
            await authRequest(
                "user",
                {
                    method: "GET",
                    token: session.access_token
                }
            );

        currentUser = user;

        await checkAdmin();

        updateAdminUI();

        return user;

    } catch (error) {

        console.warn(
            "Сессия недействительна:",
            error
        );

        clearSession();

        return null;
    }
}


/* =========================================================
   CHECK ADMIN
========================================================= */

async function checkAdmin() {

    isAdmin = false;

    if (!currentUser) {
        return false;
    }

    if (!currentUser.id) {
        return false;
    }

    try {

        const result =
            await supabase(
                "admins?user_id=eq." +
                encodeURIComponent(
                    currentUser.id
                ) +
                "&select=user_id"
            );

        isAdmin =
            Array.isArray(result) &&
            result.length > 0;

        console.log(
            "Admin:",
            isAdmin
        );

        return isAdmin;

    } catch (error) {

        console.error(
            "Ошибка проверки администратора:",
            error
        );

        isAdmin = false;

        return false;
    }
}


/* =========================================================
   LOGIN
========================================================= */

async function login(email, password) {

    try {

        const data =
            await authRequest(
                "token?grant_type=password",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

        if (!data.access_token) {
            throw new Error(
                "Supabase не вернул access_token."
            );
        }

        saveSession({
            access_token:
                data.access_token,

            refresh_token:
                data.refresh_token,

            expires_in:
                data.expires_in,

            expires_at:
                data.expires_at,

            token_type:
                data.token_type,

            user:
                data.user
        });

        currentUser =
            data.user || null;

        await checkAdmin();

        updateAdminUI();

        closeLoginModal();

        if (isAdmin) {

            alert(
                "Вы вошли как администратор."
            );

        } else {

            alert(
                "Вы вошли в аккаунт, " +
                "но у вас нет прав администратора."
            );
        }

    } catch (error) {

        console.error(
            "Ошибка входа:",
            error
        );

        alert(
            "Не удалось войти:\n\n" +
            error.message
        );
    }
}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    const session =
        getStoredSession();

    try {

        if (
            session &&
            session.access_token
        ) {

            await authRequest(
                "logout",
                {
                    method: "POST",
                    token:
                        session.access_token
                }
            );
        }

    } catch (error) {

        console.warn(
            "Ошибка выхода:",
            error
        );
    }

    clearSession();

    alert(
        "Вы вышли из аккаунта."
    );
}


/* =========================================================
   ADMIN UI
========================================================= */

function updateAdminUI() {

    /*
       Обновляем кнопку входа
    */

    const loginButton =
        document.querySelector(
            ".topbar .login"
        );

    if (loginButton) {

        if (currentUser) {

            if (isAdmin) {

                loginButton.textContent =
                    "Админ";

            } else {

                loginButton.textContent =
                    "Аккаунт";
            }

        } else {

            loginButton.textContent =
                "Войти";
        }
    }


    /*
       Скрываем все элементы,
       требующие администратора.
    */

    const adminElements =
        document.querySelectorAll(
            ".admin-only"
        );

    for (
        let i = 0;
        i < adminElements.length;
        i++
    ) {

        if (isAdmin) {

            adminElements[i]
                .classList.remove(
                    "hidden"
                );

        } else {

            adminElements[i]
                .classList.add(
                    "hidden"
                );
        }
    }
}


/* =========================================================
   REQUIRE ADMIN
========================================================= */

function requireAdmin() {

    if (!currentUser) {

        alert(
            "Для этого действия необходимо войти в аккаунт."
        );

        openLoginModal();

        return false;
    }

    if (!isAdmin) {

        alert(
            "У вас нет прав администратора."
        );

        return false;
    }

    return true;
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

    const target =
        normalize(name);

    for (
        let i = 0;
        i < players.length;
        i++
    ) {

        if (
            normalize(
                players[i].name
            ) === target
        ) {

            return players[i];
        }
    }

    return null;
}


function getPlayersByNames(names) {

    const result = [];

    for (
        let i = 0;
        i < names.length;
        i++
    ) {

        const player =
            findPlayer(names[i]);

        if (player) {
            result.push(player);
        }
    }

    return result;
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

        const data =
            await supabase(
                "players?select=*&order=id.asc"
            );

        players =
            Array.isArray(data)
                ? data
                : [];

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

    const grid =
        document.getElementById(
            "grid"
        );

    if (!grid) {
        return;
    }

    const logo =
        team.logo || "";

    grid.innerHTML = `

        <div
            class="team-card"
            onclick="openTeam()"
        >

            <div class="team-top">

                <div class="team-logo">

                    ${
                        logo
                            ? `
                                <img
                                    src="${escapeHTML(logo)}"
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

function playerCard(
    player,
    isSubstitute
) {

    const name =
        player.name ||
        "Player";

    const role =
        player.role ||
        "Игрок";

    const avatar =
        player.avatar ||
        "";

    const safeName =
        safeJSString(name);

    return `

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
                    ? `
                        <div class="player-badge">
                            ЗАМЕНА
                        </div>
                      `
                    : ""
            }

        </div>
    `;
}


/* =========================================================
   OPEN TEAM
========================================================= */

function openTeam() {

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

    if (playerPage) {
        playerPage.classList.add(
            "hidden"
        );
    }

    hideOtherPages();

    if (teamPage) {
        teamPage.classList.remove(
            "hidden"
        );
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
                class="glass"
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
                class="glass"
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
                                <span>1</span>
                              `
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
                        ${escapeHTML(
                            team.description
                        )}
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

                    ${startersHTML}

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

                    ${substitutesHTML}

                </div>

            </div>

        </div>
    `;
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

function renderPlayerProfile(
    player
) {

    const container =
        document.getElementById(
            "playerProfile"
        );

    if (!container) {
        return;
    }

    const name =
        player.name ||
        "Player";

    const role =
        player.role ||
        "Игрок";

    const country =
        player.country ||
        "";

    const avatar =
        player.avatar ||
        "";

    const safeName =
        safeJSString(name);


    container.innerHTML = `

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
                                    String(name)
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

                ${
                    isAdmin
                        ? `
                            <button
                                class="edit-btn admin-only"
                                onclick="openPlayerEditor('${safeName}')"
                            >
                                ✎ Редактировать профиль
                            </button>
                          `
                        : ""
                }


                <button
                    class="edit-btn"
                    onclick="closePlayer()"
                >
                    ← Вернуться к команде
                </button>

            </div>

        </div>
    `;
}


/* =========================================================
   CLOSE TEAM
========================================================= */

function closeTeam() {

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

    if (teamPage) {
        teamPage.classList.add(
            "hidden"
        );
    }

    if (playerPage) {
        playerPage.classList.add(
            "hidden"
        );
    }

    if (teams) {
        teams.classList.remove(
            "hidden"
        );
    }

    hideOtherPages();

    window.location.hash =
        "teams";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   CLOSE PLAYER
========================================================= */

function closePlayer() {

    const playerPage =
        document.getElementById(
            "playerPage"
        );

    const teamPage =
        document.getElementById(
            "teamPage"
        );

    if (playerPage) {
        playerPage.classList.add(
            "hidden"
        );
    }

    if (teamPage) {
        teamPage.classList.remove(
            "hidden"
        );
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
   HIDE OTHER PAGES
========================================================= */

function hideOtherPages() {

    const pages =
        document.querySelectorAll(
            ".page-section"
        );

    for (
        let i = 0;
        i < pages.length;
        i++
    ) {

        pages[i].classList.add(
            "hidden"
        );
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

    const rows =
        document.getElementById(
            "ratingRows"
        );

    if (!rows) {
        return;
    }

    rows.innerHTML = `

        <tr>

            <td>
                1
            </td>

            <td>

                <strong>
                    ${escapeHTML(
                        TEAM_NAME
                    )}
                </strong>

            </td>

            <td>
                0
            </td>

            <td>
                0
            </td>

            <td>
                —
            </td>

        </tr>

    `;
}


/* =========================================================
   MATCHES
========================================================= */

function renderMatches() {

    const container =
        document.getElementById(
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

    const container =
        document.getElementById(
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

    if (!requireAdmin()) {
        return;
    }

    const player =
        findPlayer(name);

    if (!player) {

        alert(
            "Игрок не найден."
        );

        return;
    }


    const oldName =
        document.getElementById(
            "playerEditOldName"
        );

    const teamInput =
        document.getElementById(
            "playerEditTeam"
        );

    const nameInput =
        document.getElementById(
            "playerEditName"
        );

    const countryInput =
        document.getElementById(
            "playerEditCountry"
        );

    const roleInput =
        document.getElementById(
            "playerEditRole"
        );

    const avatarInput =
        document.getElementById(
            "playerEditAvatar"
        );

    const faceitInput =
        document.getElementById(
            "playerEditFaceit"
        );

    const steamInput =
        document.getElementById(
            "playerEditSteam"
        );


    if (oldName) {
        oldName.value =
            player.name || "";
    }

    if (teamInput) {
        teamInput.value =
            TEAM_NAME;
    }

    if (nameInput) {
        nameInput.value =
            player.name || "";
    }

    if (countryInput) {
        countryInput.value =
            player.country || "";
    }

    if (roleInput) {
        roleInput.value =
            player.role || "Игрок";
    }

    if (avatarInput) {
        avatarInput.value =
            player.avatar || "";
    }

    if (faceitInput) {
        faceitInput.value =
            player.faceit || "";
    }

    if (steamInput) {
        steamInput.value =
            player.steam || "";
    }


    const modal =
        document.getElementById(
            "playerEditModal"
        );

    if (modal) {

        modal.classList.remove(
            "hidden"
        );

        document.body.style.overflow =
            "hidden";
    }
}


/* =========================================================
   CLOSE PLAYER EDITOR
========================================================= */

function closePlayerEditor() {

    const modal =
        document.getElementById(
            "playerEditModal"
        );

    if (modal) {

        modal.classList.add(
            "hidden"
        );

        document.body.style.overflow =
            "";
    }
}


/* =========================================================
   SAVE PLAYER
========================================================= */

async function savePlayer(event) {

    event.preventDefault();


    /*
       Дополнительная защита.
    */

    if (!requireAdmin()) {
        return;
    }


    const oldNameElement =
        document.getElementById(
            "playerEditOldName"
        );

    const newNameElement =
        document.getElementById(
            "playerEditName"
        );

    const countryElement =
        document.getElementById(
            "playerEditCountry"
        );

    const roleElement =
        document.getElementById(
            "playerEditRole"
        );

    const avatarElement =
        document.getElementById(
            "playerEditAvatar"
        );

    const faceitElement =
        document.getElementById(
            "playerEditFaceit"
        );

    const steamElement =
        document.getElementById(
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
            encodeURIComponent(
                oldName
            ),
            {

                method: "PATCH",

                headers: {

                    "Prefer":
                        "return=representation",

                    /*
                       Передаём токен пользователя.
                    */

                    "Authorization":
                        "Bearer " +
                        getStoredSession()
                            .access_token
                },

                body:
                    JSON.stringify(
                        data
                    )
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
            "Не удалось сохранить профиль.\n\n" +
            "Проверь RLS таблицы players и права администратора."
        );
    }
}


/* =========================================================
   TEAM EDITOR
========================================================= */

function openEditor() {

    if (!requireAdmin()) {
        return;
    }

    const title =
        document.getElementById(
            "editTitle"
        );

    const tag =
        document.getElementById(
            "editTag"
        );

    const country =
        document.getElementById(
            "editCountry"
        );

    const logo =
        document.getElementById(
            "editLogo"
        );

    const faceit =
        document.getElementById(
            "editFaceit"
        );

    const steam =
        document.getElementById(
            "editSteam"
        );

    const description =
        document.getElementById(
            "editDescription"
        );


    if (title) {
        title.value =
            team.title;
    }

    if (tag) {
        tag.value =
            team.tag;
    }

    if (country) {
        country.value =
            team.country;
    }

    if (logo) {
        logo.value =
            team.logo;
    }

    if (faceit) {
        faceit.value =
            team.faceit;
    }

    if (steam) {
        steam.value =
            team.steam;
    }

    if (description) {
        description.value =
            team.description;
    }


    const modal =
        document.getElementById(
            "editModal"
        );

    if (modal) {

        modal.classList.remove(
            "hidden"
        );

        document.body.style.overflow =
            "hidden";
    }
}


function closeEditor() {

    const modal =
        document.getElementById(
            "editModal"
        );

    if (modal) {

        modal.classList.add(
            "hidden"
        );

        document.body.style.overflow =
            "";
    }
}


/* =========================================================
   NAVIGATION
========================================================= */

function showHashPage() {

    const hash =
        window.location.hash;

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

    if (playerPage) {
        playerPage.classList.add(
            "hidden"
        );
    }


    hideOtherPages();


    if (
        hash === "#rating" ||
        hash === "#matches" ||
        hash === "#tournaments"
    ) {

        const page =
            document.querySelector(
                hash
            );

        if (page) {

            page.classList.remove(
                "hidden"
            );
        }

        updateActiveNavigation(
            hash
        );

        return;
    }


    if (hash === "#teamPage") {

        if (teamPage) {

            teamPage.classList.remove(
                "hidden"
            );
        }

        renderTeamProfile();

        updateActiveNavigation(
            "#teams"
        );

        return;
    }


    if (hash === "#playerPage") {

        if (playerPage) {

            playerPage.classList.remove(
                "hidden"
            );
        }

        updateActiveNavigation(
            "#teams"
        );

        return;
    }


    if (teams) {

        teams.classList.remove(
            "hidden"
        );
    }

    renderTeams();

    updateActiveNavigation(
        "#teams"
    );
}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function updateActiveNavigation(
    currentHash
) {

    const links =
        document.querySelectorAll(
            ".topbar nav a"
        );

    for (
        let i = 0;
        i < links.length;
        i++
    ) {

        const link =
            links[i];

        const href =
            link.getAttribute(
                "href"
            );

        if (
            href === currentHash
        ) {

            link.classList.add(
                "active"
            );

        } else {

            link.classList.remove(
                "active"
            );
        }
    }
}


/* =========================================================
   LOGIN MODAL
========================================================= */

function openLoginModal() {

    const modal =
        document.getElementById(
            "loginModal"
        );

    if (!modal) {
        return;
    }


    /*
       Если уже авторизован,
       показываем информацию
       об аккаунте.
    */

    if (currentUser) {

        if (isAdmin) {

            const result =
                confirm(
                    "Вы вошли как администратор.\n\n" +
                    "Хотите выйти?"
                );

            if (result) {
                logout();
            }

        } else {

            const result =
                confirm(
                    "Вы уже вошли в аккаунт, " +
                    "но у вас нет прав администратора.\n\n" +
                    "Хотите выйти?"
                );

            if (result) {
                logout();
            }
        }

        return;
    }


    /*
       Поля логина создаём
       непосредственно внутри modal.
    */

    const card =
        modal.querySelector(
            ".modal-card"
        );

    if (!card) {
        return;
    }


    card.innerHTML = `

        <button
            class="modal-close"
            onclick="closeLoginModal()"
        >
            ×
        </button>

        <div class="eyebrow">
            1MINUTE ACCOUNT
        </div>

        <div class="login-icon">
            1
        </div>

        <h2>
            Вход администратора
        </h2>

        <form
            id="loginForm"
            style="
                display:flex;
                flex-direction:column;
                gap:15px;
                text-align:left;
            "
        >

            <label>
                Email

                <input
                    id="loginEmail"
                    type="email"
                    required
                    autocomplete="email"
                    placeholder="admin@example.com"
                >
            </label>

            <label>
                Пароль

                <input
                    id="loginPassword"
                    type="password"
                    required
                    autocomplete="current-password"
                    placeholder="••••••••"
                >
            </label>

            <button
                class="primary save"
                type="submit"
            >
                Войти
            </button>

        </form>

    `;


    const form =
        document.getElementById(
            "loginForm"
        );

    if (form) {

        form.addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();

                const email =
                    document.getElementById(
                        "loginEmail"
                    ).value.trim();

                const password =
                    document.getElementById(
                        "loginPassword"
                    ).value;

                await login(
                    email,
                    password
                );
            }
        );
    }


    modal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}


function closeLoginModal() {

    const modal =
        document.getElementById(
            "loginModal"
        );

    if (!modal) {
        return;
    }

    modal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";
}


/* =========================================================
   INITIALIZATION
========================================================= */

async function init() {

    console.log(
        "1Minute запускается..."
    );


    /*
       Сначала проверяем авторизацию.
    */

    await checkAuth();


    /*
       Потом загружаем игроков.
    */

    await loadPlayers();


    /*
       Рендерим сайт.
    */

    renderTeams();

    renderRating();

    renderMatches();

    renderTournaments();

    showHashPage();

    updateAdminUI();


    console.log(
        "1Minute готов."
    );

    console.log(
        "Пользователь:",
        currentUser
    );

    console.log(
        "Администратор:",
        isAdmin
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


        /*
           Редактор игрока
        */

        const playerForm =
            document.getElementById(
                "playerEditForm"
            );

        if (playerForm) {

            playerForm.addEventListener(
                "submit",
                savePlayer
            );
        }


        /*
           Закрытие login modal
           по клику на фон.
        */

        const loginModal =
            document.getElementById(
                "loginModal"
            );

        if (loginModal) {

            loginModal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        loginModal
                    ) {

                        closeLoginModal();
                    }
                }
            );
        }


        /*
           Запуск
        */

        init();

    }
);
