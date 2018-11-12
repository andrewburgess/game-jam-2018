import * as Phaser from "phaser"

import { BLOCK_SIZE } from "./entities/Block"
import { BOARD_HEIGHT, BOARD_WIDTH } from "./entities/Board"
import BeamTest from "./scenes/BeamTest"
import BlocksTest from "./scenes/BlocksTest"
import Game from "./scenes/Game"
import GameUI from "./scenes/GameUI"
import Loading from "./scenes/Loading"
import Menu from "./scenes/Menu"
import MovementTest from "./scenes/MovementTest"

const GameConfiguration: GameConfig = {
    backgroundColor: "#6495ED",
    height: BLOCK_SIZE * (BOARD_HEIGHT + 1),
    input: {
        gamepad: true
    },
    scene: [Loading, Menu, BeamTest, BlocksTest, MovementTest, Game, GameUI],
    type: Phaser.CANVAS,
    width: BLOCK_SIZE * BOARD_WIDTH
}

const start = () => new Phaser.Game(GameConfiguration)
start()
