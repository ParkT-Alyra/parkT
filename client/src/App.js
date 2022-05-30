import React, { Component } from "react";
import ParkT from "./contracts/ParkT.json";
import getWeb3 from "./getWeb3";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import RegisterParking from "./pages/RegisterParking";
import Parkings from "./pages/Parkings";
import NoPage from "./pages/NoPage";
import AdminParking from "./pages/AdminParking";
import HandleBookedParking from "./pages/HandleBookedParking";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, accountBalance: null, contract: null, parkings: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      const weiRawBalance = await web3.eth.getBalance(accounts[0]);

      const accountBalance = await web3.utils.fromWei(weiRawBalance, 'ether');

      // Get the contract instance.
      //This is not a 100% accurate guess as any private network could use testnet and mainnet genesis blocks and network IDs.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ParkT.networks[networkId];
      const instance = new web3.eth.Contract(
        ParkT.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, accountBalance, contract: instance }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  runInit = async () => {
    const { contract } = this.state;

    const parkings = await contract.methods.fetchAvailableParkings().call();

    console.log(parkings);

    // Update state with the result.
    this.setState({ parkings });
  }

  registerParking = async () => {
    const { contract, accounts } = this.state;

    await contract.methods.registerParking(this.price.value, this.deposite.value, this.postalCode.value, {x: this.coordX.value, y:this.coordY.value }).send({ from: accounts[0] });
  }

  bookParking = async (event) => {
    const { contract, accounts } = this.state;

    await contract.methods.bookParking(event.target.id).send({ from: accounts[0], value: event.target.value });
    await contract.events.ParkingBooked({})
      .on("connected", function(subscriptionId){ console.log(subscriptionId);})
      .on('data', function(event){ console.log(event);})
  }

  render() {
    const { parkings, accounts, accountBalance } = this.state;

    if (!this.state.web3 || !parkings) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/parkT/" element={<Layout accounts={accounts} />}>
              <Route index element={<Home />} />
              <Route path="register-parking"
                element={<RegisterParking
                  coordY={(coordY) => this.coordY = coordY}
                  coordX={(coordX) => this.coordX = coordX}
                  price={(price) => this.price = price}
                  deposite={(deposite) => this.deposite = deposite}
                  postalCode={(postalCode) => this.postalCode = postalCode}
                  registerParking={this.registerParking}
                />} />
              <Route path="parkings"
                element={<Parkings
                  parkings={parkings}
                  parkingId={(parkingId) => this.parkingId = parkingId}
                  bookParking={this.bookParking}
                />} />
                <Route path="admin-parking" element={<AdminParking />} />
                <Route path="handle-booked-parking" element={<HandleBookedParking />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        Bonjour, Vous êtes connecté avec l'adresse : {accounts[0]}
        <br/>
        Vous disposez de {accountBalance} ETH
      </div>
    );
  }
}

export default App;
