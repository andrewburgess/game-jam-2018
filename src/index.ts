import * as Phaser from "phaser"

import Game from "./scenes/Game"
import GameUI from "./scenes/GameUI"
import Loading from "./scenes/Loading"
import Menu from "./scenes/Menu"

const GameConfiguration: GameConfig = {
    backgroundColor: "#6495ED",
    height: 800,
    input: {
        gamepad: true
    },
    scene: [Loading, Menu, Game, GameUI],
    width: 1000
}

const start = () => new Phaser.Game(GameConfiguration)
start()
