
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerRankingTemplate extends cc.Component {
    @property(cc.Label) rankLabel:cc.Label = null;
    @property(cc.Label) levelLabel:cc.Label = null;
    @property(cc.Label) nameLabel:cc.Label = null
    
}
