import * as debug from "debug"
import * as Phaser from "phaser"

import UnifiedController from "../GameInput"

import { Assets } from "../assets"
import { Beam, IBeamUpdateResult } from "../entities/Beam"
import { Projectiles } from "../entities/Projectiles"

const log = debug("game:entities:Player")

const BEAM_RESOURCES_LIMIT = 50
const BEAM_RESOURCES_TEXT = "Beam Resources: "
const BEAM_RESOURCE_GEN_DELTA = 500.0

export class Player extends Phaser.Physics.Arcade.Sprite {
    public projectiles: Projectiles
    public beam: Beam
    private controller: UnifiedController
    private beamResourcesText: Phaser.GameObjects.Text
    private beamResources: number
    private beamResourceGenDelta: number

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

        const beamPosX: number = this.x - this.width + 15
        const beamPosY: number = this.y - this.height

        // TODO(tristan): beam resource UI and update system
        this.beam = new Beam(this.scene, beamPosX, beamPosY)

        this.beamResourceGenDelta = 0.0
        this.beamResources = BEAM_RESOURCES_LIMIT
        this.beamResourcesText = this.scene.add.text(5, 5, BEAM_RESOURCES_TEXT + this.beamResources)

        this.projectiles = new Projectiles(this.scene, this.width - 15, -this.height)

        log("constructed")
    }

    public update(time: number, delta: number) {
        this.beamResourceGenDelta += delta

        const beamPosX: number = this.x - this.width + 15
        const beamPosY: number = this.y - this.height

        if (this.beamResourceGenDelta > BEAM_RESOURCE_GEN_DELTA) {
            this.beamResources = Math.min(this.beamResources + 1, BEAM_RESOURCES_LIMIT)
            this.beamResourceGenDelta = 0
        }

        if (this.controller.left!.isDown()) {
            this.setAccelerationX(this.controller.left!.getMagnitude() * -1500)
        } else if (this.controller.right!.isDown()) {
            this.setAccelerationX(this.controller.right!.getMagnitude() * 1500)
        } else {
            this.setAccelerationX(0)
        }

        if (this.controller.actionLB!.isDown()) {
            if (this.beamResources > 0) {
                const updateResult: IBeamUpdateResult = this.beam.update(time, delta)
                this.beamResources -= updateResult.resourcesConsumed
            } else {
                // TODO(tristan): breakgae animation?
                this.beam.elements.clear(true, true)
            }
            this.beam.x = beamPosX
            this.beam.y = beamPosY
        } else if (this.beam) {
            this.beam.removeAll(true)
            this.beam.latched = false
        }

        if (this.controller.actionRB!.isUniquelyDown()) {
            this.projectiles.createProjectile(this.x, this.y, 0, -1050)
        }

        this.beamResourcesText.text = BEAM_RESOURCES_TEXT + this.beamResources
    }
}
