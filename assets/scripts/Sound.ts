const { ccclass, property } = cc._decorator;

@ccclass
export class Sound extends cc.Component {

    backGroundVolume: number = 1;


    @property({ tooltip: "背景音乐", type: cc.AudioClip })
    background: cc.AudioClip = null;

    @property({ tooltip: "按钮音效", type: cc.AudioClip })
    anniu: cc.AudioClip = null;

    @property({ tooltip: "获得分数音效", type: cc.AudioClip })
    getScore: cc.AudioClip = null;

    @property({ tooltip: "球弹起音效", type: cc.AudioClip })
    jump: cc.AudioClip = null;

    @property({ tooltip: "时间到音效", type: cc.AudioClip })
    end: cc.AudioClip = null;




    onLoad() {
        this.backGroundVolume = cc.sys.localStorage.getItem("volume") || 1;
        cc.audioEngine.setMusicVolume(this.backGroundVolume);
        cc.audioEngine.setEffectsVolume(this.backGroundVolume);
        this.PlayBackGround();
    }

    PlayBackGround() {
        cc.audioEngine.playMusic(this.background, true);
    }

    PlayOnClick() {
        if(cc.audioEngine.getEffectsVolume()){
            cc.audioEngine.playEffect(this.anniu, false);
        }
    }

    /**播放获得分数音效 */
    PlayGetScore(){
        if(cc.audioEngine.getEffectsVolume()){
            cc.audioEngine.playEffect(this.getScore, false);
        }
    }

    PlayJump() {
        if(cc.audioEngine.getEffectsVolume()){
            cc.audioEngine.playEffect(this.jump, false);
        }
    }

    PlayEnd() {
        if(cc.audioEngine.getEffectsVolume()){
            cc.audioEngine.playEffect(this.end, false);
        }
    }
}

