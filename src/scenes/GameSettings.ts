import * as dat from "dat.gui"
import * as debug from "debug"
import { isUndefined } from "lodash"
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

    /**
     * The parent settings menu
     *
     * @private
     * @type {dat.GUI}
     * @memberof GameSettings
     */
    private mainGUI?: dat.GUI

    /**
     * The sound settings menu
     *
     * @private
     * @type {dat.GUI}
     * @memberof GameSettings
     */
    private soundSettings?: dat.GUI

    constructor(inKey: string = Scenes.GameSettings) {
        super({
            key: inKey
        })

        log("constructed")
    }

    public create() {
        // TODO(tristan): replace this with our own sliders and other gui entities!
        // Will need sliders for music and fx volumes, global mute
        this.mainGUI = new dat.GUI()
        this.setupSettingsMenus()

        this.controller = new UnifiedController(this.input)
        this.firstUpdate = true
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
            this.teardownSettingsMenus()
        }

        if (this.controller.up!.isDown()) {
            if (!isUndefined(this.soundSettings)) {
                this.sound.volume = Phaser.Math.Clamp(this.sound.volume + 0.01, 0.0, 1.0)
            }
        }

        if (this.controller.down!.isDown()) {
            if (!isUndefined(this.soundSettings)) {
                this.sound.volume = Phaser.Math.Clamp(this.sound.volume - 0.01, 0.0, 1.0)
            }
        }

        if (this.controller.actionRB!.isUniquelyDown()) {
            if (!isUndefined(this.soundSettings)) {
                this.sound.mute = !this.sound.mute
            }
        }
    }

    private setupSettingsMenus() {
        log("setting up settings menus")
        this.soundSettings = this.mainGUI!.addFolder("Sound Settings")
        this.soundSettings!.add(this.sound, "mute").listen()
        this.soundSettings!.add(this.sound, "volume", 0, 1).listen()
        this.soundSettings!.open()
    }

    private teardownSettingsMenus() {
        log("tearing down settings menus")
        this.mainGUI!.destroy()
        log("resuming game scene")
        this.scene.stop(Scenes.GameSettings)
        this.scene.resume(Scenes.Game)
    }
}
