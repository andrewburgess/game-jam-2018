import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"
import { Assets } from "../assets"
import Game from "../scenes/Game"

import { Beam } from "./Beam"
import { Piece } from "./Piece"
import { PROJECTILE_STANDARD_VELOCITY, Projectiles } from "./Projectiles"

const log = debug("game:entities:Player")

const PLAYER_BEAM_STARTING_RESOURCES = 100
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

        super(game, x, y, [playerSprite])

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

        // NOTE(tristan): I'm assuming that the follow directive is similar to adding the emmiters as
        // children of this container, but I don't know for sure
        this.game.add.particles(Assets.ParticleEngineThrust).createEmitter({
            angle: 90,
            blendMode: Phaser.BlendModes.ADD,
            follow: this,
            followOffset: { x: -30, y: this.botEdgeYOffset() },
            lifespan: {
                onEmit: () => {
                    return Math.max(250, Phaser.Math.Percent(this.body.velocity.length(), 0, 300) * 1000)
                }
            },
            scale: { start: 0.25, end: 0.0 },
            speed: 100
        })

        this.game.add.particles(Assets.ParticleEngineThrust).createEmitter({
            angle: 90,
            blendMode: Phaser.BlendModes.ADD,
            follow: this,
            followOffset: { x: 30, y: this.botEdgeYOffset() },
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
        this.beam = new Beam(this.game, 0, this.topEdgeYOffset(), PLAYER_BEAM_STARTING_RESOURCES)
        this.add(this.beam)
        this.controller = new UnifiedController(this.game.input)
        this.projectiles = new Projectiles(this.game, 20, this.topEdgeYOffset(), PLAYER_PROJECTILES_STARTING_RESOURCES)

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
        this.beam.update(time, delta, beamActiveAttempt, currentPiece)

        let projectileFireAttempt: boolean = false
        if (this.controller.actionRB!.isUniquelyDown()) {
            projectileFireAttempt = true
        }

        this.projectiles.update(time, delta, projectileFireAttempt, this.x, this.y, currentPiece)
    }

    private topEdgeYOffset() {
        return -this.height / 2
    }

    private botEdgeYOffset() {
        return this.height / 2 - 2
    }
}
