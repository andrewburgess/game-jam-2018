import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { Assets } from "../assets"
import { ILevel, Levels } from "../levels"

import { Scenes } from "./"
import Game, { IGameInitialization } from "./Game"

const log = debug(`game:scenes:${Scenes.LevelStart}`)

export default class LevelStart extends Phaser.Scene {
    private clicked: boolean
    private controller: UnifiedController
    private level: ILevel

    constructor() {
        super({
            key: Scenes.LevelStart
        })

        log("constructed")
    }

    public create(config: IGameInitialization) {
        log("create")

        this.clicked = false

        this.level = Levels[config.level]
        this.controller = new UnifiedController(this.input)

        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0, 0)

        const container = this.add.container(100, 100)
        container.add(this.add.image(0, 0, Assets.LevelStartBackground).setOrigin(0, 0))
        container.add(
            this.add.text(50, 50, `LEVEL ${config.level}`, {
                fill: "#ffffff",
                font: "48px Righteous"
            })
        )
        container.add(
            this.add
                .line(0, 0, 50, 110, 220, 110, 0xffffff)
                .setOrigin(0, 0)
                .setLineWidth(2)
        )
        container.add(
            this.add.text(50, 130, `BUDGET:      $${this.level.budget}`, {
                fill: "#ffffff",
                font: "26px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 160, `BEAM RATE:   ${this.level.beam.consumptionRate} GW`, {
                fill: "#ffffff",
                font: "26px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 190, `BEAM REGEN:  ${this.level.beam.regenerationRate} GW`, {
                fill: "#ffffff",
                font: "26px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 240, `MAX AMMO:    ${this.level.ammo.maximum}`, {
                fill: "#ffffff",
                font: "26px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 270, `AMMO RELOAD: ${this.level.ammo.regenerationInterval / 1000}s`, {
                fill: "#ffffff",
                font: "26px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 340, this.level.description, {
                fill: "#ffffff",
                font: "22px Share Tech Mono"
            })
        )

        const buttonContainer = this.add.container(500, 620)
        const begin = this.add.image(0, 0, Assets.ButtonBackground).setInteractive()
        begin.once("pointerup", () => this.startGame())
        buttonContainer.add(begin)
        buttonContainer.add(
            this.add.text(0, 0, "BEGIN", { fill: "#ffffff", font: "48px Share Tech Mono" }).setOrigin(0.5)
        )
    }

    public update(time: number, delta: number) {
        if (!this.scene.isActive(Scenes.LevelStart)) {
            return
        }

        super.update(time, delta)

        if (!this.clicked && (this.controller.actionA!.isDown() || this.controller.enter!.isDown())) {
            this.startGame()
        }
    }

    private startGame() {
        this.clicked = true
        const game = this.scene.get(Scenes.Game) as Game
        game.begin()

        this.scene.stop(Scenes.LevelStart)
    }
}
