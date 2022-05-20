# ParkT

## Pull Payment :
* Création d'une fonction de withdraw pour le propriétaire afin qu'il récupère les fonds disponibles dans le contrat

## Faille de Reentrancy
* Mise à jour de la balance du propriétaire du parking avant l'envoi d'Ether  

## DoS Gas Limit
* Nous n'utilisons pas de tableau mais uniquement des mappings pour limiter l'utilisation du GAS mais aussi éviter les 
boucles infinies

## Données confidentielles
* Aucune donnée confidentielle stockée sur la blockchain
* L'accès à la position exacte du parking se fait uniquement après le paiement du conducteur

## Manipulation du block Timestamp
* Nous utilisons le timestamp uniquement pour le règlement du temps resté sur la place de parking,
le délai des 15 sec n'est donc pas quelque chose qui puisse rendre faillible le SC.

## Utilisation du randomn
* Nous n'utilisons pas de random dans notre DAPP

## Delegation des appels
* Nous serons vigilants 