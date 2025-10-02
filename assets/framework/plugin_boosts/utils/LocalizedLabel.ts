import DataCenter from '../misc/DataCenter';
import LocalizationManager from './LocalizationManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalizedLabel extends cc.Component {
    @property
    key: string = ""; // key in dictionary

    private label: cc.Label = null;
    private _bound: boolean = false;

    onLoad() {
        this.label = this.getComponent(cc.Label) || null;
    }

    onEnable() {
        if (!LocalizationManager.inst) LocalizationManager.init();

        if (!this._bound) {
            try {
                DataCenter.on("Localization.lang", this.updateLabel, this);
            } catch (e) {
                cc.warn("LocalizedLabel: DataCenter.on failed", e);
            }
            this._bound = true;
        }

        try {
            const cur = DataCenter.get("Localization.lang");
            if (cur != null) {
                this.updateLabel(cur);
            } else {
                this.updateLabel(LocalizationManager.t(this.key));
            }
        } catch (e) {
            cc.warn("LocalizedLabel: update initial label failed", e);
        }
    }

    onDisable() {
        if (this._bound) {
            try {
                DataCenter.off("Localization.lang", this.updateLabel, this);
            } catch (e) {
                cc.warn("LocalizedLabel: DataCenter.off failed", e);
            }
            this._bound = false;
        }
    }

    updateLabel(_: any) {
        if (!this.label) return;
        try {
            this.label.string = LocalizationManager.t(this.key);
        } catch (e) {
            cc.warn("LocalizedLabel update error:", e);
        }
    }
}
