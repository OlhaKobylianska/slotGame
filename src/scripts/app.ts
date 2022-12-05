import * as PIXI from 'pixi.js'
import { assetsMap } from './assetsMap'
import { Background, Balance, BetAmount, Reels, Spin } from './elements'
import { changeBetAmount, spinRunFunc } from './playGame'
import { loadGame } from './loadGame'
import { EnumBetContainer, EnumSpinContainer } from './interfaces'

export const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xd4d4d4
})

document.body.appendChild(app.view)

const runGame = (): void => {
  const background = new Background()
  const spin = new Spin()
  const reels = new Reels()
  const balance = new Balance()
  const bet = new BetAmount()

  app.stage.position.set(window.innerWidth / 2, window.innerHeight / 2)
  app.stage.addChild(background.viewContainer)
  app.stage.addChild(reels.viewContainer)
  app.stage.addChild(spin.viewContainer)
  app.stage.addChild(balance.viewContainer)
  app.stage.addChild(bet.viewContainer)

  spin.viewContainer.children[EnumSpinContainer.MainPic].interactive = true;
  bet.viewContainer.children[2].interactive = true;

  spin.viewContainer.children[EnumSpinContainer.MainPic].on('click', () => spinRunFunc(spin.viewContainer, reels.viewContainer, bet.viewContainer))
  bet.viewContainer.children[EnumBetContainer.Value].on('click', () => changeBetAmount())
  app.ticker.add(loadGame)
}

assetsMap.sptites.forEach(item => app.loader.add(item.name, item.url))
app.loader.load(runGame)
