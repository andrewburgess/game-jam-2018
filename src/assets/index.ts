// TODO(tristan): will need to review licensing stuff if any of these are actually to be used in submission

// NOTE(tristan): https://bit.ly/2pGYaak
import * as BACKGROUND from "./images/background.png"
import * as BEAM from "./images/beam.png"
import * as GAME_BUTTON from "./images/game-button.png"
import * as PARTICLE_ENGINE_THRUST from "./images/particle-engine-thrust.png"
import * as PLATFORM from "./images/platform.png"
// NOTE(tristan): https://bit.ly/2SQMZtt
import * as PROJECTILE from "./images/player-projectile.png"
// NOTE(tristan): https://bit.ly/2qsAQh5
import * as PLAYER from "./images/player.png"
// NOTE(tristan): opening the raw versions of sounds assets requires at least the demo version
// of Propellerhead's Reason software: https://www.propellerheads.com/en/reason
import * as MUSIC_01 from "./sounds/music01.mp3"
import * as MUSIC_02 from "./sounds/music02.mp3"

export const Files = {
    BACKGROUND,
    BEAM,
    GAME_BUTTON,
    MUSIC_01,
    MUSIC_02,
    PARTICLE_ENGINE_THRUST,
    PLATFORM,
    PLAYER,
    PROJECTILE
}

export enum Assets {
    Background = "background",
    Beam = "beam",
    GameButton = "game-button",
    Music01 = "music-01",
    Music02 = "music-02",
    ParticleEngineThrust = "particle-engine-thrust",
    Platform = "platform",
    Player = "player",
    Projectile = "projectile"
}
