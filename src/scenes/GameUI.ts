import * as debug from "debug"
import * as Phaser from "phaser"

import { Data } from "../entities/Data"
import { ILevel, Levels } from "../levels"

import { Scenes } from "./"
import { IGameInitialization } from "./Game"

const log = debug(`game:scenes:${Scenes.GameUI}`)

const BorderColor = Phaser.Display.Color.HexStringToColor("#302828")
const BeamResourceColor = Phaser.Display.Color.HexStringToColor("#741a7a")
const BEAM_TOP = 20
const BEAM_LEFT_OFFSET = -250

export default class GameUI extends Phaser.Scene {
    private beamResources: Phaser.GameObjects.Graphics
    private beamText: Phaser.GameObjects.Text
    private level: ILevel

    constructor() {
        super({
            key: Scenes.GameUI
        })

        log("constructed")
    }

    public create(config: IGameInitialization) {
        log("create")

        this.level = Levels[config.level]
        this.beamResources = this.add.graphics()
        this.beamText = this.add.text(this.cameras.main.width + BEAM_LEFT_OFFSET - 80, BEAM_TOP, "BEAM:", {
            fill: "#ffffff",
            font: "22px Righteous"
        })

        this.registry.events.on("changedata", this.onDataUpdated.bind(this))

        this.drawBeamResources()
    }

    private drawBeamResources(amount: number = 1) {
        const left = this.cameras.main.width + BEAM_LEFT_OFFSET
        const top = BEAM_TOP
        const height = 24
        const width = 150
        const borderWidth = 2

        this.beamResources.clear()
        this.beamResources.fillStyle(BorderColor.color)
        this.beamResources.fillRect(
            left - borderWidth,
            top - borderWidth,
            width + borderWidth * 2,
            height + borderWidth * 2
        )
        this.beamResources.fillStyle(BeamResourceColor.color)
        this.beamResources.fillRect(left, top, width * amount, height)
    }

    private onDataUpdated(parent: any, key: string, data: any) {
        if (key === Data.BEAM_CURRENT) {
            const max: number = this.registry.get(Data.BEAM_MAX)
            this.drawBeamResources(data / max)
        }
    }
}
