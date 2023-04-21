# EURCV Wrapper

A token wrapper for EURCV. 

The original Solidity code is available on the [`original`](https://github.com/w3hc/eurcv-wrapper/blob/original/scripts/deploy.ts) branch.

## Motivation

On [March 28, 2023](https://etherscan.io/tx/0xd675b72a03d9893f6218402b2aa29f60f2660c89803f27840e97f5bda4f8c60f), the Société Générale (a French bank) deployed a token named 'EURCV' to Ethereum Mainnet. You can [view the Solidity code on Etherscan](https://etherscan.io/address/0xf7790914dc335b20aa19d7c9c9171e14e278a134#code) and [read their announcement](https://www.sgforge.com/societe-generale-forge-launches-coinvertible-the-first-institutional-stablecoin-deployed-on-a-public-blockchain/).

Its design basically breaks the composability offered by a standard ERC-20, which makes it unusable by any app that's not whitelisted by the bank (registrar).

Let's fix that! 😉

## Install

```
npm i
```

## Test

```
npx hardhat test
```

## Resources

- [Official annoucement](https://www.sgforge.com/societe-generale-forge-launches-coinvertible-the-first-institutional-stablecoin-deployed-on-a-public-blockchain/)
- [Source code](https://etherscan.io/address/0xf7790914dc335b20aa19d7c9c9171e14e278a134#code)
- [Amxx's comments](https://twitter.com/Amxx/status/1649196760420478976)

## Versions

- Node [v18.15.0](https://nodejs.org/uk/blog/release/v18.15.0/)
- NPM [v9.5.0](https://github.com/npm/cli/releases/tag/v9.5.0)

## Support

You can contact me via [Element](https://matrix.to/#/@julienbrg:matrix.org), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discord.com/invite/uSxzJp3J76), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).