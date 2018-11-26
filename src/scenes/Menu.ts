import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { Assets } from "../assets"
import { Data } from "../entities/Data"

import { Scenes } from "./"
import { IGameInitialization } from "./Game"

const log = debug(`game:scenes:${Scenes.Menu}`)

class Menu extends Phaser.Scene {
    /**
     * The virtual controller that maps physical device actions into game actions.
     *
     * @private
     * @type {UnifiedController}
     * @memberof Game
     */
    private controller: UnifiedController

    constructor() {
        super({
            key: Scenes.Menu
        })

        log("constructed")
    }

    public preload() {
        log("preload")
    }

    public create(data: any) {
        log("create", data)

        this.add.image(this.centerX(), this.centerY(), Assets.Title)
        const gameButton = this.add.image(0, 0, Assets.GameButton).setInteractive()

        this.add.container(this.centerX(), this.centerY() * 1.4, [gameButton])

        this.controller = new UnifiedController(this.input)

        const volumeSettingsRaw = window.localStorage.getItem(Data.VOLUME)
        const volumeSettings: VolumeSettings = {
            fxSounds: 1,
            musicSounds: 0.8,
            muted: false
        }
        if (volumeSettingsRaw) {
            const parsed = JSON.parse(volumeSettingsRaw) as VolumeSettings
            volumeSettings.fxSounds = parsed.fxSounds
            volumeSettings.musicSounds = parsed.musicSounds
            volumeSettings.muted = parsed.muted
        }

        const titleMusic = this.sound.add(Assets.MusicTitle, {
            loop: true,
            mute: volumeSettings.muted,
            volume: volumeSettings.musicSounds
        })

        titleMusic.play()

        this.events.once("destroy", () => titleMusic.stop())
        this.events.once("shutdown", () => titleMusic.stop())

        gameButton.once("pointerup", () => {
            this.startGame()
        })
    }

    public update() {
        if (this.controller.actionA!.isUniquelyDown()) {
            this.startGame()
        }
    }

    private startGame() {
        this.tweens.add({
            duration: 500,
            ease: "Linear",
            onComplete: () => {
                this.sound.stopAll()
            },
            targets: this.sound,
            volume: 0
        })
        this.cameras.main.fade(500, 0, 0, 0, true)
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start(Scenes.Game, {
                level: 1
            } as IGameInitialization)
            this.scene.start(Scenes.GameUI, {
                level: 1
            } as IGameInitialization)
        })
    }

    private centerX() {
        return this.cameras.main.width / 2
    }

    private centerY() {
        return this.cameras.main.height / 2
    }
}

export default Menu
