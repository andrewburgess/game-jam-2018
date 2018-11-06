import * as debug from "debug"
import { debounce } from "lodash"
import * as Phaser from "phaser"

import Loading from "./scenes/Loading"
import Menu from "./scenes/Menu"
import MovementTest from "./scenes/MovementTest";

const log = debug("game")

const GameConfiguration: GameConfig = {
    height: window.innerHeight,
    input: {
        gamepad: true
    },
    scene: [MovementTest],
    type: Phaser.AUTO,
    width: window.innerWidth
}

const Game = new Phaser.Game(GameConfiguration)

Game.events.on("resize", (width: number, height: number) => {
    log(`resize ${width}x${height}`)
})

const onResize = debounce(() => {
    Game.resize(window.innerWidth, window.innerHeight)
}, 400)

window.addEventListener("resize", onResize, true)
