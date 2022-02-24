const anchor = require('@project-serum/anchor');

const { SystemProgram } = anchor.web3;

const main = async() => {
    console.log("Starting test...");

    // Create and set provider and program
    const provider = anchor.Provider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.SolanaProject;

    const baseAccount = anchor.web3.Keypair.generate();

    const tx = await program.rpc.startStuffOff({
        accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
    });

    console.log("Your transaction signature ", tx);

    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('GIF count ', account.totalGifs.toString())

    await program.rpc.addGif("https://giphy.com/gifs/southpark-comedy-central-south-park-3o6nUNWlKx17IrNPq0", {
        accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
        }
    });

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('GIF count ', account.totalGifs.toString())
    console.log('GIF List: ', account.gifList)
}

const runMain = async() => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();