## Chainerd - [ec2-16-171-240-55.eu-north-1.compute.amazonaws.com](http://ec2-16-171-240-55.eu-north-1.compute.amazonaws.com:3001/)

![portfolio](https://user-images.githubusercontent.com/85624034/197272611-e25e2368-73b3-471e-b017-e6bb0ac6b0d4.jpg)
![account](https://user-images.githubusercontent.com/85624034/197272626-a7664641-c23f-4db2-8b6d-fc9c2152dd7f.jpg)

Chainerd is a HD wallet that safely stores your private keys encrypted in the browser and lets you interact with the Ethereum blockchain through an [Infura](https://infura.io/) node. It uses [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) and [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) to generate an HD tree of addresses from a randomly generated 12-word seed.

### Core components
- [LightWallet V3](https://github.com/ConsenSys/eth-lightwallet) for storing private keys
- [Ethers.js](https://docs.ethers.io/v5/) for interacting with the Ethereum blockchain
- [Material UI](https://mui.com/) for creating React components
- [Chart.js](https://www.chartjs.org/) for showing interactive charts
- [Store.js](https://www.npmjs.com/package/store-js) for cross-browser local storage
- [Redux Toolkit+Sagas](https://redux-toolkit.js.org/) for state management
- [Jest](https://jestjs.io/) for testing
- and many others, see [package.json](https://github.com/davidcoderistov/chainerd/blob/master/package.json)

### API Providers
- [Infura](https://infura.io/) as JsonRPC provider
- [Coingecko](https://www.coingecko.com/) as exchange rates provider
- [Etherscan](https://etherscan.io/) for getting Ethereum historical data
- [Blockcypher](https://www.blockcypher.com/) for getting current gas price range

### Features
- Create a new wallet
- Restore an already existing wallet
- Create, edit, delete and view accounts
- Send transactions
- View transaction history and transaction status
- ETH/USD balance conversion
- View asset allocation

### Using Chainerd

#### `env variables`

Set up local environment variables by creating a .env.development.local file in the root of your project and adding your:
- REACT_APP_INFURA_API_KEY - [Infura API key](https://infura.io/)
- REACT_APP_ETHERSCAN_API_KEY - [Etherscan API key](https://etherscan.io/)

#### `npm install`

Installs all packages.

#### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### Contributing to Chainerd

To contribute to Chainerd, follow these steps:
1. Fork this repository
2. Create a branch: `git checkout -b <branch_name>`
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin chainerd/<location>`
5. Create the pull request

Alternatively see the GitHub documentation on [creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

### Contact

If you want to contact me you can reach me at [davidcoderistov@gmail.com](mailto:davidcoderistov@gmail.com).
