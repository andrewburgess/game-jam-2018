import * as Debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { Assets } from "../assets"

import { Scenes } from "./"

const log = Debug(`game:scenes:${Scenes.MovementTest}`)

class MovementTest extends Phaser.Scene {
    private controller: UnifiedController
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

        this.controller = new UnifiedController(this.input)

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
