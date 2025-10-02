
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverDialog extends cc.Component {
    onClickContinue() {
        cc.director.loadScene("Game")
    }

    onClickQuit() {
        cc.director.loadScene("Main")
    }
}
