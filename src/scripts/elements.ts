import * as PIXI from 'pixi.js'
import { app } from './app';
import { iReals } from './interfaces';
import { countBalance, countBet } from './playGame';

const REEL_WIDTH: number = 220
const SYMBOL_SIZE: number = 120
export const reels: iReals[] = [];

export class Background {
  private view: PIXI.Container
  private bg: PIXI.Sprite
  private background: PIXI.Sprite

  constructor() {
    this.view = new PIXI.Container()

    this.bg = createSprite('bg', 0.5, 0, window.innerWidth)
    this.background = createSprite('background', 0.5, 1.15, 0, 0, -50)

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
  private spinArrow: PIXI.Sprite

  constructor() {
    this.view = createContainer(0, 230)

    this.spinBg = createSprite('spin_bg', 0.5, 0.7, 0)
    this.spinMainPic = createSprite('spin', 0.5, 0.7, 0, 0, 5)
    this.spinTextStart = createSprite('spin_play', 0.5, 0.7, 0, 0, -50)
    this.spinTextStop = createSprite('spin_stop', 0.5, 0.7, 0, 0, -55)
    this.spinTextStop.visible = false
    this.spinArrow = createSprite('spin_arrow', 0.5, 0.65, 0, 0, 0)

    app.ticker.add((delta) => {
      this.spinArrow.rotation += 0.07 * delta;
    });

    this.view.addChild(this.spinBg)
    this.view.addChild(this.spinMainPic)
    this.view.addChild(this.spinTextStart)
    this.view.addChild(this.spinTextStop)
    this.view.addChild(this.spinArrow)

    const filter = createFilter()
    this.spinTextStart.filters = [filter];
    this.spinTextStop.filters = [filter];
  }

  get viewContainer(): PIXI.Container {
    return this.view
  }
}

export class Reels {
  private slotTextures: PIXI.Texture[] = [
    PIXI.Texture.from('value_1'),
    PIXI.Texture.from('value_2'),
    PIXI.Texture.from('value_3')
  ];
  private view: PIXI.Container

  constructor() {
    this.view = createContainer(-280, -150)

    for (let i = 0; i < 3; i++) {
      const rc = createContainer(i * REEL_WIDTH, 0)
      this.view.addChild(rc);

      const reel: iReals = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new PIXI.filters.BlurFilter()
      };

      for (let j = 0; j < 3; j++) {
        const symbol = createSprite(this.slotTextures, 0, 'reels', 0, 'reels', 'reels', j)
        reel.symbols.push((symbol));
        rc.addChild(symbol);
      }
      reels.push(reel);
    }

    app.ticker.add(() => {
      for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        r.blur.blurY = (+r.position - r.previousPosition) * 8;
        r.previousPosition = +r.position;

        for (let j = 0; j < r.symbols.length; j++) {
          const s = r.symbols[j];
          const prevy = s.y;
          s.y = ((+r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
          if (s.y < 0 && prevy > SYMBOL_SIZE) {
            s.texture = this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];
            s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
            s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
          }
        }
      }
    });
  }

  get viewContainer(): PIXI.Container {
    return this.view
  }
}

export class Balance {
  private view: PIXI.Container
  private balanceBg: PIXI.Sprite
  private balanceText: PIXI.Sprite
  private balanceValue: PIXI.Text

  constructor() {
    this.view = createContainer(-250, 280)

    this.balanceBg = createSprite('balance_bg', 0.5, 0.5, 0)
    this.balanceText = createSprite('balance_text', 0.5, 0.7, 0, 0, -20)
    this.balanceValue = createText(String(countBalance), style, 0.5, 0, 10)

    this.view.addChild(this.balanceBg)
    this.view.addChild(this.balanceText)
    this.view.addChild(this.balanceValue)

    const filter = createFilter()
    this.balanceText.filters = [filter];

    app.ticker.add(() => {
      this.balanceValue.text = String(Math.round(countBalance * 100) / 100)
    })
  }

  get viewContainer(): PIXI.Container {
    return this.view
  }
}

export class BetAmount {
  private view: PIXI.Container
  private betBg: PIXI.Sprite
  private betText: PIXI.Sprite
  private betValue: PIXI.Text

  constructor() {
    this.view = createContainer(250, 280)

    this.betBg = createSprite('balance_bg', 0.5, 0.5, 0)
    this.betText = createSprite('bet_text', 0.5, 0.7, 0, 0, -20)
    this.betValue = createText(String(countBet), style, 0.5, 0, 10)

    this.view.addChild(this.betBg)
    this.view.addChild(this.betText)
    this.view.addChild(this.betValue)

    const filter = createFilter()
    this.betText.filters = [filter];

    app.ticker.add(() => {
      this.betValue.text = String(countBet)
    })
  }

  get viewContainer(): PIXI.Container {
    return this.view
  }
}

function createSprite(typeElem: string | PIXI.Texture[], anchor: number, scaleElem: number | string, widthElem: number, posX: number | string = 0, posY: number | string = 0, add: number = 0): PIXI.Sprite {
  let elem!: PIXI.Sprite
  typeof typeElem === 'string' ? elem = PIXI.Sprite.from(typeElem) : elem = new PIXI.Sprite(typeElem[Math.floor(Math.random() * typeElem.length)]);
  anchor ? elem.anchor.set(anchor) : null;
  widthElem ? elem.width = widthElem : null;
  if (scaleElem) typeof scaleElem === 'number' ? elem.scale.set(scaleElem) : elem.scale.set(Math.min(SYMBOL_SIZE / elem.width, SYMBOL_SIZE / elem.height));
  if (posX) typeof posX === 'number' ? elem.position.x = posX : elem.position.x = Math.round((SYMBOL_SIZE - elem.width) / 2);
  if (posY) typeof posY === 'number' ? elem.position.y = posY : elem.position.y = add * SYMBOL_SIZE + 10;
  return elem
}

function createContainer(posX: number, posY: number): PIXI.Container {
  const container = new PIXI.Container()
  posX ? container.position.x = posX : null
  posY ? container.position.y = posY : null
  return container
}

function createText(text: string, style: PIXI.TextStyle, anchor: number, posX: number, posY: number): PIXI.Text {
  const container = new PIXI.Text(text, style)
  anchor ? container.anchor.set(anchor) : null
  posX ? container.position.x = posX : null
  posY ? container.position.y = posY : null
  return container
}

function createFilter(): PIXI.Filter {
  const filter = new PIXI.filters.ColorMatrixFilter();
  let count = 0;
  app.ticker.add(() => {
    count += 0.1;
    const { matrix } = filter;
    matrix[1] = Math.sin(count) * 3;
    matrix[2] = Math.cos(count);
    matrix[3] = Math.cos(count) * 1.5;
    matrix[4] = Math.sin(count / 3) * 2;
  });

  return filter
}

const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 24,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff', '#E1E1E1'],
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
});
