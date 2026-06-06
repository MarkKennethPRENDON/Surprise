/**
 * ==========================================
 * CUSTOMIZATION PANEL (CONFIGURATION OBJECT)
 * ==========================================
 */
const CONFIG = {
    celebrantName: "Alona",
    birthdayDate: "November 13, 2026",
    photoURL: "pics/alone.jpg",
    musicURL: "bg/Happy Birthday Instrumental – Emotional Cinematic Piano Version.mp3",
    
    password: "HAPPY",
    welcomeMessage: "This gift was made especially for you. Enter the secret password to continue.",
    hintText: "It's a 5 letter word for joy! (Type: HAPPY)",

    mainGreeting: "May your special day be filled with happiness, beautiful memories, and endless smiles.",
    finalWishMessage: "Every star in the sky shines tonight to celebrate you. Happy Birthday, Alona ❤️",

    cards: [
        { icon: "fa-gift", title: "Birthday Wishes", text: "Wishing you a year filled with love, laughter, and all the success in the world. May all your dreams come true!" },
        { icon: "fa-camera-retro", title: "Favorite Memories", text: "From our late-night talks to our spontaneous adventures, every moment spent with you is a treasure." },
        { icon: "fa-heart", title: "Why You're Special", text: "Your kindness, your brilliant smile, and your beautiful soul make the world a brighter place." },
        { icon: "fa-plane", title: "Future Wishes", text: "I can't wait to see where life takes you next. Here is to countless more adventures together!" }
    ]
};

const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;
bgMusic.src = CONFIG.musicURL;
bgMusic.autoplay = true;
// quieter by default and SFX control
bgMusic.volume = 0.35;
let sfxEnabled = true;
let selectedSfx = 'gentle-pluck';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playTone(freq, type, duration, vol, opts = {}) {
    if(!sfxEnabled) return;
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // options: attack, release, filterFreq, detune
    const attack = opts.attack ?? Math.max(0.005, Math.min(0.06, duration * 0.15));
    const release = opts.release ?? Math.max(0.05, duration * 0.6);
    const sustainLevel = (opts.sustain ?? 0.6) * vol;
    const filterFreq = opts.filterFreq ?? 6000;
    const detune = opts.detune ?? 0;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if(detune) osc.detune.setValueAtTime(detune, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    // ADSR-like envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + attack);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, sustainLevel), now + attack + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration + release);
}

function playChime() {
    if(!sfxEnabled) return;
    playTone(520, 'triangle', 0.36, 0.12, { attack: 0.02, release: 0.28, filterFreq: 5000 });
    setTimeout(() => playTone(980, 'sine', 0.5, 0.06, { attack: 0.02, release: 0.4, filterFreq: 8000 }), 80);
}

function playError() {
    if(!sfxEnabled) return;
    playTone(220, 'sawtooth', 0.18, 0.06, { attack: 0.01, release: 0.15, filterFreq: 1200 });
    setTimeout(() => playTone(180, 'sine', 0.12, 0.03, { attack: 0.01, release: 0.12, filterFreq: 1200 }), 50);
}

function playSfxPreset(preset) {
    if(!sfxEnabled) return;
    if(audioCtx.state === 'suspended') audioCtx.resume();
    switch(preset) {
        case 'soft-bell':
            playTone(600, 'sine', 0.28, 0.05, { attack: 0.01, release: 0.24, filterFreq: 7000 });
            setTimeout(() => playTone(840, 'sine', 0.36, 0.03, { attack: 0.02, release: 0.28, filterFreq: 9000 }), 40);
            break;
        case 'warm-pop':
            playTone(200, 'sine', 0.08, 0.07, { attack: 0.005, release: 0.12, filterFreq: 1800 });
            setTimeout(() => playTone(320, 'triangle', 0.12, 0.03, { attack: 0.006, release: 0.14, filterFreq: 2500 }), 25);
            break;
        case 'gentle-pluck':
            playTone(520, 'square', 0.12, 0.045, { attack: 0.006, release: 0.18, filterFreq: 4500 });
            setTimeout(() => playTone(1040, 'sine', 0.22, 0.02, { attack: 0.01, release: 0.22, filterFreq: 7000 }), 60);
            break;
        case 'calm-tap':
        default:
            playTone(280, 'triangle', 0.06, 0.06, { attack: 0.005, release: 0.12, filterFreq: 3500 });
            setTimeout(() => playTone(900, 'sine', 0.18, 0.035, { attack: 0.015, release: 0.18, filterFreq: 7000 }), 30);
            break;
    }
}

function playSelectedSfx() {
    const sel = document.getElementById('sfx-select');
    const preset = (sel && sel.value) ? sel.value : selectedSfx;
    playSfxPreset(preset);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('hero-name').innerText = `Happy Birthday, ${CONFIG.celebrantName} ❤️`;
    document.getElementById('hero-date').innerText = CONFIG.birthdayDate;
    document.getElementById('hero-msg').innerText = CONFIG.mainGreeting;
    document.getElementById('hero-photo').src = CONFIG.photoURL;
    document.getElementById('welcome-msg').innerText = CONFIG.welcomeMessage;
    document.getElementById('wish-msg').innerText = CONFIG.finalWishMessage;

    const cardsContainer = document.getElementById('cards-container');
    CONFIG.cards.forEach((card) => {
        const cardHTML = `
            <div class="flip-card" onclick="flipCard(this)">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <i class="fas ${card.icon} card-icon"></i>
                        <h2>${card.title}</h2>
                    </div>
                    <div class="flip-card-back">
                        <p>"${card.text}"</p>
                    </div>
                </div>
            </div>
        `;
        cardsContainer.innerHTML += cardHTML;
    });

    // ensure the SFX selector reflects the default preset
    const sfxSel = document.getElementById('sfx-select');
    if(sfxSel) sfxSel.value = selectedSfx;
});

const pwdInput = document.getElementById('password-input');
const togglePwd = document.getElementById('toggle-pwd');

togglePwd.addEventListener('click', () => {
    if (pwdInput.type === "password") {
        pwdInput.type = "text";
        togglePwd.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        pwdInput.type = "password";
        togglePwd.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

function checkPassword() {
    const inputContainer = document.querySelector('.password-container');
    if (pwdInput.value.toUpperCase() === CONFIG.password.toUpperCase()) {
        playChime();
        document.getElementById('password-screen').classList.add('hidden');
        setTimeout(() => {
            document.getElementById('envelope-screen').classList.remove('hidden');
        }, 1000);
    } else {
        playError();
        inputContainer.classList.add('shake');
        pwdInput.value = "";
        pwdInput.placeholder = "Oops! Try again 💫";
        setTimeout(() => inputContainer.classList.remove('shake'), 500);
    }
}

function showHint() {
    const modal = document.getElementById('hint-modal');
    modal.innerText = CONFIG.hintText;
    modal.classList.remove('hidden');
    modal.style.top = "20px";
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.style.top = "-50px";
    }, 3000);
}

function openEnvelope() {
    const envWrapper = document.getElementById('envelope-btn');
    envWrapper.classList.add('open');
    playChime();

    bgMusic.play().then(() => {
        isMusicPlaying = true;
        document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(e => {
        console.log("Autoplay blocked, user can start music manually", e);
    });

    setTimeout(() => {
        document.getElementById('envelope-screen').classList.add('hidden');
        document.getElementById('main-content').style.display = 'flex';
        document.getElementById('music-controls').classList.remove('hidden');
        speedUpStars();
        window.scrollTo(0,0);
    }, 1500);
}

function flipCard(card) {
    playSelectedSfx();
    card.classList.toggle('flipped');
}

function makeWish() {
    playChime();
    const msg = document.getElementById('wish-msg');
    msg.classList.add('show');
    createFirework();
}

function toggleMusic() {
    const btn = document.getElementById('play-pause-btn');
    if (isMusicPlaying) {
        bgMusic.pause();
        btn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        bgMusic.play();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isMusicPlaying = !isMusicPlaying;
}

function toggleMute() {
    const btn = document.getElementById('mute-btn');
    bgMusic.muted = !bgMusic.muted;
    btn.innerHTML = bgMusic.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
}

function toggleSfx() {
    sfxEnabled = !sfxEnabled;
    const btn = document.getElementById('sfx-btn');
    btn.innerHTML = sfxEnabled ? '<i class="fas fa-bell"></i>' : '<i class="fas fa-bell-slash"></i>';
}

function copyLink() {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy);
    alert("Link copied to clipboard!");
}

const canvas = document.getElementById('night-sky');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [];
let shootingStars = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2;
        this.alpha = Math.random();
        this.alphaChange = (Math.random() * 0.02) - 0.01;
    }
    update() {
        this.alpha += this.alphaChange;
        if(this.alpha <= 0) { this.alpha = 0; this.alphaChange *= -1; } 
        else if(this.alpha >= 1) { this.alpha = 1; this.alphaChange *= -1; }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }
}

class ShootingStar {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = 0;
        this.len = Math.random() * 80 + 20;
        this.speed = Math.random() * 10 + 5;
        this.size = Math.random() * 2 + 0.5;
        this.waitTime = Math.random() * 200;
        this.active = false;
    }
    update() {
        if(!this.active) {
            this.waitTime--;
            if(this.waitTime <= 0) this.active = true;
            return;
        }
        this.x -= this.speed;
        this.y += this.speed;
        if(this.x < 0 || this.y > height) this.reset();
    }
    draw() {
        if(!this.active) return;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.len, this.y - this.len);
        ctx.lineWidth = this.size;
        const grad = ctx.createLinearGradient(this.x, this.y, this.x + this.len, this.y - this.len);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.stroke();
    }
}

for(let i=0; i<200; i++) stars.push(new Star());
for(let i=0; i<3; i++) shootingStars.push(new ShootingStar());

function speedUpStars() {
    let count = 0;
    const interval = setInterval(() => {
        stars.forEach(s => s.alphaChange = (Math.random() * 0.1) - 0.05);
        count++;
        if(count > 50) clearInterval(interval);
    }, 50);
}

function createFirework() {
    ctx.fillStyle = 'rgba(244, 208, 63, 0.2)';
    ctx.fillRect(0,0,width,height);
    for(let i=0; i<50; i++) {
        let s = new Star();
        s.x = width/2;
        s.y = height/2 + 200;
        stars.push(s);
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => { star.update(); star.draw(); });
    shootingStars.forEach(ss => { ss.update(); ss.draw(); });
    requestAnimationFrame(animate);
}

animate();