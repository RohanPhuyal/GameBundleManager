const { ccclass, property } = cc._decorator;

interface GameBundleVersionEntry {
    version: string;
    s: number;
    order: number;
}

interface GameBundleVersion {
    [key: string]: GameBundleVersionEntry;
}

interface GameTypes {
    slot: string[];
    fish: string[];
    other: string[];
}

@ccclass
export default class GameBundleSorter extends cc.Component {

    @property(cc.JsonAsset) gameBundleData: cc.JsonAsset = null;
    @property(cc.Node) displayNode: cc.Node = null;
    @property(cc.EditBox) customOrderInput: cc.EditBox = null;

    private sortedGameBundles: [string, GameBundleVersionEntry][] = [];
    private allGameBundles: [string, GameTypes][] = [];
    private slotGameBundles: [string, GameTypes][] = [];
    private fishGameBundles: [string, GameTypes][] = [];
    private otherGameBundles: [string, GameTypes][] = [];
    customOrderString = "4,5";
    private displayText = "";

    start() {
        this.sortGameBundlesByType("All");
    }

    onSortAllButtonClick() {
        this.customOrderString = this.customOrderInput.string;
    
        this.sortGameBundlesByType("All");
    }
    onSortSlotButtonClick() {
        this.customOrderString = this.customOrderInput.string;
        this.sortGameBundlesByType("Slot");
    }
    onSortFishButtonClick() {
        this.customOrderString = this.customOrderInput.string;
        this.sortGameBundlesByType("Fish");
    }
    onSortOtherButtonClick() {
        this.customOrderString = this.customOrderInput.string;
        this.sortGameBundlesByType("Others");
    }
    resetPreviousData() {
        this.sortedGameBundles = [];
        this.slotGameBundles = [];
        this.fishGameBundles = [];
        this.otherGameBundles = [];
    }

    sortGameBundles() {
        this.resetPreviousData();
        this.customOrderInput.string = this.customOrderString;
        const customOrderArray = this.customOrderString.split(',').map(Number);
        const prioritizedEntries: [string, GameBundleVersionEntry][] = [];

        // Parse the gameBundleVersion entries
        const gameBundleEntries: [string, GameBundleVersionEntry][] = Object.entries(this.gameBundleData.json.data.gameBundleVersion);

        // Sort by `order` property in ascending order
        gameBundleEntries.sort((a, b) => a[1].order - b[1].order);

        // Sort custom order first
        for (const priority of customOrderArray) {
            for (let j = 0; j < gameBundleEntries.length; j++) {
                const gameEntryS = gameBundleEntries[j][1].s; // Use `s` directly
                if (gameEntryS === priority) {
                    prioritizedEntries.push(gameBundleEntries[j]);
                    gameBundleEntries.splice(j, 1);
                    j--; // Decrement index to avoid skipping elements due to splice
                }
            }
        }

        // Sort remaining entries by `s` property in ascending order
        gameBundleEntries.sort((a, b) => a[1].s - b[1].s);

        // Merge the sorted custom-order elements with the rest of the array
        this.sortedGameBundles = [...prioritizedEntries, ...gameBundleEntries];
        cc.log(this.sortedGameBundles);
    }
    sortGameBundlesByType(sortType: string) {
        let filteredGameBundles: [string, GameBundleVersionEntry][] = [];
        switch (sortType) {
            case "All":
                this.sortGameBundles();
                filteredGameBundles = this.sortedGameBundles.filter(([key]) => {
                    const keyNumber = Number(key);
                    if (keyNumber >= 1000 && keyNumber <= 1999) {
                        this.allGameBundles.push([key, this.gameBundleData.json.data.gameBundleVersion[key]]);
                    }
                });
                cc.log(this.allGameBundles);
                this.displayGameBundleDetails(this.allGameBundles);
                break;
            case "Slot":
                this.sortGameBundles();
                filteredGameBundles = this.sortedGameBundles.filter(([key]) => {
                    const keyNumber = Number(key);
                    if (keyNumber >= 1000 && keyNumber <= 1999) {
                        this.slotGameBundles.push([key, this.gameBundleData.json.data.gameBundleVersion[key]]);
                    }
                });
                cc.log(this.slotGameBundles);
                this.displayGameBundleDetails(this.slotGameBundles);
                break;
            case "Fish":
                this.sortGameBundles();
                filteredGameBundles = this.sortedGameBundles.filter(([key]) => {
                    const keyNumber = Number(key);
                    if (keyNumber >= 2000 && keyNumber <= 2999) {
                        this.fishGameBundles.push([key, this.gameBundleData.json.data.gameBundleVersion[key]]);
                    }
                });
                cc.log(this.fishGameBundles);
                this.displayGameBundleDetails(this.fishGameBundles);
                break;
            case "Others":
                this.sortGameBundles();
                filteredGameBundles = this.sortedGameBundles.filter(([key]) => {
                    const keyNumber = Number(key);
                    if (keyNumber >= 3000) {
                        this.otherGameBundles.push([key, this.gameBundleData.json.data.gameBundleVersion[key]]);
                    }
                });
                cc.log(this.otherGameBundles);
                this.displayGameBundleDetails(this.otherGameBundles);
                break;
        }
    }

    displayGameBundleDetails(anyGameBundle: [string, GameBundleVersionEntry][] | [string, GameTypes][]) {
        // Build display string
        this.displayText = "";
        for (const [key, gameBundle] of anyGameBundle) {
            const gameBundleDetails = JSON.stringify(gameBundle);
            this.displayText += key + "\t" + gameBundleDetails + "\n";
        }

        // Update the scroll view label
        this.displayNode.getComponent(cc.Label).string = this.displayText;
    }
}
