import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.GameSettings}`)

export default class GameSettings extends Phaser.Scene {
    /**
     * The virtual controller that maps physical device actions into game actions.
     *
     * @private
     * @type {UnifiedController}
     * @memberof GameSettings
     */
    private controller: UnifiedController

    /**
     * Flag for special processing on the first update call of this scene.
     *
     * @private
     * @type {boolean}
     * @memberof GameSettings
     */
    private firstUpdate: boolean

    constructor(inKey: string = Scenes.GameSettings) {
        super({
            key: inKey
        })

        log("constructed")
    }

    public create() {
        this.setupSettingsMenus()

        this.controller = new UnifiedController(this.input)
        this.firstUpdate = true

        this.cameras.main.fadeIn(500, 0, 0, 0)
    }

    public update() {
        // NOTE(tristan): user will be pressing the settings key when we switch to this scene.
        // So we need to not register that and thus immediately close the settings menu.
        if (this.firstUpdate) {
            this.controller.settings!.setCurrentlyDown(true)
            this.firstUpdate = false
            return
        }

        if (this.controller.settings!.isUniquelyDown()) {
            log("resuming game scene")
            this.cameras.main.fade(500, 0, 0, 0)
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.stop(Scenes.GameSettings)
                this.scene.resume(Scenes.Game)
            })
        }

        if (this.controller.up!.isDown()) {
        }

        if (this.controller.down!.isDown()) {
        }

        if (this.controller.left!.isDown()) {
        }

        if (this.controller.right!.isDown()) {
        }

        if (this.controller.actionA!.isUniquelyDown()) {
        }
    }

    private setupSettingsMenus() {
        log("setting up settings menus")
        const cenX = this.cameras.main.centerX
        const cenY = this.cameras.main.centerY

        const musicVolume = this.add.graphics()
        musicVolume.fillStyle(0x222222, 0.8)
        musicVolume.fillRect(cenX, cenY - 270 / 2, 320, 50)
        this.add.text(cenX - 300, cenY - 270 / 2, "MUSIC VOLUME:", {
            fill: "#ffffff",
            font: "22px Righteous"
        })

        const fxVolume = this.add.graphics()
        fxVolume.fillStyle(0x222222, 0.8)
        fxVolume.fillRect(cenX, cenY - 160 / 2, 320, 50)
        this.add.text(cenX - 278, cenY - 160 / 2, "FX VOLUME:", {
            fill: "#ffffff",
            font: "22px Righteous"
        })

        const globalMute = this.add.graphics()
        globalMute.fillStyle(0x222222, 0.8)
        globalMute.fillRect(cenX + 270 / 2, cenY - 50 / 2, 50, 50)
        this.add.text(cenX - 250, cenY - 50 / 2, "MUTE:", {
            fill: "#ffffff",
            font: "22px Righteous"
        })
    }
}
