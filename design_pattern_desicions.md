#ParkT

## Economic Patterns
### Memory Array Building pattern

L'utilisation du stockage sur la blockchain est ce qui le plus de gas. 
Afin de limiter l'utilisation de Gas, nous utilisons nous utilisons le pattern Memomy Array Building
dans la méthode fetchParkings. Cette fonction est déclarée en view afin de permettre l'affichage des parkings.
Ces parkings sont filtrés ensuite selon leur disponibilité et leur position.

    function fetchParkings() public view returns (Parking[] memory) {
        uint parkingCount = getParkingId();

        Parking[] memory parkings = new Parking[](parkingCount);
        for (uint i = 0; i < parkingCount; i++) {
            uint currentId = i + 1;
            Parking storage currentParking = parkingById[currentId];
            parkings[i] = currentParking;
        }
        return parkings;
    }

### Tight Variable Packing

L'optimisation du Gas est toujours la priorité lors de l'écriture d'un SC.
Pour nos structures, nos définissons les uint ensemble 

    struct Parking {
        address payable owner;
        uint256 priceBySecond;
        uint256 deposit;
        uint256 balance;
        uint16 postalCode;
        Coordinates coordinate;
    }

## Security Patterns
### Checks Effects Interactions

Avant le traitement et la mise à jour de la blockchain, afin de se prémunir des attaques, il est nécessaire
d'appliquer les changements avant les appels externes et les transferts.

    parkingById[_parkingId].balance = 0;
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Transaction failed"); //Require the transaction success or revert

* Mise à jour de la blockchain
* Transfert des ETH

## Behavioral Patterns
Les contrôles sont nécessaires dans chacune des fonctions appelées afin d'une part, de vérifier les paramètres d'entrés
et d'autre part afin de vérifier l'état de la machine:
### Guard Check
        
    require(parking.owner != address(0),  "Parking not register");

* Permet de s'assurer que l'id renseigné par l'utilisateur correspond bien à un parking enregistré

### State Check

    require(booking.timestamp == 0,  "Not available");

* Vérification de l'état de la blockchain pour valider ou non la réservation du parking

## Upgradeability Patterns
### Proxy Delegate 

Il sera nécessaire d'introduire la possibilité de mettre à jour le contrat sans casser les dépendances.
Nous savons que les contrats, une fois déployés sur la blockchain sont immuables. D'autant plus que le contrat manipule
des ETH.
A ce jour nous n'avons pas eu le temps de le mettre en place mais cela fait parti de la roadmap avant le déploiement
sur un main net.

Il faudra notamment s'assurer que l'utilisateur mettant à jour le contrat est bien le propriétaire.


## TheGraph

Dans la road map, nous souhaitons pouvoir réserver un parking pour une heure précise et une durée.
La manipulation des dates est couteuse et complexe et l'outil TheGraph permettrait de gérer cette fonctionnalité
de manière plus efficace : https://soliditydeveloper.com/thegraph
 
