// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.JsonAsset) jsonData: cc.JsonAsset = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // numbers = [5, 3, 6, 1, 2, 5];

    customOrder = [46, 10];
    numbers=[];
    start() {
        let temp = [];
        // let numbers=[];

        // const entries = Object.entries(this.jsonData.json.data.gameBundleVersion);
        // for (let i = 0; i < entries.length; i++) {
        //     for (let j = i + 1; j < entries.length; j++) {
        //         const value1 = Object.values(entries[i][1])[2];
        //         const value2 = Object.values(entries[j][1])[2];

        //         if (value1 > value2) {
        //             temp = entries[i];
        //             entries[i] = entries[j];
        //             entries[j] = temp;
        //         }
        //     }
        // }
        const entries = Object.entries(this.jsonData.json.data.gameBundleVersion);
        for (let i = 0; i < entries.length; i++) {
            const value = Object.values(entries[i][1])[2];
            this.numbers.push(value);
        }
        this.customSortTest();
        
        // cc.log(this.numbers);
        // this.test();
        // this.customSortTest();

    }
    // test() {

    //     let temp = 0;
    //     for (let i = 0; i < this.numbers.length; i++) {
    //         for (let j = i + 1; j < this.numbers.length; j++) {

    //             if (this.numbers[i] > this.numbers[j]) {
    //                 temp = this.numbers[i];
    //                 this.numbers[i] = this.numbers[j];
    //                 this.numbers[j] = temp;
    //             }
    //         }
    //     }

    //     cc.log(this.numbers);
    // }

    customSortTest() {
        // let numbers = this.numbers;
        let numbers = [5, 3, 6, 1, 2, 5];
        // let order = this.customOrder;
        let order =  [5, 6];
        let temp = [];

        //getting index of all custom element
        for (let i = 0; i < order.length; i++) {
            for (let j = 0; j < numbers.length; j++) {
                if (numbers[j] == order[i]) {
                    temp.push(j);
                }
            }
        }

        //pushing values of previous found index
        let newNumber = [];
        for (let i = 0; i < temp.length; i++) {
            newNumber.push(numbers[temp[i]]);
        }
        cc.log("Temp: " + temp);
        
        //removing the values that exist on newNumber to avoid duplicate
        for (let i = 0; i < newNumber.length; i++) {
            for (let j = 0; j < numbers.length; j++) {
                if(numbers[j]==newNumber[i]){
                    numbers.splice(j,1);
                    break;
                }
            }
        }
        //sorting remain numbers in ascending order
        numbers.sort((a, b) => a - b);

        //merging the customorder and other order
        let finalNumber=[...newNumber,...numbers];
        cc.log(finalNumber);

    }
    // update (dt) {}
}
