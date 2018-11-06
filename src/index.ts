import * as Phaser from "phaser"

import BlocksTest from "./scenes/BlocksTest"
import Loading from "./scenes/Loading"
import Menu from "./scenes/Menu"
import MovementTest from "./scenes/MovementTest"

const GameConfiguration: GameConfig = {
    backgroundColor: "#6495ED",
    height: 800,
    input: {
        gamepad: true
    },
    scene: [Loading, Menu, BlocksTest, MovementTest],
    type: Phaser.CANVAS,
    width: 1000
}

const start = () => new Phaser.Game(GameConfiguration)
start()
