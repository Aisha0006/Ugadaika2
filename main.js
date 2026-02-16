/* ================= ДАННЫЕ ================= */
const animals = [
    {name:"baran", img:"fotos/baran.jpg", sound:"sounds/baran.mp3"},
    {name:"jaguer", img:"fotos/jaguer.jpg", sound:"sounds/jaguer.mp3"},
    {name:"koshka", img:"fotos/koshka.webp", sound:"sounds/koshka.mp3"},
    {name:"loshad", img:"fotos/loshad.jpg", sound:"sounds/loshad.mp3"},
    {name:"myshka", img:"fotos/myshka.jpg", sound:"sounds/myshka.mp3"},
    {name:"obeziana", img:"fotos/obeziana.avif", sound:"sounds/obeziana.mp3"},
    {name:"osel", img:"fotos/osel.jpg", sound:"sounds/osel.mp3"},
    {name:"petuh", img:"fotos/petuh.jpg", sound:"sounds/petuha.mp3"},
    {name:"slon", img:"fotos/slon.avif", sound:"sounds/slon.mp3"},
    {name:"sobaka", img:"fotos/sobaka.jpg", sound:"sounds/sobaka.mp3"},
    {name:"sova", img:"fotos/sova.jpg", sound:"sounds/sova.mp3"},
    {name:"svinia", img:"fotos/svinia.jpg", sound:"sounds/svinia.mp3"},
    {name:"tigr", img:"fotos/tigr.jpg", sound:"sounds/tigr.mp3"},
    {name:"verblud", img:"fotos/verblud.webp", sound:"sounds/verblud.mp3"}
];

/* ================= ЭКРАНЫ ================= */
const menu = document.getElementById("menu");
const gameScreen = document.getElementById("game");

function showMenu(){
    menu.classList.add("active");
    gameScreen.classList.remove("active");
}

function showGame(){
    menu.classList.remove("active");
    gameScreen.classList.add("active");
}

/* ================= ИГРА ================= */
let score = 0;           // общий счет
let correctStreak = 0;   // серия подряд правильных ответов
let lives = 3;
let correctAnimal;
let currentAnimals;
let lastCorrectAnimal = null;
let currentAudio = null;
let level = 1;           // текущий уровень
let timeLeft = 60;       // оставшееся время
let timerInterval = null;
let animalsToFind = 3;   // сколько нужно найти на уровне
let foundCount = 0;      // сколько нашли сейчас

const grid = document.getElementById("grid");
const livesDiv = document.getElementById("lives");
const message = document.getElementById("message");
const scoreDiv = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const modalOk = document.getElementById("modalOk");
const modalMenu = document.getElementById("modalMenu");

function showModal(text, okAction){
    modalText.textContent = text;
    modal.classList.add("active");

    modalOk.onclick = () => {
        modal.classList.remove("active");
        if(okAction) okAction();
    };

    modalMenu.onclick = () => {
        modal.classList.remove("active");
        showMenu();
        stopSound();
        clearInterval(timerInterval);
    };
}

function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
}

function updateLives(){
    livesDiv.textContent = "Жизни: " + "❤️".repeat(lives);
}

function updateScore(){ scoreDiv.textContent = "Очки: " + score; }

function startTimer() {
    clearInterval(timerInterval);

    let totalSeconds = Math.max(60 - (level - 1) * 10, 15);

    function updateDisplay() {
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        document.getElementById("timer").textContent = `Время: ${minutes}:${seconds}`;
    }

    updateDisplay();

    timerInterval = setInterval(() => {
        totalSeconds--;

        updateDisplay();

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            showModal("Время вышло!", restart);
            restart();
        }
    }, 1000);
}

function playSound(){
    if(!correctAnimal) return;

    if(currentAudio){
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(correctAnimal.sound);
    currentAudio.play();
}

function stopSound(){
    if(currentAudio){
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

function newRound(){
    message.textContent = "";

    currentAnimals = shuffle([...animals]).slice(0,4);
    do {
        correctAnimal = currentAnimals[Math.floor(Math.random()*4)];
    } while(lastCorrectAnimal && correctAnimal.name === lastCorrectAnimal.name);
    lastCorrectAnimal = correctAnimal;


    grid.innerHTML = "";

    currentAnimals.forEach(a=>{
        const card = document.createElement("div");
        card.className="card";

        const img = document.createElement("img");
        img.src = a.img;

        card.appendChild(img);
        card.onclick = ()=>check(a);

        grid.appendChild(card);
    });
    setTimeout(playSound, 300);
}

function check(animal){
    if(animal.name === correctAnimal.name){
    stopSound();
    score++;
    correctStreak++;
    foundCount++;

    updateScore();

    if(correctStreak === 3){
        showModal(`🎉 Молодец! ${correctStreak} правильных подряд!`);
        correctStreak = 0;
    }

    if(foundCount >= animalsToFind){
        showModal(`Уровень ${level} пройден!`);
        level++;
        animalsToFind = 3 + level; // усложняем
        clearInterval(timerInterval);
        startLevel();
    } else {
        setTimeout(newRound, 700);
    }
} else {
    lives--;
    correctStreak = 0;
    updateLives();

    if(lives <= 0){
        clearInterval(timerInterval);
        gameOver();
    } else {
        message.textContent="❌ Попробуй ещё";
    }
}
}

function gameOver(){
    message.textContent="Игра окончена!";
    grid.innerHTML="";
    restartBtn.style.display="inline-block";
}

function startLevel() {
    foundCount = 0;
    updateScore();
    updateLives();
    newRound();
    startTimer();
}

function restart(){
    lives=3;
    score = 0;
    correctStreak = 0;
    level = 1;
    animalsToFind = 3;

    updateLives();
    updateScore();

    restartBtn.style.display="none";

    newRound();
    startTimer(); // ← добавить
    setTimeout(playSound, 300);
}

/* ================= КНОПКИ ================= */
document.getElementById("playBtn").onclick = ()=>{
    showGame();
    restart();
};
document.getElementById("backBtn").onclick = ()=>{
    grid.innerHTML="";
    restartBtn.style.display="inline-block";
    showMenu();
    stopSound();
    grid.innerHTML="";
    restartBtn.style.display="inline-block";
};
document.getElementById("soundBtn").onclick = playSound;
restartBtn.onclick = restart;
/* стартовые настройки */
updateLives();