const ethers = require('ethers');
const merkleTree = require('./merkle-tree');
const utils = require('./utils');

let distFile = process.argv[2];
let account = process.argv[3];

let distribution = utils.loadMerkleDistFile(distFile);

let items = distribution.values.map(v => { return {
    account: v[0],
    token: v[1],
    claimable: ethers.BigNumber.from(v[2]),
}});

let proof = merkleTree.proof(items, account, utils.EulTokenAddr)

console.log({
    account,
    token: utils.EulTokenAddr,
    claimable: proof.item.claimable.toString(),
    proof: proof.witnesses,
});
