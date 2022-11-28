export class Player {

    constructor(scene, group, spriteName, tint, maxVelocity, acceleration, x, y) {
        this.isDown = false;
        this.isMove = false;
        this.tint = tint;
        this.maxVelocity = maxVelocity;
        this.acceleration = acceleration;
        this.x = x;
        this.y = y;
        this.target = {};
        this.view = null;
        this.create(scene, group, spriteName);
    }

    create (scene, group, spriteName)
    {
        this.sprite = group.create(this.x, this.y, spriteName);
        this.sprite.setBounce(1);
        this.sprite.setCollideWorldBounds(true, 0, 0);
        this.sprite.allowGravity = false;
        //this.sprite.setCircle(true);
        this.sprite.setTint(this.tint);

        this.sprite.on('pointerdown', function(pointer) {
            console.dir(" down");
            this.isDown = true;
        }, this);

        scene.input.on('pointerup', function(pointer) {
            console.dir(" up");
            if(!this.isDown){
                return;
            }
            this.isDown = false;
            this.isMove = true;
            this.target.x = pointer.x;
            this.target.y = pointer.y;

            const x = this.target.x  - this.sprite.body.x;
            const y = this.target.y  - this.sprite.body.y;
            const ratio = this.acceleration / (Math.abs(x) + Math.abs(y));
            /*
            console.dir(" x=" + x);
            console.dir(" y=" + y);
            console.dir(" ratio=" + ratio);
            console.dir(" xr=" + (x*ratio));
            console.dir(" yr=" + (y*ratio));
            this.ct = 10;
            */
            this.sprite.setAccelerationX(x*ratio);
            this.sprite.setAccelerationY(y*ratio);
            this.sprite.setMaxVelocity(this.maxVelocity);
            this.sprite.anims.play(pointer.x < this.sprite.body.x ? 'left' : 'right', true);
        }, this);


        this.sprite.update = () => {
            if(this.isMove){
                let x = this.target.x - this.sprite.body.x;
                let y = this.target.y - this.sprite.body.y;
                if(Math.abs(x) < 10 && Math.abs(y) < 10){
                    this.isMove = false;
                    this.sprite.anims.play('turn', true);
                    this.sprite.setAccelerationX(0);
                    this.sprite.setAccelerationY(0);
                    this.sprite.setVelocityX(0);
                    this.sprite.setVelocityY(0);
                }
            }
        };
    }

    getSprite()
    {
        return this.sprite;
    }
}