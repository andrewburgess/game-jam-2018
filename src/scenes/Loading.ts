import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets, Files } from "../assets"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.Loading}`)

class Loading extends Phaser.Scene {
    constructor() {
        super({
            key: Scenes.Loading
        })

        log("constructed")
    }

    public preload() {
        log("preload")

        this.createProgressBar()
        this.loadAssets()

        this.load.once("complete", () => {
            this.scene.start(Scenes.Menu)
        })
    }

    private createProgressBar() {
        const progressBar = this.add.graphics()
        const progressBox = this.add.graphics()

        progressBox.fillStyle(0x222222, 0.8)

        const width = this.cameras.main.width
        const height = this.cameras.main.height

        progressBox.fillRect(width / 2 - 320 / 2, height / 2 - 270 / 2, 320, 50)

        const loadingText = this.make.text({
            style: {
                fill: "#ffffff",
                font: "28px Righteous"
            },
            text: "LOADING",
            x: width / 2,
            y: height / 2 - 50
        })
        loadingText.setOrigin(0.5, 0.5)

        const updateProgress = (progress: number) => {
            log(`load progress: ${progress}`)
            progressBar.clear()
            progressBar.fillStyle(0xffffff, 1)
            progressBar.fillRect(width / 2 - 300 / 2, height / 2 - 250 / 2, 300 * progress, 30)
        }

        this.load.on("progress", updateProgress)
        this.load.once("complete", () => {
            this.load.off("progress", updateProgress, null, false)
        })
    }

    private loadAssets() {
        this.load.audio(Assets.FxBeamActivated, [Files.FX_BEAM_ACTIVATED_OGG, Files.FX_BEAM_ACTIVATED_WAV])
        this.load.audio(Assets.FxBeamBeamingPiece, [Files.FX_BEAM_BEAMING_PIECE_OGG, Files.FX_BEAM_BEAMING_PIECE_WAV])
        this.load.audio(Assets.FxPieceHit, [Files.FX_PIECE_HIT_OGG, Files.FX_PIECE_HIT_MP3])
        this.load.audio(Assets.FxProjectileFired, [Files.FX_PROJECTILE_FIRED_OGG, Files.FX_PROJECTILE_FIRED_MP3])
        this.load.audio(Assets.MusicTitle, [Files.MUSIC_TITLE_OGG, Files.MUSIC_TITLE_MP3])
        this.load.audio(Assets.Music01, [Files.MUSIC_01_OGG, Files.MUSIC_01_MP3])
        this.load.audio(Assets.Music02, [Files.MUSIC_02_OGG, Files.MUSIC_02_MP3])
        this.load.image(Assets.Background, Files.BACKGROUND)
        this.load.image(Assets.ButtonBackground, Files.BUTTON_BACKGROUND)
        this.load.image(Assets.LevelStartBackground, Files.LEVEL_START_BACKGROUND)
        this.load.image(Assets.ParticleEngineThrust, Files.PARTICLE_ENGINE_THRUST)
        this.load.image(Assets.Platform, Files.PLATFORM)
        this.load.image(Assets.Title, Files.TITLE)
        this.load.spritesheet(Assets.Beam, Files.BEAM, {
            frameHeight: 682,
            frameWidth: 64
        })
        this.load.spritesheet(Assets.Blocks, Files.BLOCKS, {
            frameHeight: 64,
            frameWidth: 64
        })
        this.load.image(Assets.Player, Files.PLAYER)
        this.load.image(Assets.Projectile, Files.PROJECTILE)
    }
}

export default Loading
