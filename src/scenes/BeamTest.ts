import * as Debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "../assets"
import { Player } from "../entities/Player"

import { Scenes } from "."
import * as Game from "./Game"

const log = Debug(`game:scenes:${Scenes.BeamTest}`)

class BeamTest extends Game.default {
    private player: Player

    constructor() {
        super(Scenes.BeamTest)
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
        this.player.destroyBeamOnCollisionWith(worldTop)

        super.create({
            level: 10
        } as Game.IGameInitialization)

        this.player.beam.addPieceLatchChecks(this.currentPiece)

        log("created")
    }

    public update(time: number, delta: number) {
        this.player.update(time, delta)
    }
}

export default BeamTest
