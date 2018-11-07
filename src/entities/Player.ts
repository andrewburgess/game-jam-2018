import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"

const log = debug("game:entities:Player")

export class Player extends Phaser.Physics.Arcade.Sprite {
    public projectiles: Phaser.Physics.Arcade.Group

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Assets.Player)

        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)

        this.setScale(3)
        this.setMaxVelocity(550)
        this.setCollideWorldBounds(true)
        this.body.onWorldBounds = true

        this.projectiles = this.scene.physics.add.group({})

        this.scene.add.particles(Assets.ParticleEngineThrust).createEmitter({
            angle: 90,
            blendMode: Phaser.BlendModes.ADD,
            follow: this,
            followOffset: { x: 10, y: 20 },
            lifespan: {
                onEmit: () => {
                    return Math.max(250, Phaser.Math.Percent(this.body.velocity.length(), 0, 300) * 1000)
                }
            },
            scale: { start: 0.25, end: 0.0 },
            speed: 100
        })

        this.scene.add.particles(Assets.ParticleEngineThrust).createEmitter({
            angle: 90,
            blendMode: Phaser.BlendModes.ADD,
            follow: this,
            followOffset: { x: -10, y: 20 },
            lifespan: {
                onEmit: () => {
                    return Math.max(250, Phaser.Math.Percent(this.body.velocity.length(), 0, 300) * 1000)
                }
            },
            scale: { start: 0.25, end: 0.0 },
            speed: 100
        })
    }

    public update(time: number, delta: number) {
        // TODO(tristan): player movement code via game input should likely belong to the player entity rather than the scene
        // Figure out how that should work. Do we need a wrapper around Phaser.Scene to extend?
    }
}
