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
            key: inKey,
            physics: {
                arcade: {
                    debug: !!window.localStorage.debug,
                    gravity: { y: 300 }
                }
            }
        })

        log("constructed")
    }

    // TODO(tristan): current settings screen jankiness issues enumerated
    // If I toggle the settings scene with the keyboard, then launch the settings scene with the mouse, I get a number of settings GUIs showing equal to the number of toggles triggered by the keyboard.
    // If I create a new field for this.sound.detune and update that based on player input, it seems to work well. If I do the same for volume and mute, it doesn't work at all on Firefox, but sort of works on Edge???
    // The first time toggling the settings screen with the game pad, it immediately closes. Thereafter, it will open as expected.
    // If I click on the settings button with the mouse with the intention to close the open settings screen, it will close and then immediately reopen (because of how I'm currently doing pointerup/down detection)

    public create() {
        this.controller = new UnifiedController(this.input)
        this.mainGUI = new dat.GUI()

        this.setupSettingsMenus()

        this.input.once("pointerdown", () => {
            this.teardownSettingsMenus()
        })
    }

    public update() {
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
        this.mainGUI!.destroy()
        this.scene.stop(Scenes.GameSettings)
        this.scene.resume(Scenes.Game)
    }
}
