import * as PIXI from 'pixi.js'
import { assetsMap } from './assetsMap'
import { Background, Speed, Spin } from './elements'

export const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xd4d4d4
})

document.body.appendChild(app.view)

const runGame = () => {
  const background = new Background()
  const spin = new Spin()
  const speed = new Speed()

  app.stage.position.set(window.innerWidth / 2, window.innerHeight / 2)
  app.stage.addChild(background.viewContainer)
  app.stage.addChild(spin.viewContainer)
  app.stage.addChild(speed.viewContainer)
}

assetsMap.sptites.forEach((item) => app.loader.add(item.name, item.url))
app.loader.load(runGame)
