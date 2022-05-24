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
      const deployedNetwork = ParkT.networks["5777"];
      const instance = new web3.eth.Contract(
        ParkT.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runInit);
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

    const parkings = await contract.methods.fetchParkings().call();

    // Update state with the result.
    this.setState({ parkings: parkings });
  }

  registerParking = async () => {
    const { contract, accounts } = this.state;
    await contract.methods.registerParking(3, 150, "75014", {x: "49.85449", y:"3.31356" }).send({ from: accounts[0] });
  }

  render() {
    //mock parkings, à récupérer d'une requête à un tableau memory des parkings availables []
    const { parkings } = this.state;

    if (!this.state.web3 || !parkings) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/parkT/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="register-parking" element={<RegisterParking registerParking={this.registerParking} />} />
              <Route path="parkings" element={<Parkings parkings={parkings} />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <h1>Good to Go!</h1>
      </div>
    );
  }
}

export default App;
