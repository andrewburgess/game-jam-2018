import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { SoundGroup } from "../SoundGroup"
import { Data } from "../entities/Data"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.GameSettings}`)

export default class GameSettings extends Phaser.Scene {
    public fxSounds: SoundGroup
    public musicSounds: SoundGroup

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

    private selectedElementIdx: integer

    private shutdown: boolean

    private uiElements: Array<[Phaser.GameObjects.Graphics, Phaser.GameObjects.Text]>

    constructor(inKey: string = Scenes.GameSettings) {
        super({
            key: inKey
        })

        log("constructed")
    }

    public init(data: any) {
        this.fxSounds = data.fxSounds
        this.musicSounds = data.musicSounds
    }

    public create() {
        this.controller = new UnifiedController(this.input)
        this.firstUpdate = true

        this.cameras.main.fadeIn(150, 0, 0, 0)

        this.uiElements = new Array<[Phaser.GameObjects.Graphics, Phaser.GameObjects.Text]>()
        this.setupSettingsMenus()
        this.selectedElementIdx = 0

        this.shutdown = false
        this.events.once("destroy", this.cleanup, this)
        this.events.once("shutdown", this.cleanup, this)
    }

    public update() {
        // NOTE(tristan): Try to ensure that if Phaser were to be processing another update
        // cycle simultaneously with event cleanup and scene shutdown, the update would not
        // emit any more events. Further events emmitted at that time could cause event listener code
        // to attempt operations on destroyed objects and cause badness.
        if (this.shutdown) {
            return
        }

        // NOTE(tristan): user will be pressing the settings key when we switch to this scene.
        // So we need to not register that and thus immediately close the settings menu.
        if (this.firstUpdate) {
            this.controller.settings!.setCurrentlyDown(true)
            this.firstUpdate = false
            return
        }

        if (this.controller.settings!.isUniquelyDown()) {
            log("resuming game scene")
            this.cameras.main.fade(150, 0, 0, 0)
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.stop(Scenes.GameSettings)
                this.scene.resume(Scenes.Game)
            })
        }

        for (const uiElement of this.uiElements) {
            uiElement[0].setAlpha(0.1)
        }

        if (this.controller.up!.isUniquelyDown()) {
            this.selectedElementIdx = (this.selectedElementIdx - 1 + this.uiElements.length) % this.uiElements.length
            log(`now selected UI element: ${this.selectedElementIdx}`)
        }

        if (this.controller.down!.isUniquelyDown()) {
            this.selectedElementIdx = (this.selectedElementIdx + 1) % this.uiElements.length
            log(`now selected UI element: ${this.selectedElementIdx}`)
        }

        this.uiElements[this.selectedElementIdx][0].alpha = 1.0

        if (this.controller.left!.isDown()) {
            if (this.selectedElementIdx === 0) {
                this.events.emit("musicVolumeChanged", -0.005)
            } else if (this.selectedElementIdx === 1) {
                this.events.emit("fxVolumeChanged", -0.005)
            }
        }

        if (this.controller.right!.isDown()) {
            if (this.selectedElementIdx === 0) {
                this.events.emit("musicVolumeChanged", 0.005)
            } else if (this.selectedElementIdx === 1) {
                this.events.emit("fxVolumeChanged", 0.005)
            }
        }

        if (this.controller.actionA!.isUniquelyDown()) {
            if (this.selectedElementIdx === 2) {
                this.events.emit("globalMuteToggled")
            }
        }
    }

    private cleanup() {
        this.shutdown = true
        this.events.off("destroy", this.cleanup, this, true)
        this.events.off("fxVolumeChanged", this.onFxVolumeChanged, this, false)
        this.events.off("globalMuteToggled", this.onGlobalMuteToggled, this, false)
        this.events.off("musicVolumeChanged", this.onMusicVolumeChanged, this, false)
        this.events.off("shutdown", this.cleanup, this, true)
    }

    private onFxVolumeChanged(amount: number) {
        const cenX = this.cameras.main.centerX
        const cenY = this.cameras.main.centerY
        const fxVolumeSlider = this.uiElements[1][0]
        const fxVolumeText = this.uiElements[1][1]

        this.fxSounds.setVolume(Phaser.Math.Clamp(this.fxSounds.getVolume() + amount, 0.0, 1.0))

        log(`fx volume changed to: ${this.fxSounds.getVolume()}`)

        fxVolumeSlider.clear()
        fxVolumeSlider.fillStyle(0x222222, 0.8)
        fxVolumeSlider.fillRect(cenX, cenY - 160 / 2, 320, 50)
        fxVolumeSlider.fillStyle(0x00ff11, 0.8)
        fxVolumeSlider.fillRect(cenX, cenY - 160 / 2, 320 * this.fxSounds.getVolume(), 50)

        fxVolumeText.text = parseFloat(this.fxSounds.getVolume().toString()).toFixed(3)

        this.storeVolume()
    }

    private onGlobalMuteToggled() {
        const cenX = this.cameras.main.centerX
        const cenY = this.cameras.main.centerY
        const globalMuteCheckbox = this.uiElements[2][0]
        const globalMuteText = this.uiElements[2][1]

        this.fxSounds.toggleMuted()
        this.musicSounds.toggleMuted()
        const globalMuteUpdated = this.fxSounds.isMuted() && this.musicSounds.isMuted()

        log(`global mute changed to: ${globalMuteUpdated}`)

        globalMuteCheckbox.clear()
        globalMuteCheckbox.fillStyle(0x222222, 0.8)
        globalMuteCheckbox.fillRect(cenX + 270 / 2, cenY - 50 / 2, 50, 50)
        if (globalMuteUpdated) {
            globalMuteCheckbox.fillStyle(0x00ff11, 0.8)
            globalMuteCheckbox.fillRect(cenX + 270 / 2, cenY - 50 / 2, 50, 50)
        } else {
            globalMuteCheckbox.fillStyle(0x222222, 0.8)
            globalMuteCheckbox.fillRect(cenX + 270 / 2, cenY - 50 / 2, 50, 50)
        }

        globalMuteText.text = globalMuteUpdated ? "true" : "false"

        this.storeVolume()
    }

    private onMusicVolumeChanged(amount: number) {
        const cenX = this.cameras.main.centerX
        const cenY = this.cameras.main.centerY
        const musicVolumeSlider = this.uiElements[0][0]
        const musicVolumeText = this.uiElements[0][1]

        this.musicSounds.setVolume(Phaser.Math.Clamp(this.musicSounds.getVolume() + amount, 0.0, 1.0))

        log(`music volume changed to: ${this.musicSounds.getVolume()}`)

        musicVolumeSlider.clear()
        musicVolumeSlider.fillStyle(0x222222, 0.8)
        musicVolumeSlider.fillRect(cenX, cenY - 270 / 2, 320, 50)
        musicVolumeSlider.fillStyle(0x00ff11, 0.8)
        musicVolumeSlider.fillRect(cenX, cenY - 270 / 2, 320 * this.musicSounds.getVolume(), 50)

        musicVolumeText.text = parseFloat(this.musicSounds.getVolume().toString()).toFixed(3)

        this.storeVolume()
    }

    private setupSettingsMenus() {
        log("setting up settings menus")
        const cenX = this.cameras.main.centerX
        const cenY = this.cameras.main.centerY

        const musicVolumeSlider = this.add.graphics()
        musicVolumeSlider.fillStyle(0x222222, 0.8)
        musicVolumeSlider.fillRect(cenX, cenY - 270 / 2, 320, 50)
        musicVolumeSlider.fillStyle(0x00ff11, 0.8)
        musicVolumeSlider.fillRect(cenX, cenY - 270 / 2, 320 * this.musicSounds.getVolume(), 50)
        this.add.text(cenX - 300, cenY - 250 / 2, "MUSIC VOLUME:", {
            fill: "#ffffff",
            font: "22px Righteous"
        })
        const musicVolumeText = this.add.text(
            cenX + 380 / 2,
            cenY - 250 / 2,
            parseFloat(this.musicSounds.getVolume().toString()).toFixed(3),
            {
                fill: "#ffffff",
                font: "22px Righteous"
            }
        )
        this.uiElements.push([musicVolumeSlider, musicVolumeText])
        this.events.on("musicVolumeChanged", this.onMusicVolumeChanged, this)

        const fxVolumeSlider = this.add.graphics()
        fxVolumeSlider.fillStyle(0x222222, 0.8)
        fxVolumeSlider.fillRect(cenX, cenY - 160 / 2, 320, 50)
        fxVolumeSlider.fillStyle(0x00ff11, 0.8)
        fxVolumeSlider.fillRect(cenX, cenY - 160 / 2, 320 * this.fxSounds.getVolume(), 50)
        this.add.text(cenX - 278, cenY - 140 / 2, "FX VOLUME:", {
            fill: "#ffffff",
            font: "22px Righteous"
        })
        const fxVolumeText = this.add.text(
            cenX + 380 / 2,
            cenY - 140 / 2,
            parseFloat(this.fxSounds.getVolume().toString()).toFixed(3),
            {
                fill: "#ffffff",
                font: "22px Righteous"
            }
        )
        this.uiElements.push([fxVolumeSlider, fxVolumeText])
        this.events.on("fxVolumeChanged", this.onFxVolumeChanged, this)

        const globalMuteCheckbox = this.add.graphics()
        globalMuteCheckbox.fillStyle(0x222222, 0.8)
        globalMuteCheckbox.fillRect(cenX + 270 / 2, cenY - 50 / 2, 50, 50)
        globalMuteCheckbox.fillStyle(0x00ff11, 0.8)
        const globalMuteInitial = this.fxSounds.isMuted() && this.musicSounds.isMuted()
        globalMuteCheckbox.fillRect(cenX + 270 / 2, cenY - 50 / 2, 50 * (globalMuteInitial ? 1 : 0), 50)
        this.add.text(cenX - 250, cenY - 25 / 2, "MUTE:", {
            fill: "#ffffff",
            font: "22px Righteous"
        })
        const globalMuteText = this.add.text(cenX + 380 / 2, cenY - 25 / 2, globalMuteInitial ? "true" : "false", {
            fill: "#ffffff",
            font: "22px Righteous"
        })
        this.uiElements.push([globalMuteCheckbox, globalMuteText])
        this.events.on("globalMuteToggled", this.onGlobalMuteToggled, this)
    }

    private storeVolume() {
        const volume: VolumeSettings = {
            fxSounds: Phaser.Math.RoundTo(this.fxSounds.getVolume(), -3),
            musicSounds: Phaser.Math.RoundTo(this.musicSounds.getVolume(), -3),
            muted: this.fxSounds.isMuted() && this.musicSounds.isMuted()
        }

        window.localStorage.setItem(Data.VOLUME, JSON.stringify(volume))
    }
}
