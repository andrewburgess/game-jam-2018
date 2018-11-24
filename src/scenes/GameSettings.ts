import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { SoundGroup } from "../SoundGroup"

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

    private uiElements: Phaser.GameObjects.Graphics[]

    constructor(inKey: string = Scenes.GameSettings) {
        super({
            key: inKey
        })

        log("constructed")
    }

    public init(data: object) {
        this.fxSounds = data.fxSounds
        this.musicSounds = data.musicSounds
    }

    public create() {
        this.controller = new UnifiedController(this.input)
        this.firstUpdate = true

        this.cameras.main.fadeIn(500, 0, 0, 0)

        this.uiElements = new Array<Phaser.GameObjects.Graphics>()
        this.setupSettingsMenus()
        this.selectedElementIdx = 0
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

        for (const uiElement of this.uiElements) {
            uiElement.setAlpha(0.1)
        }

        // TODO(tristan): use these to select the UI element to change
        if (this.controller.up!.isUniquelyDown()) {
            this.selectedElementIdx = (this.selectedElementIdx - 1 + this.uiElements.length) % this.uiElements.length
            log(`now selected UI element: ${this.selectedElementIdx}`)
        }

        if (this.controller.down!.isUniquelyDown()) {
            this.selectedElementIdx = (this.selectedElementIdx + 1) % this.uiElements.length
            log(`now selected UI element: ${this.selectedElementIdx}`)
        }

        this.uiElements[this.selectedElementIdx].alpha = 1.0

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
        this.uiElements.push(musicVolumeSlider)
        this.events.on("musicVolumeChanged", (amount: number) => {
            this.musicSounds.setVolume(Phaser.Math.Clamp(this.musicSounds.getVolume() + amount, 0.0, 1.0))
            log(`music volume changed to: ${this.musicSounds.getVolume()}`)
            musicVolumeSlider.clear()
            musicVolumeSlider.fillStyle(0x222222, 0.8)
            musicVolumeSlider.fillRect(cenX, cenY - 270 / 2, 320, 50)
            musicVolumeSlider.fillStyle(0x00ff11, 0.8)
            musicVolumeSlider.fillRect(cenX, cenY - 270 / 2, 320 * this.musicSounds.getVolume(), 50)
            musicVolumeText.text = parseFloat(this.musicSounds.getVolume().toString()).toFixed(3)
        })

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
        this.uiElements.push(fxVolumeSlider)
        this.events.on("fxVolumeChanged", (amount: number) => {
            this.fxSounds.setVolume(Phaser.Math.Clamp(this.fxSounds.getVolume() + amount, 0.0, 1.0))
            log(`fx volume changed to: ${this.fxSounds.getVolume()}`)
            fxVolumeSlider.clear()
            fxVolumeSlider.fillStyle(0x222222, 0.8)
            fxVolumeSlider.fillRect(cenX, cenY - 160 / 2, 320, 50)
            fxVolumeSlider.fillStyle(0x00ff11, 0.8)
            fxVolumeSlider.fillRect(cenX, cenY - 160 / 2, 320 * this.fxSounds.getVolume(), 50)
            fxVolumeText.text = parseFloat(this.fxSounds.getVolume().toString()).toFixed(3)
        })

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
        this.uiElements.push(globalMuteCheckbox)
        this.events.on("globalMuteToggled", () => {
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
        })
    }
}
