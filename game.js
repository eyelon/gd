const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');

// 棋盘参数
const GRID_SIZE = 60;
const MARGIN = 30;
const BOARD_SIZE = 30;
let currentPlayer = 1; // 1: 黑棋, 2: 白棋
let gameOver = false;

// 初始化棋盘状态
let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));

// 初始化棋盘
function initBoard() {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // 绘制棋盘线
    for (let i = 0; i < BOARD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(MARGIN + i * GRID_SIZE, MARGIN);
        ctx.lineTo(MARGIN + i * GRID_SIZE, canvas.height - MARGIN);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(MARGIN, MARGIN + i * GRID_SIZE);
        ctx.lineTo(canvas.width - MARGIN, MARGIN + i * GRID_SIZE);
        ctx.stroke();
    }
}

// 绘制棋子
function drawPiece(x, y) {
    ctx.beginPath();
    ctx.arc(MARGIN + x * GRID_SIZE, MARGIN + y * GRID_SIZE, 12, 0, Math.PI * 2);
    ctx.fillStyle = currentPlayer === 1 ? '#000' : '#fff';
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.stroke();
}

// 检查胜利
function checkWin(x, y) {
    const directions = [
        [ [1,0], [-1,0] ],   // 水平
        [ [0,1], [0,-1] ],   // 垂直
        [ [1,1], [-1,-1] ],  // 主对角线
        [ [1,-1], [-1,1] ]   // 副对角线
    ];                        

    for (let dir of directions) {
        let count = 1;
        
        for (let [dx, dy] of dir) {
            let xi = x + dx;
            let yi = y + dy;
            
            while (xi >= 0 && xi < BOARD_SIZE && 
                   yi >= 0 && yi < BOARD_SIZE && 
                   board[xi][yi] === currentPlayer) {
                count++;                        
                xi += dx;
                yi += dy;
            }
        }
        
        if (count >= 5) return true;
    }
    return false;                        
}

// 处理点击事件
canvas.addEventListener('click', (e) => {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    
    const x = Math.floor((xPos - MARGIN) / GRID_SIZE);
    const y = Math.floor((yPos - MARGIN) / GRID_SIZE);
    
    if (x >= 0 && x < BOARD_SIZE && 
        y >= 0 && y < BOARD_SIZE && 
        board[x][y] === 0) {
        
        board[x][y] = currentPlayer;
        drawPiece(x, y);
        
        if (checkWin(x, y)) {
            statusDiv.textContent = `${currentPlayer === 1 ? '黑方' : '白方'} 胜利！`;
            gameOver = true;
            return;
        }
        
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        statusDiv.textContent = `${currentPlayer === 1 ? '黑方' : '白方'} 回合`;
    }
});

// 重置游戏
function resetGame() {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    currentPlayer = 1;
    gameOver = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initBoard();
    statusDiv.textContent = '黑方回合';
}

// 初始化
initBoard();
