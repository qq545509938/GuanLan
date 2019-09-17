
import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;


@ccclass
class startScene extends cc.Component {

    @property(cc.Node)
    rule: cc.Node = null;
    @property(cc.Node)
    closeMusic: cc.Node = null;

    onLoad() {
        this.rule.active = false;
        let isCloseMusic = cc.sys.localStorage.getItem("isCloseMusic") || 0;
        this.closeMusic.active = isCloseMusic;
        this.playSound();
    }

    OnClick(eventTouch) {
        let btnNode = eventTouch.currentTarget;
        let btnName = btnNode.name;
        if(btnName == "kaishi") {
            cc.director.loadScene("gameScene");
        } else if(btnName == "guize") {
            this.rule.active = true;
        } else if(btnName == "shengyin") {
            let isCloseMusic = cc.sys.localStorage.getItem("isCloseMusic") || 0;
            this.closeMusic.active = isCloseMusic == 0 ? true : false;
            isCloseMusic = isCloseMusic == 0 ? 1 : 0;
            cc.sys.localStorage.setItem("isCloseMusic", isCloseMusic);
            this.playSound();
        } else if(btnName == "guanbi") {
            this.rule.active = false;
        }
    }

    playSound() {
        let isCloseMusic = cc.sys.localStorage.getItem("isCloseMusic") || 0;
        let volume = isCloseMusic == 0 ? 0.5 : 0.01;
        // cc.audioEngine.play(cc.url.raw("resources/sound/button.mp3"), false, volume);
    }
}