// 各種型定義
type Pos = Phaser.Types.Math.Vector2Like;

// 拡張メソッド 宣言
declare module "phaser" {
    namespace GameObjects {
        interface GameObjectFactory {
            DBTWavingMotion(x: number, y: number, font: string, text: string | string[], config?: Phaser.Types.GameObjects.BitmapText.WavingMotionConfig, size?: number, align?: number): DBTWavingMotion;
        }
    }
    namespace Types.GameObjects.BitmapText {
        interface WavingMotionConfig {
            speed?: number;
            angleStepX?: number;
            angleStepY?: number;
            radiusX?: number;
            radiusY?: number;
        }
    }
}

// 拡張メソッド 定義
Object.defineProperty(Phaser.GameObjects.GameObjectFactory.prototype, 'DBTWavingMotion', {
    value: function (x: number, y: number, font: string, text: string | string[], config?: Phaser.Types.GameObjects.BitmapText.WavingMotionConfig, size?: number, align?: number): DBTWavingMotion {
        const obj = new DBTWavingMotion(this.scene, x, y, font, text, config, size, align);
        this.scene.add.existing(obj);
        return obj;
    }
});

/**
 *  DynamicBitmapText クラスから継承し、新たにクラスを定義
 */
export class DBTWavingMotion extends Phaser.GameObjects.DynamicBitmapText {
    private speed: number = 4;
    private angleStepX: number = 30;
    private angleStepY: number = 30;
    private radiusX: number = 20;
    private radiusY: number = 20;

    private charPos: Array<Pos>;
    private curSp: number = 0

    constructor(scene: Phaser.Scene, x: number, y: number, font: string, text: string | string[], config?: Phaser.Types.GameObjects.BitmapText.WavingMotionConfig, size?: number, align?: number) {
        super(scene, x, y, font, text, size, align);

        if (config?.speed) {
            this.speed = config.speed;
        }
        if (config?.angleStepX) {
            this.angleStepX = config.angleStepX;
        }
        if (config?.angleStepY) {
            this.angleStepY = config.angleStepY;
        }
        if (config?.radiusX) {
            this.radiusX = config.radiusX;
        }
        if (config?.radiusY) {
            this.radiusY = config.radiusY;
        }

        this.charPos = Array.from({ length: text.length }) as Array<Pos>;
        super.setDisplayCallback(this.motion);

        return this;
    }

    private motion(data: Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig)
        : Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig {
        const parent = data.parent as DBTWavingMotion;
        if (!parent.charPos[data.index]) {
            parent.charPos[data.index] = { x: data.x, y: data.y } as Pos;
        }
        parent.curSp += parent.speed / 1000;
        const angX = data.index * Phaser.Math.DegToRad(parent.angleStepX) + parent.curSp;
        const angY = data.index * Phaser.Math.DegToRad(parent.angleStepY) + parent.curSp;
        data.x = parent.charPos[data.index].x + Math.cos(angX) * parent.radiusX;
        data.y = parent.charPos[data.index].y + Math.sin(angY) * parent.radiusY;
        if (parent.curSp >= Math.PI * 2) {
            parent.curSp -= Math.PI * 2;
        }
        return data;
    }

}
