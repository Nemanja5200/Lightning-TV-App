import Lightning from '@lightningjs/sdk/src/Lightning'
import { formatTime } from '../../../utils/Functions'
import { VideoPlayer } from '@lightningjs/sdk'

export default class ProgressBar extends Lightning.Component {
  _skipInterval = null
  _duration = 0
  _skipDirection = null
  _isSeeking = false
  _initialSkip = 1
  _holdSkip = 10
  static _template() {
    return {
      w: 1690,
      h: 156,
      collision: true,
      CurrentTime: {
        x: 0,
        y: 0,
        text: {
          text: '00:00',
          fontSize: 26,
          fontFace: 'Inter-Bold',
          textColor: 0xffffffff,
        },
      },
      Bar: {
        x: 123,
        y: 10,
        w: 1404,
        h: 9,
        rect: true,
        color: 0xffd9d9d9,
        ProgressColor: {
          w: 0,
          h: 9,
          x: 0,
          y: 0,
          rect: true,
          color: 0xffed1c24,
        },
        Dot: {
          w: 21,
          h: 21,
          x: 0,
          y: 3,
          mount: 0.5,
          rect: true,
          alpha: 0,
          color: 0xffed1c24,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 10,
            stroke: 3,
            strokeColor: 0xffffffff,
          },
        },
      },
      RemainingTime: {
        x: 1600,
        y: 0,
        text: {
          text: '00:00',
          fontSize: 26,
          fontFace: 'Inter-Bold',
          textColor: 0xffffffff,
        },
      },
    }
  }

  updateProgress(previewTime, duration) {
    if (!isFinite(duration) || duration === 0) {
      return
    }

    this._duration = duration
    this._displayTime = Math.max(0, Math.min(duration, previewTime))
    const remainingTime = Math.max(0, duration - this._displayTime)
    const progressBarWidth = (this._displayTime / duration) * 1404
    this.patch({
      CurrentTime: {
        text: { text: formatTime(this._displayTime) },
      },
      RemainingTime: {
        text: { text: `-${formatTime(remainingTime)}` },
      },
    })

    this.tag('ProgressColor').setSmooth('w', progressBarWidth, { duration: 0.2 })
    this.tag('Dot').setSmooth('x', progressBarWidth, { duration: 0.2 })
  }

  reset() {
    this._stopSeeking()
    this._duration = 0
    this._isHolding = false

    this.patch({
      CurrentTime: {
        text: { text: '00:00' },
      },
      RemainingTime: {
        text: { text: '00:00' },
      },
      Bar: {
        ProgressColor: { w: 0 },
        Dot: { x: 0, alpha: 0 },
      },
    })
  }

  _startSeeking(direction) {
    if (this._isSeeking && this._skipDirection === direction) {
      return
    }

    if (this._isSeeking && this._skipDirection !== direction) {
      this._stopSeeking(false)
    }

    this.signal('stopProgress')
    this._isSeeking = true
    this._skipDirection = direction

    const incrementBy = (dir, amount) => (dir === 'forward' ? amount : -amount)

    if (this._skipInterval) {
      clearInterval(this._skipInterval)
      this._skipInterval = null
    }

    if (this._previewTime === undefined) {
      this._previewTime = VideoPlayer.currentTime
    }

    this._previewTime += incrementBy(direction, this._initialSkip)
    this._previewTime = Math.max(0, Math.min(this._duration, this._previewTime))
    this.updateProgress(this._previewTime, this._duration)

    this._skipInterval = setInterval(() => {
      this._previewTime += incrementBy(direction, this._holdSkip)
      this._previewTime = Math.max(0, Math.min(this._duration, this._previewTime))
      this.updateProgress(this._previewTime, this._duration)
    }, 100)
  }

  _stopSeeking() {
    if (this._skipInterval) {
      clearInterval(this._skipInterval)
      this._skipInterval = null
    }

    if (this._previewTime !== undefined) {
      this.signal('applySkip', this._previewTime)
      this._previewTime = undefined
    }

    this._isSeeking = false
    this._skipDirection = null

    this.signal('startProgress')
  }

  _focus() {
    this.tag('Dot').setSmooth('alpha', 1, { duration: 0.3 })
  }

  _unfocus() {
    this._stopSeeking()
    this.tag('Dot').setSmooth('alpha', 0, { duration: 0.3 })
  }

  _handleUp() {
    this._stopSeeking()
    return false
  }

  _handleLeft() {
    this._startSeeking('backward')
    return false
  }

  _handleRight() {
    this._startSeeking('forward')
    return false
  }

  _handleLeftRelease() {
    this._stopSeeking()
    return true
  }

  _handleRightRelease() {
    this._stopSeeking()
    return true
  }

  _handleDown() {
    this._stopSeeking()
    return true
  }

  _handleHover() {
    console.log('Progress Bar', this.ref)
    this._focus()
    console.log('current ref:', this.ref)
    this.fireAncestors('$buttonHovered', this.ref)
  }
}
