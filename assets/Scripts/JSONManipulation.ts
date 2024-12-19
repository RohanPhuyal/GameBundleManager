// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
interface GameBundleVersion {
    version: string;
    s: number;
    order: number;
}

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.JsonAsset) jsonData: cc.JsonAsset = null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node) scrollViewItem: cc.Node = null;
    customOrder = "4,5";
    @property(cc.EditBox) editBox: cc.EditBox = null;
    entries;
    // onLoad () {}
    
    start() {
        this.customSort();
    }

    onButtonClick() {
        this.customOrder = this.editBox.string;
        this.customSort();
    }

    customSort() {
        this.editBox.string = this.customOrder;
        const array = this.customOrder.split(',').map(Number);
        // let customOrder = [87, 95, 72];
        let customOrder = array;
        cc.log(customOrder);
        let temp = [];

        const entries = Object.entries(this.jsonData.json.data.gameBundleVersion);

        //sort for ascending (order)
        entries.sort((a, b) => {
            const o1 = Object.values(a[1])[2];
            const o2 = Object.values(b[1])[2];
            return o1 - o2;
        });

        // Sort custom order first
        for (let i = 0; i < customOrder.length; i++) {
            for (let j = 0; j < entries.length; j++) {
                const value = Object.values(entries[j][1])[1];
                if (value === customOrder[i]) {
                    temp.push(entries[j]);
                    entries.splice(j, 1);
                    j--; // Decrement index to avoid skipping elements due to splice
                }
            }
        }
        //Sort for ascending (s)
        entries.sort((a, b) => {
            const s1 = Object.values(a[1])[1];
            const s2 = Object.values(b[1])[1];
            return s1 - s2;
        });

        // Merge the sorted custom-order elements with the rest of the array
        let finalEntries = [...temp, ...entries];
        cc.log(finalEntries);
        let showString = "";

        for (let i = 0; i < finalEntries.length; i++) {
            const obj = finalEntries[i][1];
            const objText = JSON.stringify(obj);
            showString += finalEntries[i][0];
            showString += "\t" + objText;
            showString += "\n";
        }
        this.scrollViewItem.getComponent(cc.Label).string = showString;
    }


    // update (dt) {}
}
