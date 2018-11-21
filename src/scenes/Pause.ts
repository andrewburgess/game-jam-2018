import { GUI } from "dat.gui"
import * as debug from "debug"
import * as Phaser from "phaser"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.Pause}`)

export default class Pause extends Phaser.Scene {
    /**
     * The settings menu
     *
     * @private
     * @type {dat.GUI}
     * @memberof Game
     */
    private gui: GUI

    constructor(inKey: string = Scenes.Pause) {
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

    public create() {
        this.gui = new GUI()

        this.setupSettingsMenu()

        this.input.once("pointerdown", () => {
            this.teardownSettingsMenu()
        })
    }

    private setupSettingsMenu() {
        log("showing settings menu")

        const soundSettings = this.gui.addFolder("Sound Settings")
        soundSettings.add(this.sound, "mute").listen()
        soundSettings.add(this.sound, "volume", 0, 1).listen()
        soundSettings.open()
    }

    private teardownSettingsMenu() {
        log("hiding settings menu")
        this.scene.stop(Scenes.Pause)
        this.scene.resume(Scenes.Game)
        this.gui.destroy()
    }
}
