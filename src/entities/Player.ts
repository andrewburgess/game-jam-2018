import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"

import { Assets } from "../assets"
import { Beam } from "../entities/Beam"
import { Piece } from "../entities/Piece"
import { Projectiles } from "../entities/Projectiles"

const log = debug("game:entities:Player")

const PLAYER_BEAM_STARTING_RESOURCES = 5

export class Player extends Phaser.Physics.Arcade.Sprite {
    public beam: Beam
    public projectiles: Projectiles
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

        this.beam = new Beam(this.scene, this, PLAYER_BEAM_STARTING_RESOURCES)

        this.projectiles = new Projectiles(this.scene, this.width - 15, -this.height)

        log("constructed")
    }

    public update(time: number, delta: number, currentPiece?: Piece) {
        if (this.controller.left!.isDown()) {
            this.setAccelerationX(this.controller.left!.getMagnitude() * -1500)
        } else if (this.controller.right!.isDown()) {
            this.setAccelerationX(this.controller.right!.getMagnitude() * 1500)
        } else {
            this.setAccelerationX(0)
        }

        let beamActiveAttempt: boolean = false
        if (this.controller.actionLB!.isDown()) {
            beamActiveAttempt = true
        }
        this.beam.update(time, delta, beamActiveAttempt, currentPiece!)

        if (this.controller.actionRB!.isUniquelyDown()) {
            this.projectiles.createProjectile(this.x, this.y, 0, -1050)
        }
    }
}
