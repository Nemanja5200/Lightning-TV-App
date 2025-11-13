import { VideoPlayer } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { loader, unloader } from './components/HLS'

export default class MoviePlayer extends Lightning.Component {
  static _template() {
    return {
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 20 },
    }
  }

  _enable() {
    this.fireAncestors('$punchHole')
    VideoPlayer.position(0, 0)
    VideoPlayer.size(1920, 1080)
    VideoPlayer.consumer(this)
    VideoPlayer.loader(loader)
    VideoPlayer.unloader(unloader)
    VideoPlayer.loop(false)
    VideoPlayer.open('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
    VideoPlayer.play()
  }
  _disable() {
    this.fireAncestors('$unpunchHole')
    VideoPlayer.clear()
  }
}
