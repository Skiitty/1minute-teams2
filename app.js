const SUPABASE_URL="https://wzheavazneaybhmgfntn.supabase.co";
const SUPABASE_KEY="sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK";

const TEAM_NAME="1Minute";

const STARTERS=[
"Hesoko",
"sk1pp",
"k9yzo",
"XXXOLDAR",
"yoplo"
];

const SUBSTITUTES=[
"lqq69",
"ChapsTea"
];

let players=[];

const team={
name:"1Minute",
title:"1Minute",
tag:"1M",
country:"Russia",
logo:"",
faceit:"",
steam:"",
description:"Профили состава, матчи и статистика 1Minute — всё в одном месте.",
status:"active"
};


/* =========================
   SUPABASE
========================= */

async function supabase(path,options={}){
const headers={
apikey:SUPABASE_KEY,
Authorization:"Bearer "+SUPABASE_KEY,
"Content-Type":"application/json"
};

if(options.headers)Object.assign(headers,options.headers);

const r=await fetch(SUPABASE_URL+"/rest/v1/"+path,{
method:options.method||"GET",
headers,
body:options.body
});

if(!r.ok){
const text=await r.text();
console.error("Supabase:",r.status,text);
throw new Error(text);
}

const text=await r.text();

if(!text)return[];

try{return JSON.parse(text)}
catch{return[]}
}


/* =========================
   HELPERS
========================= */

function normalize(v){
return String(v||"").trim().toLowerCase();
}

function escapeHTML(v){
return String(v||"")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");
}

function safeJSString(v){
return String(v||"")
.replace(/\\/g,"\\\\")
.replace(/'/g,"\\'")
.replace(/"/g,'\\"')
.replace(/\n/g,"\\n")
.replace(/\r/g,"\\r");
}

function findPlayer(name){
const n=normalize(name);
return players.find(p=>normalize(p.name)===n)||null;
}


/*
Если игрока нет в Supabase,
создаём временную карточку.
*/

function getPlayersByNames(names){
return names.map(name=>{
const p=findPlayer(name);

return p||{
name,
role:"Игрок",
country:"",
avatar:"",
faceit:"",
steam:""
};
});
}


/* =========================
   LOAD PLAYERS
========================= */

async function loadPlayers(){
try{
const data=await supabase("players?select=*&order=id.asc");
players=Array.isArray(data)?data:[];
console.log("Players:",players);
}catch(e){
console.error("Ошибка игроков:",e);
players=[];
}
}


/* =========================
   TEAM CARD
========================= */

function renderTeams(){
const grid=document.getElementById("grid");
if(!grid)return;

grid.innerHTML=`
<div class="team-card" onclick="openTeam()">

<div class="team-top">

<div class="team-logo">
${
team.logo
?`<img src="${escapeHTML(team.logo)}" alt="1Minute">`
:`<span>1</span>`
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

<span>${escapeHTML(team.tag)}</span>

<span class="status active">
● ACTIVE
</span>

</div>

</div>
`;
}


/* =========================
   PLAYER CARD
========================= */

function playerCard(player,isSubstitute){

const name=player.name||"Player";
const role=player.role||"Игрок";
const avatar=player.avatar||"";
const safeName=safeJSString(name);

return`

<div
class="player-card"
onclick="openPlayerByName('${safeName}')"
>

<div class="player-avatar">

${
avatar
?`
<img
src="${escapeHTML(avatar)}"
alt="${escapeHTML(name)}"
>
`
:`
<span>
${escapeHTML(name.charAt(0).toUpperCase())}
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
?`
<div class="player-badge">
ЗАМЕНА
</div>
`
:""
}

</div>

`;
}


/* =========================
   TEAM PAGE
========================= */

function openTeam(){

document.getElementById("teams")?.classList.add("hidden");
document.getElementById("playerPage")?.classList.add("hidden");

hideOtherPages();

document.getElementById("teamPage")?.classList.remove("hidden");

renderTeamProfile();

location.hash="teamPage";

scrollTo({
top:0,
behavior:"smooth"
});
}


function renderTeamProfile(){

const box=document.getElementById("teamProfile");
if(!box)return;

const starters=getPlayersByNames(STARTERS);
const substitutes=getPlayersByNames(SUBSTITUTES);

box.innerHTML=`

<div class="team-profile">

<div class="team-profile-header">

<div class="team-profile-logo">

${
team.logo
?`
<img
src="${escapeHTML(team.logo)}"
alt="1Minute"
>
`
:`
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
${escapeHTML(team.description)}
</p>

<div class="team-meta">

<span>
TAG: ${escapeHTML(team.tag)}
</span>

<span class="tier-badge">
TIER 3
</span>

</div>

</div>

</div>


<div class="roster">

<div class="roster-title">

<div class="roster-title-left">

<span class="roster-dot blue"></span>

<h2>
ОСНОВНОЙ СОСТАВ (${starters.length})
</h2>

</div>

<span class="roster-label blue-label">
STARTING ROSTER
</span>

</div>


<div class="player-grid">

${starters.map(p=>playerCard(p,false)).join("")}

</div>


<div class="roster-title substitutes-title">

<div class="roster-title-left">

<span class="roster-dot purple"></span>

<h2>
ЗАМЕНА (${substitutes.length})
</h2>

</div>

<span class="roster-label purple-label">
SUBSTITUTES
</span>

</div>


<div class="player-grid">

${substitutes.map(p=>playerCard(p,true)).join("")}

</div>

</div>

</div>

`;
}


/* =========================
   PLAYER PAGE
========================= */

function openPlayerByName(name){

const player=findPlayer(name)||{
name,
role:"Игрок",
country:"",
avatar:"",
faceit:"",
steam:""
};

document.getElementById("teams")?.classList.add("hidden");
document.getElementById("teamPage")?.classList.add("hidden");

hideOtherPages();

document.getElementById("playerPage")?.classList.remove("hidden");

renderPlayerProfile(player);

location.hash="playerPage";

scrollTo({
top:0,
behavior:"smooth"
});
}


function renderPlayerProfile(player){

const box=document.getElementById("playerProfile");
if(!box)return;

const name=player.name||"Player";
const avatar=player.avatar||"";

box.innerHTML=`

<div class="player-profile">

<div class="player-profile-avatar">

${
avatar
?`
<img
src="${escapeHTML(avatar)}"
alt="${escapeHTML(name)}"
>
`
:`
<span>
${escapeHTML(name.charAt(0).toUpperCase())}
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
${escapeHTML(player.role||"Игрок")}
</div>

${
player.country
?`<p>${escapeHTML(player.country)}</p>`
:""
}

<div class="player-links">

${
player.faceit
?`
<a
class="secondary"
href="${escapeHTML(player.faceit)}"
target="_blank"
rel="noopener noreferrer"
>
FACEIT →
</a>
`
:""
}

${
player.steam
?`
<a
class="secondary"
href="${escapeHTML(player.steam)}"
target="_blank"
rel="noopener noreferrer"
>
Steam →
</a>
`
:""
}

</div>

<div
style="
margin-top:24px;
display:flex;
gap:10px;
flex-wrap:wrap;
"
>

<button
class="edit-btn"
onclick="openPlayerEditor('${safeJSString(name)}')"
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
}


function closeTeam(){

document.getElementById("teamPage")?.classList.add("hidden");
document.getElementById("playerPage")?.classList.add("hidden");

hideOtherPages();

document.getElementById("teams")?.classList.remove("hidden");

location.hash="teams";

scrollTo({
top:0,
behavior:"smooth"
});
}


function closePlayer(){

document.getElementById("playerPage")?.classList.add("hidden");

document.getElementById("teamPage")?.classList.remove("hidden");

renderTeamProfile();

location.hash="teamPage";

scrollTo({
top:0,
behavior:"smooth"
});
}


function hideOtherPages(){

document
.querySelectorAll(".page-section")
.forEach(el=>el.classList.add("hidden"));
}


/* =========================
   FILTER
========================= */

function filterTeams(type,button){

document
.querySelectorAll(".filters button")
.forEach(b=>b.classList.remove("selected"));

if(button)button.classList.add("selected");

renderTeams();
}


/* =========================
   RATING
========================= */

function renderRating(){

const rows=document.getElementById("ratingRows");
if(!rows)return;

rows.innerHTML=`

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


/* =========================
   MATCHES
========================= */

function renderMatches(){

const box=document.getElementById("matchesList");
if(!box)return;

box.innerHTML=`

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


/* =========================
   TOURNAMENTS
========================= */

function renderTournaments(){

const box=document.getElementById("tournamentsGrid");
if(!box)return;

box.innerHTML=`

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


/* =========================
   PLAYER EDITOR
========================= */

function openPlayerEditor(name){

const player=findPlayer(name);

if(!player){

alert(
"Игрок пока отсутствует в базе Supabase."
);

return;
}

document.getElementById("playerEditOldName").value=player.name||"";

document.getElementById("playerEditTeam").value=TEAM_NAME;

document.getElementById("playerEditName").value=player.name||"";

document.getElementById("playerEditCountry").value=player.country||"";

document.getElementById("playerEditRole").value=player.role||"Игрок";

document.getElementById("playerEditAvatar").value=player.avatar||"";

document.getElementById("playerEditFaceit").value=player.faceit||"";

document.getElementById("playerEditSteam").value=player.steam||"";

document
.getElementById("playerEditModal")
?.classList.remove("hidden");

document.body.style.overflow="hidden";
}


function closePlayerEditor(){

document
.getElementById("playerEditModal")
?.classList.add("hidden");

document.body.style.overflow="";
}


async function savePlayer(event){

event.preventDefault();

const oldName=document
.getElementById("playerEditOldName")
.value.trim();

const name=document
.getElementById("playerEditName")
.value.trim();

if(!name){

alert("Введите никнейм.");
return;
}

const data={
name,
country:document.getElementById("playerEditCountry").value.trim(),
role:document.getElementById("playerEditRole").value.trim(),
avatar:document.getElementById("playerEditAvatar").value.trim(),
faceit:document.getElementById("playerEditFaceit").value.trim(),
steam:document.getElementById("playerEditSteam").value.trim()
};

try{

await supabase(
"players?name=eq."+encodeURIComponent(oldName),
{
method:"PATCH",
headers:{
Prefer:"return=representation"
},
body:JSON.stringify(data)
}
);

await loadPlayers();

closePlayerEditor();

renderTeams();
renderTeamProfile();

const updated=findPlayer(name);

if(updated){
renderPlayerProfile(updated);
}

alert("Профиль игрока сохранён.");

}catch(e){

console.error(e);

alert(
"Не удалось сохранить профиль. Проверь Supabase RLS."
);
}
}


/* =========================
   TEAM EDITOR
========================= */

function openEditor(){

document.getElementById("editTitle").value=team.title;
document.getElementById("editTag").value=team.tag;
document.getElementById("editCountry").value=team.country;
document.getElementById("editLogo").value=team.logo;
document.getElementById("editFaceit").value=team.faceit;
document.getElementById("editSteam").value=team.steam;
document.getElementById("editDescription").value=team.description;

document
.getElementById("editModal")
?.classList.remove("hidden");

document.body.style.overflow="hidden";
}


function closeEditor(){

document
.getElementById("editModal")
?.classList.add("hidden");

document.body.style.overflow="";
}


function saveTeam(event){

event.preventDefault();

team.title=document.getElementById("editTitle").value.trim();
team.name=team.title||"1Minute";

team.tag=document.getElementById("editTag").value.trim();
team.country=document.getElementById("editCountry").value.trim();
team.logo=document.getElementById("editLogo").value.trim();
team.faceit=document.getElementById("editFaceit").value.trim();
team.steam=document.getElementById("editSteam").value.trim();
team.description=document.getElementById("editDescription").value.trim();

closeEditor();

renderTeams();
renderTeamProfile();

alert("Команда сохранена.");
}


/* =========================
   NAVIGATION
========================= */

function updateActiveNavigation(hash){

document
.querySelectorAll(".topbar nav a")
.forEach(link=>{

link.classList.toggle(
"active",
link.getAttribute("href")===hash
);

});
}


function showHashPage(){

const hash=location.hash;

document.getElementById("teams")?.classList.add("hidden");
document.getElementById("teamPage")?.classList.add("hidden");
document.getElementById("playerPage")?.classList.add("hidden");

hideOtherPages();


if(
hash==="#rating"||
hash==="#matches"||
hash==="#tournaments"
){

document.querySelector(hash)?.classList.remove("hidden");

updateActiveNavigation(hash);

return;
}


if(hash==="#teamPage"){

document.getElementById("teamPage")?.classList.remove("hidden");

renderTeamProfile();

updateActiveNavigation("#teams");

return;
}


if(hash==="#playerPage"){

document.getElementById("playerPage")?.classList.remove("hidden");

updateActiveNavigation("#teams");

return;
}


document.getElementById("teams")?.classList.remove("hidden");

renderTeams();

updateActiveNavigation("#teams");
}


/* =========================
   INIT
========================= */

async function init(){

console.log("1Minute запускается...");

await loadPlayers();

renderTeams();
renderRating();
renderMatches();
renderTournaments();
showHashPage();

console.log("1Minute готов.");
}


/* =========================
   EVENTS
========================= */

window.addEventListener(
"hashchange",
showHashPage
);


document.addEventListener(
"DOMContentLoaded",
()=>{

const playerForm=
document.getElementById("playerEditForm");

if(playerForm){
playerForm.addEventListener(
"submit",
savePlayer
);
}


const teamForm=
document.getElementById("editForm");

if(teamForm){
teamForm.addEventListener(
"submit",
saveTeam
);
}

init();

}
);
