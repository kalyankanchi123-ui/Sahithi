let floatingInterval;
let floatingActive = true;
let countdownFinished = false;
let finalePlayed = false;
let tapStarted = false; // top-level guard for splash tap
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

window.onload = function () {
    window.scrollTo(0, 0);
};

// FIX: Consolidated initialization and better error handling
document.addEventListener("DOMContentLoaded", function () {

const bgMusic = document.getElementById("bgMusic");
const cheerSound = document.getElementById("cheerSound");
const surpriseVideo = document.getElementById("surpriseVideo");
const birthdayVideo = document.getElementById("birthdayVideo");

if(bgMusic) bgMusic.pause();
if(cheerSound) cheerSound.pause();
if(surpriseVideo) surpriseVideo.pause();
if(birthdayVideo) birthdayVideo.pause();

// Stop birthday wish on refresh
speechSynthesis.cancel();

    const sectionsToPause = [
document.getElementById("gallery"),
document.querySelector(".slideshow-section")
];

const sectionObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

stopFloatingMemories();

}else{

startFloatingMemories();

}

});

},{threshold:0.35});

sectionsToPause.forEach(section=>{
if(section) sectionObserver.observe(section);
});

// Tap to reveal gallery captions on touch devices
document.querySelectorAll('.photo-container').forEach(function(container) {
    container.addEventListener('click', function() {
        var isActive = container.classList.contains('tapped');
        // Close all others
        document.querySelectorAll('.photo-container.tapped').forEach(function(c) {
            c.classList.remove('tapped');
        });
        if (!isActive) {
            container.classList.add('tapped');
        }
    });
});



const canvas = document.getElementById("fireworks");

if(canvas){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
    
    createParticles();
    initializeAnimations();
    setupScrollAnimations();

    // Start slideshow after everything loads
    setTimeout(() => {
        startSlideshow();
    }, 500);

    setupMousemoveEffect();
});

// Create floating particles
function createParticles() {
    const particles = document.getElementById('particles');
    const particleEmojis = ['🧿', '💕', '✨', '💫', '😎', '🤞', '✨', '💫', '🦋'];

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];

        particle.style.left = Math.random()*100 + "vw";
        particle.style.bottom = "-50px";
        particle.style.animationDuration = (Math.random() * 4 + 8) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';

        document.body.appendChild(particle);
    }
}

function initializeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = (index * 0.2) + 's';
    });
}

// Scroll animations (AOS - Animate On Scroll)
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');

                if (entry.target.classList.contains('message-card')) {
                    animateMessageText();
                }
            }
        });
    }, observerOptions);

    const elementsToObserve = document.querySelectorAll('[data-aos], .section-title, .message-card');
    elementsToObserve.forEach(element => {
        observer.observe(element);

        const delay = element.getAttribute('data-delay');
        if (delay) {
            element.style.transitionDelay = delay + 'ms';
        }
    });
}

function animateMessageText() {
    const messageTexts = document.querySelectorAll('.message-text');
    messageTexts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('fade-in-animate');
        }, index * 500);
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function toggleLike(button) {
    const heartIcon = button.querySelector('.heart-icon');
    button.classList.toggle('liked');

    if (button.classList.contains('liked')) {
        heartIcon.textContent = '❤️';
        createFloatingHeart(button);
    } else {
        heartIcon.textContent = '🤍';
    }
}

function createFloatingHeart(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.fontSize = '1.5rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';

    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + 'px';
    heart.style.top = rect.top + 'px';

    document.body.appendChild(heart);

    heart.animate([
        { transform: 'translateY(0px) scale(1)', opacity: 1 },
        { transform: 'translateY(-60px) scale(1.5)', opacity: 0 }
    ], {
        duration: 1500,
        easing: 'ease-out'
    }).onfinish = () => {
        document.body.removeChild(heart);
    };
}

// FIX: Parallax with reduced animations on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const particles = document.querySelectorAll('.particle');

    particles.forEach((particle, index) => {
        const speed = 0.1 + (index % 3) * 0.05;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, { passive: true });

// FIX: Throttled mousemove for performance
let lastMouseTime = 0;
function setupMousemoveEffect() {
    document.addEventListener('mousemove', throttleMouseMove, { passive: true });
}

function throttleMouseMove(e) {
    const now = Date.now();
    if (now - lastMouseTime < 16) return; // 60fps throttle
    lastMouseTime = now;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    const moveX = (x - 0.5) * 20;
    const moveY = (y - 0.5) * 20;

    const floatingHearts = document.querySelector('.floating-hearts');
    if (floatingHearts) {
        floatingHearts.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
}

// Add click ripple effect to buttons
document.addEventListener("DOMContentLoaded", function(){

document.querySelectorAll('button').forEach(button => {

    button.addEventListener('click', function (e) {

        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position:absolute;
            width:${size}px;
            height:${size}px;
            left:${x}px;
            top:${y}px;
            background:rgba(255,255,255,0.5);
            border-radius:50%;
            transform:scale(0);
            animation:ripple 0.6s ease-out;
        `;

        this.appendChild(ripple);

        setTimeout(()=>ripple.remove(),600);

    });

});

});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Photo entrance animation
const photoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            if (img) {
                img.style.animation = 'photoEnter 0.8s ease-out forwards';
            }
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.photo-card').forEach(card => {
    photoObserver.observe(card);
});

const photoStyle = document.createElement('style');
photoStyle.textContent = `
    @keyframes photoEnter {
        from {
            transform: scale(0.8) rotate(-5deg);
            opacity: 0;
        }
        to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(photoStyle);

// FIX: Better autoplay handling for audio
document.addEventListener("click", function () {

if(!countdownFinished) return;

const music = document.getElementById("bgMusic");

if(music && music.paused){
music.play().catch(()=>{});
}

},{once:true});

function openVideo(){

const popup = document.getElementById("videoPopup");
const video = document.getElementById("birthdayVideo");
const bgMusic = document.getElementById("bgMusic");

popup.classList.add("active");

if(bgMusic && !bgMusic.paused){
bgMusic.pause();
}

if(video){
video.currentTime = 0;
video.play().catch(()=>{});
}

}

function closeVideo() {
    const popup = document.getElementById("videoPopup");
    const video = document.getElementById("birthdayVideo");
    const bgMusic = document.getElementById("bgMusic");

    popup.classList.remove("active");

    if(video){
        video.pause();
        video.currentTime = 0;
    }

    if(bgMusic){
        bgMusic.play().catch(()=>{});
    }
}

// Handle video end event
document.addEventListener("DOMContentLoaded", function () {
   const popup = document.getElementById("videoPopup");
if(popup){
    popup.classList.remove("active");
}
    const video = document.getElementById("birthdayVideo");
const bgMusic = document.getElementById("bgMusic");

if(video){
    video.pause();
    video.currentTime = 0;
}

if(bgMusic){
    bgMusic.pause();
    bgMusic.currentTime = 0;
}
});

let slideIndex = 0;
let slideshowInterval = null;

function startSlideshow(){

const slides = document.querySelectorAll(".slide");

if(slides.length === 0) return;

function showSlides(){

slides.forEach(slide=>{
slide.style.display = "none";
});

slideIndex++;

if(slideIndex > slides.length){
slideIndex = 1;
}

slides[slideIndex-1].style.display = "block";

}

showSlides(); // show first slide immediately

slideshowInterval = setInterval(showSlides,3000);

}

// Cleanup slideshow on page unload
window.addEventListener('beforeunload', () => {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
});

function ultimateCakeCut(playSound = true) {
    const knife = document.getElementById("knife3d");
    const cakeStage = document.getElementById("cakeStage");
    const cheer = document.getElementById("cheerSound");
    const overlay = document.getElementById("cakeCutOverlay");

    if (!knife) return;

    // Swing knife into cake
    knife.style.transition = "all 0.5s cubic-bezier(0.68,-0.55,0.27,1.55)";
    knife.style.transform = "rotate(20deg) translateY(60px) translateX(-20px) scale(1.2)";

    setTimeout(() => {
        // Split cake tiers
        if(cakeStage) cakeStage.classList.add("cut");

        // Show cut emoji
        if(overlay) {
            overlay.style.display = "block";
            overlay.innerHTML = "🎂✨";
        }

        // Blow out candles
        document.querySelectorAll(".flame").forEach(f => {
            f.style.animation = "none";
            f.style.opacity = "0";
            f.style.transform = "translateX(-50%) scaleY(0)";
        });

        // Celebration
        createCakeCuttingParticles();
        explodeConfetti();
        launchBalloons();
        startFireworks();

        if (playSound && cheer && countdownFinished) {
            cheer.currentTime = 0;
            cheer.play().catch(() => {});
        }

        // Swing knife back after
        setTimeout(() => {
            knife.style.transform = "rotate(-30deg)";
        }, 1500);

        // Reset cake after 5 seconds
        setTimeout(() => {
            if(cakeStage) cakeStage.classList.remove("cut");
            if(overlay) overlay.style.display = "none";
            document.querySelectorAll(".flame").forEach(f => {
                f.style.animation = "";
                f.style.opacity = "";
                f.style.transform = "";
            });
        }, 5000);

    }, 500);
}

function createCakeCuttingParticles() {
    const cakeStage = document.querySelector(".cake-stage");
    if (!cakeStage) return;
    
    const rect = cakeStage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create cake crumb particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.style.position = "fixed";
        particle.style.left = centerX + "px";
        particle.style.top = centerY + "px";
        particle.style.fontSize = (8 + Math.random() * 10) + "px";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "9994";
        
        const emojis = ["🍰", "✨", "🎉", "🌟"];
        particle.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 3;
        
        document.body.appendChild(particle);
        
        let x = centerX;
        let y = centerY;
        let velocityY = vy;
        
        const animate = () => {
            x += vx;
            y += velocityY;
            velocityY += 0.2; // gravity
            
            particle.style.left = x + "px";
            particle.style.top = y + "px";
            particle.style.opacity = Math.max(0, 1 - (Date.now() - startTime) / 1500);
            
            if ((Date.now() - startTime) < 1500) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        const startTime = Date.now();
        animate();
    }
}

function explodeConfetti() {
    for (let i = 0; i < 40; i++) {
        let confetti = document.createElement("div");
        confetti.className = "confetti-piece";

        confetti.style.left = window.innerWidth / 2 + (Math.random()*200-100) + "px";
        confetti.style.top = "-20px"; // start above screen
        confetti.style.backgroundColor = `hsl(${Math.random() * 360},100%,50%)`;
        confetti.style.animationDuration = (Math.random() * 2 + 4) + "s";

        document.body.appendChild(confetti);

        setTimeout(() => {
            if (confetti && confetti.parentNode) {
                confetti.remove();
            }
        }, 6000);
    }
}

function launchBalloons() {

    const emojis = ["🎈", "💐", "🎁", "🎉", "🎊"];

    for (let i = 0; i < 15; i++) {

        let balloon = document.createElement("div");
        balloon.className = "balloon";

        balloon.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

        balloon.style.left = Math.random() * 100 + "vw";
        balloon.style.bottom = "-100px";
        balloon.style.animationDuration = (Math.random() * 4 + 8) + "s";

        document.body.appendChild(balloon);

        setTimeout(() => {
            if (balloon && balloon.parentNode) {
                balloon.remove();
            }
        }, 12000);
    }
}

function startFireworks() {

    for (let i = 0; i < 12; i++) {

        setTimeout(() => {

            launchCornerFirework("left");
            launchCornerFirework("right");

        }, i * 600);

    }

}

function launchCornerFirework(side) {

    let rocket = document.createElement("div");
    rocket.className = "firework-launch";

    // start from bottom corners
    if (side === "left") {
        rocket.style.left = "5vw";
    } else {
        rocket.style.left = "90vw";
    }

    rocket.style.bottom = "0px";

    document.body.appendChild(rocket);

    setTimeout(() => {

        rocket.remove();

        let explodeX =
            side === "left"
                ? window.innerWidth * 0.35
                : window.innerWidth * 0.65;

        let explodeY = window.innerHeight * 0.3;

        explodeFirework(explodeX, explodeY);

    }, 700);
}

function launchCinematicFirework() {
    let x = Math.random() * window.innerWidth;

    let rocket = document.createElement("div");
    rocket.className = "firework-launch";

    rocket.style.left = x + "px";
    rocket.style.bottom = "0px";   // start from bottom

    document.body.appendChild(rocket);

    setTimeout(() => {
        if (rocket && rocket.parentNode) {
            rocket.remove();
        }
        explodeFirework(x, window.innerHeight * 0.3 + Math.random() * 150);
    }, 700);
}

function explodeFirework(cx, cy){

for(let i=0;i<80;i++){

let star=document.createElement("div");
star.className="firework-star";

star.style.left=cx+"px";
star.style.top=cy+"px";

let angle=Math.random()*Math.PI*2;

/* layered explosion */

let distance;

if(i < 25){
distance=Math.random()*120+50;
}
else if(i < 50){
distance=Math.random()*180+100;
}
else{
distance=Math.random()*240+140;
}

let dx=Math.cos(angle)*distance+"px";
let dy=Math.sin(angle)*distance+"px";

star.style.setProperty("--x",dx);
star.style.setProperty("--y",dy);

/* color palette */

const colors=[
"#ff4e73",
"#ffd166",
"#06d6a0",
"#4cc9f0",
"#ffffff"
];

star.style.backgroundColor=colors[Math.floor(Math.random()*colors.length)];

document.body.appendChild(star);

setTimeout(()=>star.remove(),1600);

}
}

function startFinalCelebration() {
    document.body.classList.add("night-mode");

    let fireInterval = setInterval(() => {
        startFireworks();
    }, 1000);

    setTimeout(() => {
        clearInterval(fireInterval);
    }, 10000);
}

function celebrateBirthday() {
    // FIX: Check if confetti library is loaded
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 }
        });
    }

    startFireworks();
}

function celebrateWithBalloons() {
    // FIX: Check if confetti library is loaded
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 }
        });
    }

    launchBalloons();
    startFireworks();
}

function showBirthdayMessage() {

    let msg = document.createElement("div");

    msg.innerHTML = "🎇 Here's to Your Most Magical Year Yet! 🎇";

    msg.style.position = "fixed";
    msg.style.top = "50%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%) scale(0.8)";
    msg.style.fontSize = window.innerWidth < 768 ? "18px" : "50px";
    msg.style.color = "white";
    msg.style.textShadow = "0 0 20px pink, 0 0 40px red";
    msg.style.whiteSpace = "nowrap";
    msg.style.zIndex = "9999";
    msg.style.opacity = "0";
    msg.style.transition = "all 0.8s ease";
    msg.style.padding = window.innerWidth < 768 ? "10px 12px" : "10px 20px";
    msg.style.maxWidth = window.innerWidth < 768 ? "92vw" : "95vw";
    msg.style.textAlign = "center";
    msg.style.lineHeight = "1.2";
    msg.style.borderRadius = "15px";
    msg.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    msg.style.overflow = "hidden";
    msg.style.textOverflow = "ellipsis";

    document.body.appendChild(msg);

    setTimeout(()=>{
        msg.style.opacity = "1";
        msg.style.transform = "translate(-50%, -50%) scale(1)";
    },100);

    setTimeout(()=>{
        msg.style.opacity = "0";
    },4500);

    setTimeout(()=>{
        msg.remove();
    },5500);
}

// FIX: Better speech synthesis with error handling
function playBirthdayWish() {
    try {
        const message = "Happy Birthday Sahithi! Wishing you an amazing year ahead. May your life be filled with happiness and success.";

        const speech = new SpeechSynthesisUtterance(message);

        // FIX: Wait for voices to load
        const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            if (voices.length === 0) {
                setTimeout(loadVoices, 100);
                return;
            }

            speech.voice = voices.find(v => v.name.includes("Google")) || voices[0];
            speech.rate = 0.9;
            speech.pitch = 1.1;

            speechSynthesis.speak(speech);
        };

        loadVoices();
    } catch (error) {
        console.error('Speech synthesis error:', error);
    }
}

function startBirthdayFinale(){
    const btn = document.querySelector(".finale-btn");
    if(btn) { btn.disabled = true; btn.innerText = "🎆 It's happening! 🎆"; }

    const colors = ["#ff4e73","#ffd166","#ff7eb3","#ffffff","#c77dff","#4cc9f0"];

    confetti({ particleCount:120, spread:100, origin:{ y:0.6 }, colors });
    setTimeout(() => confetti({ particleCount:80,  spread:120, origin:{ x:0.2, y:0.5 }, colors }), 400);
    setTimeout(() => confetti({ particleCount:80,  spread:120, origin:{ x:0.8, y:0.5 }, colors }), 700);
    setTimeout(() => confetti({ particleCount:100, spread:80,  origin:{ y:0.4 },         colors }), 1100);
    setTimeout(() => confetti({ particleCount:60,  spread:150, origin:{ x:0.1, y:0.6 }, colors }), 1500);
    setTimeout(() => confetti({ particleCount:60,  spread:150, origin:{ x:0.9, y:0.6 }, colors }), 1800);
    setTimeout(() => confetti({ particleCount:150, spread:120, origin:{ y:0.5 },         colors }), 2400);

    startFireworks();
    setTimeout(() => launchBalloons(), 500);
    setTimeout(() => launchBalloons(), 1500);
    setTimeout(() => { ultimateCakeCut(false); showBirthdayMessage(); }, 800);

    setTimeout(() => {
        if(btn) { btn.disabled = false; btn.innerText = "Chudalani vundha"; }
    }, 5000);
}

document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
        closeVideo();
    }
});

window.addEventListener("scroll",()=>{
    let scrollTop=document.documentElement.scrollTop;
    let height=document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let progress=(scrollTop/height)*100;
    const bar = document.getElementById("progressBar");
    if (bar) bar.style.width=progress+"%";
});

const popup = document.getElementById("videoPopup");

if(popup){
popup.addEventListener("click", function(e){
    if(e.target.id === "videoPopup"){
        closeVideo();
    }
});
}

document.addEventListener("DOMContentLoaded", function(){

const video = document.getElementById("birthdayVideo");

if(video){
    video.addEventListener("ended", () => {
        const bgMusic = document.getElementById("bgMusic");
        if(bgMusic){
            bgMusic.play().catch(()=>{});
        }
    });
}

});

function openGiftBox(){
stopFloatingMemories();
const gift = document.getElementById("giftBox");
const bgMusic = document.getElementById("bgMusic");
const wrapper = document.getElementById("surpriseVideoWrapper");
const video = document.getElementById("surpriseVideo");

gift.classList.add("open");

/* stop background music */
if(bgMusic){
bgMusic.pause();
}

/* gold particle burst */

for(let i = 0; i < 25; i++){

let particle=document.createElement("div");
particle.className="gold-particle";

particle.style.left="50%";
particle.style.top="60%";

let angle=Math.random()*Math.PI*2;
let distance=Math.random()*200;

particle.style.setProperty("--x",Math.cos(angle)*distance+"px");
particle.style.setProperty("--y",Math.sin(angle)*distance+"px");

document.body.appendChild(particle);

setTimeout(()=>particle.remove(),1500);
}

/* open surprise video */

setTimeout(()=>{

wrapper.classList.add("show");

if(video){
video.currentTime = 0;
if(countdownFinished){
video.play().catch(()=>{});
}
}

},900);

}

/* Resume background music when surprise video ends */
document.addEventListener("DOMContentLoaded", function(){
const video = document.getElementById("surpriseVideo");
const bgMusic = document.getElementById("bgMusic");
if(video){
    video.addEventListener("ended", () => {
        if(bgMusic && countdownFinished){
            bgMusic.play().catch(()=>{});
        }
    });
}
});

function closeSurpriseVideo(){
startFloatingMemories();
const wrapper = document.getElementById("surpriseVideoWrapper");
const video = document.getElementById("surpriseVideo");
const bgMusic = document.getElementById("bgMusic");

video.pause();
video.currentTime = 0;

wrapper.classList.remove("show");

if(bgMusic){
bgMusic.play().catch(()=>{});
}

}

function particleFirework(){

const canvas = document.getElementById("fireworks");
if(!canvas) return;

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for(let i=0;i<120;i++){

particles.push({
x: canvas.width/2,
y: canvas.height/2,
angle: Math.random()*Math.PI*2,
speed: Math.random()*6,
life: 100
});

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height*0.6);

particles.forEach(p=>{

p.x += Math.cos(p.angle)*p.speed;
p.y += Math.sin(p.angle)*p.speed;
p.life--;

ctx.fillStyle = `hsl(${Math.random()*360},100%,60%)`;
ctx.beginPath();
ctx.arc(p.x,p.y,3,0,Math.PI*2);
ctx.fill();

});

particles = particles.filter(p=>p.life>0);

if(particles.length>0){
requestAnimationFrame(animate);
}

}

animate();
}

window.addEventListener("resize", ()=>{

const canvas=document.getElementById("fireworks");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

});

function createNameParticles(){

const names = ["CHINNI","SACHI"];

for(let i = 0; i < 3; i++){

let letter=document.createElement("div");

letter.innerText = names[Math.floor(Math.random()*names.length)];

letter.className="particle";

letter.style.left = Math.random()*100 + "vw";

letter.style.bottom = "-50px";

letter.style.fontSize = (18 + Math.random()*10) + "px";

letter.style.animationDuration = (Math.random()*10 + 10) + "s";

letter.style.animationDelay = Math.random()*4 + "s";

document.body.appendChild(letter);

setTimeout(()=>{
if(letter && letter.parentNode){
letter.remove();
}
},30000);

}

}

// Delay name particles until after countdown
setTimeout(() => {
    createNameParticles();
    setInterval(createNameParticles, 40000);
}, 4000);

/* SECRET MESSAGE */

function secretLoveMessage(){

    let msg = document.createElement("div");

    msg.innerHTML = "❤️ Happiest Birthday Chinni ❤️";

    msg.style.position = "fixed";
    msg.style.top = "50%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.fontSize = window.innerWidth < 768 ? "22px" : "40px";
    msg.style.color = "white";
    msg.style.background = "rgba(0,0,0,0.8)";
    msg.style.padding = window.innerWidth < 768 ? "15px 20px" : "20px 40px";
    msg.style.borderRadius = "15px";
    msg.style.textAlign = "center";
    msg.style.boxShadow = "0 0 30px pink";
    msg.style.zIndex = "99999";
    msg.style.whiteSpace = "nowrap";
    msg.style.maxWidth = "90vw";
    msg.style.overflow = "hidden";
    msg.style.textOverflow = "ellipsis";

    document.body.appendChild(msg);

    setTimeout(function(){
        msg.remove();
    },4000);

}


/* DETECT S + K TOGETHER on desktop */

let keys = {};

document.addEventListener("keydown", function(e){

    keys[e.key.toLowerCase()] = true;

    if(keys["s"] && keys["k"]){

        secretLoveMessage();

    }

});

document.addEventListener("keyup", function(e){

    delete keys[e.key.toLowerCase()];

});

/* DETECT TRIPLE-TAP on mobile */
let tapCount = 0;
let tapTimer = null;

document.addEventListener("touchend", function(e){
    if(!tapStarted) return; // ignore taps during splash
    tapCount++;
    
    clearTimeout(tapTimer);
    
    if(tapCount === 3){
        secretLoveMessage();
        tapCount = 0;
    }
    
    tapTimer = setTimeout(() => {
        tapCount = 0;
    }, 500);
});



document.addEventListener("DOMContentLoaded", function() {

// Create animated countdown rings
const countdownScreen = document.getElementById("countdownScreen");
if(countdownScreen) {
    for(let i = 0; i < 3; i++) {
        const ring = document.createElement("div");
        ring.className = "countdown-ring";
        countdownScreen.appendChild(ring);
    }
}

// ── TAP TO BEGIN SPLASH ──────────────────────────────────────────────
// Browsers block audio without a user gesture. One tap unlocks everything.

const countdownSound = document.getElementById("countdownSound");
if(countdownSound) { countdownSound.loop = false; countdownSound.muted = false; }

// Hide countdown screen until tap
const countdownScreenEl = document.getElementById("countdownScreen");
if(countdownScreenEl) countdownScreenEl.style.display = "none";

// Build splash overlay
const splash = document.createElement("div");
splash.id = "tapSplash";
splash.style.cssText = "position:fixed;inset:0;z-index:999999;background:linear-gradient(135deg,#1a0533 0%,#0d0221 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;user-select:none;-webkit-user-select:none;";
splash.innerHTML = '<div style="font-size:4rem;margin-bottom:1rem;animation:splashPulse 1.2s ease-in-out infinite;">🎂</div><div style="font-size:1.6rem;font-weight:700;color:#fff;font-family:Poppins,sans-serif;letter-spacing:2px;">Tap to Begin</div><div style="font-size:0.95rem;color:rgba(255,255,255,0.6);margin-top:0.5rem;font-family:Poppins,sans-serif;text-align:center;padding:0 20px;">A special birthday surprise awaits 🎉</div>';
const splashStyle = document.createElement("style");
splashStyle.textContent = "@keyframes splashPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}";
document.head.appendChild(splashStyle);
document.body.appendChild(splash);

function showNumber(num, value) {
    if(!num) return;
    num.innerText = value;
    num.style.animation = "none";
    setTimeout(() => {
        num.style.animation = "countdownBounce 0.8s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";
    }, 10);
    createCountdownParticles();
}

function startAfterTap() {
    if(tapStarted) return;
    tapStarted = true;
    splash.remove();

    // Show countdown screen immediately
    if(countdownScreenEl) {
        countdownScreenEl.style.display = "flex";
        countdownScreenEl.style.opacity = "1";
        countdownScreenEl.style.visibility = "visible";
    }

    const num = document.getElementById("countdownNumber");

    // 0s   → show 3
    showNumber(num, 3);

    // 1s   → show 2
    setTimeout(() => { showNumber(num, 2); }, 1000);

    // 1.12s → start countdown audio (no forced stop — plays to natural end)
    setTimeout(() => {
        if(countdownSound) {
            countdownSound.currentTime = 0;
            countdownSound.play().catch(() => {});
        }
    }, 1120);

    // 2s   → show 1
    setTimeout(() => { showNumber(num, 1); }, 2000);

    // 3s   → hide countdown screen
    setTimeout(() => {
        if(countdownScreenEl) {
            countdownScreenEl.style.transition = "opacity 0.5s ease-out";
            countdownScreenEl.style.opacity = "0";
            setTimeout(() => {
                countdownScreenEl.style.display = "none";
                countdownScreenEl.style.visibility = "hidden";
            }, 500);
        }
    }, 3000);

    // 3.1s → start main page
    setTimeout(() => {
        countdownFinished = true;
        startBirthdayExperience();
    }, 3100);
}

splash.addEventListener("click",      startAfterTap, { once: true });
splash.addEventListener("touchstart", startAfterTap, { once: true, passive: true });

// Dummy let to avoid reference errors from old interval variable usage below
let interval = null;
let count = 3;

// Create particle burst for countdown
function createCountdownParticles() {
    const screen = document.getElementById("countdownScreen");
    if(!screen) return;
    
    for(let i = 0; i < 12; i++) {
        const particle = document.createElement("div");
        particle.style.position = "fixed";
        particle.style.left = "50%";
        particle.style.top = "50%";
        particle.style.width = "8px";
        particle.style.height = "8px";
        particle.style.borderRadius = "50%";
        particle.style.background = `hsl(${320 + i * 5}, 100%, 60%)`;
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "9999";
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 3 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let life = 1;
        
        const animate = () => {
            x += vx;
            y += vy;
            life -= 0.02;
            
            particle.style.left = x + "px";
            particle.style.top = y + "px";
            particle.style.opacity = life;
            
            if(life > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        animate();
    }
}

for(let i=0;i<80;i++){

let star=document.createElement("div");

star.className="star";

star.style.left=Math.random()*100+"vw";
star.style.top=Math.random()*100+"vh";

document.body.appendChild(star);

}

});

document.addEventListener("click",function(e){

// Don't spawn hearts during splash screen
if(!tapStarted) return;

let heart=document.createElement("div");

heart.innerHTML="❤️";

heart.style.position="fixed";
heart.style.left=e.clientX+"px";
heart.style.top=e.clientY+"px";
heart.style.fontSize="24px";
heart.style.pointerEvents="none";
heart.style.zIndex="9999";

document.body.appendChild(heart);

heart.animate([
{transform:"translateY(0)",opacity:1},
{transform:"translateY(-80px)",opacity:0}
],{duration:1000});

setTimeout(()=>heart.remove(),1000);

});

function clinkGlasses() {
    const left   = document.getElementById("leftGlass");
    const right  = document.getElementById("rightGlass");
    const effect = document.getElementById("clinkEffect");
    const toast  = document.getElementById("toastMessage");
    const cheer  = document.getElementById("cheerSound");

    if (!left || !right) return;
    if (left.classList.contains("clinking")) return; // prevent double-trigger

    // Clink both glasses
    left.classList.add("clinking");
    right.classList.add("clinking");

    // Sparkle burst in the middle
    if (effect) {
        effect.classList.remove("show");
        void effect.offsetWidth; // reflow to restart animation
        effect.innerHTML = ["✨","🌟","💫","⭐"][Math.floor(Math.random() * 4)];
        effect.classList.add("show");
    }

    // Play cheer sound
    if (cheer && countdownFinished) {
        cheer.currentTime = 0;
        cheer.play().catch(() => {});
    }

    // Reveal toast message
    if (toast) toast.classList.add("visible");

    // Floating drink emojis burst
    const emojis = ["🥃", "🍺", "✨", "🍻", "🌟", "🎉"];
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const el = document.createElement("div");
            el.className = "drink-bubble-float";
            el.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.left = (25 + Math.random() * 50) + "vw";
            el.style.top  = (35 + Math.random() * 25) + "vh";
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 2100);
        }, i * 80);
    }

    // Confetti burst
    if (typeof confetti === "function") {
        confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#ffd166", "#ff4e73", "#ffffff", "#ff7eb3", "#ffb347"]
        });
    }

    // Remove clinking class after animation
    setTimeout(() => {
        left.classList.remove("clinking");
        right.classList.remove("clinking");
    }, 600);
}

function startBirthdayExperience(){

const bgMusic = document.getElementById("bgMusic");

/* start background music */

if(bgMusic){
bgMusic.currentTime = 0;
bgMusic.play().catch(()=>{});
}

/* celebration effects */

celebrateBirthday();

/* voice wish - play immediately */

playBirthdayWish();

}

function floatingMemories(){

const photos=[
"Image4.jpeg",
"Image2.jpeg",
"Image3.jpeg",
"Sahithi 5.jpeg"
];

let photo=document.createElement("img");
photo.className="floating-memory";

photo.src=photos[Math.floor(Math.random()*photos.length)];

photo.style.position="fixed";
photo.style.width="120px";
photo.style.borderRadius="10px";
photo.style.left=Math.random()*100+"vw";
photo.style.bottom="-150px";
photo.style.opacity="0.8";
photo.style.zIndex="9990";

document.body.appendChild(photo);

photo.animate([
{transform:"translateY(0)",opacity:0},
{transform:"translateY(-120vh)",opacity:1}
],{
duration:25000
});

setTimeout(()=>photo.remove(),25000);

}

// Start floating memories only after countdown finishes
floatingInterval = setInterval(() => {
if(countdownFinished && floatingActive){
floatingMemories();
}
},20000);

function stopFloatingMemories(){

floatingActive = false;

document.querySelectorAll(".floating-memory").forEach(photo=>{
photo.remove();
});

}

function startFloatingMemories(){

floatingActive = true;
}
