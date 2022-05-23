import React, { Component } from "react";
import ParkT from "./contracts/ParkT.json";
import getWeb3 from "./getWeb3";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import RegisterParking from "./pages/RegisterParking";
import Parkings from "./pages/Parkings";
import NoPage from "./pages/NoPage";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ParkT.networks[networkId];
      const instance = new web3.eth.Contract(
        ParkT.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: 'response' });
  };

  render() {
    //mock parkings, à récupérer d'une requête à un tableau memory des parkings availables []
    const parkings = [
          { "postalCode": "06000", "priceBySecond":  10, "coordinates": {"x": 10, "y": 10} },
          { "postalCode": "75014", "priceBySecond":  30, "coordinates": {"x": 10, "y": 10} },
          { "postalCode": "06100", "priceBySecond":  25, "coordinates": {"x": 10, "y": 10} },
          { "postalCode": "06200", "priceBySecond":  5,  "coordinates": {"x": 10, "y": 10} },
          { "postalCode": "06300", "priceBySecond":  12, "coordinates": {"x": 10, "y": 10} }
    ];
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/parkT/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="register-parking" element={<RegisterParking />} />
              <Route path="parkings" element={<Parkings parkings={parkings} />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
