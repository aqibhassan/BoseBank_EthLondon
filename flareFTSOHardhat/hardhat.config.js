require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.19",
    networks: {
        hardhat: {
            forking: {
                url: 'https://flare-api.flare.network/ext/C/rpc',
            },
        },
    },
};