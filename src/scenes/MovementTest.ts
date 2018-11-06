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

class VirtualKey {
    private keyboard_button: Phaser.Input.Keyboard.Key | undefined
    private gamepad_button: Phaser.Input.Gamepad.Button | undefined
    private is_down: boolean
    private was_down: boolean

    constructor(keyboard_button: Phaser.Input.Keyboard.Key) {
        this.keyboard_button = keyboard_button
        this.is_down = false
        this.was_down = false
    }

    private poll() {
        var prev: boolean = this.is_down
        var cur: boolean = (this.keyboard_button == undefined ? false : this.keyboard_button.isDown) ||
            (this.gamepad_button == undefined ? false : this.gamepad_button.pressed)

        this.was_down = prev
        this.is_down = cur
    }

    public isDown() {
        this.poll()
        return this.is_down
    }

    public isUniquelyDown() {
        this.poll()
        return this.is_down && !this.was_down
    }

    public setGamepadButton(button: Phaser.Input.Gamepad.Button) {
        this.gamepad_button = button
    }
}

type GameController = {
    up?: VirtualKey
    down?: VirtualKey
    left?: VirtualKey
    right?: VirtualKey
    actionLB?: VirtualKey
    actionRB?: VirtualKey
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
            up: new VirtualKey(this.input.keyboard.addKey("W")),
            left: new VirtualKey(this.input.keyboard.addKey("A")),
            down: new VirtualKey(this.input.keyboard.addKey("S")),
            right: new VirtualKey(this.input.keyboard.addKey("D")),
            actionLB: new VirtualKey(this.input.keyboard.addKey("LEFT")),
            actionRB: new VirtualKey(this.input.keyboard.addKey("RIGHT"))
        }

        this.input.gamepad.once('down', (pad: Phaser.Input.Gamepad.Gamepad, button: Phaser.Input.Gamepad.Button, index: number) => {
            // TODO(tristan): some better way to do this other than guesstimating button indicies?
            // TODO(tristan): add gamepad axis range
            this.controller.up!.setGamepadButton(pad.buttons[12])
            this.controller.left!.setGamepadButton(pad.buttons[14])
            this.controller.down!.setGamepadButton(pad.buttons[13])
            this.controller.right!.setGamepadButton(pad.buttons[15])
            this.controller.actionLB!.setGamepadButton(pad.buttons[4])
            this.controller.actionRB!.setGamepadButton(pad.buttons[5])
        }, this);

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
        if (this.controller.left!.isDown()) {
            this.player.setAccelerationX(-1500)
        } else if (this.controller.right!.isDown()) {
            this.player.setAccelerationX(1500)
        } else {
            this.player.setAccelerationX(0)
        }

        if (this.controller.actionLB!.isUniquelyDown()) {
            var p_proj: Phaser.Physics.Arcade.Body = this.player_projectiles.create(this.player.x - this.player.width + 15, this.player.y - this.player.height, 'asset_player_projectile')
            p_proj.setVelocityY(-1050)
        }

        if (this.controller.actionRB!.isUniquelyDown()) {
            var p_proj: Phaser.Physics.Arcade.Body = this.player_projectiles.create(this.player.x + this.player.width - 15, this.player.y - this.player.height, 'asset_player_projectile')
            p_proj.setVelocityY(-1050)
        }
    }
}

export default MovementTest
