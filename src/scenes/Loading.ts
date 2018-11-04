import * as debug from "debug"
import * as Phaser from "phaser"

const log = debug("game:scenes:loading")

class Loading extends Phaser.Scene {
    private loadInterval: number

    constructor() {
        super({
            key: "loading"
        })

        log("constructed")
    }

    public preload() {
        log("preload")

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

        let progress = 0
        this.loadInterval = window.setInterval(() => {
            log("load progress")
            progress++
            progressBar.clear()
            progressBar.fillStyle(0xffffff, 1)
            progressBar.fillRect(width / 2 - 300 / 2, height / 2 - 250 / 2, 300 * (progress / 5), 30)
        }, 1000)

        this.sys.events.once("shutdown", () => {
            log("sys.shutdown")
            progressBar.destroy()
            progressBox.destroy()
            loadingText.destroy()

            window.clearInterval(this.loadInterval)
        })
    }

    public create() {
        log("create")

        window.setTimeout(() => {
            this.scene.start("menu", { testing: true })
        }, 5800)
    }

    public update() {}
}

export default Loading
