import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
@ccclass
class lanqiu2 extends cc.Component {

    @property(cc.Node)
    boundaryLeft = null;//左边界
    @property(cc.Node)
    boundaryRight = null;//右边界

    canvas = null;//容器
    rigidBody = null;

    startPosition = null;//接触点
    gameScene = null;

    onLoad() {
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.canvas = this.node.parent;
        this.gameScene = this.canvas.getComponent("gameScene");
    }

    onBeginContact(contact,selfCollider,otherCollider) {
        if(otherCollider.node.name == "goal" && !this.startPosition) {
            this.startPosition = cc.v2(this.node.position);
        }
    }

    onEndContact(contact,selfCollider,otherCollider) {
        if(otherCollider.node.name == "goal") {
            let endPosition = cc.v2(this.node.position);
            let lanban = otherCollider.node.parent;
            let vertex1 = lanban.convertToWorldSpaceAR(lanban.getChildByName("p").getPosition());//篮筐顶点1
            let vertex2 = lanban.convertToWorldSpaceAR(lanban.getChildByName("q").getPosition());//篮筐顶点2
            let startNodePosition = this.node.parent.convertToWorldSpaceAR(this.startPosition);
            let endNodePosition = this.node.parent.convertToWorldSpaceAR(endPosition);
            let isGoal = cc.Intersection.lineLine(vertex1, vertex2, startNodePosition, endNodePosition);

            if(isGoal && startNodePosition.y > vertex1.y) {//从下方穿过的不算进球
                this.gameScene.Goal();
            }
            this.startPosition = null;
        } else if(otherCollider.node == this.boundaryRight && this.rigidBody.linearVelocity.x > 0) {
            this.scheduleOnce(()=>{
                this.node.x = this.boundaryLeft.x - this.node.width * (1 - this.node.anchorX);
            })
        } else if(otherCollider.node == this.boundaryLeft && this.rigidBody.linearVelocity.x < 0) {
            //刚体处于安全锁定状态需要延迟一帧
            this.scheduleOnce(()=>{
                this.node.x = this.boundaryRight.x + this.node.width * this.node.anchorX;
            });
        } else if(otherCollider.node.name == "lankuang") {

            this.rigidBody.angularVelocity *= (this.rigidBody.linearVelocity.x ^ this.rigidBody.angularVelocity) > 0 ? 1 : -1;
        }
    }


    onPreSolve(contact,selfCollider,otherCollider) {
    }

    onPostSolve(contact,selfCollider,otherCollider) {
    }

}