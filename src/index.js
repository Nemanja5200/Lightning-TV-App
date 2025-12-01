import { Launch } from '@lightningjs/sdk'
import App from './App.js'
import { appSettings, platformSettings } from '../settings.json'
import { getDevice } from './utils/device.js'

const device = getDevice()

appSettings.keys = {}

switch (device) {
  case 'tizen':
    appSettings.keys = {
      10009: 'Back',
      10182: 'Exit',
      427: 'ChannelUp',
      428: 'ChannelDown',
      10252: 'MediaPlayPause',
      412: 'MediaRewind',
      417: 'MediaFastForward',
      415: 'MediaPlay',
      19: 'MediaPause',
      413: 'MediaStop',
    }
    break
  case 'webos':
    appSettings.keys = {
      461: 'Back',
      33: 'ChannelUp',
      34: 'ChannelDown',
      415: 'MediaPlay',
      19: 'MediaPause',
      417: 'MediaFastForward',
      412: 'MediaRewind',
      413: 'MediaStop',
    }
    break
  case 'hisense':
    appSettings.keys = {
      8: 'Back',
      427: 'ChannelUp',
      428: 'ChannelDown',
      415: 'MediaPlay',
      19: 'MediaPause',
      417: 'MediaFastForward',
      412: 'MediaRewind',
      413: 'MediaStop',
    }
    break
  // Dodajte druge slučajeve prema potrebi
  default:
    // Ako nije prepoznat uređaj, neka ostane prazno
    break
}

const app = Launch(App, appSettings, platformSettings)
const canvas = app.stage.getCanvas()
document.body.appendChild(canvas)
