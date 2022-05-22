# ParkT
***Un système de reservation de parking intelligent décentralisé réalisé avec Truffle et Solidity***

## Docs
[`Avoiding_common_attacks.md`](./avoiding_common_attacks.md) — Avoiding common attacks <br>
[`Design_pattern_desicions.md`](./design_pattern_desicions.md) — Design Pattern Desicions <br>
[`Tests_explication.md`](./tests_explication.md) — Tests explication <br>
[`Deployed_addresses.md`](./deployed_addresses.md) — Deployed addresses<br>

## Tools Required:

Avant de cloner le repository, assurez-vous d'avoir installé :

* Solidity
* Ganache
* Truffle
* Node Package Manager
* Node.js
* MetaMask

## Fonctionnalités (init):
### 1ère étape
	Propriétaire de Parking enregistre un parking slot (ID 1, adresse, disponibilté, commodité)
	Parking ID-1 disponible

### 2ème étape
	Conducteur reserve 1 parking (transaction => validée)
	Parking ID-1 indisponible

### 3ème étape
	Conducteur libère la place de Parking
	Mise à jour de la réputation du Parking
	Mise à jour de la réputation du Conducteur
	Mise à jour de la disponibilité de la place (IOT + réservé ou non reservé)


## Pour démarrer <a name="getting-started"></a>

Cloner le repo : 

`git clone https://github.com/KevinColo/parkT.git`

Une fois le repo cloné :
	
	npm install

Pour installer les dépendances.

Ensuite, déplacez-vous dans le répertoire client. Dans votre terminal/ligne de commande, exécutez :

	truffle test
	
## Running the dapp:

	npm start

