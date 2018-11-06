import * as debug from "debug"
import * as Phaser from "phaser"

// TODO(tristan): will need to review licensing stuff if any of these are actually to be used in submission
// NOTE(tristan): https://bit.ly/2pGYaak
import * as asset_background from "../assets/background.png"
// NOTE(tristan): https://bit.ly/2qsAQh5
import * as asset_player from "../assets/player.png"
// NOTE(tristan): https://bit.ly/2SQMZtt
import * as asset_player_projectile from "../assets/player_projectile.png"

const log = debug("game:scenes:movementTest")

// TODO(tristan): unify supported keyboard buttons and supported gamepad buttons to the same game actions
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
    private player_projectiles: Phaser.Physics.Arcade.Group
    private world_top: Phaser.Physics.Arcade.Sprite

    constructor() {
        log("constructing")

        super({
            key: "movementTest",
            physics: {
                arcade: {
                    debug: true,
                    gravity: { y: 100 }
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
        this.load.image("asset_player_projectile", asset_player_projectile)

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

        this.player = this.physics.add.sprite(midX, this.cameras.main.height, "asset_player")
        this.player.setScale(3)
        this.player.setMaxVelocity(550)
        this.player.setCollideWorldBounds(true)
        this.player.body.onWorldBounds = true

        // TODO(tristan): look into why the physics collision box requires an offset of 16 like this
        // Are the default collision box dimesnions for a blank sprite 16x16?
        this.world_top = this.physics.add.staticSprite(16, -16, 'world_top')
        this.world_top.setSize(this.physics.world.bounds.width, this.world_top.height)

        this.player_projectiles = this.physics.add.group({})
        this.physics.add.overlap(this.player_projectiles, this.world_top,
            function (world_top: Phaser.Physics.Arcade.Sprite, player_projectile: Phaser.Physics.Arcade.Sprite) {
                // NOTE(tristan): this assumes a static map. Once projectiles leave the visible screen, they are gone forever
                if (world_top.body.bottom >= player_projectile.body.bottom) {
                    player_projectile.destroy()
                }
            }, undefined, this)

        log("created")
    }

    public update(time, delta) {
        if (this.controller.left!.isDown) {
            this.player.setAccelerationX(-1500)
        } else if (this.controller.right!.isDown) {
            this.player.setAccelerationX(1500)
        } else {
            this.player.setAccelerationX(0)
        }

        if (Phaser.Input.Keyboard.JustDown(this.controller.actionA!)) {
            var p_proj: Phaser.Physics.Arcade.Body = this.player_projectiles.create(this.player.x - this.player.width + 15, this.player.y - this.player.height, 'asset_player_projectile')
            p_proj.setVelocityY(-1050)
            p_proj.onWorldBounds = true
        }

        if (Phaser.Input.Keyboard.JustDown(this.controller.actionB!)) {
            var p_proj: Phaser.Physics.Arcade.Body = this.player_projectiles.create(this.player.x + this.player.width - 15, this.player.y - this.player.height, 'asset_player_projectile')
            p_proj.setVelocityY(-1050)
        }
    }
}

export default MovementTest
