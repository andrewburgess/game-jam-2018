import * as debug from "debug"
import { isUndefined } from "lodash"
import * as Phaser from "phaser"

import { Piece } from "./Piece"
import { Projectile } from "./Projectile"

const log = debug("game:entities:Projectiles")

export const PROJECTILE_STANDARD_VELOCITY = -1100

const PROJECTILE_RESOURCES_TEXT = "Projectile Resources: "
const PROJECTILE_RESOURCE_GEN_DELTA = 250.0

export class Projectiles extends Phaser.GameObjects.Container {
    public elements: Phaser.Physics.Arcade.Group
    public scene: Phaser.Scene

    private resourceGenDelta: number
    private resourceLimit: number
    private resources: number
    private resourcesText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, x: number, y: number, startingResources: integer) {
        log("constructing")

        super(scene, x, y)
        this.scene = scene

        this.elements = new Phaser.Physics.Arcade.Group(this.scene.physics.world, this.scene)

        this.resourceGenDelta = 0.0
        this.resources = this.resourceLimit = startingResources
        this.resourcesText = this.scene.add.text(
            this.scene.cameras.main.width - 258,
            25,
            PROJECTILE_RESOURCES_TEXT + this.resources
        )

        this.scene.add.existing(this)

        log("constructed")
    }

    public createProjectile(gunPosX: number, gunPosY: number, velocityX: number, velocityY: number) {
        const pProj: Projectile = new Projectile(this.scene, gunPosX, gunPosY)

        this.add(pProj)

        this.elements.add(pProj)
        pProj.setVelocityY(velocityY)

        this.resources--
    }

    public destroyOnCollisionWith(boundary: Phaser.Physics.Arcade.Sprite) {
        this.scene.physics.add.overlap(
            this.elements,
            boundary,
            (collidedBoundary: Phaser.Physics.Arcade.Sprite, playerProjectile: Phaser.Physics.Arcade.Sprite) => {
                if (collidedBoundary.body.bottom >= playerProjectile.body.bottom) {
                    playerProjectile.destroy()
                }
            },
            undefined,
            this.scene
        )
    }

    public getElements(): Projectile[] {
        return this.getAll() as Projectile[]
    }

    public update(time: number, delta: number, currentPiece?: Piece) {
        this.resourceGenDelta += delta

        if (this.resourceGenDelta > PROJECTILE_RESOURCE_GEN_DELTA) {
            this.resources = Math.min(this.resources + 1, this.resourceLimit)
            this.resourceGenDelta = 0.0
        }

        this.each((projectile: Projectile) => {
            if (!isUndefined(currentPiece)) {
                projectile.update(time, delta, currentPiece)
            }
        })

        this.resourcesText.text = PROJECTILE_RESOURCES_TEXT + this.resources
    }
}
