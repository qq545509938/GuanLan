
import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import {Sound} from "./Sound";


@ccclass
class startScene extends cc.Component {

    @property(cc.Node)
    rule: cc.Node = null;
    @property(cc.Toggle)
    tge_yinyue: cc.Toggle = null;
    sound: Sound;

    onLoad() {
        this.sound = this.node.getComponent(Sound);
        this.rule.active = false;
        let music = cc.sys.localStorage.getItem("volume");
        this.tge_yinyue.isChecked = music == "0" ? true : false;
        this.playSound();
    }

    OnClick(eventTouch) {
        let btnNode = eventTouch.currentTarget;
        let btnName = btnNode.name;
        this.sound.PlayOnClick();
        if(btnName == "kaishi") {
            cc.director.loadScene("gameScene");
        } else if(btnName == "guize") {
            this.rule.active = true;
        } else if(btnName == "shengyin") {
           this.playSound();
        } else if(btnName == "guanbi") {
            this.rule.active = false;
        }
    }

    playSound() {
        if (this.tge_yinyue.isChecked) {
            cc.audioEngine.setMusicVolume(0);
            cc.audioEngine.setEffectsVolume(0);
            cc.sys.localStorage.setItem("volume", 0);
        } else {
            cc.audioEngine.setMusicVolume(1);
            cc.audioEngine.setEffectsVolume(1);
            cc.sys.localStorage.setItem("volume", 1);
        }
    }

}