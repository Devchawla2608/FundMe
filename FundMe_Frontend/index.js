import { ethers } from "./ethers-5.6.esm.min.js";
import { ContractAddress, abi } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const widthdrawButton = document.getElementById("withdrawButton");
const getBalanceButton = document.getElementById("getBalanceButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
widthdrawButton.onclick = withdraw;
getBalanceButton.onclick = getBalance;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("connectButton").innerHTML = "Connected";
    alert("You are connected");
  } else {
    document.getElementById("connectButton").innerHTML = "Get Metamask first";
    alert("Get Metamask first");
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(ContractAddress);
    console.log(ethers.utils.formatEther(balance));
    alert(`Your balance is ${ethers.utils.formatEther(balance)}`);
  }
}

async function fund() {
  const ethAmount = "77";
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, abi, signer);
    // Here we got the FundMe contract and after that we want try to acces fund function
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!!!");
      alert(`You funded ${ethAmount} Eth`);
    } catch (err) {
      console.log("This is an error", err);
      alert(`You are not authorized .Please Reset Your meta mask`);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash} ....`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing ..........");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      alert(`You can not withdraw becuase you are not owner`);
    } catch (err) {
      alert(`You can not withdraw becuase you are not owner`);
      console.log(err);
    }
  }
}
