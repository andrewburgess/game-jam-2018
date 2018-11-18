import * as debug from "debug"
import { isUndefined } from "lodash"
import * as Phaser from "phaser"

import Game from "../scenes/Game"

import { Piece } from "./Piece"
import { Projectile } from "./Projectile"

const log = debug("game:entities:Projectiles")

export const PROJECTILE_STANDARD_VELOCITY = -1200

const PROJECTILE_RESOURCES_TEXT = "Projectile Resources: "
const PROJECTILE_RESOURCE_GEN_DELTA = 750.0

export class Projectiles extends Phaser.GameObjects.Container {
    public elements: Phaser.Physics.Arcade.Group

    private game: Game
    private resourceGenDelta: number
    private resourceLimit: number
    private resources: number
    private resourcesText: Phaser.GameObjects.Text

    constructor(game: Game, x: number, y: number, startingResources: integer) {
        log("constructing")

        super(game, x, y)
        this.game = game

        this.elements = new Phaser.Physics.Arcade.Group(this.game.physics.world, this.game)

        this.resourceGenDelta = 0.0
        this.resources = this.resourceLimit = startingResources
        this.resourcesText = this.game.add.text(
            this.game.cameras.main.width - 258,
            25,
            PROJECTILE_RESOURCES_TEXT + this.resources
        )

        this.game.add.existing(this)

        log("constructed")
    }

    public destroyOnCollisionWith(boundary: Phaser.Physics.Arcade.Sprite) {
        this.game.physics.add.overlap(
            this.elements,
            boundary,
            (collidedBoundary: Phaser.Physics.Arcade.Sprite, playerProjectile: Phaser.Physics.Arcade.Sprite) => {
                if (collidedBoundary.body.bottom >= playerProjectile.body.bottom) {
                    playerProjectile.destroy()
                }
            },
            undefined,
            this.game
        )
    }

    public getElements(): Projectile[] {
        return this.getAll() as Projectile[]
    }

    public update(
        // TODO(tristan): compress
        time: number,
        delta: number,
        fireDesired: boolean,
        playerX: number,
        playerY: number,
        currentPiece?: Piece
    ) {
        this.resourceGenDelta += delta

        if (fireDesired && this.resources > 0) {
            this.createProjectile(playerX, playerY, 0, PROJECTILE_STANDARD_VELOCITY)
            this.resources--
        }

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

    private createProjectile(gunPosX: number, gunPosY: number, velocityX: number, velocityY: number) {
        const pProj: Projectile = new Projectile(this.game, gunPosX, gunPosY)

        this.add(pProj)

        this.elements.add(pProj)
        pProj.setVelocityY(velocityY)
    }
}
