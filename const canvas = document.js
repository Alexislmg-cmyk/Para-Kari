const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("nameInput");
const controls = document.getElementById("controls");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// estados
let activated = false;
let finishedTyping = false;
let showFinalMessage = false;
let finalOpacity = 0;

// texto
let fullText = "";
let displayedText = "";
let charIndex = 0;

// mensaje interno
const message = "Eternamente agradecido contigo por estar conmigo";

// animación
let pulse = 0;
let pulseSpeed = 0.05;

// partículas
let particles = [];

// activar pantalla completa
document.getElementById("fullscreenBtn").addEventListener("click", () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
});

// botón principal
document.getElementById("applyName").addEventListener("click", () => {
    const value = input.value.trim().toLowerCase();

    if (value === "kari") {
        activated = true;
        fullText = "Para Kari 💖";
        displayedText = "";
        charIndex = 0;
        finishedTyping = false;
        showFinalMessage = false;
        finalOpacity = 0;

        controls.classList.add("hidden");
    }
});

// corazón
function drawHeart(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size, y - size, x - size * 2, y + size, x, y + size * 2);
    ctx.bezierCurveTo(x + size * 2, y + size, x + size, y - size, x, y);
    ctx.fill();
}

// partículas
function spawnParticles(x, y) {
    for (let i = 0; i < 25; i++) {
        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: 4 + Math.random() * 3,
            life: 1
        });
    }
}

// animación principal
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    pulse += pulseSpeed;
    let scale = 1 + Math.sin(pulse) * (activated ? 0.1 : 0.03);

    // corazón
    drawHeart(centerX, centerY, 55 * scale, "#ff2e8c");

    // nombre letra por letra
    if (activated) {
        if (charIndex < fullText.length) {
            displayedText += fullText.charAt(charIndex);
            charIndex++;
        } else if (!finishedTyping) {
            finishedTyping = true;
            spawnParticles(centerX, centerY);

            setTimeout(() => {
                showFinalMessage = true;
            }, 1200);
        }

        ctx.fillStyle = "#333";
        ctx.font = "22px Arial";
        ctx.textAlign = "center";
        ctx.fillText(displayedText, centerX, centerY - 90);
    }

    // mensaje dentro del corazón
    if (activated) {
        ctx.fillStyle = "#fff";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.globalAlpha = 0.85;

        const words = message.split(" ");
        let line = "";
        let y = centerY - 10;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            if (ctx.measureText(testLine).width > 140) {
                ctx.fillText(line, centerX, y);
                line = words[i] + " ";
                y += 18;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, centerX, y);
        ctx.globalAlpha = 1;
    }

    // partículas
    particles.forEach((p, i) => {
        ctx.fillStyle = `rgba(255,100,180,${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) particles.splice(i, 1);
    });

    // frase final
    if (showFinalMessage) {
        finalOpacity += 0.01;
        ctx.globalAlpha = Math.min(finalOpacity, 1);
        ctx.fillStyle = "#555";
        ctx.font = "18px Arial";
        ctx.fillText("Gracias por llegar a mi vida", centerX, centerY + 120);
        ctx.globalAlpha = 1;
    }

    requestAnimationFrame(animate);
}

animate();