import { UserInfo, ChoiceType } from "../Info";
import View from "../../../framework/plugin_boosts/ui/View";
import DataCenter from '../../../framework/plugin_boosts/misc/DataCenter';
import LocalizationManager from '../../../framework/plugin_boosts/utils/LocalizationManager';
import Platform from "../../../framework/Platform";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelupDialog extends cc.Component {

    @property(cc.Label)
    diamondLabel:cc.Label = null;


    @property(cc.Label)
    btnLabel:cc.Label = null;

    @property(cc.Label)
    tipLabel:cc.Label = null;

    @property(cc.Label)
    levelLabel:cc.Label = null;

    mult:number = 1;

    baseDiamond:number = 0;

    onLoad () {}
    start () {}
    onShown(level,p)
    {
        const lang = LocalizationManager.inst.lang;

        //给钻石
        p = Math.min(p,1);
        let diamond = Math.floor(Math.max(30 * p,10))
        this.baseDiamond = diamond;
        this.diamondLabel.string = diamond.toString();
        lang === "vi" ? this.levelLabel.string = cc.js.formatStr("- Màn %s - ",level): this.levelLabel.string = cc.js.formatStr("- Level %s - ",level)
        //this.levelLabel.string = cc.js.formatStr("- 第 %s 关 - ",level)

        if(Math.random() > 0.7)
        {
            this.mult = g.randomInt(3,6)
            lang === "vi" ? this.btnLabel.string = "Nhận x" + this.mult : this.btnLabel.string = "Receive x" + this.mult
            //this.btnLabel.string = this.mult +"倍领取"
        }else{
            lang === "vi" ? this.btnLabel.string = "Nhận x2" : this.btnLabel.string = "Receive x2"
            //this.btnLabel.string = "双倍领取"
            this.mult = 2
        }
        lang === "vi" ? this.tipLabel.string ="Chúc mừng bạn nhận được " + this.btnLabel.string +" phần thưởng":
        this.tipLabel.string ="Congratulations on receiving " + this.btnLabel.string +" reward"
        //this.tipLabel.string ="恭喜获得" + this.btnLabel.string +"奖励机会"
    }

    click_get()
    {
        UserInfo.addDiamond(this.baseDiamond);
        UserInfo.save();
        this.getComponent(View).hide()
    }

    share_suc()
    {
        UserInfo.addDiamond(this.baseDiamond*this.mult);
        UserInfo.save();
        this.getComponent(View).hide()
    }

    click_getex()
    {
        let choise = UserInfo.getChoice(ChoiceType.Levelup);
        if(choise == 1)
        {
            Platform.share(this.share_suc,this);
        }else if(choise == 0)
        {
            this.share_suc();
        }else{
            //video
            Platform.watch_video(this.share_suc,this)
        }
        
    }
}