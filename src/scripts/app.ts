import * as PIXI from 'pixi.js'
import { assetsMap } from './assetsMap'
import { Background, Reels, Spin } from './elements'
import { spinRunFunc } from './events'
import { loadGame } from './playGame'

export const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xd4d4d4
})

document.body.appendChild(app.view)

const runGame = () => {
  const background = new Background()
  const spin = new Spin()
  const reels = new Reels()

  spin.viewContainer.children[1].interactive = true;
  spin.viewContainer.children[1].on('click', () => spinRunFunc(spin.viewContainer))

  app.stage.position.set(window.innerWidth / 2, window.innerHeight / 2)
  app.stage.addChild(background.viewContainer)
  app.stage.addChild(reels.viewContainer)
  app.stage.addChild(spin.viewContainer)

  loadGame()
}

assetsMap.sptites.forEach((item) => app.loader.add(item.name, item.url))
app.loader.load(runGame)
