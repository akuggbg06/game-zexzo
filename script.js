const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 600;

let score = 0, speed = 0, gameRunning = true, frameCount = 0;
let player = {
    x: 225, y: 500, width: 50, height: 70, lane: 1,
    lanes: [150, 225, 300]
};
let obstacles = [];
let roadLines = [];

for(let i = 0; i < 20; i++) {
    roadLines.push({ y: i * 40, x: canvas.width/2 - 5, width: 10, height: 25 });
}

const colors = ['#ff0000', '#ff4444', '#cc0000', '#ff6666', '#ff3333'];

function addObstacle() {
    if(!gameRunning) return;
    let laneIndex = Math.floor(Math.random() * 3);
    obstacles.push({
        x: player.lanes[laneIndex],
        y: -80,
        width: 45,
        height: 65,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

function drawRoad() {
    ctx.fillStyle = '#2a2a3e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(let i = -50; i < canvas.width + 50; i += 70) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 40, canvas.height);
        ctx.strokeStyle = '#44ff44';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    for(let line of roadLines) {
        ctx.fillStyle = '#ffff00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'cyan';
        ctx.fillRect(line.x, line.y, line.width, line.height);
        line.y += speed / 3;
        if(line.y > canvas.height) line.y = -30;
    }
    ctx.shadowBlur = 0;
    
    for(let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(player.lanes[i] + 25, 0);
        ctx.lineTo(player.lanes[i] + 25, canvas.height);
        ctx.strokeStyle = '#ffffff88';
        ctx.setLineDash([20, 30]);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

function drawPlayer() {
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.width, player.height, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(player.x + 10, player.y + 20, 8, 0, Math.PI*2);
    ctx.arc(player.x + player.width - 10, player.y + 20, 8, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.fillRect(player.x + 15, player.y + 45, 8, 15);
    ctx.fillRect(player.x + player.width - 23, player.y + 45, 8, 15);
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(player.x + 20, player.y - 8, 10, 12);
    ctx.shadowBlur = 0;
}

function drawObstacles() {
    for(let obs of obstacles) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0000';
        ctx.fillStyle = obs.color;
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 10);
        ctx.fill();
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(obs.x + 10, obs.y + 15, 8, 10);
        ctx.fillRect(obs.x + obs.width - 18, obs.y + 15, 8, 10);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(obs.x + 15, obs.y + 35, 15, 8);
    }
    ctx.shadowBlur = 0;
}

function updateGame() {
    if(!gameRunning) return;
    speed = Math.min(15, Math.floor(score / 200) + 5);
    document.getElementById('speed').innerText = Math.floor(speed * 8);
    document.getElementById('score').innerText = Math.floor(score);
    
    frameCount++;
    if(frameCount > Math.max(30, 70 - Math.floor(score / 150))) {
        addObstacle();
        frameCount = 0;
    }
    
    for(let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += speed + 3;
        if(obstacles[i].y > canvas.height) {
            obstacles.splice(i,1);
            score += 100;
            i--;
        }
    }
    
    for(let obs of obstacles) {
        if(player.x < obs.x + obs.width &&
           player.x + player.width > obs.x &&
           player.y < obs.y + obs.height &&
           player.y + player.height > obs.y) {
            gameRunning = false;
            alert('💥 GAME OVER!\nSkor: ' + Math.floor(score));
            return;
        }
    }
}

function draw() {
    drawRoad();
    drawObstacles();
    drawPlayer();
}

function gameLoop() {
    if(gameRunning) updateGame();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if(!gameRunning) return;
    if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if(player.lane > 0) {
            player.lane--;
            player.x = player.lanes[player.lane];
        }
    } else if(e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if(player.lane < 2) {
            player.lane++;
            player.x = player.lanes[player.lane];
        }
    }
});

document.getElementById('leftBtn').onclick = () => {
    if(!gameRunning) return;
    if(player.lane > 0) {
        player.lane--;
        player.x = player.lanes[player.lane];
    }
};
document.getElementById('rightBtn').onclick = () => {
    if(!gameRunning) return;
    if(player.lane < 2) {
        player.lane++;
        player.x = player.lanes[player.lane];
    }
};
document.getElementById('restartBtn').onclick = () => {
    score = 0;
    gameRunning = true;
    obstacles = [];
    frameCount = 0;
    player.lane = 1;
    player.x = player.lanes[1];
    document.getElementById('score').innerText = '0';
    document.getElementById('speed').innerText = '0';
};

if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x+r, y);
        this.lineTo(x+w-r, y);
        this.quadraticCurveTo(x+w, y, x+w, y+r);
        this.lineTo(x+w, y+h-r);
        this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        this.lineTo(x+r, y+h);
        this.quadraticCurveTo(x, y+h, x, y+h-r);
        this.lineTo(x, y+r);
        this.quadraticCurveTo(x, y, x+r, y);
        return this;
    };
}

gameLoop();
