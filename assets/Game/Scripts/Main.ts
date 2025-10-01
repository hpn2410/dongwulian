import ViewManager from "../../framework/plugin_boosts/ui/ViewManager";
import { UserInfo } from "./Info";
import Platform from "../../framework/Platform";
import Device from "../../framework/plugin_boosts/gamesys/Device";
import { R } from "./hex-lines-game/Res";
import { Toast } from "../../framework/plugin_boosts/ui/ToastManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    static instance: Main = null;
    @property(cc.Node)
    drawRedPoint: cc.Node = null;

    @property(cc.Node)
    skinRedPoint: cc.Node = null;

    onLoad() {
        Main.instance = this;
        Platform.login();
        UserInfo.init();
        Device.playMusic(R.audio_bgm);
    }

    refreshRedpoints() {
        if (g.isNextDay(UserInfo.freedrawTime)) {
            this.drawRedPoint.active = true
        }
        else {
            this.drawRedPoint.active = false;
        }
        this.skinRedPoint.active = UserInfo.diamond >= 500 && !UserInfo.isAllUnlocked()
    }

    start() {

        if (g.isNextDay(UserInfo.dailyGetTime)) {
            ViewManager.instance.show("Game/DailyDialog")
        }

        this.refreshRedpoints();

        if (g.isNextDay(UserInfo.luckyVideoWatchTime)) {
            UserInfo.luckyVideoWatchTime = new Date().getTime()
            UserInfo.luckyVideoWatchCount = 0;
        }

        Platform.showBannerAd();
    }

    click_play() {
        ViewManager.instance.show("Game/LevelDialog")
    }

    toggle_sfx(t) {
        Device.setSoundsEnable(!t.isChecked)
    }

    click_skin() {
        ViewManager.instance.show("Game/ShopDialog")
    }

    click_rank() {
        ViewManager.instance.show("wechat/WxRankDialog")
    }

    onShare() {

    }

    click_share() {
        Platform.share(this.onShare);
    }

    click_luck() {
        ViewManager.instance.show("Game/LuckyDialog")
    }


    click_more() {
        Toast.make("敬请期待")
    }

    // update (dt) {}
}
