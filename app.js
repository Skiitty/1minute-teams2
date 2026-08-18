/* =========================================================
   1MINUTE — APP.JS
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
   TEAM ROSTER
========================================================= */

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
   GLOBAL STATE
========================================================= */

let players = [];

let currentUser = null;

let isAdmin = false;


/* =========================================================
   TEAM DATA
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
   SUPABASE CLIENT
========================================================= */

let supabaseClient = null;


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
            "Supabase client создан."
        );

        return true;

    } catch (error) {

        console.error(
            "Не удалось создать Supabase client:",
            error
        );

        return false;

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
        function(player) {

            return (
                normalize(player.name) ===
                target
            );

        }
    ) || null;

}


function getPlayersByNames(names) {

    return names
        .map(findPlayer)
        .filter(Boolean);

}


/* =========================================================
   SUPABASE REST HELPER
========================================================= */

async function supabaseRequest(
    path,
    options = {}
) {

    const headers = {

        "apikey":
            SUPABASE_KEY,

        "Authorization":
            "Bearer " + SUPABASE_KEY,

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


    if (!response.ok) {

        const text =
            await response.text();

        console.error(
            "Supabase REST error:",
            response.status,
            text
        );

        throw new Error(text);

    }


    const text =
        await response.text();


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
   AUTH — CHECK SESSION
========================================================= */

async function checkAuth() {

    if (!supabaseClient) {

        currentUser = null;

        isAdmin = false;

        updateLoginButton();

        return;

    }


    try {

        const result =
            await supabaseClient.auth.getSession();


        if (result.error) {

            throw result.error;

        }


        currentUser =
            result.data &&
            result.data.session
                ? result.data.session.user
                : null;


        console.log(
            "Current user:",
            currentUser
                ? currentUser.id
                : "нет пользователя"
        );


        await checkAdmin();


        updateLoginButton();

        updateLoginModalUI();


        console.log(
            "Текущий пользователь:",
            currentUser
        );

        console.log(
            "Администратор:",
            isAdmin
        );


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
   AUTH — CHECK ADMIN
========================================================= */

/*
    ВАЖНО:

    Проверяем именно UUID текущего пользователя:

    currentUser.id

    Например:

    33aab221-5fec-453e-b949-4c2e7f66be3a

    В таблице admins должно быть:

    user_id =
    33aab221-5fec-453e-b949-4c2e7f66be3a
*/

async function checkAdmin() {

    isAdmin = false;


    if (!currentUser) {

        console.log(
            "Admin check: пользователь не авторизован"
        );

        return false;

    }


    if (!supabaseClient) {

        console.error(
            "Admin check: Supabase client отсутствует."
        );

        return false;

    }


    const userId =
        currentUser.id;


    console.log(
        "================================="
    );

    console.log(
        "ADMIN CHECK"
    );

    console.log(
        "Auth user ID:",
        userId
    );

    console.log(
        "Ищем этот UUID в admins.user_id"
    );


    try {

        /*
         * Используем Supabase client,
         * а не обычный REST fetch.
         */

        const result =
            await supabaseClient
                .from("admins")
                .select("user_id")
                .eq(
                    "user_id",
                    userId
                )
                .maybeSingle();


        console.log(
            "Ответ admins:",
            result
        );


        if (result.error) {

            console.error(
                "ADMIN TABLE ERROR:",
                result.error
            );

            console.error(
                "Код:",
                result.error.code
            );

            console.error(
                "Сообщение:",
                result.error.message
            );

            console.error(
                "Детали:",
                result.error.details
            );

            console.error(
                "Hint:",
                result.error.hint
            );

            isAdmin = false;

            return false;

        }


        if (result.data) {

            isAdmin = true;

            console.log(
                "✅ ADMIN FOUND"
            );

            console.log(
                "Admin UUID:",
                result.data.user_id
            );

        } else {

            isAdmin = false;

            console.log(
                "❌ ADMIN NOT FOUND"
            );

            console.log(
                "В таблице admins нет доступной строки с этим UUID."
            );

        }


        console.log(
            "Итог isAdmin:",
            isAdmin
        );

        console.log(
            "================================="
        );


        return isAdmin;


    } catch (error) {

        console.error(
            "Критическая ошибка проверки admins:",
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


    if (isAdmin) {

        button.textContent =
            "Администратор";

    } else {

        button.textContent =
            "Аккаунт";

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
                    "✓ Доступ администратора" +
                    "</span>"
                    :
                    "<br><span style='color:#ffb36b'>" +
                    "У вас нет прав администратора." +
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


    const status =
        document.getElementById(
            "loginStatus"
        );


    const error =
        document.getElementById(
            "loginError"
        );


    if (!email || !password) {

        showLoginError(
            "Поля входа не найдены."
        );

        return;

    }


    if (error) {

        error.style.display =
            "none";

        error.textContent =
            "";

    }


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
            result.data.user;


        console.log(
            "LOGIN USER:",
            currentUser.id
        );


        /*
         * Очень важно:
         * после входа сразу проверяем admins.
         */

        await checkAdmin();


        updateLoginButton();

        updateLoginModalUI();


        if (status) {

            if (isAdmin) {

                status.innerHTML =
                    "<span style='color:#8ee6ad'>" +
                    "✓ Вы вошли как администратор." +
                    "</span>";

            } else {

                status.innerHTML =
                    "<span style='color:#ffb36b'>" +
                    "Вход выполнен, но прав администратора нет." +
                    "</span>";

            }

        }


        setTimeout(
            function() {

                closeLoginModal();

                renderTeams();

                renderTeamProfile();


                if (
                    window.location.hash ===
                    "#teamPage"
                ) {

                    showHashPage();

                }

            },
            600
        );


    } catch (errorObject) {

        console.error(
            "Ошибка входа:",
            errorObject
        );


        showLoginError(
            getAuthErrorMessage(
                errorObject
            )
        );

    }

}


/* =========================================================
   LOGIN ERROR
========================================================= */

function showLoginError(message) {

    const error =
        document.getElementById(
            "loginError"
        );


    if (!error) {

        alert(message);

        return;

    }


    error.textContent =
        message;

    error.style.display =
        "block";

}


function getAuthErrorMessage(error) {

    const message =
        String(
            error?.message || ""
        ).toLowerCase();


    if (
        message.includes(
            "invalid login credentials"
        ) ||
        message.includes(
            "invalid credentials"
        ) ||
        message.includes(
            "invalid login"
        )
    ) {

        return "Неверный email или пароль.";

    }


    if (
        message.includes(
            "email not confirmed"
        )
    ) {

        return (
            "Email не подтверждён. " +
            "Подтверди его в письме от Supabase."
        );

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
                await supabaseClient.auth
                    .signOut();


            if (result.error) {

                throw result.error;

            }

        }

    } catch (error) {

        console.error(
            "Ошибка выхода:",
            error
        );

    }


    currentUser = null;

    isAdmin = false;


    updateLoginButton();

    updateLoginModalUI();

    closeLoginModal();


    renderTeamProfile();


    if (
        window.location.hash ===
        "#teamPage"
    ) {

        showHashPage();

    }


    alert(
        "Вы вышли из аккаунта."
    );

}


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

function setupAuthListener() {

    if (!supabaseClient) {

        return;

    }


    supabaseClient.auth.onAuthStateChange(
        async function(
            event,
            session
        ) {

            console.log(
                "Auth event:",
                event
            );


            currentUser =
                session
                    ? session.user
                    : null;


            /*
             * Не проверяем admins для SIGNED_OUT.
             */

            if (currentUser) {

                await checkAdmin();

            } else {

                isAdmin = false;

            }


            updateLoginButton();

            updateLoginModalUI();

            renderTeamProfile();


            const playerPage =
                document.getElementById(
                    "playerProfile"
                );


            if (
                playerPage &&
                window.location.hash ===
                "#playerPage"
            ) {

                const playerName =
                    playerPage.dataset.player;


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
                            ?
                            `
                                <img
                                    src="${escapeHTML(logo)}"
                                    alt="${escapeHTML(team.name)}"
                                >
                            `
                            :
                            `
                                <span>
                                    1
                                </span>
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


    if (
        starters.length === 0
    ) {

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
                .map(
                    function(player) {

                        return playerCard(
                            player,
                            false
                        );

                    }
                )
                .join("");

    }


    if (
        substitutes.length === 0
    ) {

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
                .map(
                    function(player) {

                        return playerCard(
                            player,
                            true
                        );

                    }
                )
                .join("");

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
                                <span>
                                    1
                                </span>
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

function renderPlayerProfile(player) {

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


    container.dataset.player =
        name;


    let adminButtons = "";


    if (isAdmin) {

        adminButtons = `

            <button
                class="edit-btn"
                type="button"
                onclick="openPlayerEditor('${safeName}')"
            >
                ✎ Редактировать профиль
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

function openPlayerEditor(name) {

    if (!isAdmin) {

        alert(
            "Доступ запрещён. " +
            "Редактировать профили может только администратор."
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
            player.role ||
            "Игрок";

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


    if (
        !currentUser ||
        !isAdmin
    ) {

        alert(
            "Доступ запрещён."
        );

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


        await loadPlayers();


        closePlayerEditor();


        renderTeams();

        renderTeamProfile();


        const updatedPlayer =
            findPlayer(
                newName
            );


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
            "Ошибка сохранения игрока:",
            error
        );


        alert(
            "Не удалось сохранить профиль.\n\n" +
            "Проверь RLS таблицы players."
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


/* =========================================================
   CLOSE TEAM EDITOR
========================================================= */

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
   HIDE OTHER PAGES
========================================================= */

function hideOtherPages() {

    const pages =
        document.querySelectorAll(
            ".page-section"
        );


    pages.forEach(
        function(page) {

            page.classList.add(
                "hidden"
            );

        }
    );

}


/* =========================================================
   FILTER
========================================================= */

function filterTeams(
    filter,
    button
) {

    const buttons =
        document.querySelectorAll(
            ".filters button"
        );


    buttons.forEach(
        function(item) {

            item.classList.remove(
                "selected"
            );

        }
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


    links.forEach(
        function(link) {

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
        "================================="
    );

    console.log(
        "1Minute запускается..."
    );

    console.log(
        "================================="
    );


    const connected =
        initSupabase();


    if (!connected) {

        console.error(
            "Supabase не подключён."
        );


        renderTeams();

        renderRating();

        renderMatches();

        renderTournaments();

        showHashPage();

        return;

    }


    setupAuthListener();


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


        const editForm =
            document.getElementById(
                "editForm"
            );


        if (editForm) {

            editForm.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();


                    if (!isAdmin) {

                        alert(
                            "Доступ запрещён."
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


                    if (title) {

                        team.name =
                            title.value.trim();

                        team.title =
                            title.value.trim();

                    }


                    if (tag) {

                        team.tag =
                            tag.value.trim();

                    }


                    if (country) {

                        team.country =
                            country.value.trim();

                    }


                    if (logo) {

                        team.logo =
                            logo.value.trim();

                    }


                    if (faceit) {

                        team.faceit =
                            faceit.value.trim();

                    }


                    if (steam) {

                        team.steam =
                            steam.value.trim();

                    }


                    if (description) {

                        team.description =
                            description.value.trim();

                    }


                    closeEditor();

                    renderTeams();

                    renderTeamProfile();


                    alert(
                        "Данные команды обновлены."
                    );

                }
            );

        }


        init();

    }
);


/* =========================================================
   END
========================================================= */
