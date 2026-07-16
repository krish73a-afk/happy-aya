// Typing effect
const text = "I know things feel heavy right now… but you’re not alone 💙";
let i = 0;

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typing").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 40);
    }
}
typeWriter();

// MAIN OPTIONS
function showOption(type) {
    let response = document.getElementById("response");
    document.getElementById("game").classList.add("hidden");

    if (type === 'comfort') {
        startComfortGame();
    }
    if (type === 'distraction') {
        startDistractGame(); // ✅ FIXED NAME
    }
    if (type === 'smile') {
        startSmileGame();
    }
    if (type === 'heal') {
    startHealHeartGame();
}
}

// ❤️ COMFORT GAME (floating hugs)
let comfortScore = 0;

function startComfortGame() {
    comfortScore = 0;

    document.getElementById("response").innerHTML = `
        <p>Catch 5 hugs… you deserve them 🫂💙</p>
        <div id="comfortArea" style="height:260px; position:relative; overflow:hidden;"></div>
        <p id="score">Hugs: 0 / 10</p>
    `;

    // spawn a few at start
    for (let i = 0; i < 3; i++) {
        spawnHug();
    }
}

function spawnHug() {
    let area = document.getElementById("comfortArea");

    let hug = document.createElement("img");

    // 🔁 multiple images (optional)
    let images = ["hug.png"];
    hug.src = images[Math.floor(Math.random() * images.length)];

    hug.style.width = "45px";
    hug.style.height = "45px";
    hug.style.position = "absolute";
    hug.style.left = Math.random() * (area.clientWidth - 50) + "px";
    hug.style.top = Math.random() * (area.clientHeight - 50) + "px";
    hug.style.cursor = "pointer";
    hug.style.transition = "transform 0.2s";
    hug.style.userSelect = "none";
    hug.style.objectFit = "contain";

    area.appendChild(hug);

    // 🎈 random movement
    let dx = (Math.random() * 2 - 1) * 2;
    let dy = (Math.random() * 2 - 1) * 2;

    let move = setInterval(() => {
        let x = hug.offsetLeft + dx;
        let y = hug.offsetTop + dy;

        // bounce inside box
        if (x <= 0 || x >= area.clientWidth - 50) dx *= -1;
        if (y <= 0 || y >= area.clientHeight - 50) dy *= -1;

        hug.style.left = x + "px";
        hug.style.top = y + "px";
    }, 30);

    // ✨ hover effect
    hug.onmouseover = () => {
        hug.style.transform = "scale(1.3)";
    };

    hug.onmouseout = () => {
        hug.style.transform = "scale(1)";
    };

    // 💙 click to collect
    hug.onclick = () => {
        clearInterval(move);

        hug.style.transform = "scale(1.5)";
        setTimeout(() => hug.remove(), 150);

        comfortScore++;
        document.getElementById("score").innerText = `Hugs: ${comfortScore} / 10`;

        if (comfortScore >= 10) {
            endComfortGame();
        } else {
            spawnHug(); // keep spawning
        }
    };
}

function endComfortGame() {
    document.getElementById("response").innerHTML = `
        <p>You collected all the hugs… 🥺💙</p>
        <p>I know they’re just little images on a screen…</p>
        <p>but I hope they made your heart feel a tiny bit lighter.</p>
        <p>You didn’t deserve what happened to you.</p>
        <p>And none of this takes away how kind, special, and lovable you are.</p>
        <p>One day, someone will choose you properly… without hurting you.</p>
        <p style="margin-top:10px;">Until then… I’ll be right here, sending you all the hugs I can 🫂</p>
        <p style="font-size:14px; opacity:0.7;">(Someone cares about you more than you think 💙)</p>
    `;
}

// 😤 DISTRACTION GAME (catch snacks)
let gameActive = false;
let snacks = [];
let score = 0;
let gameInterval;

const snackTypes = ["🍕","🍩","🍪","🍫","🍟","🧁"];

function startDistractGame() {
    document.getElementById("response").innerHTML = `
        <p>Catch 10 snacks… take a little break 🍪💙</p>
        
        <div id="gameBox" style="
            height:260px;
            position:relative;
            overflow:hidden;
        "></div>

        <p id="score">Score: 0 / 20</p>
    `;

    gameActive = true;
    snacks = [];
    score = 0;

    const box = document.getElementById("gameBox");

    // 🎯 create bucket
    let bucket = document.createElement("div");
    bucket.id = "bucket";
    bucket.style.position = "absolute";
    bucket.style.bottom = "10px";
    bucket.style.left = "50%";
    bucket.style.transform = "translateX(-50%)";
    bucket.style.width = "80px";
    bucket.style.height = "35px";
    bucket.style.background = "#ff8fa3";
    bucket.style.borderRadius = "20px";

    box.appendChild(bucket);

    // 🖱 move bucket INSIDE box
    box.onmousemove = (e) => {
        if (!gameActive) return;

        let rect = box.getBoundingClientRect();
        let x = e.clientX - rect.left;

        bucket.style.left = (x - 40) + "px";
    };

    gameInterval = setInterval(gameLoop, 50);
}

function gameLoop() {
    if (!gameActive) return;

    const box = document.getElementById("gameBox");
    const bucket = document.getElementById("bucket");

    // 🍿 spawn snacks INSIDE the box
    if (Math.random() < 0.08) {
        let snack = document.createElement("div");

        snack.innerText = snackTypes[Math.floor(Math.random() * snackTypes.length)];
        snack.style.position = "absolute";
        snack.style.left = Math.random() * (box.clientWidth - 30) + "px";
        snack.style.top = "0px";
        snack.style.fontSize = "22px";

        box.appendChild(snack);
        snacks.push(snack);
    }

    snacks.forEach((snack, index) => {
        let top = parseInt(snack.style.top);
        snack.style.top = (top + 3.5) + "px";

        let snackRect = snack.getBoundingClientRect();
        let bucketRect = bucket.getBoundingClientRect();

        // 🎯 collision
        if (
            snackRect.bottom > bucketRect.top &&
            snackRect.left < bucketRect.right &&
            snackRect.right > bucketRect.left
        ) {
            snack.remove();
            snacks.splice(index, 1);
            score++;

            document.getElementById("score").innerText = `Score: ${score} / 20`;
        }

        // ❌ remove if missed (inside box only)
        if (top > box.clientHeight) {
            snack.remove();
            snacks.splice(index, 1);
        }
    });

    if (score >= 20) {
        endGame();
    }
}


function endGame() {
    gameActive = false;
    clearInterval(gameInterval);

    document.getElementById("response").innerHTML = `
        <div class="end-screen">
            <h2>You did it 🎉</h2>
            <p>You caught all those snacks like a pro.</p>
            <p>Your brain just got a tiny break — and that matters.</p>
            <p>Take a breath. You're doing better than you think.</p>
            <p style="margin-top:10px;">Want another round? Or try something else 💙</p>
        </div>
    `;
}

// 😊 SMILE GAME (compliments)
function startSmileGame() {
    document.getElementById("response").innerHTML = `
        <p>Pick a compliment 💙</p>
        <button onclick="compliment(1)">Click me 😌</button>
        <button onclick="compliment(2)">Or me 👀</button>
        <button onclick="compliment(3)">No me 😤</button>
    `;
}

function compliment(num) {
    let msg = "";

    const normal = [
        "hey… you don’t have to carry everything at once 💙",
        "this feeling will pass, even if it’s heavy right now",
        "you’re allowed to rest, not everything needs fixing today",
        "you’ve made it through every hard day so far",
        "you don’t need to be strong all the time"
    ];

    const funny = [
        "your ex really fumbled like it was a speedrun 💀",
        "imagine losing YOU… wild behavior",
        "they chose confusion over you 😭 bold move",
        "if bad decisions were a job, they’d be promoted",
        "honestly… you upgraded by them leaving 😌"
    ];

    const flirty = [
        "not to flirt but… you’re kinda dangerously likable 👀",
        "you’re the type people regret losing later",
        "if charm was a stat, yours is maxed out",
        "lowkey… you’re unfairly attractive AND strong",
        "someone out there would treat you way better 😌"
    ];

    if (num === 1) {
        msg = normal[Math.floor(Math.random() * normal.length)];
    }

    if (num === 2) {
        msg = funny[Math.floor(Math.random() * funny.length)];
    }

    if (num === 3) {
        msg = flirty[Math.floor(Math.random() * flirty.length)];
    }

    document.getElementById("response").innerHTML = `
        <p>${msg}</p>
        <p>(yeah… that’s true 😌)</p>
        <br>
        <button onclick="startSmileGame()">Try again 🔄</button>
    `;
}

// ❤️ HEAL HEART QUIZ (same as before)


// ❤️ HEAL MY HEART GAME

let heartHealth = 0;
let heartGameActive = false;

const badEmotions = [
    "😡 Anger",
    "😢 Sadness",
    "😨 Fear",
    "💔 Pain",
    "😤 Stress",
    "😞 Regret"
];

const goodEmotions = [
    "❤️ Love",
    "😊 Happiness",
    "🌟 Hope",
    "🤗 Kindness",
    "✨ Peace",
    "🌈 Joy"
];


function startHealHeartGame() {

    heartHealth = 0;
    heartGameActive = true;


    document.getElementById("response").innerHTML = `
        <div class="heal-game">

            <h2>❤️ Heal My Heart</h2>

            <p>
            Remove the bad emotions and collect the good ones.
            </p>

            <div id="heart">
                💔
            </div>

            <p>
            Heart Healing:
            <span id="heartScore">0</span>/10
            </p>

            <div id="emotionArea"></div>

        </div>
    `;


    spawnEmotion();

}



function spawnEmotion(){

    if(!heartGameActive) return;


    let emotion = document.createElement("div");


    let good = Math.random() > 0.5;


    if(good){

        emotion.innerText =
        goodEmotions[Math.floor(Math.random()*goodEmotions.length)];

        emotion.className="goodEmotion";

    }
    else{

        emotion.innerText =
        badEmotions[Math.floor(Math.random()*badEmotions.length)];

        emotion.className="badEmotion";

    }


    let area=document.getElementById("emotionArea");


    emotion.style.left =
    Math.random() * 80 + "%";


    emotion.style.top =
    Math.random() * 80 + "%";


    area.appendChild(emotion);



    emotion.onclick=function(){


        if(emotion.className==="badEmotion"){

            // remove bad emotions
            emotion.style.transform="scale(0)";
            
            setTimeout(()=>{
                emotion.remove();
            },200);

        }


        else{


            // collect good emotions

            heartHealth++;


            document.getElementById("heartScore")
            .innerText=heartHealth;


            emotion.remove();



            if(heartHealth>=10){

                finishHealing();

                return;

            }

        }


    };



    setTimeout(()=>{

        if(emotion.parentElement)
        emotion.remove();

    },3000);



    setTimeout(spawnEmotion,800);

}




function finishHealing(){

    heartGameActive=false;


    document.getElementById("response").innerHTML=`

        <div class="heal-result">

            <h2>❤️ Your heart is healed</h2>

            <div style="font-size:80px">
            ❤️
            </div>

            <p>
            You pushed away the bad emotions
            and filled your heart with better ones.
            </p>

            <p>
            Healing takes time... but every small step matters 💙
            </p>

        </div>

    `;

}
function revealMessage() {
    document.getElementById("hiddenMsg").style.display = "block";
}
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");


function toggleMusic(){

    if(music.paused){

        music.play();

        musicBtn.innerHTML="🔊 Pause Music";

    }
    else{

        music.pause();

        musicBtn.innerHTML="🎵 Play Music";

    }

}