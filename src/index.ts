import * as Phaser from "phaser"

import Loading from "./scenes/Loading"
import Menu from "./scenes/Menu"
import MovementTest from "./scenes/MovementTest"

const GameConfiguration: GameConfig = {
    height: 800,
    input: {
        gamepad: true
    },
    scene: [Loading, Menu, MovementTest],
    type: Phaser.AUTO,
    width: 1000
}

const start = () => new Phaser.Game(GameConfiguration)
start()
