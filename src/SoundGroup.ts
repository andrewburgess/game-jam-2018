import * as debug from "debug"
import * as Phaser from "phaser"

import { Assets } from "./assets"
import Game from "./scenes/Game"

const log = debug(`game:SoundGroup`)

export class SoundGroup {
    private game: Game
    private muted: boolean
    private soundMap: Map<Assets, Phaser.Sound.WebAudioSound>
    private sounds: Phaser.Sound.WebAudioSound[]
    private volume: number

    constructor(game: Game) {
        this.game = game
        this.soundMap = new Map<Assets, Phaser.Sound.WebAudioSound>()
        this.sounds = new Array<Phaser.Sound.WebAudioSound>()

        this.setMuted(false)
        this.setVolume(1.0)
    }

    public add(key: Assets) {
        const sound = this.game.sound.add(key) as Phaser.Sound.WebAudioSound

        sound.setMute(this.muted)
        sound.setVolume(this.volume)

        this.soundMap[key] = sound
        this.sounds.push(sound)
    }

    public get(key: Assets): Phaser.Sound.WebAudioSound {
        return this.soundMap[key]
    }

    public getVolume() {
        return this.volume
    }

    public isMuted() {
        return this.muted
    }

    public loopAllSounds() {
        for (const [idx, sound] of this.sounds.entries()) {
            sound.on("ended", () => {
                this.sounds[(idx + 1) % this.sounds.length].play()
            })
        }

        this.sounds[0].play()
    }

    public stopAllSounds() {
        this.sounds.forEach((sound) => {
            sound.removeAllListeners()
            sound.stop()
        })
    }

    public setMuted(newMuted: boolean) {
        for (const sound of this.sounds) {
            sound.mute = newMuted
        }

        this.muted = newMuted
    }

    public setVolume(newVolume: number) {
        for (const sound of this.sounds) {
            sound.volume = newVolume
        }

        this.volume = newVolume
    }

    public toggleMuted() {
        for (const sound of this.sounds) {
            sound.mute = !sound.mute
        }

        this.muted = !this.muted
    }
}
