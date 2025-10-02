import DataCenter, { dc, field } from "../misc/DataCenter";

@dc("Localization", true)
export default class LocalizationManager extends DataCenter {
    @field({ default: "en" })
    lang: string = "en"; // english by default

    private static texts: { [key: string]: { [lang: string]: string } } = {
        "PlayText": { en: "Play", vi: "Chơi" },
        "QuitText": { en: "Quit", vi: "Thoát" },
        "SkinText": { en:"Skins", vi: "Trang phục"},
        "ShareText": { en: "Share", vi: "Chia sẻ" },
        "LeaderboardText": { en: "Leaderboard", vi: "Xếp hạng" },
        "AddToMyProgramText": { en: "Add To My Program", vi: "Thêm Vào Ứng Dụng" },
        "FreeText": { en: "Free", vi: "Miễn Phí" },
        "CoolDownText": { en: "Cool Down00:00", vi: "Đang Chờ00:00" },
        "LuckyWheelText": { en: "Lucky Wheel", vi: "Vòng Quay May Mắn" },
        "DailyGetText": { en: "= Daily Get =", vi: "= Nhận Hàng Ngày =" },
        "ReceiveText": { en: "Receive", vi: "Nhận Được" },
        "ReceiveDoubleText": { en: "Receive x2", vi: "Nhận x2" },
        "HunredDiamondText": { en: "Diamonds x100", vi: "Kim Cương x100" },
        "DiscardText": { en: "Discard", vi: "Bỏ Qua" },
        "ContinueText": { en: "Continue", vi: "Tiếp Tục" },
        "PassRewardText": { en: "Pass Reward", vi: "Phần Thưởng Vượt Ải" },
        "RewardText": { en: "Reward: ", vi: "Thưởng: " },
        "AwesomeText": { en: "Awesome", vi: "Tuyệt Vời" },
        "StepText": { en: "Steps: ", vi: "Bước: " },
        "TimeText": { en: "Time: ", vi: "Thời Gian: " },
        "LevelText": { en: "Level ", vi: "Màn " },
        "RankText": { en: "Rank ", vi: "Hạng " },
        "NameText": { en: "Name ", vi: "Tên " },
        "UsageExceededPlayerText": { en: "Usage         Exceeded         Player", vi: "Tốn          Vượt           Người Chơi" },
        "ConnectSameAnimalText": { en: "Connect Same Animal", vi: "Nối Con Vật Giống Nhau" },
        "PressAnyButtonToCloseText": { en: "Press Any Button To Close", vi: "Nhấn Bất Kỳ Nút Để Đóng" },
        "AskHelpText": { en: "Ask For Help", vi: "Nhờ Giúp Đỡ" },
        "HomePageText": { en: "Home Page", vi: "Trang Chủ" },
        "ChallengeText": { en: "Challenge", vi: "Thử Thách" },
        "NextLevelText": { en: "Next Level", vi: "Qua Màn" },
        "CongratulationsText": { en: "Congratulations", vi: "Chúc Mừng" },
        "SkinWithEffectText": { en: "Skin With Special Effect", vi: "Trang Phục Có Hiệu Ứng" },
        "SkinSelectionText": { en: "= Skin Selection =", vi: "= Chọn Trang Phục =" },
        "ViewRankingText": { en: "View Ranking", vi: "Xem BXH" },
        "GameOverText": { en: "Game Over", vi: "Kết thúc trò chơi" },
        "LoseText": { en: "You Lose!", vi: "Bạn thua rồi!" },
        "RetryText": { en: "Retry", vi: "Thử lại" },
        "ExitText": { en: "Exit", vi: "Thoát" }
    };

    static inst: LocalizationManager = null;

    // init must be called early (e.g. in main.js before runSceneImmediate)
    static init() {
        if (!this.inst) {
            this.inst = DataCenter.register(LocalizationManager) as LocalizationManager;

            // Defer the initial emit/set to next tick to avoid running listeners
            // while the scene graph is still being established (fixes setParent/_children null issue).
            setTimeout(() => {
                try {
                    // Use DataCenter.set so DataCenter's emit flow is used (listeners will be invoked).
                    DataCenter.set("Localization.lang", this.inst.lang);
                } catch (e) {
                    cc.error("LocalizationManager: deferred init set failed:", e);
                }
            }, 0);
        }
        return this.inst;
    }

    static t(key: string): string {
        if (!this.inst) {
            // safe init fallback (if someone forgot to call init)
            this.init();
        }
        let lang = this.inst.lang || "en";
        let dic = this.texts[key];
        if (!dic) return key;
        return dic[lang] || dic["en"];
    }

    static changeLanguage(newLang: string) {
        if (!this.inst) this.init();
        if (newLang !== this.inst.lang) {
            this.inst.lang = newLang;
            // save to local via DataCenter instance (persist)
            try { 
                this.inst.save(); 
            } catch (e) { 
                cc.warn("Localization save failed:", e); 
            }

            // Set via DataCenter so listeners get notified via DataCenter event flow
            DataCenter.set("Localization.lang", newLang);
        }
    }
}
