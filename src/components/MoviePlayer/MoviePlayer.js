import { Colors, Router, Utils, VideoPlayer } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { loader, unloader } from './components/HLS'
import PlayerButton from './components/PlayerButton'
import { IMAGE_PATH } from '../../constance/Images'
import { PATHS } from '../../constance/paths'
import ProgressBar from './components/ProgressBar'
import LoadingScreenComponent from '../LoadingScreenComponent/LoadinScreenComponent'
import { Gradient } from '@lightningjs/ui-components'

export default class MoviePlayer extends Lightning.Component {
  _isPaused = false
  _progressInterval = null
  _isSeeking = false
  _seekTimeout = null
  _hideControlsTimeout = null
  _controlsVisible = true
  static _template() {
    return {
      ControlsContainer: {
        w: 1920,
        h: 1080,
        alpha: 1,
        Bg: {
          type: Gradient,
          w: 1920,
          h: 300,
          y: 800,
          zIndex: 0,
          colorTop: 0x00151515,
          colorBottom: 0xcc151515,
        },
        Back: {
          type: PlayerButton,
          w: 86,
          h: 86,
          x: 115,
          y: 836,
          zIndex: 10,
          icon: Utils.asset(IMAGE_PATH.PLAYAER_BACK_BTN),
        },
        Controls: {
          w: 312,
          h: 90,
          y: 836,
          x: 804,
          flex: { direction: 'row', alignItems: 'center' },
          Prev: {
            type: PlayerButton,
            w: 86,
            h: 86,
            flexItem: { marginRight: 45 },
            zIndex: 10,
            icon: Utils.asset(IMAGE_PATH.PLAYER_PREV),
          },
          PausePlay: {
            type: PlayerButton,
            w: 95,
            h: 95,
            flexItem: { marginRight: 45 },
            zIndex: 10,
          },
          Forward: {
            type: PlayerButton,
            w: 86,
            h: 86,
            zIndex: 10,
            icon: Utils.asset(IMAGE_PATH.PLAYER_FORWARD),
          },
        },
        ProgressBar: {
          type: ProgressBar,
          x: 115,
          y: 961,
          signals: {
            applySkip: '_applySkip',
            stopProgress: '_stopProgress',
            startProgress: '_startProgress',
          },
          zIndex: 10,
        },
        Spinner: {
          type: LoadingScreenComponent,
          rect: true,
          w: 1920,
          h: 1080,
          color: Colors('#000000').alpha(0).get(),
          visible: false,
          props: {
            xPos: 960,
            yPos: 540,
          },
        },
      },
    }
  }

  get Back() {
    return this.tag('ControlsContainer.Back')
  }

  get Prev() {
    return this.tag('ControlsContainer.Controls.Prev')
  }

  get PausePlay() {
    return this.tag('ControlsContainer.Controls.PausePlay')
  }

  get Forward() {
    return this.tag('ControlsContainer.Controls.Forward')
  }

  get ProgressBar() {
    return this.tag('ControlsContainer.ProgressBar')
  }

  get ControlsContainer() {
    return this.tag('ControlsContainer')
  }

  _init() {
    this._setState('Back')
  }

  _showControls() {
    this._controlsVisible = true

    this.ControlsContainer.setSmooth('alpha', 1, {
      duration: 0.3,
      timingFunction: 'ease-out',
    })

    this._resetHideTimer()
  }

  _hideControls() {
    this._controlsVisible = false

    this.ControlsContainer.setSmooth('alpha', 0, {
      duration: 0.5,
      timingFunction: 'ease-in',
    })

    if (this._hideControlsTimeout) {
      clearTimeout(this._hideControlsTimeout)
      this._hideControlsTimeout = null
    }
  }

  _resetHideTimer() {
    if (this._hideControlsTimeout) {
      clearTimeout(this._hideControlsTimeout)
    }

    if (this._isPaused) {
      return
    }

    this._hideControlsTimeout = setTimeout(() => {
      if (!this._isPaused) {
        this._hideControls()
      }
    }, 5000)
  }

  _handleAnyKey() {
    if (!this._controlsVisible) {
      this._showControls()
      return true
    }

    this._resetHideTimer()
    return false
  }

  _updatePlayPauseIcon() {
    this.PausePlay.patch({
      icon: {
        src: this._isPaused
          ? Utils.asset(IMAGE_PATH.PLAYER_PLAY)
          : Utils.asset(IMAGE_PATH.PLAYER_PAUSE),
        width: 70,
        height: 70,
      },
    })
  }

  _updateProgress() {
    if (this._isSeeking) {
      return
    }

    const currentTime = VideoPlayer.currentTime || 0
    const duration = VideoPlayer.duration || 0

    if (!isFinite(duration) || duration === 0) {
      return
    }
    this.ProgressBar.updateProgress(currentTime, duration)
  }

  _startProgressUpdates() {
    this._stopProgressUpdates()
    this._progressInterval = setInterval(() => {
      this._updateProgress()
    }, 500)
  }

  _stopProgressUpdates() {
    if (this._progressInterval) {
      clearInterval(this._progressInterval)
      this._progressInterval = null
    }
  }

  _resetUI() {
    this._isPaused = false
    this._isSeeking = false
    this._controlsVisible = true

    if (this._seekTimeout) {
      clearTimeout(this._seekTimeout)
      this._seekTimeout = null
    }

    if (this._hideControlsTimeout) {
      clearTimeout(this._hideControlsTimeout)
      this._hideControlsTimeout = null
    }

    this.ControlsContainer.alpha = 1
    this.ProgressBar.reset()
    this.patch({
      ControlsContainer: {
        Controls: {
          PausePlay: {
            icon: {
              src: Utils.asset(IMAGE_PATH.PLAYER_PAUSE),
              width: 70,
              height: 70,
            },
          },
        },
      },
    })
  }

  _enable() {
    this._resetUI()
    this.fireAncestors('$punchHole')
    VideoPlayer.position(0, 0)
    VideoPlayer.size(1920, 1080)
    VideoPlayer.consumer(this)
    VideoPlayer.loader(loader)
    VideoPlayer.unloader(unloader)
    VideoPlayer.loop(false)
    VideoPlayer.open('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
    VideoPlayer.play()

    this._startProgressUpdates()
    this._resetHideTimer()
  }

  _disable() {
    this.fireAncestors('$unpunchHole')
    this._stopProgressUpdates()

    if (this._seekTimeout) {
      clearTimeout(this._seekTimeout)
      this._seekTimeout = null
    }

    if (this._hideControlsTimeout) {
      clearTimeout(this._hideControlsTimeout)
      this._hideControlsTimeout = null
    }

    VideoPlayer.clear()
    this._resetUI()
  }

  _applySkip(time) {
    if (this._seekTimeout) {
      clearTimeout(this._seekTimeout)
    }

    this._isSeeking = true
    VideoPlayer.seek(time)

    this._seekTimeout = setTimeout(() => {
      this._isSeeking = false
      this._seekTimeout = null
    }, 500)
  }
  _startProgress() {
    this._startProgressUpdates()
  }

  _stopProgress() {
    this._stopProgressUpdates()
  }

  $videoPlayerSeeking() {
    this._isSeeking = true
    this.tag('Spinner').visible = true
  }

  $videoPlayerSeeked() {
    this._isSeeking = false
    this.tag('Spinner').visible = false
  }

  $videoPlayerEnded() {
    Router.back()
  }
  static _states() {
    return [
      class Back extends this {
        _getFocused() {
          return this.Back
        }

        _handleRight() {
          this._handleAnyKey()
          this._setState('Controls')
          return true
        }

        _handleDown() {
          this._handleAnyKey()
          this._setState('ProgressBar')
          return true
        }

        _handleEnter() {
          this._handleAnyKey()
          this._handleBack()
          return true
        }

        _handleBack() {
          const history = Router.getHistory()
          if (history.length) {
            Router.back()
          } else {
            Router.navigate(PATHS.HOME)
          }
        }

        _captureKey() {
          if (this._handleAnyKey()) {
            return true
          }
          return false
        }

        _handleUp() {
          return this._captureKey() || false
        }
        _handleLeft() {
          return this._captureKey() || false
        }
      },

      class Controls extends this {
        $enter() {
          this._controlIndex = 0
        }

        _getFocused() {
          const controls = [this.Prev, this.PausePlay, this.Forward]
          return controls[this._controlIndex]
        }

        _handleLeft() {
          this._handleAnyKey()
          if (this._controlIndex > 0) {
            this._controlIndex--
          } else {
            this._setState('Back')
          }
          return true
        }

        _handleRight() {
          this._handleAnyKey()
          if (this._controlIndex < 2) {
            this._controlIndex++
          }
          return true
        }

        _handleDown() {
          this._handleAnyKey()
          this._setState('ProgressBar')
          return true
        }

        _handleEnter() {
          this._handleAnyKey()
          const buttons = ['Prev', 'PausePlay', 'Forward']
          const focusedButton = buttons[this._controlIndex]

          switch (focusedButton) {
            case 'Prev':
              VideoPlayer.skip(-5)
              break
            case 'PausePlay':
              this._isPaused = !this._isPaused
              VideoPlayer.playPause()
              this._updatePlayPauseIcon()

              if (this._isPaused) {
                this._showControls()
                if (this._hideControlsTimeout) {
                  clearTimeout(this._hideControlsTimeout)
                  this._hideControlsTimeout = null
                }
              } else {
                this._resetHideTimer()
              }
              break
            case 'Forward':
              VideoPlayer.skip(+5)
              break
          }
          return true
        }

        _captureKey() {
          if (this._handleAnyKey()) {
            return true
          }
          return false
        }

        _handleUp() {
          return this._captureKey() || false
        }
      },

      class ProgressBar extends this {
        _getFocused() {
          return this.ProgressBar
        }

        _handleUp() {
          this._handleAnyKey()
          this._setState('Controls')
          return true
        }

        _handleLeft() {
          this._handleAnyKey()
          return false
        }

        _handleRight() {
          this._handleAnyKey()
          return false
        }

        _handleDown() {
          return this._handleAnyKey() || false
        }

        _handleLeftRelease() {
          this._handleAnyKey()
          return false
        }

        _handleRightRelease() {
          this._handleAnyKey()
          return false
        }
      },
    ]
  }
}
