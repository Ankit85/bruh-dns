const main = async () => {
    const [owner, superCoder] = await hre.ethers.getSigners();
    
    const balance3 = await hre.ethers.provider.getBalance(owner.address);
    console.log("owner bal before deploy: ", hre.ethers.utils.formatEther(balance3));
    console.log("deployed success");
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    console.log("deployed success");
    const domainContract = await domainContractFactory.deploy("bruh");
    console.log("deployed success");
    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address);
    console.log("Contract deployed by:", owner.address);
    
// Let's be extra generous with our payment (we're paying more than required)

    const balance2 = await hre.ethers.provider.getBalance(owner.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance2));

  let txn = await domainContract.register("0xFalcon",  {value: hre.ethers.utils.parseEther('0.0001')});
  await txn.wait();

// How much money is in here?
const balance = await hre.ethers.provider.getBalance(domainContract.address);
console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

// Quick! Grab the funds from the contract! (as superCoder)
try {
  txn = await domainContract.connect(superCoder).withdraw();
  await txn.wait();
} catch(error){
  console.log("Could not rob contract");
}

  // Let's look in their wallet so we can compare later
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  // Oops, looks like the owner is saving their money!
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();
  
  // Fetch balance of contract & owner
  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
  console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));
  }
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();