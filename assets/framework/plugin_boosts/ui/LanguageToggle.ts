import DataCenter from '../misc/DataCenter';
import LocalizationManager from '../utils/LocalizationManager';
const { ccclass, property } = cc._decorator;

@ccclass
export default class LanguageToggle extends cc.Component {
    @property(cc.Node) nodeThump: cc.Node = null;
    @property(cc.Sprite) spriteBg: cc.Sprite = null;
    @property(cc.Label) vieLabel: cc.Label = null;
    @property(cc.Label) engLabel: cc.Label = null;
    @property([cc.Color]) colorBg: cc.Color[] = []; // 0:VIE ; 1:ENG

    private isToggleChecked: boolean = false;

    start() {
        if (!LocalizationManager.inst) LocalizationManager.init();

        const cur = DataCenter.get ? DataCenter.get("Localization.lang") : (LocalizationManager.inst && LocalizationManager.inst.lang) || "en";
        this.isToggleChecked = (cur === "vi");
        this.applyUI(cur);
    }

    toggleLang() {
        // guard fields
        if (!LocalizationManager.inst) LocalizationManager.init();

        const cur = LocalizationManager.inst.lang || "en";
        const next = (cur === "en") ? "vi" : "en";
        LocalizationManager.changeLanguage(next);
        this.isToggleChecked = (next === "vi");
        this.applyUI(next);
        cc.log("Language switched to", next);
    }

    applyUI(lang: string) {
        // safe checks before changing node properties
        if (this.vieLabel) this.vieLabel.node.active = (lang === "vi");
        if (this.engLabel) this.engLabel.node.active = (lang !== "vi");

        if (this.spriteBg && this.colorBg && this.colorBg.length >= 2) {
            // index: 0 => VIE, 1 => ENG
            this.spriteBg.node.color = (lang === "vi") ? this.colorBg[0] : this.colorBg[1];
        }

        if (this.nodeThump) {
            // move thump to left/right by absolute x value recorded from inspector
            // assume initial x stored in inspector (positive value)
            let baseX = Math.abs(this.nodeThump.x || 0);
            let x = (lang === "vi") ? baseX : -baseX;
            this.nodeThump.setPosition(cc.v2(x, 0));
        }
    }
}
