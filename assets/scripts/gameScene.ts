import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import {Sound} from "./Sound";
@ccclass
class gameScene extends cc.Component {

    @property(cc.Node)//半个篮筐碰撞检测
    lanban = null;
    @property(cc.Node)//另外半个篮筐实现篮球穿透篮筐的效果
    lanban2 = null;
    @property(cc.Node)//完整的篮筐用来处理移动动画
    lanbanMove = null;
    @property(cc.Node)
    lanqiu = null;
    @property(cc.Label)
    score = null;//分数
    @property(cc.Slider)
    Slider = null;
    @property(cc.ProgressBar)
    progressBar = null;
    @property(cc.Node)
    shouzhi = null;
    @property(cc.Node)
    end = null;
    @property(cc.Label)
    endScore = null;
    @property(cc.Label)
    maxScore = null;

    @property({
        type: cc.Float,
        tooltip: "水平移动速度"
    })
    speedX = 0;

    @property({
        type: cc.Float,
        tooltip: "垂直移动速度"
    })
    speedY = 0;

    @property({
        type: cc.Float,
        tooltip: "旋转速度"
    })
    rotationSpeed = 0;


    @property({
        type: cc.Float,
        tooltip: "篮板移动时间"
    })
    lanbanDuration = 0;
    @property({
        type: cc.Float,
        tooltip: "篮板最大高度"
    })
    lanbanMaxHeight = 0;
    @property({
        type: cc.Float,
        tooltip: "篮板最小高度"
    })
    lanbanMinHeight = 0;

    @property({
        type: cc.Float,
        tooltip: "初试时间"
    })
    initTime = 0;

    @property({
        type: cc.Float,
        tooltip: "递减时间"
    })
    decreaseTime = 0;

    @property({
        type: cc.Float,
        tooltip: "最小时间"
    })
    minTime = 0;



    rigidBody = null;
    leftTime = 0;
    dirction = 1;
    time = 0;
    sound: Sound;

    onLoad() {
        this.sound = this.node.getComponent(Sound);
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getPhysicsManager().enabled = true;
        this.rigidBody = this.lanqiu.getComponent(cc.RigidBody);
        this.node.on(cc.Node.EventType.TOUCH_START, this.jump, this);
        this.score.string = 0;
        this.lanban.x = this.node.width * (1 - this.node.anchorX) - this.lanban.width * this.lanban.anchorX;
        this.lanban.y = this.getHeight();
        this.SetLanBan2();
        this.end.active = false;
        this.time = this.initTime;
        this.lanbanMove.active = false;
        this.lanban.active = true;

    }


    jump() {
        if(!this.end.active) {
            this.sound.PlayJump();
            let xSpeed = this.speedX * this.dirction;
            this.rigidBody.linearVelocity = cc.v2(xSpeed, this.speedY);
            this.rigidBody.angularVelocity = this.rotationSpeed * this.dirction;
        }
        if(this.shouzhi.active) {
            this.shouzhi.active = false;
        }
    }

    Goal() {
        if(this.end.active) {
          return;
        }
        let score = Number(this.score.string) + 1;
        this.score.string = score;
        this.leftTime = 0;
        this.time = Math.max(this.initTime - score * this.decreaseTime, this.minTime);


        this.lanbanMove.setScale(this.lanban.scaleX, this.lanban.scaleY);
        this.lanbanMove.x = this.lanban.x;
        this.lanbanMove.y = this.lanban.y;
        this.lanbanMove.active = true;
        this.lanban.active = false;
        this.lanban2.active = false;
        this.sound.PlayGetScore();
        if(this.dirction > 0) {
            this.dirction *= -1;
            //移出屏幕
            let x = this.node.width * (1 - this.node.anchorX) + this.lanbanMove.width * this.lanbanMove.anchorX;
            let actionRight = cc.moveTo(this.lanbanDuration, cc.v2(x, this.lanbanMove.y));
            let callBack = () => {
                this.lanbanMove.setScale(1 ,1);
                //移到左边
                let x = -this.node.width * this.node.anchorX + this.lanbanMove.width * this.lanbanMove.anchorX;
                let y = this.getHeight();
                this.lanbanMove.x = -this.node.width * this.node.anchorX - this.lanbanMove.width * (1 - this.lanbanMove.anchorX);
                //从左边屏幕移出来
                let actionLeft = cc.moveTo(this.lanbanDuration, cc.v2(x, y));
                //刚体位置没有随着父节点移动
                let call = () => {
                    this.lanban.setScale(this.lanbanMove.scaleX, this.lanbanMove.scaleY);
                    this.lanban.x = this.lanbanMove.x;
                    this.lanban.y = this.lanbanMove.y;
                    this.SetLanBan2();
                    this.lanban.active = true;
                    this.lanban2.active = true;
                    this.lanbanMove.active = false;
                    let goal = this.lanban.getChildByName("goal");
                    goal.setPosition(39.1, -73.6);
                };
                let list = [actionLeft, cc.callFunc(call)];
                this.lanbanMove.runAction(cc.sequence(list));

            };
            let actionList = [actionRight, cc.callFunc(callBack)];

            this.lanbanMove.runAction(cc.sequence(actionList));
        } else {
            this.dirction *= -1;
            //移出屏幕
            let x = -this.node.width * this.node.anchorX - this.lanbanMove.width * (1 - this.lanbanMove.anchorX);
            let actionLeft = cc.moveTo(this.lanbanDuration, cc.v2(x, this.lanbanMove.y));
            let callBack = () => {
                this.lanbanMove.setScale(-1 ,1);
                //移到右边
                let x = this.node.width * (1 - this.node.anchorX) - this.lanbanMove.width * this.lanbanMove.anchorX;
                let y = this.getHeight();
                this.lanbanMove.x = this.node.width * (1 - this.node.anchorX) + this.lanbanMove.width * this.lanbanMove.anchorX;
                //从左边屏幕移出来
                let actionRight = cc.moveTo(this.lanbanDuration, cc.v2(x, y));
                //刚体位置没有随着父节点移动
                let call = () => {
                    this.lanban.setScale(this.lanbanMove.scaleX, this.lanbanMove.scaleY);
                    this.lanban.x = this.lanbanMove.x;
                    this.lanban.y = this.lanbanMove.y;
                    this.SetLanBan2();
                    this.lanban.active = true;
                    this.lanban2.active = true;
                    this.lanbanMove.active = false;
                    let goal = this.lanban.getChildByName("goal");
                    goal.setPosition(39.1, -73.6);
                };
                let list = [actionRight, cc.callFunc(call)];
                this.lanbanMove.runAction(cc.sequence(list));

            };
            let actionList = [actionLeft, cc.callFunc(callBack)];
            this.lanbanMove.runAction(cc.sequence(actionList));
        }
    }

    getHeight() {
        return Math.random() * this.lanbanMaxHeight + this.lanbanMinHeight;
    }

    update(dt) {
        if(this.score.string == 0) {
            this.Slider.progress = 1;
            this.progressBar.progress = 1;
        } else {
            this.leftTime += dt;
            let progress = 1 - this.leftTime / this.time;
            progress = progress > 0 ? progress : 0;
            this.progressBar.progress = progress;
            this.Slider.progress = progress;
        }
        if(this.leftTime >= this.time && !this.end.active) {
            this.end.active = true;
            this.sound.PlayEnd();
            let score = cc.sys.localStorage.getItem("guanlanScore") || 0;
            let maxScore = Math.max(score, Number(this.score.string));
            cc.sys.localStorage.setItem("guanlanScore", maxScore);
            this.endScore.string = this.score.string;
            this.maxScore.string = maxScore;
            this.rigidBody.angularVelocity = 0;
            this.rigidBody.linearVelocity = cc.v2(0, 0);
        }
    }

    OnClick(eventTouch) {
        let btnNode = eventTouch.currentTarget;
        let btnName = btnNode.name;
        this.sound.PlayOnClick();
        if(btnName == "kaishi") {
            cc.director.loadScene("gameScene");
        }
    }

    SetLanBan2() {

        let vertex1 = this.lanban.convertToWorldSpaceAR(this.lanban.getChildByName("p").getPosition());//篮筐顶点1
        let vertex2 = this.lanban.convertToWorldSpaceAR(this.lanban.getChildByName("q").getPosition());//篮筐顶点2
        let xWorld = Math.min(vertex1.x, vertex2.x) + Math.abs(vertex1.x - vertex2.x) / 2;
        let yWorld = vertex1.y + this.lanban2.height / 2;
        let position = this.node.convertToNodeSpaceAR(cc.v2(xWorld, yWorld));
        this.lanban2.setPosition(position);
    }

}