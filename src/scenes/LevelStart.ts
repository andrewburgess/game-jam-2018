import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { Assets } from "../assets"
import { ILevel, Levels } from "../levels"

import { Scenes } from "./"
import Game, { IGameInitialization } from "./Game"

const log = debug(`game:scenes:${Scenes.LevelStart}`)

export default class LevelStart extends Phaser.Scene {
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
            this.add.text(50, 140, `BUDGET:      $${this.level.budget}`, {
                fill: "#ffffff",
                font: "28px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 180, `BEAM RATE:   ${this.level.beam.consumptionRate} GW`, {
                fill: "#ffffff",
                font: "28px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 210, `BEAM REGEN:  ${this.level.beam.regenerationRate} GW`, {
                fill: "#ffffff",
                font: "28px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 260, `MAX AMMO:    ${this.level.ammo.maximum}`, {
                fill: "#ffffff",
                font: "28px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 290, `AMMO RELOAD: ${this.level.ammo.regenerationInterval / 1000}s`, {
                fill: "#ffffff",
                font: "28px Share Tech Mono"
            })
        )
        container.add(
            this.add.text(50, 360, this.level.description, {
                fill: "#ffffff",
                font: "24px Share Tech Mono"
            })
        )

        const begin = this.add
            .image(0, 480, Assets.BeginButton)
            .setInteractive()
            .setOrigin(0, 0)
        begin.once("pointerup", () => this.startGame())
        container.add(begin)
        begin.setPosition(400 - begin.width / 2, begin.y)
    }

    public update() {
        if (this.controller.actionA!.isUniquelyDown()) {
            this.startGame()
        }
    }

    private startGame() {
        const game = this.scene.get(Scenes.Game) as Game
        game.begin()

        this.scene.stop(Scenes.LevelStart)
    }
}
