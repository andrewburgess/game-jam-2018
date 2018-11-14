import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"

import { Assets } from "../assets"
import { Beam } from "../entities/Beam"
import { Piece } from "../entities/Piece"
import { PROJECTILE_STANDARD_VELOCITY, Projectiles } from "../entities/Projectiles"

const log = debug("game:entities:Player")

const PLAYER_BEAM_STARTING_RESOURCES = 100
const PLAYER_MAX_VELOCITY = 550
const PLAYER_MOVEMENT_ACCELERATION_SCALE = 1500
const PLAYER_SCALE = 3

export class Player extends Phaser.GameObjects.Container {
    public beam: Beam
    public projectiles: Projectiles
    private controller: UnifiedController

    constructor(scene: Phaser.Scene, x: number, y: number) {
        log("constructing")

        const playerSprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, Assets.Player)
        playerSprite.setScale(PLAYER_SCALE)

        super(scene, x, y, [playerSprite])

        this.setSize(playerSprite.width * PLAYER_SCALE, playerSprite.height * PLAYER_SCALE)

        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)

        this.body.setMaxVelocity(PLAYER_MAX_VELOCITY)
        this.body.setCollideWorldBounds(true)

        // NOTE(tristan): I'm assuming that the follow directive is similar to adding the emmiters as
        // children of this container, but I don't know for sure
        scene.add.particles(Assets.ParticleEngineThrust).createEmitter({
            angle: 90,
            blendMode: Phaser.BlendModes.ADD,
            follow: this,
            followOffset: { x: -15, y: this.botEdgeYOffset() },
            lifespan: {
                onEmit: () => {
                    return Math.max(250, Phaser.Math.Percent(this.body.velocity.length(), 0, 300) * 1000)
                }
            },
            scale: { start: 0.25, end: 0.0 },
            speed: 100
        })

        scene.add.particles(Assets.ParticleEngineThrust).createEmitter({
            angle: 90,
            blendMode: Phaser.BlendModes.ADD,
            follow: this,
            followOffset: { x: 15, y: this.botEdgeYOffset() },
            lifespan: {
                onEmit: () => {
                    return Math.max(250, Phaser.Math.Percent(this.body.velocity.length(), 0, 300) * 1000)
                }
            },
            scale: { start: 0.25, end: 0.0 },
            speed: 100
        })

        // NOTE(tristan): We want the beam to always be offset relative to the player, so it's added as a child
        // to the player continer.
        // However, we don't want projectiles to always be offset relative to the player; we want
        // projectiles to always be fired starting at the position of the player and then let physics
        // take over from there.
        this.beam = new Beam(scene, 0, this.topEdgeYOffset(), PLAYER_BEAM_STARTING_RESOURCES)
        this.add(this.beam)
        this.controller = new UnifiedController(this.scene.input)
        this.projectiles = new Projectiles(scene, 20, this.topEdgeYOffset())

        log("constructed")
    }

    public update(time: number, delta: number, currentPiece?: Piece) {
        if (this.controller.left!.isDown()) {
            this.body.setAccelerationX(this.controller.left!.getMagnitude() * -PLAYER_MOVEMENT_ACCELERATION_SCALE)
        } else if (this.controller.right!.isDown()) {
            this.body.setAccelerationX(this.controller.right!.getMagnitude() * PLAYER_MOVEMENT_ACCELERATION_SCALE)
        } else {
            this.body.setAccelerationX(0)
        }

        let beamActiveAttempt: boolean = false
        if (this.controller.actionLB!.isDown()) {
            beamActiveAttempt = true
        }
        this.beam.update(time, delta, beamActiveAttempt, currentPiece!)

        if (this.controller.actionRB!.isUniquelyDown()) {
            this.projectiles.createProjectile(this.x, this.y, 0, PROJECTILE_STANDARD_VELOCITY)
        }
    }

    private topEdgeYOffset() {
        return -this.height / 2
    }

    private botEdgeYOffset() {
        return this.height / 2
    }
}
