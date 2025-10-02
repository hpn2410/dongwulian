import Platform from "../../../framework/Platform";
import PlayerRankingTemplate from "./PlayerRankingTemplate";
import { UserInfo, ChoiceType } from "../../../Game/Scripts/Info";
import MyRankingTemplate from "./MyRankingTemplate";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankListController extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    playerRankingTemplate: cc.Prefab = null;

    @property(cc.Prefab)
    myRankingTemplate: cc.Prefab = null;

    onEnable() {
        this.loadRanking();
    }

    loadRanking() {
        Platform.getRankList((errCode, list) => {
            if (!Array.isArray(list)) list = [];

            // sort theo level giảm dần
            list.sort((a, b) => b.level - a.level);

            const myLevel = UserInfo.level;
            console.log("Player level:", myLevel);

            // --- tìm vị trí chèn user ---
            let insertIndex = list.findIndex(p => myLevel >= p.level);
            if (insertIndex === -1) {
                insertIndex = list.length;
            }

            // chèn user vào danh sách
            list.splice(insertIndex, 0, {
                name: "You",
                level: myLevel,
                isUser: true
            });

            // cập nhật lại rank
            list = list.map((p, idx) => ({
                ...p,
                rank: idx + 1
            }));

            // clear node con cũ
            this.content.removeAllChildren();

            // render
            list.forEach(item => {
                let node;

                if (item.isUser) {
                    node = cc.instantiate(this.myRankingTemplate);
                    const script = node.getComponent(MyRankingTemplate);
                    if (script) {
                        script.rankLabel.string = String(item.rank);
                        script.levelLabel.string = String(item.level);
                        script.nameLabel.string = item.name;
                    }
                } else {
                    node = cc.instantiate(this.playerRankingTemplate);
                    const script = node.getComponent(PlayerRankingTemplate);
                    if (script) {
                        script.rankLabel.string = String(item.rank);
                        script.levelLabel.string = String(item.level);
                        script.nameLabel.string = item.name;
                    }
                }

                this.content.addChild(node);
            });
        }, this);
    }
}
