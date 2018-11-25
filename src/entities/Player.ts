import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { Assets } from "../assets"
import Game from "../scenes/Game"

import { Beam } from "./Beam"
import { Piece } from "./Piece"
import { Projectiles } from "./Projectiles"

const log = debug("game:entities:Player")
const PLAYER_MAX_VELOCITY = 550
const PLAYER_MOVEMENT_ACCELERATION_SCALE = 1500
const PLAYER_PROJECTILES_STARTING_RESOURCES = 20

export class Player extends Phaser.GameObjects.Container {
    public beam: Beam
    public body: Phaser.Physics.Arcade.Body
    public projectiles: Projectiles
    private controller: UnifiedController
    private game: Game

    constructor(game: Game, x: number, y: number) {
        log("constructing")

        const playerSprite = new Phaser.Physics.Arcade.Image(game, 0, 0, Assets.Player)
        super(game, x, y)

        this.game = game

        this.setSize(100, 110)
        playerSprite.setDisplaySize(100, 110)

        this.game.physics.world.enable(this)
        this.game.add.existing(this)
        this.body.setAllowGravity(false)
        this.body.setAllowDrag(true)
        this.body.setDrag(500, 0)

        this.body.setMaxVelocity(PLAYER_MAX_VELOCITY)
        this.body.setCollideWorldBounds(true)

        const leftEngine = this.scene.add.particles(Assets.ParticleEngineThrust)
        leftEngine.createEmitter({
            angle: {
                onEmit: () => {
                    if (Math.abs(this.body.acceleration.x) > 0) {
                        return this.body.acceleration.x < 0 ? 0 : 180
                    }

                    return 90 - 90 * (this.body.velocity.x / PLAYER_MAX_VELOCITY)
                }
            },
            blendMode: Phaser.BlendModes.ADD,
            lifespan: {
                onEmit: () => {
                    return Math.max(250, Phaser.Math.Percent(this.body.velocity.length(), 0, 300) * 1000)
                }
            },
            scale: { start: 0.2, end: 0.0 },
            speed: {
                onEmit: () => {
                    if (Math.abs(this.body.acceleration.x) > 0) {
                        return 100
                    }

                    return Math.max(25, Math.abs(100 * (this.body.velocity.x / PLAYER_MAX_VELOCITY)))
                }
            },
            x: -30,
            y: 55
        })
        this.add(leftEngine)

        const rightEngine = this.scene.add.particles(Assets.ParticleEngineThrust)
        rightEngine.createEmitter({
            angle: {
                onEmit: () => {
                    if (Math.abs(this.body.acceleration.x) > 0) {
                        return this.body.acceleration.x < 0 ? 0 : 180
                    }

                    return 90 - 90 * (this.body.velocity.x / PLAYER_MAX_VELOCITY)
                }
            },
            blendMode: Phaser.BlendModes.ADD,
            lifespan: {
                onEmit: () => {
                    return Math.max(250, Phaser.Math.Percent(this.body.velocity.length(), 0, 300) * 1000)
                }
            },
            scale: { start: 0.2, end: 0.0 },
            speed: {
                onEmit: () => {
                    if (Math.abs(this.body.acceleration.x) > 0) {
                        return 100
                    }

                    return Math.max(25, Math.abs(100 * (this.body.velocity.x / PLAYER_MAX_VELOCITY)))
                }
            },
            x: 30,
            y: 55
        })
        this.add(rightEngine)

        // NOTE(tristan): We want the beam to always be offset relative to the player, so it's added as a child
        // to the player continer.
        // However, we don't want projectiles to always be offset relative to the player; we want
        // projectiles to always be fired starting at the position of the player and then let physics
        // take over from there.
        this.beam = new Beam(this.game, 0, this.topEdgeYOffset())
        this.controller = new UnifiedController(this.game.input)
        this.projectiles = new Projectiles(this.game, 0, this.topEdgeYOffset())
        this.add(this.beam)
        this.add(playerSprite)
        this.add(this.projectiles)

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

        if (!this.beam.isFiring() && this.controller.actionLB!.isUniquelyDown()) {
            this.beam.fire()
        } else if (this.beam.isFiring() && !this.controller.actionLB!.isDown()) {
            this.beam.stopFiring()
        }
        this.beam.update(time, delta)

        if (this.controller.actionRB!.isDown()) {
            this.projectiles.fire()
        }
        this.projectiles.update(time, delta)
    }

    private topEdgeYOffset() {
        return -this.height / 2
    }
}
