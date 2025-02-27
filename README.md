# Jetton Notes - Front End 

This front end is deployed on jettonnotes.com and can be accessed using the telegram mini app also at @jetton_notes_bot

# What is this?
This a Jetton wallet built with crypto note technology, powered by ZKP and inspired by Tornado Cash Crypto Notes.
## The problem
Wallets on Ton are messy. There are multiple standards already for wallet contracts and each jetton wallet must be deployed per wallet contract, it's extra work for a developer and confuses the users on which wallet to chose and how to recover it.
Setting gas correctly is also hard on Ton. It's more advanced to use it than a chain like Eth. 
There are multiple address formats depending on encoding and if you send to the wrong address e.g: to testnet, it can't be recovered even if you have the keys because the contract for the wallet was not deployed.

## This project is
A crypto note implementation and Jetton wallet with Account Abstraction.

It gives you simple wallet addresses, computed as a hash of two secret numbers. No contract deployment is needed for a user to own jettons.

It was created for Gas Free payments for including POS, Micropayments and supports burner wallets.

You can use it to Create Gift Cards, Game Asset attached balances, Gambling games or create even physical objects with Jetton balances.
All trustless with relayed transactions. 

## Why another Wallet contract? We got already 5 standards...
This is not a TON wallet, this is a Jetton wallet which is a new take on how you access jettons and works together with the existing wallet standards. 
With full relaying functional on mainnet, users can use Jettons without having a Ton wallet at all.


## Inspiration for the technology
Tornado cash crypto notes were the main inspiration for Jetton Notes, the commit-reveal scheme used for anonymizing transactions can be leveraged for other use cases too.

Use of technology:

Account Abstraction , P2P payments, POS systems

Micro payments for apps or games

Off-chain transactions using crypto notes Unlocks: 
Gift Cards implementations
Jettons attached to physical objects via crypto notes.
>
Crypto note based Jettons are embeddable in any application and can be transferred to users without a wallet.

Games where each in-game asset can hold jettons

AI Agents with Balance

Build `npm run build`

It's deployed on jettonnotes.com using cloudflare pages.