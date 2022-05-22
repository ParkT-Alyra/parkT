# ParkT
    Nous avons utilisé l'analyseur de code static de Remix pour vérifier que l'ensemble des fonctionnalités est bien 
    sécurisé. Que l'ensemble des potentielles failles est traité et corrigé si nécessaire.

## Version du compilateur Pragma
* Fixé à 0.8.14
* On s'assure que les contrats ne seront pas accidentellement déployés en utilisant une version trop récente avec des
vulnérabilités 

## Pull Payment
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
* Nous n'avons pas, pour le moment, d'appels vers d'autres contrats 

## Front running
* Nous n'avons pas de fonctionnalité nécessitant de faire une action rapide. Il n'y a donc aucune faille à ce niveau.

## Force Feeding
* La vérification de la balance en comparaison stricte peut faire dérailler, on utilise donc **>=** 
    
  ``require(msg.value >= minRequireDemand, "Insufficient funds");``

## Oracle manipulation
Nous n'utilisons pas d'Oracle dans le cadre de parkT

## Griefing
Nous avons pour le moment un seul contrat, mais s'il est nécessaire de déployer un second contrat, nous serons
vigilants au gas consommé sur les différents contrats

## Check-effects-interaction

## Low level calls

## Guard conditions

## Gas costs
