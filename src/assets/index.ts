// TODO(tristan): will need to review licensing stuff if any of these are actually to be used in submission

// NOTE(tristan): https://bit.ly/2pGYaak
import * as BACKGROUND from "./images/background.png"
import * as BEAM from "./images/beam.png"
import * as BEGIN_BUTTON from "./images/begin-button.png"
import * as BLOCKS from "./images/blocks.png"
import * as GAME_BUTTON from "./images/game-button.png"
import * as LEVEL_START_BACKGROUND from "./images/level-start-background.png"
import * as PARTICLE_ENGINE_THRUST from "./images/particle-engine-thrust.png"
import * as PLATFORM from "./images/platform.png"
// NOTE(tristan): https://bit.ly/2SQMZtt
import * as PROJECTILE from "./images/player-projectile.png"
// NOTE(tristan): https://bit.ly/2qsAQh5
import * as PLAYER from "./images/player.png"
import * as TITLE from "./images/title.png"
// NOTE(tristan): opening the raw versions of sounds assets requires at least the demo version
// of Propellerhead's Reason software: https://www.propellerheads.com/en/reason
import * as FX_BEAM_ACTIVATED_OGG from "./sounds/fx-beam-activated.ogg"
import * as FX_BEAM_ACTIVATED_WAV from "./sounds/fx-beam-activated.wav"
import * as FX_BEAM_BEAMING_PIECE_OGG from "./sounds/fx-beam-beaming-piece.ogg"
import * as FX_BEAM_BEAMING_PIECE_WAV from "./sounds/fx-beam-beaming-piece.wav"
import * as FX_PIECE_HIT_MP3 from "./sounds/fx-piece-hit.mp3"
import * as FX_PIECE_HIT_OGG from "./sounds/fx-piece-hit.ogg"
import * as FX_PROJECTILE_FIRED_MP3 from "./sounds/fx-projectile-fired.mp3"
import * as FX_PROJECTILE_FIRED_OGG from "./sounds/fx-projectile-fired.ogg"
import * as MUSIC_01_MP3 from "./sounds/music-01.mp3"
import * as MUSIC_01_OGG from "./sounds/music-01.ogg"
import * as MUSIC_02_MP3 from "./sounds/music-02.mp3"
import * as MUSIC_02_OGG from "./sounds/music-02.ogg"
import * as MUSIC_TITLE_MP3 from "./sounds/music-title.mp3"
import * as MUSIC_TITLE_OGG from "./sounds/music-title.ogg"

export const Files = {
    BACKGROUND,
    BEAM,
    BEGIN_BUTTON,
    BLOCKS,
    FX_BEAM_ACTIVATED_OGG,
    FX_BEAM_ACTIVATED_WAV,
    FX_BEAM_BEAMING_PIECE_OGG,
    FX_BEAM_BEAMING_PIECE_WAV,
    FX_PIECE_HIT_MP3,
    FX_PIECE_HIT_OGG,
    FX_PROJECTILE_FIRED_MP3,
    FX_PROJECTILE_FIRED_OGG,
    GAME_BUTTON,
    LEVEL_START_BACKGROUND,
    MUSIC_01_MP3,
    MUSIC_01_OGG,
    MUSIC_02_MP3,
    MUSIC_02_OGG,
    MUSIC_TITLE_MP3,
    MUSIC_TITLE_OGG,
    PARTICLE_ENGINE_THRUST,
    PLATFORM,
    PLAYER,
    PROJECTILE,
    TITLE
}

export enum Assets {
    Background = "background",
    Beam = "beam",
    BeginButton = "begin-button",
    Blocks = "blocks",
    FxBeamActivated = "fx-beam-activated",
    FxBeamBeamingPiece = "fx-beam-beaming-piece",
    FxPieceHit = "fx-piece-hit",
    FxProjectileFired = "fx-projectile-fired",
    GameButton = "game-button",
    LevelStartBackground = "level-start-background",
    Music01 = "music-01",
    Music02 = "music-02",
    MusicTitle = "music-title",
    ParticleEngineThrust = "particle-engine-thrust",
    Platform = "platform",
    Player = "player",
    Projectile = "projectile",
    Title = "title"
}
