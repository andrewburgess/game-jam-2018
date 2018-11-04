import * as debug from "debug"
import * as Phaser from "phaser"

// TODO:(tristan) will need to review licensing stuff if any of these are actually to be used in submission
// NOTE:(tristan) https://bit.ly/2pGYaak
import * as asset_background from "../assets/background.png"
// NOTE:(tristan) https://bit.ly/2qsAQh5
import * as asset_player from "../assets/player.png"

const log = debug("game:scenes:movementTest")

// TODO:(tristan) unify supported keyboard buttons and supported gamepad buttons to the same game actions
type GameController = {
   up?: Phaser.Input.Keyboard.Key
   down?: Phaser.Input.Keyboard.Key
   left?: Phaser.Input.Keyboard.Key
   right?: Phaser.Input.Keyboard.Key
   actionA?: Phaser.Input.Keyboard.Key
   actionB?: Phaser.Input.Keyboard.Key
}

class MovementTest extends Phaser.Scene {
    private controller: GameController
    private player: Phaser.Physics.Arcade.Sprite

    constructor() {
        log("constructing")

        super({
            key: "movementTest",
            physics: {
                arcade: {
                    debug: true,
                    gravity: { y: 300 }
                }
            }
        })

        log("constructed")
    }

    public preload() {
        log("preloading")

        this.load.image("asset_background", asset_background)
        this.load.spritesheet("asset_player", asset_player, {
            frameWidth: 40,
            frameHeight: 32
        })

        log("preloaded")
    }

    public create() {
        log("creating")

        const midX = this.cameras.main.width / 2
        const midY = this.cameras.main.height / 2

        this.controller = {
            up: this.input.keyboard.addKey("W"),
            down: this.input.keyboard.addKey("S"),
            left: this.input.keyboard.addKey("A"),
            right: this.input.keyboard.addKey("D"),
            actionA: this.input.keyboard.addKey("LEFT"),
            actionB: this.input.keyboard.addKey("RIGHT"),
        }

        this.add.image(midX, midY, "asset_background")

        this.player = this.physics.add.sprite(midX, midY + 100, "asset_player")
        this.player.setScale(3)
        this.player.setBounce(0.2).setCollideWorldBounds(true)

        log("created")
    }

    public update() {
        
    }
}

export default MovementTest
