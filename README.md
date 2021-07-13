# hardhat-plugin

[Hardhat](https://hardhat.org) plugin from Keep Network.

## What

This plugin contains helpers for Hardhat.

## Installation

<_A step-by-step guide on how to install the plugin_>

```bash
npm install @keep-network/hardhat-helpers ethers@^5.0.32
```

Import the plugin in your `hardhat.config.js`:

```js
require("@keep-network/hardhat-helpers")
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@keep-network/hardhat-helpers"
```

## Environment extensions

This plugin extends the Hardhat Runtime Environment by adding an `helpers` field
whose type is `HardhatHelpers`.

## Usage

There are no additional steps you need to take for this plugin to work.

Install it and access `helpers` through the Hardhat Runtime Environment anywhere
you need it (tasks, scripts, tests, etc).

Example:

```js
hre.helpers.address.isValid(KeepToken.address)
```
