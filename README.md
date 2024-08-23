# Soapbox

Soapbox is a decentralized Web3 free speech platform allows users to "shout" on the blockchain.
Shouts are immutable and censorship-resistant.

## Live site

[https://soapbox.gdn](https://soapbox.gdn)

## About

Copyright (c) AJ Savino and contributors

### contract_main

An EOS/WAX smart contract to make textual posts on the blockchain
Contains methods to "Shout", "Follow" and Banking

### contract_token

An EOS/WAX smart contract to establish the "SOAP" token

## Installation

-   [Docker](https://docs.docker.com/get-docker/)
-   [waxteam/dev](https://hub.docker.com/r/waxteam/dev)

waxteam/dev contains the EOSIO and WAX blockchain software and tools required to build and deploy smart contracts

## Building

-   docker start waxdev
-   docker attach waxdev
-   mkdir {contract_name}/build
-   cd {contract_name}/build
-   cmake ..
-   make

The built smart contract is in the 'build/{contract_name}' directory and contains the .wasm and .abi files that can be deployed to the blockchain
