import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"

import { Scenes } from "./"

const log = debug(`game:scenes:${Scenes.MovementTest}`)

class GamepadAxisRange {
    private axis: Phaser.Input.Gamepad.Axis
    private comparator: string
    private threshold: number
    private value: number

    constructor(axis: Phaser.Input.Gamepad.Axis, comparator: string, threshold: number) {
        this.axis = axis
        this.comparator = comparator
        this.threshold = threshold
        this.value = 0.0
    }

    public getMagnitude() {
        this.poll()
        return Math.abs(this.value)
    }

    public valueInRange() {
        this.poll()

        let inRange: boolean = false

        switch (this.comparator) {
            case "lt": {
                inRange = this.value < this.threshold
                break
            }
            case "gt": {
                inRange = this.value > this.threshold
                break
            }
            case "le": {
                inRange = this.value <= this.threshold
                break
            }
            case "ge": {
                inRange = this.value >= this.threshold
                break
            }
            case "eq": {
                inRange = this.value === this.threshold
                break
            }
            case "ne": {
                inRange = this.value !== this.threshold
                break
            }
        }

        return inRange
    }

    private poll() {
        this.value = this.axis.getValue()
    }
}

class VirtualKey {
    private curDownState: boolean
    private gamepadButton: Phaser.Input.Gamepad.Button | undefined
    private gamepadAxisRange: GamepadAxisRange | undefined
    private keyboardButton: Phaser.Input.Keyboard.Key | undefined
    private magnitude: number
    private prevDownState: boolean

    constructor(keyboardButton: Phaser.Input.Keyboard.Key) {
        this.keyboardButton = keyboardButton
        this.curDownState = false
        this.prevDownState = false
        this.magnitude = 0.0
    }

    public getMagnitude() {
        this.poll()
        return this.magnitude
    }

    public isDown() {
        this.poll()
        return this.curDownState
    }

    public isUniquelyDown() {
        this.poll()
        return this.curDownState && !this.prevDownState
    }

    public setGamepadButton(button: Phaser.Input.Gamepad.Button) {
        this.gamepadButton = button
    }

    public setGamepadAxisRange(axis: Phaser.Input.Gamepad.Axis, comparator: string, threshold: number) {
        this.gamepadAxisRange = new GamepadAxisRange(axis, comparator, threshold)
    }

    private poll() {
        const kbdButtonIsDown: boolean = this.keyboardButton === undefined ? false : this.keyboardButton.isDown
        const gpadButtonIsDown: boolean = this.gamepadButton === undefined ? false : this.gamepadButton.pressed
        const gpadStickIsDown: boolean =
            this.gamepadAxisRange === undefined ? false : this.gamepadAxisRange.valueInRange()

        const prev: boolean = this.curDownState
        const cur: boolean = kbdButtonIsDown || gpadButtonIsDown || gpadStickIsDown

        this.prevDownState = prev
        this.curDownState = cur

        if (gpadStickIsDown) {
            this.magnitude = this.gamepadAxisRange!.getMagnitude()
        } else if (this.isDown) {
            this.magnitude = 1.0
        } else {
            this.magnitude = 0.0
        }
    }
}

interface IGameController {
    up?: VirtualKey
    down?: VirtualKey
    left?: VirtualKey
    right?: VirtualKey
    actionLB?: VirtualKey
    actionRB?: VirtualKey
}

class MovementTest extends Phaser.Scene {
    private controller: IGameController
    private player: Phaser.Physics.Arcade.Sprite
    private playerProjectiles: Phaser.Physics.Arcade.Group
    private worldTop: Phaser.Physics.Arcade.Sprite

    constructor() {
        log("constructing")

        super({
            key: Scenes.MovementTest,
            physics: {
                arcade: {
                    debug: true,
                    gravity: { y: 100 }
                }
            }
        })

        log("constructed")
    }

    public create() {
        log("creating")

        const midX = this.cameras.main.width / 2
        const midY = this.cameras.main.height / 2

        this.controller = {
            actionLB: new VirtualKey(this.input.keyboard.addKey("LEFT")),
            actionRB: new VirtualKey(this.input.keyboard.addKey("RIGHT")),
            down: new VirtualKey(this.input.keyboard.addKey("S")),
            left: new VirtualKey(this.input.keyboard.addKey("A")),
            right: new VirtualKey(this.input.keyboard.addKey("D")),
            up: new VirtualKey(this.input.keyboard.addKey("W"))
        }

        this.input.gamepad.once(
            "down",
            (pad: Phaser.Input.Gamepad.Gamepad, button: Phaser.Input.Gamepad.Button, index: number) => {
                // TODO(tristan): some better way to do this other than guesstimating button indicies?
                this.controller.actionLB!.setGamepadButton(pad.buttons[4])
                this.controller.actionRB!.setGamepadButton(pad.buttons[5])
                this.controller.down!.setGamepadButton(pad.buttons[13])
                this.controller.down!.setGamepadAxisRange(pad.axes[1], "gt", 0)
                this.controller.left!.setGamepadButton(pad.buttons[14])
                this.controller.left!.setGamepadAxisRange(pad.axes[0], "lt", 0)
                this.controller.right!.setGamepadButton(pad.buttons[15])
                this.controller.right!.setGamepadAxisRange(pad.axes[0], "gt", 0)
                this.controller.up!.setGamepadButton(pad.buttons[12])
                this.controller.up!.setGamepadAxisRange(pad.axes[1], "lt", 0)
            },
            this
        )

        this.add.image(midX, midY, Assets.Background)

        this.player = this.physics.add.sprite(midX, this.cameras.main.height, Assets.Player)
        this.player.setScale(3)
        this.player.setMaxVelocity(550)
        this.player.setCollideWorldBounds(true)
        this.player.body.onWorldBounds = true

        // TODO(tristan): look into why the physics collision box requires an offset of 16 like this
        // Are the default collision box dimesnions for a blank sprite 16x16?
        this.worldTop = this.physics.add.staticSprite(16, -16, "world_top")
        this.worldTop.setSize(this.physics.world.bounds.width, this.worldTop.height)

        this.playerProjectiles = this.physics.add.group({})
        this.physics.add.overlap(
            this.playerProjectiles,
            this.worldTop,
            (worldTop: Phaser.Physics.Arcade.Sprite, playerProjectile: Phaser.Physics.Arcade.Sprite) => {
                // NOTE(tristan): this assumes a static map. Once projectiles leave the visible screen, they are gone forever
                if (worldTop.body.bottom >= playerProjectile.body.bottom) {
                    playerProjectile.destroy()
                }
            },
            undefined,
            this
        )

        this.add.particles(Assets.ParticleEngineThrust).createEmitter({
            angle: 90,
            blendMode: Phaser.BlendModes.ADD,
            follow: this.player,
            followOffset: { x: 10, y: 20 },
            lifespan: {
                onEmit: () => {
                    return Math.max(250, Phaser.Math.Percent(this.player.body.velocity.length(), 0, 300) * 1000)
                }
            },
            scale: { start: 0.25, end: 0.0 },
            speed: 100
        })

        this.add.particles(Assets.ParticleEngineThrust).createEmitter({
            angle: 90,
            blendMode: Phaser.BlendModes.ADD,
            follow: this.player,
            followOffset: { x: -10, y: 20 },
            lifespan: {
                onEmit: () => {
                    return Math.max(250, Phaser.Math.Percent(this.player.body.velocity.length(), 0, 300) * 1000)
                }
            },
            scale: { start: 0.25, end: 0.0 },
            speed: 100
        })

        log("created")
    }

    public update(time: number, delta: number) {
        if (this.controller.left!.isDown()) {
            // TODO(tristan): particle stream out of left engine
            this.player.setAccelerationX(this.controller.left!.getMagnitude() * -1500)
        } else if (this.controller.right!.isDown()) {
            // TODO(tristan): particle stream out of right engine
            this.player.setAccelerationX(this.controller.right!.getMagnitude() * 1500)
        } else {
            this.player.setAccelerationX(0)
        }

        if (this.controller.actionLB!.isUniquelyDown()) {
            const pProj: Phaser.Physics.Arcade.Body = this.playerProjectiles.create(
                this.player.x - this.player.width + 15,
                this.player.y - this.player.height,
                Assets.Projectile
            )
            pProj.setVelocityY(-1050)
        }

        if (this.controller.actionRB!.isUniquelyDown()) {
            const pProj: Phaser.Physics.Arcade.Body = this.playerProjectiles.create(
                this.player.x + this.player.width - 15,
                this.player.y - this.player.height,
                Assets.Projectile
            )
            pProj.setVelocityY(-1050)
        }
    }
}

export default MovementTest
