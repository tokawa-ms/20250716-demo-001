/**
 * スペースインベーダーゲーム
 * レトロアーケードスタイルのJavaScript実装
 */

class SpaceInvadersGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // ゲーム状態
        this.gameState = 'menu'; // menu, playing, paused, gameOver, levelClear
        this.score = 0;
        this.hiScore = parseInt(localStorage.getItem('invaders-hiscore') || '0');
        this.lives = 3;
        this.level = 1;
        
        // ゲームオブジェクト
        this.player = null;
        this.invaders = [];
        this.barriers = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.ufo = null;
        this.particles = [];
        
        // タイミング制御
        this.lastTime = 0;
        this.invaderMoveTimer = 0;
        this.invaderMoveInterval = 1000; // 1秒
        this.invaderDirection = 1; // 1: right, -1: left
        this.invaderShootTimer = 0;
        this.ufoTimer = 0;
        this.flashTimer = 0;
        
        // キー入力
        this.keys = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop();
        
        // 初期画面表示
        this.drawMenu();
    }

    setupEventListeners() {
        // キーボードイベント
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameState === 'menu' || this.gameState === 'gameOver' || this.gameState === 'levelClear') {
                    this.startGame();
                } else if (this.gameState === 'playing') {
                    this.player.shoot();
                }
            }
            
            if (e.code === 'KeyP' && this.gameState === 'playing') {
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    startGame() {
        if (this.gameState === 'gameOver') {
            this.score = 0;
            this.lives = 3;
            this.level = 1;
        } else if (this.gameState === 'levelClear') {
            this.level++;
        }
        
        this.gameState = 'playing';
        this.createGameObjects();
        this.hideOverlays();
        this.updateUI();
    }

    createGameObjects() {
        // プレイヤー作成
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 60);
        
        // インベーダー作成 (5行 × 11列)
        this.invaders = [];
        const startX = 100;
        const startY = 100;
        const spacingX = 50;
        const spacingY = 40;
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                const x = startX + col * spacingX;
                const y = startY + row * spacingY;
                const type = row < 1 ? 'ufo-type' : row < 3 ? 'medium' : 'small';
                this.invaders.push(new Invader(x, y, type));
            }
        }
        
        // バリア作成
        this.barriers = [];
        const barrierCount = 4;
        const barrierSpacing = this.canvas.width / (barrierCount + 1);
        
        for (let i = 0; i < barrierCount; i++) {
            const x = barrierSpacing * (i + 1);
            const y = this.canvas.height - 200;
            this.barriers.push(new Barrier(x, y));
        }
        
        // 弾をリセット
        this.bullets = [];
        this.enemyBullets = [];
        this.particles = [];
        this.ufo = null;
        
        // タイマーリセット
        this.invaderMoveTimer = 0;
        this.invaderShootTimer = 0;
        this.ufoTimer = 0;
        this.flashTimer = 0;
        
        // インベーダーの移動速度を調整
        this.updateInvaderSpeed();
    }

    updateInvaderSpeed() {
        // インベーダーの数が減るほど移動速度を上げる
        const remainingInvaders = this.invaders.length;
        const totalInvaders = 55; // 5 × 11
        const speedMultiplier = Math.max(0.3, remainingInvaders / totalInvaders);
        this.invaderMoveInterval = 1000 * speedMultiplier;
    }

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (this.gameState === 'playing') {
            this.update(deltaTime);
        }
        
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // プレイヤー更新
        this.player.update(this.keys, this.canvas.width);
        
        // 弾更新
        this.bullets = this.bullets.filter(bullet => bullet.update());
        this.enemyBullets = this.enemyBullets.filter(bullet => bullet.update());
        
        // インベーダー更新
        this.updateInvaders(deltaTime);
        
        // UFO更新
        this.updateUFO(deltaTime);
        
        // パーティクル更新
        this.particles = this.particles.filter(particle => particle.update());
        
        // 衝突判定
        this.checkCollisions();
        
        // ゲーム状態チェック
        this.checkGameState();
        
        // フラッシュエフェクト更新
        if (this.flashTimer > 0) {
            this.flashTimer -= deltaTime;
        }
    }

    updateInvaders(deltaTime) {
        if (this.invaders.length === 0) return;
        
        // インベーダー移動
        this.invaderMoveTimer += deltaTime;
        if (this.invaderMoveTimer >= this.invaderMoveInterval) {
            this.moveInvaders();
            this.invaderMoveTimer = 0;
        }
        
        // インベーダーの弾発射
        this.invaderShootTimer += deltaTime;
        const shootInterval = Math.max(500, 2000 - this.level * 100); // レベルが上がると発射頻度増加
        if (this.invaderShootTimer >= shootInterval) {
            this.invaderShoot();
            this.invaderShootTimer = 0;
        }
    }

    moveInvaders() {
        // 端に到達したかチェック
        let hitEdge = false;
        for (const invader of this.invaders) {
            if ((this.invaderDirection === 1 && invader.x >= this.canvas.width - 50) ||
                (this.invaderDirection === -1 && invader.x <= 50)) {
                hitEdge = true;
                break;
            }
        }
        
        if (hitEdge) {
            // 方向転換して下に移動
            this.invaderDirection *= -1;
            for (const invader of this.invaders) {
                invader.y += 20;
            }
        } else {
            // 横移動
            for (const invader of this.invaders) {
                invader.x += this.invaderDirection * 25;
            }
        }
        
        this.updateInvaderSpeed();
    }

    invaderShoot() {
        // ランダムなインベーダーから弾発射
        if (this.invaders.length > 0) {
            const shooter = this.invaders[Math.floor(Math.random() * this.invaders.length)];
            this.enemyBullets.push(new Bullet(shooter.x, shooter.y + 20, 0, 3, '#ff4444'));
        }
    }

    updateUFO(deltaTime) {
        // UFO出現タイミング
        this.ufoTimer += deltaTime;
        if (this.ufoTimer >= 20000 && !this.ufo) { // 20秒間隔
            this.ufo = new UFO();
            this.ufoTimer = 0;
        }
        
        // UFO更新
        if (this.ufo) {
            this.ufo.update();
            if (this.ufo.x > this.canvas.width + 50) {
                this.ufo = null;
            }
        }
    }

    checkCollisions() {
        // プレイヤーの弾 vs インベーダー
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = this.invaders.length - 1; j >= 0; j--) {
                const invader = this.invaders[j];
                if (this.checkCollision(bullet, invader)) {
                    this.destroyInvader(invader, j);
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }
        
        // プレイヤーの弾 vs UFO
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (this.ufo && this.checkCollision(bullet, this.ufo)) {
                this.destroyUFO();
                this.bullets.splice(i, 1);
            }
        }
        
        // プレイヤーの弾 vs バリア
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            for (const barrier of this.barriers) {
                if (barrier.checkCollision(bullet)) {
                    barrier.takeDamage(bullet.x, bullet.y);
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }
        
        // 敵の弾 vs プレイヤー
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const bullet = this.enemyBullets[i];
            if (this.checkCollision(bullet, this.player)) {
                this.playerHit();
                this.enemyBullets.splice(i, 1);
            }
        }
        
        // 敵の弾 vs バリア
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const bullet = this.enemyBullets[i];
            for (const barrier of this.barriers) {
                if (barrier.checkCollision(bullet)) {
                    barrier.takeDamage(bullet.x, bullet.y);
                    this.enemyBullets.splice(i, 1);
                    break;
                }
            }
        }
        
        // インベーダー vs プレイヤー (接触)
        for (const invader of this.invaders) {
            if (this.checkCollision(invader, this.player)) {
                this.gameOver();
                return;
            }
        }
    }

    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    destroyInvader(invader, index) {
        // スコア加算
        const points = invader.type === 'small' ? 10 : invader.type === 'medium' ? 20 : 30;
        this.addScore(points);
        
        // 爆発エフェクト
        this.createExplosion(invader.x + invader.width/2, invader.y + invader.height/2);
        
        // インベーダー削除
        this.invaders.splice(index, 1);
    }

    destroyUFO() {
        const bonus = 100 + Math.floor(Math.random() * 400); // 100-500点
        this.addScore(bonus);
        this.showUFOBonus(bonus);
        this.createExplosion(this.ufo.x + this.ufo.width/2, this.ufo.y + this.ufo.height/2);
        this.ufo = null;
    }

    playerHit() {
        this.lives--;
        this.flashTimer = 500; // 0.5秒フラッシュ
        this.createExplosion(this.player.x + this.player.width/2, this.player.y + this.player.height/2);
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // プレイヤーをリセット位置に
            this.player.x = this.canvas.width / 2;
            this.player.y = this.canvas.height - 60;
        }
        
        this.updateUI();
    }

    addScore(points) {
        this.score += points;
        if (this.score > this.hiScore) {
            this.hiScore = this.score;
            localStorage.setItem('invaders-hiscore', this.hiScore.toString());
        }
        this.updateUI();
    }

    showUFOBonus(points) {
        const bonusElement = document.getElementById('ufo-bonus');
        const pointsElement = document.getElementById('ufo-points');
        pointsElement.textContent = points;
        bonusElement.classList.remove('hidden');
        bonusElement.classList.add('ufo-bonus-show');
        
        setTimeout(() => {
            bonusElement.classList.add('hidden');
            bonusElement.classList.remove('ufo-bonus-show');
        }, 2000);
    }

    createExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed));
        }
    }

    checkGameState() {
        // レベルクリアチェック
        if (this.invaders.length === 0) {
            this.levelClear();
        }
        
        // ゲームオーバーチェック（インベーダーが下まで到達）
        for (const invader of this.invaders) {
            if (invader.y + invader.height >= this.canvas.height - 100) {
                this.gameOver();
                break;
            }
        }
    }

    levelClear() {
        this.gameState = 'levelClear';
        const bonus = this.lives * 100;
        this.addScore(bonus);
        document.getElementById('level-bonus').textContent = bonus;
        document.getElementById('level-clear').classList.remove('hidden');
    }

    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('game-canvas').classList.add('game-over-effect');
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pause-screen').classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pause-screen').classList.add('hidden');
        }
    }

    hideOverlays() {
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('level-clear').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-canvas').classList.remove('game-over-effect');
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('hi-score').textContent = this.hiScore;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }

    draw() {
        // 画面クリア
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'menu') {
            this.drawMenu();
            return;
        }
        
        // フラッシュエフェクト
        if (this.flashTimer > 0) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'multiply';
            this.ctx.fillStyle = '#ff4444';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
        
        // ゲームオブジェクト描画
        if (this.player) this.player.draw(this.ctx);
        
        for (const invader of this.invaders) {
            invader.draw(this.ctx);
        }
        
        for (const barrier of this.barriers) {
            barrier.draw(this.ctx);
        }
        
        for (const bullet of this.bullets) {
            bullet.draw(this.ctx);
        }
        
        for (const bullet of this.enemyBullets) {
            bullet.draw(this.ctx);
        }
        
        if (this.ufo) {
            this.ufo.draw(this.ctx);
        }
        
        for (const particle of this.particles) {
            particle.draw(this.ctx);
        }
    }

    drawMenu() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SPACE INVADERS', this.canvas.width / 2, this.canvas.height / 2 - 100);
        
        this.ctx.font = '24px monospace';
        this.ctx.fillText('Press SPACE to Start', this.canvas.width / 2, this.canvas.height / 2 + 50);
        
        this.ctx.font = '16px monospace';
        this.ctx.fillText('← → to move, SPACE to fire, P to pause', this.canvas.width / 2, this.canvas.height / 2 + 100);
    }
}

// ゲームオブジェクトクラス定義
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 20;
        this.speed = 5;
        this.canShoot = true;
        this.shootCooldown = 0;
    }

    update(keys, canvasWidth) {
        // 移動
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvasWidth - this.width) {
            this.x += this.speed;
        }
        
        // 射撃クールダウン
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        } else {
            this.canShoot = true;
        }
    }

    shoot() {
        if (this.canShoot) {
            game.bullets.push(new Bullet(this.x + this.width/2, this.y, 0, -7, '#00ff00'));
            this.canShoot = false;
            this.shootCooldown = 10;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#00ff00';
        // 砲台の形を描画
        ctx.fillRect(this.x + 15, this.y, 10, 15);
        ctx.fillRect(this.x, this.y + 15, this.width, 5);
    }
}

class Invader {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 20;
        this.type = type;
        this.animFrame = 0;
    }

    draw(ctx) {
        const colors = {
            'small': '#ff4444',
            'medium': '#ffff44',
            'ufo-type': '#44ff44'
        };
        
        ctx.fillStyle = colors[this.type] || '#ffffff';
        
        // シンプルなインベーダーの形
        if (this.type === 'ufo-type') {
            // 円形UFO型
            ctx.fillRect(this.x + 5, this.y + 5, 20, 10);
            ctx.fillRect(this.x + 10, this.y, 10, 20);
        } else {
            // 標準的なインベーダー形状
            ctx.fillRect(this.x, this.y + 5, this.width, 10);
            ctx.fillRect(this.x + 5, this.y, 20, 5);
            ctx.fillRect(this.x + 10, this.y + 15, 10, 5);
        }
    }
}

class Barrier {
    constructor(x, y) {
        this.x = x - 30;
        this.y = y;
        this.width = 60;
        this.height = 40;
        this.blocks = [];
        
        // バリアのブロック構造を初期化
        for (let row = 0; row < 4; row++) {
            this.blocks[row] = [];
            for (let col = 0; col < 6; col++) {
                // バリアの形状（中央にくぼみ）
                if (row === 3 && col >= 2 && col <= 3) {
                    this.blocks[row][col] = 0; // 穴
                } else {
                    this.blocks[row][col] = 1; // ブロック有り
                }
            }
        }
    }

    checkCollision(bullet) {
        if (bullet.x < this.x || bullet.x > this.x + this.width ||
            bullet.y < this.y || bullet.y > this.y + this.height) {
            return false;
        }
        
        // ブロック単位での当たり判定
        const blockX = Math.floor((bullet.x - this.x) / 10);
        const blockY = Math.floor((bullet.y - this.y) / 10);
        
        if (blockX >= 0 && blockX < 6 && blockY >= 0 && blockY < 4) {
            return this.blocks[blockY][blockX] === 1;
        }
        
        return false;
    }

    takeDamage(x, y) {
        // 弾が当たった周辺のブロックを破壊
        const blockX = Math.floor((x - this.x) / 10);
        const blockY = Math.floor((y - this.y) / 10);
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const bx = blockX + dx;
                const by = blockY + dy;
                if (bx >= 0 && bx < 6 && by >= 0 && by < 4) {
                    this.blocks[by][bx] = 0;
                }
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#00ff00';
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
                if (this.blocks[row][col] === 1) {
                    ctx.fillRect(this.x + col * 10, this.y + row * 10, 10, 10);
                }
            }
        }
    }
}

class Bullet {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 3;
        this.height = 8;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // 画面外チェック
        return this.y > -20 && this.y < game.canvas.height + 20;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class UFO {
    constructor() {
        this.x = -50;
        this.y = 50;
        this.width = 40;
        this.height = 20;
        this.speed = 2;
    }

    update() {
        this.x += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = '#ff44ff';
        // UFOの形状
        ctx.fillRect(this.x + 5, this.y + 5, 30, 10);
        ctx.fillRect(this.x + 10, this.y, 20, 5);
        ctx.fillRect(this.x + 15, this.y + 15, 10, 5);
    }
}

class Particle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 30;
        this.maxLife = 30;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        return this.life > 0;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.fillRect(this.x, this.y, 2, 2);
    }
}

// ゲーム開始
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new SpaceInvadersGame();
});