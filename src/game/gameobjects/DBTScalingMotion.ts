// 各種型定義
type Pos = Phaser.Types.Math.Vector2Like;

// 拡張メソッド 宣言
declare module "phaser" {
    namespace GameObjects {
        interface GameObjectFactory {
            DBTScalingMotion(x: number, y: number, font: string, text: string | string[], config?: Phaser.Types.GameObjects.BitmapText.ScalingMotionConfig, align?: number): DBTScalingMotion;
        }
    }
    namespace Types.GameObjects.BitmapText {
        interface ScalingMotionConfig {
            speed?: number;
            minScale?: number;
            maxScale?: number;
            angleStep?: number;
        }
    }
}

// 拡張メソッド 定義
Object.defineProperty(Phaser.GameObjects.GameObjectFactory.prototype, 'DBTScalingMotion', {
    value: function (x: number, y: number, font: string, text: string | string[], config?: Phaser.Types.GameObjects.BitmapText.ScalingMotionConfig, size?: number, align?: number): DBTScalingMotion {
        const obj = new DBTScalingMotion(this.scene, x, y, font, text, config, size, align);
        this.scene.add.existing(obj);
        return obj;
    }
});

/**
 *  DynamicBitmapText クラスから継承し、新たにクラスを定義
 */
export class DBTScalingMotion extends Phaser.GameObjects.DynamicBitmapText {
    private speed: number = 4;
    private minScale: number = 0.5;
    private maxScale: number = 1.0;
    private angleStep: number = -30;

    private charPos: Array<Pos>;
    private curSp: number = 0

    constructor(scene: Phaser.Scene, x: number, y: number, font: string, text: string | string[], config?: Phaser.Types.GameObjects.BitmapText.ScalingMotionConfig, size?: number, align?: number) {
        super(scene, x, y, font, text, size, align);

        if (config?.speed) {
            this.speed = config.speed;
        }
        if (config?.minScale) {
            this.minScale = config.minScale;
        }
        if (config?.maxScale) {
            this.maxScale = config.maxScale;
        }
        if (config?.angleStep) {
            this.angleStep = config.angleStep;
        }

        this.charPos = Array.from({ length: text.length }) as Array<Pos>;
        super.setDisplayCallback(this.motion);

        return this;
    }

    private motion(data: Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig)
        : Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig {
        const parent = data.parent as DBTScalingMotion;
        if (!parent.charPos[data.index]) {
            parent.charPos[data.index] = { x: data.x, y: data.y } as Pos;
        }
        const char: Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData
            = parent.fontData.chars[data.charCode]
        parent.curSp += parent.speed / 1000;
        const ang = data.index * Phaser.Math.DegToRad(parent.angleStep) + parent.curSp;
        const scale = (Math.sin(ang) + 1) / 2 * (parent.maxScale - parent.minScale) + parent.minScale;
        data.scale = scale;
        const posXBase = parent.charPos[data.index].x / scale;
        const halfCharW = (char.width / 2) / scale;
        data.x = posXBase + halfCharW * (1 - scale);
        data.y = parent.charPos[data.index].y / scale +
            ((parent.fontData.lineHeight / 2) / scale) * (1 - scale);
        if (parent.curSp >= Math.PI * 2) {
            parent.curSp -= Math.PI * 2;
        }
        return data;
    }
}
