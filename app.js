/* =========================================================
   1MINUTE — APP.JS
   TEAM DATABASE + SUPABASE + ADMIN + ROSTER
   + STEAM AVATAR AUTO UPDATE
   + TEAM PERSISTENCE
   + TOAST NOTIFICATIONS
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://wzheavazneaybhmgfntn.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK";

const TEAM_NAME =
    "1Minute";


/* =========================================================
   STEAM AVATAR EDGE FUNCTION
========================================================= */

const STEAM_AVATAR_FUNCTION =
    SUPABASE_URL +
    "/functions/v1/steam-avatar";


/* =========================================================
   GLOBAL STATE
========================================================= */

let players = [];

let currentUser = null;

let isAdmin = false;

let supabaseClient = null;

let teamDatabaseId = null;


/* =========================================================
   TEAM
========================================================= */

const team = {

    id: null,

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

    return String(value || "")
        .trim()
        .toLowerCase();

}


function escapeHTML(value) {

    return String(value ?? "")
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
   TOAST NOTIFICATIONS
========================================================= */

function showToast(
    message,
    type = "success"
) {

    let toast =
        document.getElementById(
            "siteToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "siteToast";


        toast.style.position =
            "fixed";

        toast.style.right =
            "25px";

        toast.style.bottom =
            "25px";

        toast.style.zIndex =
            "999999";

        toast.style.padding =
            "14px 18px";

        toast.style.borderRadius =
            "10px";

        toast.style.fontSize =
            "14px";

        toast.style.fontWeight =
            "600";

        toast.style.maxWidth =
            "380px";

        toast.style.lineHeight =
            "1.45";

        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.4)";

        toast.style.transition =
            "opacity .25s ease, transform .25s ease";

        toast.style.pointerEvents =
            "none";

        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    if (type === "error") {

        toast.style.background =
            "#2a1414";

        toast.style.border =
            "1px solid #663232";

        toast.style.color =
            "#ff9a9a";

    } else if (type === "info") {

        toast.style.background =
            "#171b24";

        toast.style.border =
            "1px solid #343b4c";

        toast.style.color =
            "#cbd2df";

    } else {

        toast.style.background =
            "#102419";

        toast.style.border =
            "1px solid #285a3a";

        toast.style.color =
            "#8ee6ad";

    }


    toast.style.opacity =
        "1";

    toast.style.transform =
        "translateY(0)";


    clearTimeout(
        window.siteToastTimer
    );


    window.siteToastTimer =
        setTimeout(
            function() {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateY(10px)";

            },
            3000
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


    const sessionResult =
        await supabaseClient.auth.getSession();


    if (sessionResult.error) {

        throw sessionResult.error;

    }


    const session =
        sessionResult.data?.session ||
        null;


    const accessToken =
        session?.access_token ||
        SUPABASE_KEY;


    const headers = {

        "apikey":
            SUPABASE_KEY,

        "Authorization":
            "Bearer " + accessToken,

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
   AUTH CHECK
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


        console.log(
            "Текущий пользователь:",
            currentUser
        );


        await checkAdmin();


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

            isAdmin = false;

            return false;

        }


        isAdmin =
            !!result.data;


        console.log(
            "Admin check:",
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


        await checkAdmin();


        updateLoginButton();

        updateLoginModalUI();


        await loadTeam();

        await loadPlayers();


        renderTeams();

        renderTeamProfile();


        showToast(
            isAdmin
                ? "Вход выполнен. Вы администратор."
                : "Вход выполнен.",
            "success"
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

function showLoginError(message) {

    const error =
        document.getElementById(
            "loginError"
        );


    if (!error) {

        showToast(
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


function getAuthErrorMessage(error) {

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


    showToast(
        "Вы вышли из аккаунта.",
        "success"
    );

}


/* =========================================================
   AUTH LISTENER
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
                session?.user ||
                null;


            await checkAdmin();


            updateLoginButton();

            updateLoginModalUI();


            renderTeamProfile();

        }
    );

}


/* =========================================================
   LOAD TEAM
========================================================= */

async function loadTeam() {

    if (!supabaseClient) {

        return;

    }


    try {

        let result;


        /*
         * Сначала ищем команду по ID,
         * если ID уже известен.
         */

        if (teamDatabaseId) {

            result =
                await supabaseClient
                    .from("teams")
                    .select("*")
                    .eq(
                        "id",
                        teamDatabaseId
                    )
                    .maybeSingle();

        } else {

            /*
             * Первый запуск:
             * ищем 1Minute.
             */

            result =
                await supabaseClient
                    .from("teams")
                    .select("*")
                    .eq(
                        "name",
                        TEAM_NAME
                    )
                    .maybeSingle();

        }


        if (result.error) {

            throw result.error;

        }


        if (!result.data) {

            console.log(
                "Команда 1Minute в таблице teams не найдена."
            );

            return;

        }


        const data =
            result.data;


        /*
         * Запоминаем ID.
         */

        if (data.id) {

            teamDatabaseId =
                data.id;

            team.id =
                data.id;

        }


        team.name =
            data.name ||
            "1Minute";


        team.title =
            data.name ||
            "1Minute";


        team.tag =
            data.tag ||
            "1M";


        team.country =
            data.country ||
            "Russia";


        team.logo =
            data.logo ||
            "";


        team.faceit =
            data.faceit ||
            "";


        team.steam =
            data.steam ||
            "";


        team.description =
            data.description ||
            "";


        console.log(
            "✓ Команда загружена:",
            team
        );

    } catch (error) {

        console.error(
            "Ошибка загрузки команды:",
            error
        );

    }

}


/* =========================================================
   SAVE TEAM
========================================================= */

async function saveTeamFromForm(event) {

    event.preventDefault();


    if (
        !currentUser ||
        !isAdmin
    ) {

        showToast(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const title =
        document.getElementById(
            "editTitle"
        )?.value.trim() ||
        "1Minute";


    const tag =
        document.getElementById(
            "editTag"
        )?.value.trim() ||
        "1M";


    const country =
        document.getElementById(
            "editCountry"
        )?.value.trim() ||
        "Russia";


    const logo =
        document.getElementById(
            "editLogo"
        )?.value.trim() ||
        "";


    const faceit =
        document.getElementById(
            "editFaceit"
        )?.value.trim() ||
        "";


    const steam =
        document.getElementById(
            "editSteam"
        )?.value.trim() ||
        "";


    const description =
        document.getElementById(
            "editDescription"
        )?.value.trim() ||
        "";


    try {

        let query;


        /*
         * Если знаем ID команды —
         * обновляем именно её.
         */

        if (teamDatabaseId) {

            query =
                supabaseClient
                    .from("teams")
                    .update({

                        name:
                            title,

                        tag:
                            tag,

                        country:
                            country,

                        logo:
                            logo,

                        faceit:
                            faceit,

                        steam:
                            steam,

                        description:
                            description

                    })
                    .eq(
                        "id",
                        teamDatabaseId
                    )
                    .select()
                    .maybeSingle();

        } else {

            /*
             * Если ID ещё неизвестен,
             * ищем старое имя.
             */

            query =
                supabaseClient
                    .from("teams")
                    .update({

                        name:
                            title,

                        tag:
                            tag,

                        country:
                            country,

                        logo:
                            logo,

                        faceit:
                            faceit,

                        steam:
                            steam,

                        description:
                            description

                    })
                    .eq(
                        "name",
                        TEAM_NAME
                    )
                    .select()
                    .maybeSingle();

        }


        const result =
            await query;


        if (result.error) {

            console.error(
                "Ошибка сохранения команды:",
                result.error
            );

            throw result.error;

        }


        if (!result.data) {

            throw new Error(
                "Команда не найдена в таблице teams."
            );

        }


        /*
         * Обновляем ID.
         */

        if (result.data.id) {

            teamDatabaseId =
                result.data.id;

            team.id =
                result.data.id;

        }


        /*
         * Обновляем локальные данные.
         */

        team.name =
            result.data.name ||
            title;


        team.title =
            result.data.name ||
            title;


        team.tag =
            result.data.tag ||
            tag;


        team.country =
            result.data.country ||
            country;


        team.logo =
            result.data.logo ||
            logo;


        team.faceit =
            result.data.faceit ||
            faceit;


        team.steam =
            result.data.steam ||
            steam;


        team.description =
            result.data.description ||
            description;


        closeEditor();


        renderTeams();

        renderTeamProfile();


        showToast(
            "Изменения команды сохранены.",
            "success"
        );


        console.log(
            "✓ Команда сохранена:",
            result.data
        );

    } catch (error) {

        console.error(
            "SAVE TEAM ERROR:",
            error
        );


        showToast(
            "Не удалось сохранить изменения команды.",
            "error"
        );

    }

}


/* =========================================================
   TEAM EDITOR
========================================================= */

function openEditor() {

    if (!isAdmin) {

        showToast(
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
            team.title ||
            team.name ||
            "";


    if (tag)
        tag.value =
            team.tag ||
            "";


    if (country)
        country.value =
            team.country ||
            "";


    if (logo)
        logo.value =
            team.logo ||
            "";


    if (faceit)
        faceit.value =
            team.faceit ||
            "";


    if (steam)
        steam.value =
            team.steam ||
            "";


    if (description)
        description.value =
            team.description ||
            "";


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


    let adminControls =
        "";


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


    let adminButtons =
        "";


    if (isAdmin) {

        const isSubstitute =
            normalize(
                player.roster_type ||
                "starter"
            ) ===
            "substitute";


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

function openPlayerEditor(name) {

    if (!isAdmin) {

        showToast(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showToast(
            "Игрок не найден.",
            "error"
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


    if (oldName)
        oldName.value =
            player.name || "";


    if (teamInput)
        teamInput.value =
            TEAM_NAME;


    if (nameInput)
        nameInput.value =
            player.name || "";


    if (countryInput)
        countryInput.value =
            player.country || "";


    if (roleInput)
        roleInput.value =
            player.role ||
            "Игрок";


    if (avatarInput)
        avatarInput.value =
            player.avatar || "";


    if (faceitInput)
        faceitInput.value =
            player.faceit || "";


    if (steamInput)
        steamInput.value =
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
   STEAM AVATAR
========================================================= */

async function getSteamAvatar(
    steamUrl
) {

    if (!steamUrl) {

        return null;

    }


    try {

        const response =
            await fetch(
                STEAM_AVATAR_FUNCTION,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            steam_url:
                                steamUrl

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Steam avatar error:",
                data
            );

            return null;

        }


        if (
            data.success &&
            data.avatar
        ) {

            return data;

        }


        return null;

    } catch (error) {

        console.error(
            "Ошибка получения Steam аватара:",
            error
        );

        return null;

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

        showToast(
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


    let avatar =
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

        showToast(
            "Введите никнейм игрока.",
            "error"
        );

        return;

    }


    try {

        /*
         * Если указана Steam-ссылка —
         * автоматически получаем аватар.
         */

        if (steam) {

            showToast(
                "Получаем аватар Steam...",
                "info"
            );


            const steamData =
                await getSteamAvatar(
                    steam
                );


            if (
                steamData &&
                steamData.avatar
            ) {

                avatar =
                    steamData.avatar;

            }

        }


        const player =
            findPlayer(oldName);


        let query;


        if (player?.id) {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        name:
                            newName,

                        country:
                            country || "",

                        role:
                            role ||
                            "Игрок",

                        avatar:
                            avatar || "",

                        faceit:
                            faceit || "",

                        steam:
                            steam || ""

                    })
                    .eq(
                        "id",
                        player.id
                    )
                    .select()
                    .maybeSingle();

        } else {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        name:
                            newName,

                        country:
                            country || "",

                        role:
                            role ||
                            "Игрок",

                        avatar:
                            avatar || "",

                        faceit:
                            faceit || "",

                        steam:
                            steam || ""

                    })
                    .eq(
                        "name",
                        oldName
                    )
                    .select()
                    .maybeSingle();

        }


        const result =
            await query;


        if (result.error) {

            throw result.error;

        }


        if (!result.data) {

            throw new Error(
                "Игрок не найден в базе данных."
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


        showToast(
            "Профиль игрока сохранён.",
            "success"
        );


    } catch (error) {

        console.error(
            "Ошибка сохранения игрока:",
            error
        );


        showToast(
            "Не удалось сохранить профиль игрока.",
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

        showToast(
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

async function addPlayer(event) {

    event.preventDefault();


    if (
        !currentUser ||
        !isAdmin
    ) {

        showToast(
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


    let avatar =
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

        showToast(
            "Введите никнейм игрока.",
            "error"
        );

        return;

    }


    if (findPlayer(name)) {

        showToast(
            "Игрок с таким никнеймом уже существует.",
            "error"
        );

        return;

    }


    try {

        /*
         * Автоматически получаем Steam аватар.
         */

        if (steam) {

            showToast(
                "Получаем аватар Steam...",
                "info"
            );


            const steamData =
                await getSteamAvatar(
                    steam
                );


            if (
                steamData &&
                steamData.avatar
            ) {

                avatar =
                    steamData.avatar;

            }

        }


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
                            role ||
                            "Игрок",

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


        showToast(
            "Игрок успешно добавлен.",
            "success"
        );

    } catch (error) {

        console.error(
            "Ошибка добавления игрока:",
            error
        );


        showToast(
            "Не удалось добавить игрока.",
            "error"
        );

    }

}


/* =========================================================
   MOVE PLAYER TO SUBSTITUTE
========================================================= */

async function movePlayerToSubstitute(name) {

    if (!isAdmin) {

        showToast(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showToast(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    try {

        let query;


        if (player.id) {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        roster_type:
                            "substitute"

                    })
                    .eq(
                        "id",
                        player.id
                    )
                    .select()
                    .maybeSingle();

        } else {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        roster_type:
                            "substitute"

                    })
                    .eq(
                        "name",
                        player.name
                    )
                    .select()
                    .maybeSingle();

        }


        const result =
            await query;


        if (result.error) {

            throw result.error;

        }


        if (!result.data) {

            throw new Error(
                "Игрок не найден в базе."
            );

        }


        await loadPlayers();


        renderTeamProfile();

        renderTeams();


        showToast(
            player.name +
            " переведён в замены.",
            "success"
        );


    } catch (error) {

        console.error(
            error
        );


        showToast(
            "Не удалось изменить состав.",
            "error"
        );

    }

}


/* =========================================================
   MOVE PLAYER TO STARTER
========================================================= */

async function movePlayerToStarter(name) {

    if (!isAdmin) {

        showToast(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showToast(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    try {

        let query;


        if (player.id) {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        roster_type:
                            "starter"

                    })
                    .eq(
                        "id",
                        player.id
                    )
                    .select()
                    .maybeSingle();

        } else {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        roster_type:
                            "starter"

                    })
                    .eq(
                        "name",
                        player.name
                    )
                    .select()
                    .maybeSingle();

        }


        const result =
            await query;


        if (result.error) {

            throw result.error;

        }


        if (!result.data) {

            throw new Error(
                "Игрок не найден в базе."
            );

        }


        await loadPlayers();


        renderTeamProfile();

        renderTeams();


        showToast(
            player.name +
            " переведён в основной состав.",
            "success"
        );


    } catch (error) {

        console.error(
            error
        );


        showToast(
            "Не удалось изменить состав.",
            "error"
        );

    }

}


/* =========================================================
   REMOVE PLAYER
========================================================= */

async function removePlayerFromRoster(name) {

    if (!isAdmin) {

        showToast(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showToast(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    const confirmed =
        confirm(
            `Удалить ${player.name} из состава?\n\nИгрок будет скрыт с сайта.`
        );


    if (!confirmed) {

        return;

    }


    try {

        let query;


        if (player.id) {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        active:
                            false

                    })
                    .eq(
                        "id",
                        player.id
                    )
                    .select()
                    .maybeSingle();

        } else {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        active:
                            false

                    })
                    .eq(
                        "name",
                        player.name
                    )
                    .select()
                    .maybeSingle();

        }


        const result =
            await query;


        if (result.error) {

            throw result.error;

        }


        await loadPlayers();


        renderTeams();

        renderTeamProfile();

        closePlayer();


        showToast(
            "Игрок удалён из состава.",
            "success"
        );


    } catch (error) {

        console.error(
            error
        );


        showToast(
            "Не удалось удалить игрока.",
            "error"
        );

    }

}


/* =========================================================
   RESTORE PLAYER
========================================================= */

async function restorePlayer(name) {

    if (!isAdmin) {

        showToast(
            "Доступ запрещён.",
            "error"
        );

        return;

    }


    const player =
        findPlayer(name);


    if (!player) {

        showToast(
            "Игрок не найден.",
            "error"
        );

        return;

    }


    try {

        let query;


        if (player.id) {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        active:
                            true

                    })
                    .eq(
                        "id",
                        player.id
                    )
                    .select()
                    .maybeSingle();

        } else {

            query =
                supabaseClient
                    .from("players")
                    .update({

                        active:
                            true

                    })
                    .eq(
                        "name",
                        player.name
                    )
                    .select()
                    .maybeSingle();

        }


        const result =
            await query;


        if (result.error) {

            throw result.error;

        }


        await loadPlayers();


        renderTeamProfile();

        renderTeams();


        showToast(
            "Игрок снова добавлен в состав.",
            "success"
        );


    } catch (error) {

        console.error(
            error
        );


        showToast(
            "Не удалось восстановить игрока.",
            "error"
        );

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
   Оставляем функцию для совместимости,
   но вкладки фильтра больше не используются.
========================================================= */

function filterTeams(
    filter,
    button
) {

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
                    ${escapeHTML(
                        team.name
                    )}
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
            Матчи ${escapeHTML(team.name)}
            пока не добавлены.
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
            Турниры ${escapeHTML(team.name)}
            пока не добавлены.
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

        renderTeams();

        renderRating();

        renderMatches();

        renderTournaments();

        showHashPage();

        return;

    }


    setupAuthListener();


    await checkAuth();


    /*
     * ВАЖНО:
     * сначала загружаем команду,
     * чтобы после F5 подтянулись
     * сохранённые данные.
     */

    await loadTeam();


    await loadPlayers();


    createAddPlayerModal();


    renderTeams();

    renderRating();

    renderMatches();

    renderTournaments();


    showHashPage();


    console.log(
        "================================="
    );


    console.log(
        "1Minute готов."
    );


    console.log(
        "Team:",
        team
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


    console.log(
        "================================="
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
         * PLAYER EDIT FORM
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
         * LOGIN FORM
         */

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


        /*
         * TEAM EDIT FORM
         */

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


        /*
         * START
         */

        init();

    }
);


/* =========================================================
   END
========================================================= */
