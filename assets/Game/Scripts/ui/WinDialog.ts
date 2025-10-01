import { UserInfo, ChoiceType } from "../Info";
import Platform from "../../../framework/Platform";
import ViewManager from "../../../framework/plugin_boosts/ui/ViewManager";
import Consts from "../hex-lines-game/Consts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WinDialog extends cc.Component {


    @property(cc.ParticleSystem)
    ps:cc.ParticleSystem = null;

    @property(cc.Label)
    levelLabel:cc.Label = null;

    @property(cc.Label)
    stepLabel:cc.Label = null;

    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(cc.Label)
    percentLabel:cc.Label = null;

    @property(cc.Label)
    diamondLabel:cc.Label = null;

    @property(cc.Node)
    diamondNode:cc.Node = null;


    onLoad () {}
    start () {}

    onShown()
    {
        this.ps.resetSystem();
        Platform.showSmallRank();

        this.levelLabel.string = cc.js.formatStr("- 第 %s 关 - " , UserInfo.currentLevel)
        this.stepLabel.string = UserInfo.stepUsed.toString()
        this.timeLabel.string = UserInfo.timePassed.toString() +"s";
        let p = g.decreaseFomula(0.99,0.3,UserInfo.timePassed + UserInfo.stepUsed,UserInfo.currentLevel + 50 )
        this.percentLabel.string = (p* 100 ).toFixed(0) +"%"

        this.diamondNode.active = false
        
        if(UserInfo.level == UserInfo.currentLevel)
        {
            let lv = UserInfo.level
            let choise = UserInfo.getChoice(ChoiceType.Levelup);
            if(choise > 0 && Math.random() > 0.5 && lv >= 3)
            {
                this.scheduleOnce(_=>{
                    ViewManager.instance.show("Game/LevelupDialog",lv,p)
                },1)
                this.diamondNode.active = false
            }else{
                this.diamondNode.active = true;
                p = Math.min(p,1);
                let diamond = Math.floor(Math.max(30 * p,10))
                this.diamondLabel.string = diamond.toString();
                UserInfo.addDiamond(diamond);
            }
            UserInfo.level = lv + 1
            Platform.uploadScore(UserInfo.level);
            UserInfo.save();
        }
        let choise = UserInfo.getChoice(ChoiceType.HB);
        if(choise == 1)
        {
            if(UserInfo.level >= 3)
            {
                if(!UserInfo.isUnlock(Consts.FreeSkinId))
                {
                    ViewManager.instance.show("Game/HbDialog")
                }
            }
        }
    }

    click_rank()
    {
        ViewManager.instance.show("wechat/WxRankDialog")
    }

    click_shop()
    {
        ViewManager.instance.show("Game/ShopDialog");
    }

    click_next()
    {
        UserInfo.currentLevel = UserInfo.currentLevel +1;
        cc.director.loadScene("Game")
    }

    click_home()
    {
        cc.director.loadScene("Main")
    }

    click_share()
    {
        Platform.share();
    }
}