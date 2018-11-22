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
     * @type {Unified}
     * @memberof Game
     */
    private controller: UnifiedController

    private firstUpdate: boolean

    /**
     * The parent settings menu
     *
     * @private
     * @type {dat.GUI}
     * @memberof Game
     */
    private mainGUI?: dat.GUI

    /**
     * The sound settings menu
     *
     * @private
     * @type {dat.GUI}
     * @memberof Game
     */
    private soundSettings?: dat.GUI

    constructor(inKey: string = Scenes.GameSettings) {
        super({
            key: inKey
        })

        this.firstUpdate = true

        log("constructed")
    }

    public create() {
        this.mainGUI = new dat.GUI()
        this.setupSettingsMenus()

        this.controller = new UnifiedController(this.input)
    }

    public update() {
        // NOTE(tristan): user will be pressing the settings key when we enter this new scene.
        // So we need to not register that and immediately close the settings menu.
        // This takes advantage of the fact that scene constructors are called pretty much only once ever.
        if (this.firstUpdate && !this.controller.settings!.isDown()) {
            return
        } else if (this.firstUpdate && this.controller.settings!.isDown()) {
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
        log("showing settings menus")
        this.soundSettings = this.mainGUI!.addFolder("Sound Settings")
        this.soundSettings!.add(this.sound, "mute").listen()
        this.soundSettings!.add(this.sound, "volume", 0, 1).listen()
        this.soundSettings!.open()
    }

    private teardownSettingsMenus() {
        log("hiding settings menu")
        this.mainGUI!.removeFolder(this.soundSettings!)
        this.mainGUI!.destroy()
        this.mainGUI!.updateDisplay()
        this.scene.stop(Scenes.GameSettings)
        this.scene.resume(Scenes.Game)
    }
}
