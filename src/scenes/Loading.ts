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
                font: "20px monospace"
            },
            text: "Loading...",
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
        this.load.image(Assets.Background, Files.BACKGROUND)
        this.load.image(Assets.BlocksTest, Files.BLOCKS_TEST)
        this.load.image(Assets.MovementTest, Files.MOVEMENT_TEST)
        this.load.image(Assets.ParticleEngineThrust, Files.PARTICLE_ENGINE_THRUST)
        this.load.spritesheet(Assets.Player, Files.PLAYER, {
            frameHeight: 32,
            frameWidth: 40
        })
        this.load.image(Assets.Projectile, Files.PROJECTILE)
    }
}

export default Loading
