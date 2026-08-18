/* =========================================================
   1MINUTE — APP.JS
   TEAM DATABASE + SUPABASE + ADMIN
   FINAL VERSION
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://wzheavazneaybhmgfntn.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK";

const TEAM_NAME = "1Minute";


/* =========================================================
   GLOBAL STATE
========================================================= */

let players = [];
let currentUser = null;
let isAdmin = false;
let supabaseClient = null;
let currentPlayer = null;


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
   NOTIFICATION
========================================================= */

function showNotification(
    message,
    type = "success"
) {

    let container =
        document.getElementById(
            "siteNotifications"
        );

    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "siteNotifications";

        container.style.cssText = `
            position:fixed;
            top:22px;
            right:22px;
            z-index:99999;
            display:flex;
            flex-direction:column;
            gap:10px;
            pointer-events:none;
            max-width:360px;
        `;

        document.body.appendChild(
            container
        );

    }


    const notification =
        document.createElement(
            "div"
        );


    const isError =
        type === "error";


    notification.style.cssText = `
        pointer-events:auto;
        min-width:280px;
        max-width:360px;
        padding:15px 17px;
        border-radius:10px;
        background:${
            isError
                ? "#241313"
                : "#101d15"
        };
        border:1px solid ${
            isError
                ? "#61302d"
                : "#28563a"
        };
        color:${
            isError
                ? "#ff9a91"
                : "#9af0b8"
        };
        box-shadow:0 15px 40px rgba(0,0,0,.35);
        font-family:Inter,Arial,sans-serif;
        font-size:13px;
        font-weight:600;
        line-height:1.5;
        display:flex;
        align-items:center;
        gap:10px;
        transform:translateX(30px);
        opacity:0;
        transition:
            opacity .25s ease,
            transform .25s ease;
    `;


    notification.innerHTML = `

        <span
            style="
                font-size:17px;
                flex-shrink:0;
            "
        >
            ${
                isError
                    ? "!"
                    : "✓"
            }
        </span>

        <span>
            ${escapeHTML(message)}
        </span>

        <button
            type="button"
            style="
                margin-left:auto;
                border:0;
                background:none;
                color:inherit;
                cursor:pointer;
                font-size:18px;
                line-height:1;
                opacity:.65;
            "
        >
            ×
        </button>

    `;


    const closeButton =
        notification.querySelector(
            "button"
        );


    closeButton.addEventListener(
        "click",
        () => {

            removeNotification(
                notification
            );

        }
    );


    container.appendChild(
        notification
    );


    requestAnimationFrame(
        () => {

            notification.style.opacity =
                "1";

            notification.style.transform =
                "translateX(0)";

        }
    );


    setTimeout(
        () => {

            removeNotification(
                notification
            );

        },
        4000
    );

}


function removeNotification(
    notification
) {

    if (!notification) {

        return;

    }

    notification.style.opacity =
        "0";

    notification.style.transform =
        "translateX(30px)";

    setTimeout(
        () => {

            notification.remove();

        },
        250
    );

}


/* =========================================================
   SUPABASE INIT
========================================================= */

function initSupabase() {

    if (
        !window.supabase ||
        !window.supabase.createClient
    ) {

        console.error(
            "Supabase SDK не найден."
        );

        return false;

    }


    try {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        console.log(
            "✓ Supabase подключён"
        );


        return true;

    } catch (error) {

        console.error(
            "Ошибка создания Supabase client:",
            error
        );

        return false;

    }

}


/* =========================================================
   HELPERS
========================================================= */

function normalize(value) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase();

}


function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function safeJSString(value) {

    return String(
        value || ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        )
        .replace(
            /\n/g,
            "\\n"
        )
        .replace(
            /\r/g,
            "\\r"
        );

}


function findPlayer(name) {

    const target =
        normalize(name);


    return players.find(
        player =>
            normalize(
                player.name
            ) === target
    ) || null;

}


function getActivePlayers() {

    return players.filter(
        player =>
            player.active !== false
    );

}


function getStarterPlayers() {

    return getActivePlayers().filter(
        player =>
            normalize(
                player.roster_type ||
                "starter"
            ) === "starter"
    );

}


function getSubstitutePlayers() {

    return getActivePlayers().filter(
        player =>
            normalize(
                player.roster_type ||
                ""
            ) === "substitute"
    );

}


/* =========================================================
   SUPABASE REQUEST
========================================================= */

async function supabaseRequest(
    path,
    options = {}
) {

    if (!supabaseClient) {

        throw new Error(
            "Supabase client не инициализирован."
        );

    }


    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth.getSession();


    const accessToken =
        session?.access_token ||
        SUPABASE_KEY;


    const headers = {

        "apikey":
            SUPABASE_KEY,

        "Authorization":
            "Bearer " +
            accessToken,

        "Content-Type":
            "application/json"

    };


    if (options.headers) {

        Object.assign(
            headers,
            options.headers
        );

    }


    const response =
        await fetch(
            SUPABASE_URL +
            "/rest/v1/" +
            path,
            {

                method:
                    options.method ||
                    "GET",

                headers,

                body:
                    options.body

            }
        );


    const text =
        await response.text();


    if (!response.ok) {

        console.error(
            "Supabase REST error:",
            response.status,
            text
        );

        throw new Error(
            text ||
            `Supabase error ${response.status}`
        );

    }


    if (!text) {

        return [];

    }


    try {

        return JSON.parse(
            text
        );

    } catch {

        return [];

    }

}


/* =========================================================
   AUTH
========================================================= */

async function checkAuth() {

    if (!supabaseClient) {

        currentUser = null;
        isAdmin = false;

        updateLoginButton();
        updateLoginModalUI();

        return;

    }


    try {

        const result =
            await supabaseClient.auth.getSession();


        if (result.error) {

            throw result.error;

        }


        currentUser =
            result.data?.session?.user ||
            null;


        if (currentUser) {

            await checkAdmin();

        } else {

            isAdmin = false;

        }


        updateLoginButton();
        updateLoginModalUI();


    } catch (error) {

        console.error(
            "Ошибка проверки авторизации:",
            error
        );

        currentUser = null;
        isAdmin = false;

        updateLoginButton();
        updateLoginModalUI();

    }

}


/* =========================================================
   ADMIN CHECK
========================================================= */

async function checkAdmin() {

    isAdmin = false;


    if (!currentUser) {

        return false;

    }


    try {

        const result =
            await supabaseClient
                .from("admin_users")
                .select("user_id")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .maybeSingle();


        if (result.error) {

            console.error(
                "Ошибка admin_users:",
                result.error
            );

            return false;

        }


        isAdmin =
            !!result.data;


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
   AUTH LISTENER
   IMPORTANT:
   NO await INSIDE CALLBACK
========================================================= */

function setupAuthListener() {

    if (!supabaseClient) {

        return;

    }


    supabaseClient.auth.onAuthStateChange(
        function(
            event,
            session
        ) {

            console.log(
                "Auth event:",
                event
            );


            currentUser =
                session?.user ||
                null;


            if (!currentUser) {

                isAdmin = false;

                updateLoginButton();
                updateLoginModalUI();

                renderTeamProfile();

                return;

            }


            /*
             * Не вызываем Supabase await
             * непосредственно внутри callback.
             *
             * Это важно для supabase-js.
             */

            setTimeout(
                async function() {

                    await checkAdmin();

                    updateLoginButton();
                    updateLoginModalUI();

                    renderTeamProfile();

                },
                0
            );

        }
    );

}


/* =========================================================
   LOGIN BUTTON
========================================================= */

function updateLoginButton() {

    const button =
        document.querySelector(
            ".login"
        );


    if (!button) {

        return;

    }


    if (!currentUser) {

        button.textContent =
            "Войти";

        return;

    }


    button.textContent =
        isAdmin
            ? "Администратор"
            : "Аккаунт";

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

        console.error(
            "loginModal не найден."
        );

        return;

    }


    updateLoginModalUI();


    const error =
        document.getElementById(
            "loginError"
        );


    if (error) {

        error.style.display =
            "none";

        error.textContent =
            "";

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
   LOGIN MODAL UI
========================================================= */

function updateLoginModalUI() {

    const status =
        document.getElementById(
            "loginStatus"
        );


    const loginForm =
        document.getElementById(
            "loginForm"
        );


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!status) {

        return;

    }


    if (currentUser) {

        status.innerHTML =
            "Вы вошли как <strong>" +
            escapeHTML(
                currentUser.email ||
                "пользователь"
            ) +
            (
                isAdmin
                    ?
                    "<br><span style='color:#8ee6ad'>" +
                    "✓ Вы администратор" +
                    "</span>"
                    :
                    "<br><span style='color:#ffb36b'>" +
                    "У вас нет прав администратора" +
                    "</span>"
            );


        if (loginForm) {

            loginForm.style.display =
                "none";

        }


        if (logoutButton) {

            logoutButton.style.display =
                "block";

        }

    } else {

        status.textContent =
            "Войдите в свой аккаунт Supabase.";


        if (loginForm) {

            loginForm.style.display =
                "flex";

        }


        if (logoutButton) {

            logoutButton.style.display =
                "none";

        }

    }

}


/* =========================================================
   LOGIN
========================================================= */

async function login(event) {

    event.preventDefault();


    if (!supabaseClient) {

        showLoginError(
            "Supabase не подключён."
        );

        return;

    }


    const email =
        document.getElementById(
            "loginEmail"
        );


    const password =
        document.getElementById(
            "loginPassword"
        );


    if (!email || !password) {

        showLoginError(
            "Поля входа не найдены."
        );

        return;

    }


    const errorElement =
        document.getElementById(
            "loginError"
        );


    if (errorElement) {

        errorElement.style.display =
            "none";

        errorElement.textContent =
            "";

    }


    const status =
        document.getElementById(
            "loginStatus"
        );


    if (status) {

        status.textContent =
            "Выполняется вход...";

    }


    try {

        const result =
            await supabaseClient.auth
                .signInWithPassword({

                    email:
                        email.value.trim(),

                    password:
                        password.value

                });


        if (result.error) {

            throw result.error;

        }


        currentUser =
            result.data.user ||
            null;


        await checkAdmin();


        updateLoginButton();
        updateLoginModalUI();


        await loadPlayers();


        renderTeams();
        renderTeamProfile();


        showNotification(
            isAdmin
                ? "Вы вошли как администратор."
                : "Вход выполнен."
        );


        setTimeout(
            closeLoginModal,
            500
        );


    } catch (error) {

        console.error(
            "Ошибка входа:",
            error
        );


        showLoginError(
            getAuthErrorMessage(
                error
            )
        );

    }

}


/* =========================================================
   LOGIN ERROR
========================================================= */

function showLoginError(
    message
) {

    const error =
        document.getElementById(
            "loginError"
        );


    if (!error) {

        showNotification(
            message,
            "error"
        );

        return;

    }


    error.textContent =
        message;

    error.style.display =
        "block";

}


function getAuthErrorMessage(
    error
) {

    const message =
        String(
            error?.message ||
            ""
        ).toLowerCase();


    if (
        message.includes(
            "invalid login credentials"
        ) ||
        message.includes(
            "invalid credentials"
        )
    ) {

        return "Неверный email или пароль.";

    }


    if (
        message.includes(
            "email not confirmed"
        )
    ) {

        return "Email не подтверждён.";

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

        if (supabaseClient) {

            const result =
                await supabaseClient.auth.signOut();


            if (result.error) {

                throw result.error;

            }

        }


        currentUser = null;
        isAdmin = false;


        updateLoginButton();
        updateLoginModalUI();


        closeLoginModal();


        renderTeams();
        renderTeamProfile();


        showNotification(
            "Вы вышли из аккаунта."
        );


    } catch (error) {

        console.error(
            "Ошибка выхода:",
            error
        );


        showNotification(
            "Не удалось выйти из аккаунта.",
            "error"
        );

    }

}


/* =========================================================
   LOAD PLAYERS
========================================================= */

async function loadPlayers() {

    try {

        const data =
            await supabaseRequest(
                "players?select=*&order=id.asc"
            );


        players =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "✓ Игроки загружены:",
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
                            ?
                            `
                            <img
                                src="${escapeHTML(team.logo)}"
                                alt="${escapeHTML(team.name)}"
                            >
                            `
                            :
                            `
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
        safeJSString(
            name
        );


    return `

        <div
            class="player-card"
            onclick="openPlayerByName('${safeName}')"
        >

            <div class="player-avatar">

                ${
                    avatar
                        ?
                        `
                        <img
                            src="${escapeHTML(avatar)}"
                            alt="${escapeHTML(name)}"
                        >
                        `
                        :
                        `
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
                isSubstitute
                    ?
                    `
                    <div class="player-badge">
                        ЗАМЕНА
                    </div>
                    `
                    :
                    ""
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
        top:0,
        behavior:"smooth"
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
        getStarterPlayers();


    const substitutes =
        getSubstitutePlayers();


    const startersHTML =
        starters.length
            ?
            starters
                .map(
                    player =>
                        playerCard(
                            player,
                            false
                        )
                )
                .join("")
            :
            `
            <div
                class="glass"
                style="padding:24px;"
            >
                Основной состав пока пуст.
            </div>
            `;


    const substitutesHTML =
        substitutes.length
            ?
            substitutes
                .map(
                    player =>
                        playerCard(
                            player,
                            true
                        )
                )
                .join("")
            :
            `
            <div
                class="glass"
                style="padding:24px;"
            >
                Замены пока нет.
            </div>
            `;


    let adminControls = "";


    if (isAdmin) {

        adminControls = `

            <div
                class="glass"
                style="
                    padding:20px;
                    margin-bottom:30px;
                    border:1px solid rgba(255,255,255,.08);
                "
            >

                <div
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:15px;
                        flex-wrap:wrap;
                    "
                >

                    <div>

                        <div class="eyebrow">
                            ADMIN
                        </div>

                        <h3 style="margin:5px 0 0;">
                            Управление составом
                        </h3>

                    </div>


                    <div
                        style="
                            display:flex;
                            gap:10px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            class="primary"
                            type="button"
                            onclick="openAddPlayerModal()"
                        >
                            + Добавить игрока
                        </button>


                        <button
                            class="secondary"
                            type="button"
                            onclick="openEditor()"
                        >
                            ✎ Команда
                        </button>

                    </div>

                </div>

            </div>

        `;

    }


    container.innerHTML = `

        <div class="team-profile">

            <div class="team-profile-header">

                <div class="team-profile-logo">

                    ${
                        team.logo
                            ?
                            `
                            <img
                                src="${escapeHTML(team.logo)}"
                                alt="${escapeHTML(team.name)}"
                            >
                            `
                            :
                            `
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


            ${adminControls}


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

function openPlayerByName(
    name
) {

    const player =
        findPlayer(name);


    if (!player) {

        showNotification(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    currentPlayer =
        player;


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
        top:0,
        behavior:"smooth"
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
        safeJSString(
            name
        );


    let adminButtons = "";


    if (isAdmin) {

        const isSubstitute =
            normalize(
                player.roster_type ||
                "starter"
            ) === "substitute";


        adminButtons = `

            <button
                class="edit-btn"
                type="button"
                onclick="openPlayerEditor('${safeName}')"
            >
                ✎ Редактировать профиль
            </button>


            <button
                class="edit-btn"
                type="button"
                onclick="${
                    isSubstitute
                        ?
                        `movePlayerToStarter('${safeName}')`
                        :
                        `movePlayerToSubstitute('${safeName}')`
                }"
            >
                ⇄ ${
                    isSubstitute
                        ?
                        "В основной состав"
                        :
                        "В замены"
                }
            </button>


            <button
                class="edit-btn"
                type="button"
                style="
                    border-color:#542525;
                    color:#ff8d8d;
                "
                onclick="removePlayerFromRoster('${safeName}')"
            >
                🗑 Удалить из состава
            </button>

        `;

    }


    container.innerHTML = `

        <div class="player-profile">

            <div class="player-profile-avatar">

                ${
                    avatar
                        ?
                        `
                        <img
                            src="${escapeHTML(avatar)}"
                            alt="${escapeHTML(name)}"
                        >
                        `
                        :
                        `
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
                    ?
                    `
                    <p>
                        ${escapeHTML(country)}
                    </p>
                    `
                    :
                    ""
            }


            <div class="player-links">

                ${
                    player.faceit
                        ?
                        `
                        <a
                            class="secondary"
                            href="${escapeHTML(player.faceit)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            FACEIT →
                        </a>
                        `
                        :
                        ""
                }


                ${
                    player.steam
                        ?
                        `
                        <a
                            class="secondary"
                            href="${escapeHTML(player.steam)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Steam →
                        </a>
                        `
                        :
                        ""
                }

            </div>


            <div
                class="player-profile-actions"
                style="
                    margin-top:24px;
                    display:flex;
                    gap:10px;
                    justify-content:center;
                    flex-wrap:wrap;
                "
            >

                ${adminButtons}


                <button
                    class="edit-btn"
                    type="button"
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

function openPlayerEditor(
    name
) {

    if (!isAdmin) {

        showNotification(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showNotification(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    document.getElementById(
        "playerEditOldName"
    ).value =
        player.name || "";


    document.getElementById(
        "playerEditTeam"
    ).value =
        TEAM_NAME;


    document.getElementById(
        "playerEditName"
    ).value =
        player.name || "";


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

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   SAVE PLAYER
========================================================= */

async function savePlayer(
    event
) {

    event.preventDefault();


    if (
        !currentUser ||
        !isAdmin
    ) {

        showNotification(
            "Доступ запрещён.",
            "error"
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

        showNotification(
            "Введите никнейм игрока.",
            "error"
        );

        return;

    }


    try {

        await supabaseRequest(

            "players?name=eq." +
            encodeURIComponent(
                oldName
            ),

            {

                method:
                    "PATCH",

                headers: {

                    "Prefer":
                        "return=representation"

                },

                body:
                    JSON.stringify({

                        name:
                            newName,

                        country:
                            country || "",

                        role:
                            role || "Игрок",

                        avatar:
                            avatar || "",

                        faceit:
                            faceit || "",

                        steam:
                            steam || ""

                    })

            }

        );


        await loadPlayers();


        closePlayerEditor();


        renderTeams();
        renderTeamProfile();


        const updatedPlayer =
            findPlayer(
                newName
            );


        if (updatedPlayer) {

            currentPlayer =
                updatedPlayer;

            renderPlayerProfile(
                updatedPlayer
            );

        }


        showNotification(
            "Профиль игрока сохранён."
        );


    } catch (error) {

        console.error(
            "Ошибка сохранения игрока:",
            error
        );


        showNotification(
            "Не удалось сохранить профиль.",
            "error"
        );

    }

}


/* =========================================================
   ADD PLAYER MODAL
========================================================= */

function createAddPlayerModal() {

    if (
        document.getElementById(
            "addPlayerModal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "addPlayerModal";


    modal.className =
        "modal hidden";


    modal.innerHTML = `

        <div class="modal-card">

            <button
                class="modal-close"
                type="button"
                onclick="closeAddPlayerModal()"
            >
                ×
            </button>


            <div class="eyebrow">
                ADD PLAYER
            </div>


            <h2>
                Добавить игрока
            </h2>


            <form id="addPlayerForm">

                <label>
                    Никнейм

                    <input
                        id="addPlayerName"
                        required
                        placeholder="Например: XXXOLDAR"
                    >
                </label>


                <label>
                    Страна

                    <input
                        id="addPlayerCountry"
                        placeholder="Russia"
                    >
                </label>


                <label>
                    Роль

                    <select id="addPlayerRole">

                        <option value="Игрок">
                            Игрок
                        </option>

                        <option value="Капитан">
                            Капитан
                        </option>

                        <option value="AWPer">
                            AWPer
                        </option>

                        <option value="Sniper">
                            Sniper
                        </option>

                        <option value="Rifler">
                            Rifler
                        </option>

                        <option value="Rifle">
                            Rifle
                        </option>

                        <option value="Entry">
                            Entry
                        </option>

                        <option value="Anchor">
                            Anchor
                        </option>

                        <option value="Support">
                            Support
                        </option>

                        <option value="IGL">
                            IGL
                        </option>

                        <option value="IGL + support">
                            IGL + support
                        </option>

                    </select>

                </label>


                <label>
                    Позиция в составе

                    <select id="addPlayerRoster">

                        <option value="starter">
                            Основной состав
                        </option>

                        <option value="substitute">
                            Замена
                        </option>

                    </select>

                </label>


                <label>
                    Аватар URL

                    <input
                        id="addPlayerAvatar"
                        type="url"
                        placeholder="https://..."
                    >
                </label>


                <label>
                    FACEIT URL

                    <input
                        id="addPlayerFaceit"
                        type="url"
                        placeholder="https://www.faceit.com/..."
                    >
                </label>


                <label>
                    Steam URL

                    <input
                        id="addPlayerSteam"
                        type="url"
                        placeholder="https://steamcommunity.com/..."
                    >
                </label>


                <button
                    class="primary save"
                    type="submit"
                >
                    Добавить игрока
                </button>

            </form>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {

                closeAddPlayerModal();

            }

        }
    );


    const form =
        document.getElementById(
            "addPlayerForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            addPlayer
        );

    }

}


/* =========================================================
   OPEN ADD PLAYER
========================================================= */

function openAddPlayerModal() {

    if (!isAdmin) {

        showNotification(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    createAddPlayerModal();


    const modal =
        document.getElementById(
            "addPlayerModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE ADD PLAYER
========================================================= */

function closeAddPlayerModal() {

    const modal =
        document.getElementById(
            "addPlayerModal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   ADD PLAYER
========================================================= */

async function addPlayer(
    event
) {

    event.preventDefault();


    if (
        !currentUser ||
        !isAdmin
    ) {

        showNotification(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const name =
        document.getElementById(
            "addPlayerName"
        )?.value.trim();


    const country =
        document.getElementById(
            "addPlayerCountry"
        )?.value.trim();


    const role =
        document.getElementById(
            "addPlayerRole"
        )?.value;


    const rosterType =
        document.getElementById(
            "addPlayerRoster"
        )?.value;


    const avatar =
        document.getElementById(
            "addPlayerAvatar"
        )?.value.trim();


    const faceit =
        document.getElementById(
            "addPlayerFaceit"
        )?.value.trim();


    const steam =
        document.getElementById(
            "addPlayerSteam"
        )?.value.trim();


    if (!name) {

        showNotification(
            "Введите никнейм игрока.",
            "error"
        );

        return;

    }


    if (findPlayer(name)) {

        showNotification(
            "Игрок с таким никнеймом уже существует.",
            "error"
        );

        return;

    }


    try {

        await supabaseRequest(
            "players",
            {

                method:
                    "POST",

                headers: {

                    "Prefer":
                        "return=representation"

                },

                body:
                    JSON.stringify({

                        name:
                            name,

                        country:
                            country || "",

                        role:
                            role || "Игрок",

                        avatar:
                            avatar || "",

                        faceit:
                            faceit || "",

                        steam:
                            steam || "",

                        roster_type:
                            rosterType ||
                            "starter",

                        active:
                            true

                    })

            }
        );


        await loadPlayers();


        closeAddPlayerModal();


        renderTeams();
        renderTeamProfile();


        showNotification(
            "Игрок успешно добавлен."
        );


    } catch (error) {

        console.error(
            "Ошибка добавления игрока:",
            error
        );


        showNotification(
            "Не удалось добавить игрока.",
            "error"
        );

    }

}


/* =========================================================
   MOVE TO SUBSTITUTE
========================================================= */

async function movePlayerToSubstitute(
    name
) {

    if (!isAdmin) {

        showNotification(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showNotification(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    try {

        await supabaseRequest(

            "players?name=eq." +
            encodeURIComponent(
                player.name
            ),

            {

                method:
                    "PATCH",

                headers: {

                    "Prefer":
                        "return=representation"

                },

                body:
                    JSON.stringify({

                        roster_type:
                            "substitute"

                    })

            }

        );


        await loadPlayers();


        const updated =
            findPlayer(
                player.name
            );


        if (updated) {

            currentPlayer =
                updated;

        }


        renderTeams();
        renderTeamProfile();


        if (
            window.location.hash ===
            "#playerPage" &&
            currentPlayer
        ) {

            renderPlayerProfile(
                currentPlayer
            );

        }


        showNotification(
            `${player.name} переведён в замены.`
        );

    } catch (error) {

        console.error(
            "Ошибка перевода:",
            error
        );


        showNotification(
            "Не удалось изменить состав.",
            "error"
        );

    }

}


/* =========================================================
   MOVE TO STARTER
========================================================= */

async function movePlayerToStarter(
    name
) {

    if (!isAdmin) {

        showNotification(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showNotification(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    try {

        await supabaseRequest(

            "players?name=eq." +
            encodeURIComponent(
                player.name
            ),

            {

                method:
                    "PATCH",

                headers: {

                    "Prefer":
                        "return=representation"

                },

                body:
                    JSON.stringify({

                        roster_type:
                            "starter"

                    })

            }

        );


        await loadPlayers();


        const updated =
            findPlayer(
                player.name
            );


        if (updated) {

            currentPlayer =
                updated;

        }


        renderTeams();
        renderTeamProfile();


        if (
            window.location.hash ===
            "#playerPage" &&
            currentPlayer
        ) {

            renderPlayerProfile(
                currentPlayer
            );

        }


        showNotification(
            `${player.name} переведён в основной состав.`
        );

    } catch (error) {

        console.error(
            "Ошибка перевода:",
            error
        );


        showNotification(
            "Не удалось изменить состав.",
            "error"
        );

    }

}


/* =========================================================
   REMOVE PLAYER
========================================================= */

async function removePlayerFromRoster(
    name
) {

    if (!isAdmin) {

        showNotification(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showNotification(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    try {

        await supabaseRequest(

            "players?name=eq." +
            encodeURIComponent(
                player.name
            ),

            {

                method:
                    "PATCH",

                headers: {

                    "Prefer":
                        "return=representation"

                },

                body:
                    JSON.stringify({

                        active:
                            false

                    })

            }

        );


        await loadPlayers();


        renderTeams();
        renderTeamProfile();


        closePlayer();


        showNotification(
            `${player.name} удалён из состава.`
        );


    } catch (error) {

        console.error(
            error
        );


        showNotification(
            "Не удалось удалить игрока.",
            "error"
        );

    }

}


/* =========================================================
   RESTORE PLAYER
========================================================= */

async function restorePlayer(
    name
) {

    if (!isAdmin) {

        showNotification(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showNotification(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    try {

        await supabaseRequest(

            "players?name=eq." +
            encodeURIComponent(
                player.name
            ),

            {

                method:
                    "PATCH",

                headers: {

                    "Prefer":
                        "return=representation"

                },

                body:
                    JSON.stringify({

                        active:
                            true

                    })

            }

        );


        await loadPlayers();


        renderTeamProfile();
        renderTeams();


        showNotification(
            `${player.name} снова добавлен в состав.`
        );


    } catch (error) {

        console.error(
            error
        );


        showNotification(
            "Не удалось восстановить игрока.",
            "error"
        );

    }

}


/* =========================================================
   TEAM EDITOR
========================================================= */

function openEditor() {

    if (!isAdmin) {

        showNotification(
            "Доступ запрещён.",
            "error"
        );

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


    if (title)
        title.value =
            team.title;


    if (tag)
        tag.value =
            team.tag;


    if (country)
        country.value =
            team.country;


    if (logo)
        logo.value =
            team.logo;


    if (faceit)
        faceit.value =
            team.faceit;


    if (steam)
        steam.value =
            team.steam;


    if (description)
        description.value =
            team.description;


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

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   SAVE TEAM
========================================================= */

function saveTeamFromForm(
    event
) {

    event.preventDefault();


    if (!isAdmin) {

        showNotification(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const title =
        document.getElementById(
            "editTitle"
        )?.value.trim();


    const tag =
        document.getElementById(
            "editTag"
        )?.value.trim();


    const country =
        document.getElementById(
            "editCountry"
        )?.value.trim();


    const logo =
        document.getElementById(
            "editLogo"
        )?.value.trim();


    const faceit =
        document.getElementById(
            "editFaceit"
        )?.value.trim();


    const steam =
        document.getElementById(
            "editSteam"
        )?.value.trim();


    const description =
        document.getElementById(
            "editDescription"
        )?.value.trim();


    if (title) {

        team.title =
            title;

        team.name =
            title;

    }


    if (tag) {

        team.tag =
            tag;

    }


    if (country) {

        team.country =
            country;

    }


    team.logo =
        logo || "";


    team.faceit =
        faceit || "";


    team.steam =
        steam || "";


    team.description =
        description || "";


    closeEditor();


    renderTeams();
    renderTeamProfile();


    showNotification(
        "Данные команды обновлены."
    );

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
        top:0,
        behavior:"smooth"
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
        top:0,
        behavior:"smooth"
    });

}


/* =========================================================
   HIDE OTHER PAGES
========================================================= */

function hideOtherPages() {

    document
        .querySelectorAll(
            ".page-section"
        )
        .forEach(
            page =>
                page.classList.add(
                    "hidden"
                )
        );

}


/* =========================================================
   FILTER
========================================================= */

function filterTeams(
    filter,
    button
) {

    document
        .querySelectorAll(
            ".filters button"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "selected"
                )
        );


    if (button) {

        button.classList.add(
            "selected"
        );

    }


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


    if (teams)
        teams.classList.add(
            "hidden"
        );


    if (teamPage)
        teamPage.classList.add(
            "hidden"
        );


    if (playerPage)
        playerPage.classList.add(
            "hidden"
        );


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


    if (
        hash === "#teamPage"
    ) {

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


    if (
        hash === "#playerPage"
    ) {

        if (playerPage) {

            playerPage.classList.remove(
                "hidden"
            );

        }


        if (currentPlayer) {

            renderPlayerProfile(
                currentPlayer
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
   NAVIGATION
========================================================= */

function updateActiveNavigation(
    currentHash
) {

    document
        .querySelectorAll(
            ".topbar nav a"
        )
        .forEach(
            link => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    href ===
                    currentHash
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
        );

}


/* =========================================================
   INITIALIZATION
========================================================= */

async function init() {

    console.log(
        "1Minute запускается..."
    );


    const connected =
        initSupabase();


    if (!connected) {

        renderTeams();
        renderRating();
        renderMatches();
        renderTournaments();
        showHashPage();

        return;

    }


    /*
     * Сначала ставим listener.
     * Затем получаем текущую сессию.
     */

    setupAuthListener();


    await checkAuth();


    await loadPlayers();


    createAddPlayerModal();


    renderTeams();
    renderRating();
    renderMatches();
    renderTournaments();


    showHashPage();


    console.log(
        "1Minute готов."
    );


    console.log(
        "User:",
        currentUser?.id ||
        "нет"
    );


    console.log(
        "Admin:",
        isAdmin
    );


    console.log(
        "Players:",
        players.length
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


        /* ================================================
           PLAYER EDIT FORM
        ================================================ */

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


        /* ================================================
           LOGIN FORM
        ================================================ */

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


        /* ================================================
           TEAM EDIT FORM
        ================================================ */

        const editForm =
            document.getElementById(
                "editForm"
            );


        if (editForm) {

            editForm.addEventListener(
                "submit",
                saveTeamFromForm
            );

        }


        /* ================================================
           START
        ================================================ */

        init();

    }
);
/* =========================================================
   MAIN PAGE DESIGN
   Убираем фильтры и центрируем команду
========================================================= */

function setupMainPageDesign() {

    /* Убираем фильтры:
       Все / Активные / Неактивные
    */

    const filters =
        document.querySelector(".filters");

    if (filters) {
        filters.remove();
    }


    /* Центрируем заголовок TEAM / 1Minute */

    const teamsSection =
        document.getElementById("teams");

    if (teamsSection) {

        teamsSection.style.textAlign =
            "center";

    }


    /* Центрируем блок с карточкой команды */

    const teamsList =
        document.getElementById("teams-list");

    if (teamsList) {

        teamsList.style.display =
            "flex";

        teamsList.style.flexDirection =
            "column";

        teamsList.style.alignItems =
            "center";

    }


    /* Саму карточку команды */

    const grid =
        document.getElementById("grid");

    if (grid) {

        grid.style.width =
            "100%";

        grid.style.display =
            "flex";

        grid.style.justifyContent =
            "center";

        grid.style.alignItems =
            "center";

    }

}


/* =========================================================
   MAIN PAGE DESIGN AFTER RENDER
========================================================= */

const originalRenderTeams =
    renderTeams;

renderTeams = function() {

    originalRenderTeams();

    setupMainPageDesign();

};


/* =========================================================
   INITIAL DESIGN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setTimeout(
            setupMainPageDesign,
            100
        );

    }
);

/* =========================================================
   END
========================================================= */
