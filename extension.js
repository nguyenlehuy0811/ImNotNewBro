(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('April Fools Turbo Engine requires Unsandboxed mode!');
  }

  const APRIL_FOOLS_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlREFUeNpi/P//PwM1ARMD3QBoB4wuGHUg2gGjC0YdiHYSsI4B4m2E5IBAAnL10f3Uf1AC4vWg4f20C1C4H3S/H3C4H3a4HwAAAA3g4A34gC11AAAAAElFTkSuQmCC';

  class AprilFoolsTurboEngine {
    constructor() {
      this.canvas = Scratch.renderer.gl.canvas;
      this.currentFilter = '';
      this.currentTransform = '';
    }

    getInfo() {
      return {
        id: 'aprilFoolsTurboEngine',
        name: 'April Fools Turbo',
        color1: '#ff0055',
        color2: '#cc0044',
        blockIconURI: APRIL_FOOLS_ICON,
        menuIconURI: APRIL_FOOLS_ICON,
        blocks: [
          '--- SCREEN TROLLS ---',
          {
            opcode: 'flipScreen',
            blockType: Scratch.BlockType.COMMAND,
            text: 'rotate screen by [ANGLE] degrees',
            arguments: {
              ANGLE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 180 }
            }
          },
          {
            opcode: 'setScreenFilter',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set screen effect to [EFFECT]',
            arguments: {
              EFFECT: { type: Scratch.ArgumentType.STRING, menu: 'filterMenu', defaultValue: 'invert' }
            }
          },
          {
            opcode: 'resetScreenEffects',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset screen to normal'
          },

          '--- HYPER TROLL EFFECTS ---',
          {
            opcode: 'fakeErrorPopup',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show fake alert [TITLE] message [MESSAGE]',
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'SYSTEM WARNING' },
              MESSAGE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Your project was deleted for being too cool!' }
            }
          },
          {
            opcode: 'jiggleSprite',
            blockType: Scratch.BlockType.COMMAND,
            text: 'shake sprite wildly with intensity [INTENSITY] for [TIME] secs',
            arguments: {
              INTENSITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 },
              TIME: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'playJumpscareSound',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play jumpscare sound (frequency [FREQ] Hz)',
            arguments: {
              FREQ: { type: Scratch.ArgumentType.NUMBER, defaultValue: 800 }
            }
          },

          '--- DANGER ZONE ---',
          {
            opcode: 'dontPressThisBlock',
            blockType: Scratch.BlockType.COMMAND,
            text: '⚠️ DO NOT PRESS THIS ⚠️'
          }
        ],
        menus: {
          filterMenu: {
            acceptReporters: false,
            items: ['normal', 'invert', 'grayscale', 'blur', 'sepia', 'hue-rotate']
          }
        }
      };
    }

    flipScreen(args) {
      const angle = Number(args.ANGLE) || 0;
      this.currentTransform = `rotate(${angle}deg)`;
      this.applyStyles();
    }

    setScreenFilter(args) {
      const effect = String(args.EFFECT);
      let filterStr = '';
      if (effect === 'normal') filterStr = 'none';
      else if (effect === 'invert') filterStr = 'invert(100%)';
      else if (effect === 'grayscale') filterStr = 'grayscale(100%)';
      else if (effect === 'blur') filterStr = 'blur(5px)';
      else if (effect === 'sepia') filterStr = 'sepia(100%)';
      else if (effect === 'hue-rotate') filterStr = 'hue-rotate(180deg)';

      this.currentFilter = filterStr;
      this.applyStyles();
    }

    resetScreenEffects() {
      this.currentFilter = 'none';
      this.currentTransform = 'rotate(0deg)';
      this.applyStyles();
    }

    applyStyles() {
      if (this.canvas) {
        this.canvas.style.filter = this.currentFilter;
        this.canvas.style.transform = this.currentTransform;
        this.canvas.style.transition = 'all 0.3s ease';
      }
    }

    fakeErrorPopup(args) {
      alert(`${args.TITLE}\n\n${args.MESSAGE}`);
    }

    async jiggleSprite(args, util) {
      const target = util.target;
      if (!target) return;

      const intensity = Number(args.INTENSITY) || 10;
      const duration = Number(args.TIME) || 1;
      const startTime = performance.now();
      const origX = target.x;
      const origY = target.y;
      const origDir = target.direction;

      while (performance.now() - startTime < duration * 1000) {
        const dx = (Math.random() - 0.5) * intensity;
        const dy = (Math.random() - 0.5) * intensity;
        const dDir = (Math.random() - 0.5) * intensity * 2;

        target.setXY(origX + dx, origY + dy);
        target.setDirection(origDir + dDir);

        Scratch.vm.runtime.requestRedraw();
        await new Promise(r => setTimeout(r, 16));
      }

      target.setXY(origX, origY);
      target.setDirection(origDir);
      Scratch.vm.runtime.requestRedraw();
    }

    playJumpscareSound(args) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(Number(args.FREQ) || 800, ctx.currentTime);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
        console.error(e);
      }
    }

    dontPressThisBlock() {
      while (true) {
        console.log("BOOM! You asked for it!");
      }
    }
  }

  Scratch.extensions.register(new AprilFoolsTurboEngine());
})(Scratch);
