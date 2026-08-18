```javascript
/* =========================================================
   1MINUTE
   APP.JS
   Supabase Auth + Admin
========================================================= */

const SUPABASE_URL =
    "https://wzheavazneaybhmgfntn.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK";

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


/* =========================================================
   STATE
========================================================= */

let players = [];

let currentUser = null;
let isAdmin = false;


/* =========================================================
   TEAM
========================================================= */

const team = {
    name: "1Minute",
    title: "1Minute",
    tag: "1M",
    country: "Russia",
    logo: "",
    faceit: "",
    steam: "",
    description:
        "Профили состава, матчи и статистика 1Minute — всё в одном месте.",
    status: "active"
};


/* =========================================================
   SUPABASE
========================================================= */

if (!window.supabase) {
    console.error(
        "Supabase JS не подключён в index.html"
    );
}

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


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


function safeJSString(value) {
    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
}


function findPlayer(name) {

    const target =
        normalize(name);

    return players.find(
        player =>
            normalize(player.name) === target
    ) || null;
}


function getPlayersByNames(names) {

    return names
        .map(name => findPlayer(name))
        .filter(Boolean);
}


/* =========================================================
   AUTH
========================================================= */

async function checkAuth() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();

        if (error) {
            throw error;
        }

        currentUser =
            data.session
                ? data.session.user
                : null;

        await checkAdmin();

        updateLoginButton();

        console.log(
            "Авторизация:",
            currentUser
                ? currentUser.email
                : "нет"
        );

        console.log(
            "Администратор:",
            isAdmin
        );

    } catch (error) {

        console.error(
            "Ошибка авторизации:",
            error
        );

        currentUser = null;
        isAdmin = false;

        updateLoginButton();
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

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("admins")
                .select("user_id")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        isAdmin = !!data;

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
   LOGIN BUTTON
========================================================= */

function updateLoginButton() {

    const button =
        document.querySelector(".login");

    if (!button) {
        return;
    }

    if (!currentUser) {

        button.textContent =
            "Войти";

        button.onclick =
            openLoginModal;

        return;
    }

    if (isAdmin) {

        button.textContent =
            "Администратор";

    } else {

        button.textContent =
            "Аккаунт";
    }

    button.onclick =
        openLoginModal;
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

    const status =
        document.getElementById(
            "loginStatus"
        );

    const error =
        document.getElementById(
            "loginError"
        );

    if (error) {
        error.textContent = "";
        error.style.display = "none";
    }

    if (status) {

        if (!currentUser) {

            status.textContent =
                "Введите email и пароль.";

        } else {

            status.innerHTML =
                "Вы вошли как <strong>" +
                escapeHTML(
                    currentUser.email || ""
                ) +
                "</strong>";

            if (isAdmin) {

                status.innerHTML +=
                    "<br><span style='color:#8ee6ad'>" +
                    "✓ Администратор" +
                    "</span>";

            } else {

                status.innerHTML +=
                    "<br><span style='color:#ffb36b'>" +
                    "Нет прав администратора" +
                    "</span>";
            }
        }
    }

    const email =
        document.getElementById(
            "loginEmail"
        );

    const password =
        document.getElementById(
            "loginPassword"
        );

    if (!currentUser) {

        if (email) {
            email.value = "";
        }

        if (password) {
            password.value = "";
        }
    }

    modal.classList.remove("hidden");

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

    modal.classList.add("hidden");

    document.body.style.overflow =
        "";
}


/* =========================================================
   LOGIN
========================================================= */

async function login(event) {

    event.preventDefault();

    const email =
        document.getElementById(
            "loginEmail"
        );

    const password =
        document.getElementById(
            "loginPassword"
        );

    const status =
        document.getElementById(
            "loginStatus"
        );

    const error =
        document.getElementById(
            "loginError"
        );

    if (!email || !password) {
        return;
    }

    if (error) {
        error.textContent = "";
        error.style.display = "none";
    }

    if (status) {
        status.textContent =
            "Выполняется вход...";
    }

    try {

        const {
            data,
            error: authError
        } =
            await supabaseClient.auth
                .signInWithPassword({
                    email:
                        email.value.trim(),
                    password:
                        password.value
                });

        if (authError) {
            throw authError;
        }

        currentUser =
            data.user;

        await checkAdmin();

        updateLoginButton();

        if (status) {

            if (isAdmin) {

                status.innerHTML =
                    "<span style='color:#8ee6ad'>" +
                    "✓ Вход выполнен. Вы администратор." +
                    "</span>";

            } else {

                status.innerHTML =
                    "<span style='color:#ffb36b'>" +
                    "Вход выполнен, но прав администратора нет." +
                    "</span>";
            }
        }

        renderTeamProfile();

        setTimeout(
            closeLoginModal,
            700
        );

    } catch (errorObject) {

        console.error(
            "Ошибка входа:",
            errorObject
        );

        if (error) {

            error.style.display =
                "block";

            error.textContent =
                getAuthErrorMessage(
                    errorObject
                );
        }

        if (status) {
            status.textContent = "";
        }
    }
}


function getAuthErrorMessage(error) {

    const message =
        String(
            error?.message || ""
        ).toLowerCase();

    if (
        message.includes(
            "invalid login credentials"
        )
    ) {
        return "Неверный email или пароль.";
    }

    if (
        message.includes(
            "email not confirmed"
        )
    ) {
        return "Сначала подтверди email.";
    }

    return (
        error?.message ||
        "Не удалось выполнить вход."
    );
}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    try {

        await supabaseClient.auth.signOut();

    } catch (error) {

        console.error(
            "Ошибка выхода:",
            error
        );
    }

    currentUser = null;
    isAdmin = false;

    updateLoginButton();

    closeLoginModal();

    renderTeamProfile();

    alert(
        "Вы вышли из аккаунта."
    );
}


/* =========================================================
   LOAD PLAYERS
========================================================= */

async function loadPlayers() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("players")
                .select("*")
                .order("id", {
                    ascending: true
                });

        if (error) {
            throw error;
        }

        players =
            Array.isArray(data)
                ? data
                : [];

        console.log(
            "Игроки:",
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

function playerCard(
    player,
    substitute
) {

    const name =
        player.name || "Player";

    const role =
        player.role || "Игрок";

    const avatar =
        player.avatar || "";

    return `

        <div
            class="player-card"
            onclick="openPlayerByName('${safeJSString(name)}')"
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
                                    name
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
                substitute
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
        teams.classList.add("hidden");
    }

    if (playerPage) {
        playerPage.classList.add("hidden");
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

    const startersHTML =
        starters.length
            ? starters
                .map(
                    player =>
                        playerCard(
                            player,
                            false
                        )
                )
                .join("")
            : `
                <div
                    class="glass"
                    style="padding:24px"
                >
                    Основной состав пока не загружен.
                </div>
            `;

    const substitutesHTML =
        substitutes.length
            ? substitutes
                .map(
                    player =>
                        playerCard(
                            player,
                            true
                        )
                )
                .join("")
            : `
                <div
                    class="glass"
                    style="padding:24px"
                >
                    Замены пока не добавлены.
                </div>
            `;


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

                    <div class="eyebrow">
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
                        style="
                            margin-top:12px;
                            display:inline-flex;
                            gap:7px;
                            align-items:center;
                            color:#8ee6ad;
                            background:#0b1710;
                            border:1px solid #21452f;
                            border-radius:6px;
                            padding:5px 9px;
                            font-size:10px;
                            font-weight:800;
                        "
                    >
                        ● ACTIVE
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
        teams.classList.add("hidden");
    }

    if (teamPage) {
        teamPage.classList.add("hidden");
    }

    hideOtherPages();

    if (playerPage) {
        playerPage.classList.remove(
            "hidden"
        );
    }

    renderPlayerProfile(player);

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

    const country =
        player.country || "";

    const avatar =
        player.avatar || "";

    container.dataset.player =
        name;


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
                                STEAM →
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
                    justify-content:center;
                    gap:10px;
                    flex-wrap:wrap;
                "
            >

                ${
                    isAdmin
                        ? `
                            <button
                                class="edit-btn"
                                onclick="openPlayerEditor('${safeJSString(name)}')"
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
   PLAYER EDITOR
========================================================= */

function openPlayerEditor(name) {

    if (!isAdmin || !currentUser) {

        alert(
            "Доступ запрещён."
        );

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

    const values = {
        playerEditOldName:
            player.name || "",

        playerEditTeam:
            TEAM_NAME,

        playerEditName:
            player.name || "",

        playerEditCountry:
            player.country || "",

        playerEditRole:
            player.role || "Игрок",

        playerEditAvatar:
            player.avatar || "",

        playerEditFaceit:
            player.faceit || "",

        playerEditSteam:
            player.steam || ""
    };

    Object.keys(values)
        .forEach(id => {

            const input =
                document.getElementById(id);

            if (input) {
                input.value =
                    values[id];
            }
        });


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

    if (!currentUser || !isAdmin) {

        alert(
            "Доступ запрещён."
        );

        return;
    }

    const oldName =
        document.getElementById(
            "playerEditOldName"
        )?.value.trim();

    const newName =
        document.getElementById(
            "playerEditName"
        )?.value.trim();

    const country =
        document.getElementById(
            "playerEditCountry"
        )?.value.trim();

    const role =
        document.getElementById(
            "playerEditRole"
        )?.value.trim();

    const avatar =
        document.getElementById(
            "playerEditAvatar"
        )?.value.trim();

    const faceit =
        document.getElementById(
            "playerEditFaceit"
        )?.value.trim();

    const steam =
        document.getElementById(
            "playerEditSteam"
        )?.value.trim();


    if (!oldName || !newName) {

        alert(
            "Введите никнейм игрока."
        );

        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("players")
                .update({
                    name: newName,
                    country: country,
                    role: role,
                    avatar: avatar,
                    faceit: faceit,
                    steam: steam
                })
                .eq(
                    "name",
                    oldName
                )
                .select();


        if (error) {
            throw error;
        }


        if (!data || data.length === 0) {

            throw new Error(
                "Supabase не изменил запись. Проверь RLS."
            );
        }


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
            "Профиль сохранён."
        );


    } catch (error) {

        console.error(
            "Ошибка сохранения игрока:",
            error
        );

        alert(
            "Не удалось сохранить профиль.\n\n" +
            error.message
        );
    }
}


/* =========================================================
   TEAM EDITOR
========================================================= */

function openEditor() {

    if (!isAdmin) {

        alert(
            "Доступ запрещён."
        );

        return;
    }

    const fields = {
        editTitle:
            team.title,

        editTag:
            team.tag,

        editCountry:
            team.country,

        editLogo:
            team.logo,

        editFaceit:
            team.faceit,

        editSteam:
            team.steam,

        editDescription:
            team.description
    };

    Object.keys(fields)
        .forEach(id => {

            const element =
                document.getElementById(id);

            if (element) {
                element.value =
                    fields[id];
            }
        });


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
   HIDE PAGES
========================================================= */

function hideOtherPages() {

    document
        .querySelectorAll(
            ".page-section"
        )
        .forEach(page => {

            page.classList.add(
                "hidden"
            );
        });
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
   HASH NAVIGATION
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
            document.querySelector(hash);

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

    document
        .querySelectorAll(
            ".topbar nav a"
        )
        .forEach(link => {

            const href =
                link.getAttribute(
                    "href"
                );

            link.classList.toggle(
                "active",
                href === currentHash
            );
        });
}


/* =========================================================
   SUPABASE AUTH LISTENER
========================================================= */

supabaseClient.auth.onAuthStateChange(
    async function(
        event,
        session
    ) {

        console.log(
            "Supabase Auth:",
            event
        );

        currentUser =
            session
                ? session.user
                : null;

        /*
         * Не оставляем старый admin после logout.
         */
        isAdmin = false;

        if (currentUser) {
            await checkAdmin();
        }

        updateLoginButton();

        /*
         * Если пользователь уже открыл
         * профиль игрока — обновляем
         * кнопку редактирования.
         */
        if (
            window.location.hash ===
            "#playerPage"
        ) {

            const profile =
                document.getElementById(
                    "playerProfile"
                );

            const playerName =
                profile?.dataset.player;

            if (playerName) {

                const player =
                    findPlayer(
                        playerName
                    );

                if (player) {

                    renderPlayerProfile(
                        player
                    );
                }
            }
        }
    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

async function init() {

    console.log(
        "1Minute запускается..."
    );


    await checkAuth();

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

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                login
            );
        }


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


        init();
    }
);
```
