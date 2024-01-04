/*

Script to withdraw EUL from the EulStakes contract without requiring a UI.

Install NPM dependencies and then run the following command:

RPC_URL="<RPC URL HERE>" node stake-crawler.js withdraw <YOUR ADDRESS HERE>

*/



const ethers = require('ethers');

let stakeContract = '0xc697BB6625D9f7AdcF0fbf0cbd4DcF50D8716cd3';

let iface = new ethers.utils.Interface([
    'event Stake(address indexed who, address indexed underlying, address sender, uint newAmount)',
]);


const provider = new ethers.providers.JsonRpcBatchProvider(process.env.RPC_URL);

async function getLogs() {
    let filter = {
        address: stakeContract,
        fromBlock: 0,
    };

    let logs = await provider.getLogs(filter);

    let lookup = {};

    for (let log of logs) {
        log = iface.parseLog(log);
        if (log.name !== 'Stake') console.warn('unknown event: ', log.name);

        let who = log.args.who.toLowerCase();
        let underlying = log.args.underlying.toLowerCase();

        lookup[who] = lookup[who] || {};
        lookup[who][underlying] = lookup[who][underlying] || {};

        lookup[who][underlying] = log.args.newAmount;
    }

    return lookup;
};


async function main() {
    let mode = process.argv[2];

    let lookup = await getLogs();

    if (mode === 'dump') {
        for (let who of Object.keys(lookup)) {
            for (let underlying of Object.keys(lookup[who])) {
                let amount = lookup[who][underlying];
                if (amount.eq(0)) continue;
                console.log(`${who},${underlying},${amount.toString()}`);
            }
        }
    } else if (mode === 'withdraw') {
        let who = process.argv[3].toLowerCase();

        let u = lookup[who];
        let output = [];

        for (let underlying of Object.keys(lookup[who])) {
            let amount = lookup[who][underlying];
            if (amount.eq(0)) continue;
            output.push([underlying, amount.mul(-1).toString()]);
        }

        console.log(`Go to: https://etherscan.io/address/0xc697BB6625D9f7AdcF0fbf0cbd4DcF50D8716cd3#writeContract`);
        console.log();
        console.log(`Connect your web3 wallet with address ${who}`);
        console.log();
        console.log(`Enter the following as the "ops" parameter to the stake() function and press the Write button:`); 
        console.log();
        console.log(JSON.stringify(output));
    } else {
        throw Error("unknown mode");
    }
}

main();
