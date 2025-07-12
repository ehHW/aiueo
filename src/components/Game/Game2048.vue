<template>
    <div class="game-container">
        <h1 class="score">Score: {{ score }}</h1>
        <div class="button-container">
            <button class="game-button" @click="newGame">新游戏</button>
            <button class="game-button" @click="undo">撤销</button>
        </div>
        <div class="board" ref="boardRef">
            <div v-for="(row, i) in board" :key="i" class="row">
                <div v-for="(cell, j) in row" :key="j" class="cell" :class="[`cell-${cell}`, { 'empty': cell === 0 }]">
                    {{ cell || '' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

const score = ref(0)
const board = ref(Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0)))
const moved = ref(false)
const boardRef = ref<HTMLElement | null>(null)
const animationPending = ref(false)

watch(() => moved.value, async (val: boolean) => {
    if (val) {
        animationPending.value = true
        createNew()
        createNew()

        // 等待所有单元格的过渡动画完成
        const cells = boardRef.value?.getElementsByClassName('cell') || []
        const promises = Array.from(cells).map(cell => {
            return new Promise<void>(resolve => {
                const onTransitionEnd = () => {
                    cell.removeEventListener('transitionend', onTransitionEnd)
                    resolve()
                }
                cell.addEventListener('transitionend', onTransitionEnd)
                // 添加超时保护，防止某些情况下动画没有触发
                setTimeout(resolve, 200)
            })
        })
        await Promise.race([
            Promise.all(promises),
            new Promise(resolve => setTimeout(resolve, 200)) // 最大等待时间
        ])

        // 所有动画完成后再检查游戏状态
        gameOver()
        history.value.push({
            score: score.value,
            board: record()
        })
        moved.value = false
        animationPending.value = false
    }
})


type Direction = 'up' | 'down' | 'left' | 'right'
type HistoryItem = {
    score: number
    board: number[][]
}

const history = ref<HistoryItem[]>([
    {
        score: 0,
        board: record()
    }
])

function newGame() {
    score.value = 0
    board.value = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0))
    createNew()
    createNew()
    history.value = [{
        score: 0,
        board: record()
    }]
}

function gameOver() {
    if (move(ref(record()), 'up', true) && move(ref(record()), 'down', true) && move(ref(record()), 'left', true) && move(ref(record()), 'right', true)) {
        alert('Game Over!');
    }
}

function undo() {
    if (history.value.length > 1) {
        history.value.pop()
        const last = recordHistory(history.value[history.value.length - 1])
        score.value = last.score
        board.value = last.board
    }
}

function record() {
    return board.value.map(row => row.slice())
}

function recordHistory(arr: HistoryItem) {
    return {
        score: arr.score,
        board: arr.board.map(row => row.slice())
    }
}

function createNew() {
    const empty = []
    for (let i = 0; i < board.value.length; i++) {
        for (let j = 0; j < board.value[i].length; j++) {
            if (board.value[i][j] === 0) {
                empty.push([i, j])
            }
        }
    }
    if (empty.length === 0) {
        return
    }
    const [i, j] = empty[Math.floor(Math.random() * empty.length)]
    board.value[i][j] = Math.random() < 0.5 ? 2 : 4
}

function move(matrix: Ref<Array<Array<number>>>, direction: Direction, test: boolean = false, isGameOver: boolean = true) {
    const rows = matrix.value.length
    const cols = matrix.value[0].length

    function inRange(i: number, j: number) {
        return i >= 0 && i < rows && j >= 0 && j < cols
    }

    const nexts = {
        up: (i: number, j: number) => [i + 1, j],
        down: (i: number, j: number) => [i - 1, j],
        left: (i: number, j: number) => [i, j + 1],
        right: (i: number, j: number) => [i, j - 1]
    }

    function nextPos(i: number, j: number) {
        const [ni, nj] = nexts[direction](i, j)
        if (inRange(ni, nj)) {
            return [ni, nj]
        }
        return null
    }

    function nextNonZero(i: number, j: number) {
        const pos = nextPos(i, j)
        if (!pos) {
            return null
        }
        const [ni, nj] = pos
        if (matrix.value[ni][nj] === 0) {
            return nextNonZero(ni, nj)
        }
        return pos
    }

    function calc(i: number, j: number) {
        const v = matrix.value[i][j]
        const pos = nextNonZero(i, j)
        if (!pos) {
            return
        }
        const [ni, nj] = pos
        const nv = matrix.value[ni][nj]
        if (v === 0) {
            matrix.value[i][j] = nv
            matrix.value[ni][nj] = 0
            if (!test) {
                moved.value = true
            } else {
                isGameOver = false
            }
            calc(i, j)
        } else if (v === nv) {
            matrix.value[i][j] = v * 2
            matrix.value[ni][nj] = 0
            score.value += v * 2
            if (!test) {
                moved.value = true
            } else {
                isGameOver = false
            }
        }
    }

    if (direction === 'up') {
        for (let j = 0; j < cols; j++) {
            for (let i = 0; i < rows; i++) {
                calc(i, j)
            }
        }
    } else if (direction === 'down') {
        for (let j = 0; j < cols; j++) {
            for (let i = rows - 1; i >= 0; i--) {
                calc(i, j)
            }
        }
    } else if (direction === 'left') {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                calc(i, j)
            }
        }
    } else if (direction === 'right') {
        for (let i = 0; i < rows; i++) {
            for (let j = cols - 1; j >= 0; j--) {
                calc(i, j)
            }
        }
    }
    return isGameOver
}

const handleKeydown = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
            move(board, 'up')
            break
        case 'arrowdown':
        case 's':
            move(board, 'down')
            break
        case 'arrowleft':
        case 'a':
            move(board, 'left')
            break
        case 'arrowright':
        case 'd':
            move(board, 'right')
            break
    }
}

onMounted(() => {
    newGame()
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})


</script>

<style scoped>
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
}

.score {
    font-size: 2em;
    color: var(--board-btn-text-color);
    margin: 0;
}

.button-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.game-button {
    padding: 10px 20px;
    font-size: 1em;
    font-weight: 500;
    color: var(--board-btn-text-color);
    background-color: var(--board-btn-bg-color);
    border: none;
    border-radius: 5px;
    cursor: default;
    transition: background-color 0.3s;
    outline: none;
    /* 添加这一行 */
}

.game-button:hover {
    opacity: 0.8;
}

.board {
    background-color: var(--board-bg-color);
    opacity: 0.8;
    padding: 15px;
    border-radius: 6px;
    display: inline-block;
}

.row {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
}

.row:last-child {
    margin-bottom: 0;
}

.cell {
    width: 80px;
    height: 80px;
    background-color: var(--bg-color);
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    font-weight: bold;
    color: var(--text-color);
    transition: all 0.15s ease;
}

.cell.empty {
    background-color: #CDC1B4;
    opacity: 0.5;
}

/* 数字块的主题色 */
:root.light {
    .cell-2 {
        background-color: #eee4da;
    }

    .cell-4 {
        background-color: #ede0c8;
    }

    .cell-8 {
        background-color: #f2b179;
        color: #f9f6f2;
    }

    .cell-16 {
        background-color: #f59563;
        color: #f9f6f2;
    }

    .cell-32 {
        background-color: #f67c5f;
        color: #f9f6f2;
    }

    .cell-64 {
        background-color: #f65e3b;
        color: #f9f6f2;
    }

    .cell-128 {
        background-color: #edcf72;
        color: #f9f6f2;
    }

    .cell-256 {
        background-color: #edcc61;
        color: #f9f6f2;
    }

    .cell-512 {
        background-color: #edc850;
        color: #f9f6f2;
    }

    .cell-1024 {
        background-color: #edc53f;
        color: #f9f6f2;
    }

    .cell-2048 {
        background-color: #edc22e;
        color: #f9f6f2;
    }
}

:root.dark {
    .cell-2 {
        background-color: #bcb0a4;
        color: #1a1a1a;
    }

    .cell-4 {
        background-color: #b8a794;
        color: #1a1a1a;
    }

    .cell-8 {
        background-color: #c17f4c;
        color: #f9f6f2;
    }

    .cell-16 {
        background-color: #c65e37;
        color: #f9f6f2;
    }

    .cell-32 {
        background-color: #c44e31;
        color: #f9f6f2;
    }

    .cell-64 {
        background-color: #c13c1f;
        color: #f9f6f2;
    }

    .cell-128 {
        background-color: #ba9c43;
        color: #f9f6f2;
    }

    .cell-256 {
        background-color: #ba9838;
        color: #f9f6f2;
    }

    .cell-512 {
        background-color: #ba942d;
        color: #f9f6f2;
    }

    .cell-1024 {
        background-color: #ba911f;
        color: #f9f6f2;
    }

    .cell-2048 {
        background-color: #ba8f11;
        color: #f9f6f2;
    }
}

.cell-128,
.cell-256,
.cell-512 {
    font-size: 1.8em;
}

.cell-1024,
.cell-2048 {
    font-size: 1.5em;
}
</style>
