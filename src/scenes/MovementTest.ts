import * as Debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import { Player } from "../entities/Player"

import { Scenes } from "./"

const log = Debug(`game:scenes:${Scenes.MovementTest}`)

class MovementTest extends Phaser.Scene {
    private player: Player

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

        this.add.image(midX, midY, Assets.Background)

        this.player = new Player(this, midX, this.cameras.main.height)

        const worldTop: Phaser.Physics.Arcade.Sprite = this.physics.add.staticSprite(16, -16, "world_top")
        worldTop.setSize(this.physics.world.bounds.width, worldTop.height)
        this.player.destroyProjectilesOnCollisionWith(worldTop)

        log("created")
    }

    public update(time: number, delta: number) {
        this.player.update(time, delta)
    }
}

export default MovementTest
