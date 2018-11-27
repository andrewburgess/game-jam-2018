import * as Phaser from "phaser"

import Game from "./scenes/Game"
import GameSettings from "./scenes/GameSettings"
import GameUI from "./scenes/GameUI"
import LevelComplete from "./scenes/LevelComplete"
import LevelFail from "./scenes/LevelFail"
import LevelStart from "./scenes/LevelStart"
import Loading from "./scenes/Loading"
import Menu from "./scenes/Menu"
import Winner from "./scenes/Winner"

const GameConfiguration: GameConfig = {
    backgroundColor: "#000000",
    height: 800,
    input: {
        gamepad: true
    },
    scene: [Loading, Menu, Game, GameSettings, GameUI, LevelComplete, LevelFail, LevelStart, Winner],
    width: 1000
}

const start = () => new Phaser.Game(GameConfiguration)

window.WebFont.load({
    active: () => start(),
    google: {
        families: ["Share Tech Mono", "Righteous"]
    },
    inactive: () => start(),
    timeout: 2000
})
