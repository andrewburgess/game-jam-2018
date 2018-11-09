import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"

import { Assets } from "../assets"
import { Beam } from "../entities/Beam"
import { Projectile } from "../entities/Projectile"

const log = debug("game:entities:Player")

export class Player extends Phaser.Physics.Arcade.Sprite {
    public projectiles: Phaser.Physics.Arcade.Group
    public beam: Beam
    private controller: UnifiedController

    constructor(scene: Phaser.Scene, x: number, y: number) {
        log("constructing")

        super(scene, x, y, Assets.Player)

        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)

        this.controller = new UnifiedController(this.scene.input)

        this.setScale(3)
        this.setMaxVelocity(550)
        this.setCollideWorldBounds(true)

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

        log("constructed")
    }

    public update(time: number, delta: number) {
        log("updating")

        const gunPosX: number = this.x + this.width - 15
        const gunPosY: number = this.y - this.height

        const beamPosX: number = this.x - this.width + 15
        const beamPosY: number = this.y - this.height

        if (this.controller.left!.isDown()) {
            this.setAccelerationX(this.controller.left!.getMagnitude() * -1500)
        } else if (this.controller.right!.isDown()) {
            this.setAccelerationX(this.controller.right!.getMagnitude() * 1500)
        } else {
            this.setAccelerationX(0)
        }

        if (this.controller.actionLB!.isUniquelyDown()) {
            this.beam = new Beam(this.scene, beamPosX, beamPosY)
        } else if (this.controller.actionLB!.isDown()) {
            this.beam.update(time, delta)
            this.beam.x = beamPosX
            this.beam.y = beamPosY
        } else if (this.beam) {
            this.beam.destroy()
        }

        if (this.controller.actionRB!.isUniquelyDown()) {
            const pProj: Projectile = new Projectile(this.scene, gunPosX, gunPosY)
            this.projectiles.add(pProj)
            pProj.setVelocityY(-1050)
        }

        log("updated")
    }

    public destroyProjectilesOnCollisionWith(boundary: Phaser.Physics.Arcade.Sprite) {
        this.scene.physics.add.overlap(
            this.projectiles,
            boundary,
            (collidedBoundary: Phaser.Physics.Arcade.Sprite, playerProjectile: Phaser.Physics.Arcade.Sprite) => {
                if (collidedBoundary.body.bottom >= playerProjectile.body.bottom) {
                    playerProjectile.destroy()
                }
            },
            undefined,
            this
        )
    }
}
