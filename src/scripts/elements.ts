import * as PIXI from 'pixi.js'
import { app } from './app';
import { spinRunFunc, spinStopFunc } from './events';

function createSprite(typeElem: string, anchor: number, scaleElem: number, widthElem: number, posX: number = 0, posY: number = 0): PIXI.Sprite {
  const elem = PIXI.Sprite.from(typeElem);
  anchor ? elem.anchor.set(anchor) : null
  widthElem ? elem.width = widthElem : null
  scaleElem ? elem.scale.set(scaleElem) : null
  posX ? elem.position.x = posX : null
  posY ? elem.position.y = posY : null
  return elem
}

function createAnimatedSprite(typeElem: string[], anchor: number, scaleElem: number, posX: number = 0, posY: number = 0, speed: number): PIXI.AnimatedSprite | undefined {
  let elem

  if (typeElem.length >= 1) {
    const arrElem = typeElem.map((item: string) => PIXI.Texture.from(item))
    elem = new PIXI.AnimatedSprite(arrElem);
    anchor ? elem.anchor.set(anchor) : null
    scaleElem ? elem.scale.set(scaleElem) : null
    posX ? elem.position.x = posX : null
    posY ? elem.position.y = posY : null

    elem.loop = true;
    elem.animationSpeed = speed;
    elem.play();
  }

  return elem


  //   this.speedMainPic = new PIXI.AnimatedSprite([
  //     PIXI.Texture.from('speed'), PIXI.Texture.from('speed2')
  //   ])

  // this.speedMainPic.scale.set(0.7)
  // this.speedMainPic.anchor.set(0.5);
  // this.speedMainPic.position.y = 5
  // this.speedMainPic.loop = true;
  // this.speedMainPic.animationSpeed = 0.04;
  // this.speedMainPic.play();
}

function createContainer(posX: number, posY: number): PIXI.Container {
  const container = new PIXI.Container()
  posX ? container.position.x = posX : null
  posY ? container.position.y = posY : null
  return container
}

export class Background {
  private view: PIXI.Container
  private bg: PIXI.Sprite
  private background: PIXI.Sprite

  constructor() {
    this.view = new PIXI.Container()

    this.bg = createSprite('bg', 0.5, 0, window.innerWidth)
    this.background = createSprite('background', 0.5, 1.15, 0)

    this.view.addChild(this.bg)
    this.view.addChild(this.background)
  }

  get viewContainer(): PIXI.Container {
    return this.view
  }
}

export class Spin {
  private view: PIXI.Container
  private spinBg: PIXI.Sprite
  private spinMainPic: PIXI.Sprite
  private spinTextStart: PIXI.Sprite
  private spinTextStop: PIXI.Sprite
  private spinStop: PIXI.Sprite
  private spinArrow: PIXI.Sprite

  constructor() {
    this.view = createContainer(600, 120)

    this.spinBg = createSprite('spin_bg', 0.5, 0.7, 0)
    this.spinMainPic = createSprite('spin', 0.5, 0.7, 0, 0, 10)
    this.spinTextStart = createSprite('spin_play', 0.5, 0.7, 0, 0, -50)
    this.spinTextStop = createSprite('spin_stop', 0.5, 0.7, 0, 0, -70)
    this.spinTextStop.visible = false
    this.spinStop = createSprite('stop', 0.5, 0.65, 0, 0, 0)
    this.spinStop.visible = false
    this.spinArrow = createSprite('spin_arrow', 0.5, 0.65, 0, 0, 0)

    app.ticker.add((delta) => {
      this.spinArrow.rotation += 0.07 * delta;
    });

    this.view.addChild(this.spinBg)
    this.view.addChild(this.spinMainPic)
    this.view.addChild(this.spinTextStart)
    this.view.addChild(this.spinTextStop)
    this.view.addChild(this.spinStop)
    this.view.addChild(this.spinArrow)

    this.spinMainPic.interactive = true;
    this.spinMainPic.on('click', spinRunFunc)
    
    this.spinStop.interactive = true;
    this.spinStop.on('click', spinStopFunc)
  }

  get viewContainer(): PIXI.Container {
    return this.view
  }
}

export class Speed {
  private view: PIXI.Container
  private speedBg: PIXI.Sprite
  private speedMainPic: PIXI.AnimatedSprite | undefined
  private speedText: PIXI.Sprite
  private speedValue: PIXI.Sprite
  private value: number = 2

  constructor() {
    this.view = createContainer(600, -150)

    this.speedBg = createSprite('spin_bg', 0.5, 0.7, 0)
    this.speedMainPic = createAnimatedSprite(['speed', 'speed2'], 0.5, 0.7, 0, 5, 0.04)
    this.speedText = createSprite('speed_text', 0.5, 0.7, 0, 0, -42)
    this.speedValue = createSprite(`speed_x${this.value}`, 0.5, 0.65, 0, 0, 0)

    this.view.addChild(this.speedBg)
    this.speedMainPic ? this.view.addChild(this.speedMainPic) : null
    this.view.addChild(this.speedText)
    this.view.addChild(this.speedValue)
  }

  get viewContainer(): PIXI.Container {
    return this.view
  }
}