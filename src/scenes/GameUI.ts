import * as debug from "debug"
import * as Phaser from "phaser"

import { Data } from "../entities/Data"
import { ILevel, Levels } from "../levels"

import { Scenes } from "./"
import { IGameInitialization } from "./Game"

const log = debug(`game:scenes:${Scenes.GameUI}`)

const AMMO_TOP = 48
const BorderColor = Phaser.Display.Color.HexStringToColor("#302828")
const BeamResourceColor = Phaser.Display.Color.HexStringToColor("#741a7a")
const BEAM_TOP = 16
const UI_X_OFFSET = -180

export default class GameUI extends Phaser.Scene {
    private ammoText: Phaser.GameObjects.Text
    private beamResources: Phaser.GameObjects.Graphics
    private budgetLabelText: Phaser.GameObjects.Text
    private budgetText: Phaser.GameObjects.Text
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
        this.add.text(this.cameras.main.width + UI_X_OFFSET - 80, BEAM_TOP, "BEAM:", {
            fill: "#ffffff",
            font: "22px Righteous"
        })
        this.ammoText = this.add.text(
            this.cameras.main.width + UI_X_OFFSET - 80,
            AMMO_TOP,
            `AMMO: ${this.level.ammo.maximum} / ${this.level.ammo.maximum}`,
            {
                fill: "#ffffff",
                font: "22px Righteous"
            }
        )
        this.budgetLabelText = this.add
            .text(0, BEAM_TOP, "BUDGET", {
                fill: "#ffffff",
                font: "24px Righteous"
            })
            .setAlign("center")

        this.budgetLabelText.setPosition(
            this.cameras.main.centerX - this.budgetLabelText.width / 2,
            this.budgetLabelText.y
        )

        this.budgetText = this.add
            .text(this.cameras.main.centerX, BEAM_TOP + 24, `$${this.level.budget}`, {
                fill: "#ffffff",
                font: "48px Righteous"
            })
            .setAlign("center")

        this.budgetText.setPosition(this.cameras.main.centerX - this.budgetText.width / 2, this.budgetText.y)

        this.registry.events.on("changedata", this.onDataUpdated.bind(this))

        this.drawBeamResources()
    }

    private drawBeamResources(amount: number = 1) {
        const left = this.cameras.main.width + UI_X_OFFSET
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
        if (key === Data.AMMO_CURRENT) {
            this.ammoText.setText(`AMMO: ${data} / ${this.level.ammo.maximum}`)
        } else if (key === Data.BEAM_CURRENT) {
            const max: number = this.registry.get(Data.BEAM_MAX)
            this.drawBeamResources(data / max)
        } else if (key === Data.BUDGET) {
            this.budgetText.setText(`${data < 0 ? "-" : ""}$${data}`)
            this.budgetText.setPosition(this.cameras.main.centerX - this.budgetText.width / 2, this.budgetText.y)

            if (data < 0) {
                this.budgetText.setFill("#ff0000")
            }
        }
    }
}
