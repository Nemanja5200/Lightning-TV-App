import Lightning from '@lightningjs/sdk/src/Lightning'
import { formatTime } from '../../../utils/Functions'

export default class ProgressBar extends Lightning.Component {
  static _template() {
    return {
      w: 1690,
      h: 156,
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

  updateProgress(currentTime, duration) {
    if (!isFinite(duration) || duration === 0) {
      return
    }

    const remainingTime = Math.max(0, duration - currentTime)
    const progressBarWidth = (currentTime / duration) * 1404

    this.patch({
      CurrentTime: {
        text: { text: formatTime(currentTime) },
      },
      RemainingTime: {
        text: { text: `-${formatTime(remainingTime)}` },
      },
      Bar: {
        ProgressColor: { w: progressBarWidth },
        Dot: { x: progressBarWidth },
      },
    })
  }

  reset() {
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

  _focus() {
    this.tag('Dot').setSmooth('alpha', 1, { duration: 0.3 })
  }

  _unfocus() {
    this.tag('Dot').setSmooth('alpha', 0, { duration: 0.3 })
  }

  _handleUp() {
    return false
  }

  _handleLeft() {
    this.signal('seekBackward')
    return true
  }

  _handleRight() {
    this.signal('seekForward')
    return true
  }

  _handleDown() {
    return true
  }
}
