import '../gameobjects/DBTWavingMotion';
import '../gameobjects/DBTScalingMotion';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        this.load.setBaseURL('assets');
        // 缶フォント
        this.load.bitmapFont('canfont', 'bitmapfonts/canfont.png', 'bitmapfonts/canfont.xml');
        // 岩石のフォント
        this.load.bitmapFont('rockdigits', 'bitmapfonts/rockdigits.png', 'bitmapfonts/rockdigits.xml');
    }

    create() {
        this.displayBitmaptext();
    }

    private displayBitmaptext() {
        const wconfig: Phaser.Types.GameObjects.BitmapText.WavingMotionConfig = {
            speed: 8,       // スピードを1～50くらいで指定。値が大きいほど速い。
            angleStepX: 30, // 文字間の周期差(X)。-180～180の範囲で指定。
            angleStepY: 30, // 文字間の周期差(Y)。-180～180の範囲で指定。
            radiusX: 20,    // 横のふり幅
            radiusY: 15     // 縦のふり幅
        }
        this.add.DBTWavingMotion(50, 100, 'canfont', 'ABCDEFG', wconfig);

        const sconfig: Phaser.Types.GameObjects.BitmapText.ScalingMotionConfig = {
            speed: 10,      // スピードを1～50くらいで指定。値が大きいほど速い。
            minScale: 0.8,  // スケールの最小値
            maxScale: 1.0,  // スケールの最大値
            angleStep: -30  // 文字間の周期差。-180～180の範囲で指定。
        }
        this.add.DBTScalingMotion(50, 300, 'rockdigits', '012345', sconfig);
    }
}
