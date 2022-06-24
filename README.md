# Merkle Trees for EUL Distribution

Get a proof for an account:

    node get-proof.js trees/merkle-dist5.json.gz [account]

Render a merkle tree into markdown:

    node render-merkle-dist.js dump trees/merkle-dist5.json.gz output.md

Diff two merkle trees and render diff in markdown format:

    node render-merkle-dist.js diff trees/merkle-dist2.json.gz trees/merkle-dist5.json.gz output.md
