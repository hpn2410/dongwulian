import { Toast } from "../../../framework/plugin_boosts/ui/ToastManager";
import ViewManager from "../../../framework/plugin_boosts/ui/ViewManager";
import View from "../../../framework/plugin_boosts/ui/View";
import { UserInfo } from "../Info";
import Platform from "../../../framework/Platform";
import Device from "../../../framework/plugin_boosts/gamesys/Device";
import { R } from "../hex-lines-game/Res";
import UIFunctions from "../../../framework/plugin_boosts/ui/UIFunctions";
import LocalizationManager from '../../../framework/plugin_boosts/utils/LocalizationManager';
import DataCenter from '../../../framework/plugin_boosts/misc/DataCenter';
import Main from "../Main";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LuckyDialog extends cc.Component {

    
    start () {}

    @property(cc.Sprite)
    wheelSp:cc.Sprite

    _canRotate = true;

    @property([cc.Sprite])
    sprites:cc.Sprite[] = []

    @property([cc.Label])
    labels:cc.Label[] = []

    @property(cc.Button)
    btn_freedraw:cc.Button = null;

    @property(cc.Button)
    btn_videodraw:cc.Button = null;

    @property(cc.Node)
    freedrawTip:cc.Node = null;


    @property(cc.Label)
    drawLabel:cc.Label = null;

    //lang: string = "en";

    static MaxVideoCount = 5;

    // click_draw()
    // {

    // }

    pool = []
    

    share_succ()
    {
        this.startDraw();
        UserInfo.freedrawTime = new Date().getTime()
        UserInfo.save()
        Main.instance.refreshRedpoints()
        this.onShown();
    }

    click_freeedraw()
    {
        if (g.isNextDay(UserInfo.freedrawTime))
        {
            this.share_succ()
        }
    }

    onLoad () {

        for (var i = 0 ;i < R.luckyConfig.json.length; i ++)
        {
            var cfg = R.luckyConfig.json[i];
            let chance = parseFloat(cfg.chance)
            for (var j = 0 ; j < chance * 2 ; j++)
            {
                this.pool.push(i);
            }
        }
        this.pool.shuffle()
        console.log(this.pool);
    }

    startDraw()
    {
        let id = g.getRandomInArray(this.pool)
        this.startWheel(id)
        Device.playEffect(R.audio_draw);
    }

    // 5次
    click_videodraw()
    {
        if (UserInfo.luckyVideoWatchCount >= LuckyDialog.MaxVideoCount)
        {
            if(g.isNextDay(UserInfo.luckyVideoWatchTime))
            {
                UserInfo.luckyVideoWatchCount = 0;
                UserInfo.luckyVideoWatchTime = new Date().getTime();
            }else{
                // Platform.share(_=>{
                //     this.startDraw()
                // })
                return;
            }
        }else{
            Platform.watch_video(_=>{
                UserInfo.luckyVideoWatchCount ++ 
                this.startDraw()
            })
        }
        //video 流量主开通后
        // Platform.watch_video(_=>{
        //     this.startDraw()
        //     UserInfo.luckyVideoWatchCount += 1;
        //     UserInfo.save();
        //     this.onShown()
        //     // Toast.make("还剩" +  (5- UserInfo.luckyVideoWatchCount) +"次机会")
        // });
    }


    calculateAngle(index:number){//奖品的index从0开始
        let angle = -(index-1) * 60 - 30  -  4 * 360 -  this.wheelSp.node.rotation %360 
        return angle
    }

    onShown()
    {
        const lang = LocalizationManager.inst.lang; 

        if (UserInfo.luckyVideoWatchCount >=  LuckyDialog.MaxVideoCount)
        {
            //this.drawLabel.string = "已用完"
            this.drawLabel.string = lang === "vi" ? "Đã sử dụng hết" : "Used up";
            UIFunctions.setButtonEnabled(this.btn_videodraw,false)
        }else{
            //this.drawLabel.string = "看视频抽奖"
            this.drawLabel.string = lang === "vi" ? "Xem quảng cáo" : "Watch ads to spin";
            UIFunctions.setButtonEnabled(this.btn_videodraw,true)
        }
        if (g.isGreaterDate(new Date(),  new Date(UserInfo.freedrawTime)) )
        {
            //free draw 
            this.btn_freedraw.interactable = true
            this.btn_freedraw.node.opacity = 255;
            this.freedrawTip.active = false
        }else{
            this.btn_freedraw.interactable = false
            this.btn_freedraw.node.opacity = 100;
            this.freedrawTip.active = true;
        }

        for (var i = 0 ; i< R.luckyConfig.json.length; i ++)
        {
            let cfg = R.luckyConfig.json[i]
            this.labels[i].string = cfg.gold_reward +""
        }
    }

    startWheel(id)
    {
        const lang = LocalizationManager.inst.lang; 

        console.log("target wheel:" ,id);
        let angle = this.calculateAngle(id)
        if (!this._canRotate){
            lang === "vi" ? Toast.make('Chọn giải thưởng...'): Toast.make('Choose your prieze...');
            //Toast.make('正在给您挑选奖品...')
            return
        }
        this._canRotate = false

        let stage3 = cc.rotateBy(Math.abs(angle/400),angle)
        let callFunc = cc.callFunc(function(){
            this._canRotate = true
            this.showRes(id)
        }.bind(this))
        let sequence = cc.sequence(stage3,callFunc)
        this.wheelSp.node.runAction(sequence.easing(cc.easeQuadraticActionInOut()))
    }

    showRes(id)
    {
        const lang = LocalizationManager.inst.lang;

        let cfg = R.luckyConfig.json[id]
        let gold = !isNaN((Number(cfg.gold_reward)))
        if(gold)
        {
            this.getComponent(View).hide()
            ViewManager.instance.show("Game/GetDialog",cfg.gold_reward)
        }
        else{
            //神秘
            lang === "vi" ? Toast.make('Chúc mừng ' + cfg.gold_reward): Toast.make('Congrats!' + cfg.gold_reward);
            //Toast.make("恭喜你抽中了 " + cfg.gold_reward);
            UserInfo.unlock(g.randomInt(0,6));
            // Device.playEffect(R.audio_unlock);
        }
    }

    update(dt) {

    }

    click_close()
    {
        const lang = LocalizationManager.inst.lang;

        if (!this._canRotate){
            lang === "vi" ? Toast.make('Chọn giải thưởng...'): Toast.make('Choose your prieze...');
            //Toast.make('正在给您挑选奖品...');
            return 
        }
        this.getComponent(View).hide()
    }

    onEnable() {
        // Register event listener for language change
        DataCenter.on("Localization.lang", this.onLanguageChanged, this);
    }

    onDisable() {
        // Unregister event listener
        DataCenter.off("Localization.lang", this.onLanguageChanged, this);
    }

    onLanguageChanged(newLang: string) {
        this.onShown();
        this.startDraw();
        this.click_close();
    }
}