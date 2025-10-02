import ShopItemTemplate from "./ShopItemTemplate";
import SpriteFrameCache from "../../../framework/plugin_boosts/misc/SpriteFrameCache";
import { R } from "../hex-lines-game/Res";
import Platform from "../../../framework/Platform";
import { UserInfo, ChoiceType } from "../Info";
import { Toast } from "../../../framework/plugin_boosts/ui/ToastManager";
import UIFunctions from "../../../framework/plugin_boosts/ui/UIFunctions";
import Device from "../../../framework/plugin_boosts/gamesys/Device";
import DataCenter from '../../../framework/plugin_boosts/misc/DataCenter';
import LocalizationManager from '../../../framework/plugin_boosts/utils/LocalizationManager';
import Main from "../Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopDialog extends cc.Component {

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;

    @property(cc.Label)
    freeDiamondLabel: cc.Label = null;

    @property(cc.Button)
    freeDiamondBtn: cc.Button = null;

    onLoad() {
        // this.scrollview
    }

    start() {

    }

    onShown() {
        // {"id":"1","mini_img":"a1","img":"a2","cost":"100"},
        this.scrollview.showlist((node: cc.Node, data: any, i: number) => {
            // console.log(i,data);
            let item = node.getComponent(ShopItemTemplate);
            item.data = data;
            item.diamondLabel.string = data.cost;
            let isLocked = !UserInfo.isUnlock(data.id);
            item.btnBuyNode.active = isLocked
            item.maskNode.active = isLocked;
            item.borderNode.color = cc.Color.WHITE;
            item.titleLabel.string = data.text;
            item.selectedFlag.active = UserInfo.selectedSkin == data.id;
            item.btnSignal.add(this.click_unlock, this)
            SpriteFrameCache.instance.getSpriteFrame("Game/Textures/ThumbBgs/" + data.mini_img + ".jpg").then(sf => item.bgmini.spriteFrame = sf)
        }, R.skinConfig.json)

        this.refreshBtnStatus();
    }

    refreshBtnStatus() {

        const lang = LocalizationManager.inst.lang;

        if (g.isNextDay(UserInfo.shopFreeDiamondTime)) {
            lang === "vi" ? this.freeDiamondLabel.string = "Miễn Phí 50" : this.freeDiamondLabel.string = "Free 50"
            //this.freeDiamondLabel.string = "免费得50"
            UIFunctions.setButtonEnabled(this.freeDiamondBtn, true)
        } else {
            lang === "vi" ? this.freeDiamondLabel.string = "Đã nhận" : this.freeDiamondLabel.string = "Received"
            //this.freeDiamondLabel.string = "已领取"
            UIFunctions.setButtonEnabled(this.freeDiamondBtn, false)
        }
    }

    click_close() {

    }

    share_succ() {
        UserInfo.addDiamond(50);
        UserInfo.shopFreeDiamondTime = new Date().getTime();
        UserInfo.save()
        this.refreshBtnStatus();
    }

    click_free() {
        let choice = UserInfo.getChoice(ChoiceType.Shop)
        if (choice == 1) {
            Platform.share(this.share_succ, this)
        } else if (choice == 0) {
            this.share_succ()
        } else {
            //video
            Platform.watch_video(this.share_succ, this)
        }
    }

    selectBg(data) {
        UserInfo.selectedSkin = data.id;
        UserInfo.save()
        this.onShown();
    }

    click_unlock(data) {

        const lang = LocalizationManager.inst.lang;

        if (UserInfo.isUnlock(data.id)) {
            //select 
            this.selectBg(data);
            lang === "vi" ? Toast.make("Đã chọn " + data.text) : Toast.make("Selected " + data.text)
            //Toast.make("已选择 " + data.text)
            return;
        }
        if (UserInfo.diamond >= data.cost) {
            UserInfo.diamond -= data.cost;
            UserInfo.unlock(data.id);
            this.selectBg(data)
            lang === "vi" ? Toast.make(cc.js.formatStr("%s đã được mở khóa", data.text)) : Toast.make(cc.js.formatStr("%s Unlocked", data.text))
            //Toast.make(cc.js.formatStr("%s已解锁", data.text))
            Device.playEffect(R.audio_unlock)
            if (Main.instance)
                Main.instance.refreshRedpoints()
        } else {
            lang === "vi" ? Toast.make("Không đủ kim cương") : Toast.make("Not enough diamond")
            //Toast.make("钻石不足")
            Device.playEffect(R.audio_invalid)
        }
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
        this.refreshBtnStatus();
    }
}