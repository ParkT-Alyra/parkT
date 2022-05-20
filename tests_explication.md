# ParkT

## Objet du contrat :
    Permettre à un propriétaire, un conducteur et un IOT de communiquer avec la blockchain au travers de parkT
    La création de tests permet de s'assurer du bon fonctionnement de l'application et de tester l'ensemble des cas 
    d'usage.
* Tous les tests suivent la même logique d'implémentation: 
  * Vérification des reverts et require
  * Vérification des cas nominaux
  * Vérification des cas au limite

## Register Parking
### should have a price and all information
  * Vérification de la création d'un parking avec l'ensemble des éléments nécessaires à la mise à disponibilité
### should register one parking at a time
  * L'enregistrement d'un parking se fait un par un

## Book Parking
### should not book a parking if is not register
  * Vérification que le parking qui souhaite être réservé existe sur la blockchain 
### should not book a parking for insufficient funds
  * La réservation ne peut se faire que si le montant envoyé correspond au tarif d'une journée de stationnement 
  * Et le montant de la caution (mon enlèvement fourrière par exemple, dégradation sur la place de stationnement)
### should book an empty parking
  * Vérification de la mise à jour de l'heure, minute et seconde du démarrage de la réservation
  * Vérification du conducteur qui reserve la place de stationnement
  * Vérification du montant stocké pour la réservation du stationnement
  * Vérification de l'évènement confirmant que la réservation est bien effectuée
### should not book a parking if not empty
  * Vérification que la place de stationnement souhaitant être réservée est disponible

## Release Parking
### should revert if releaser is not the booker
  * Vérification que le parking souhaitant être rendu disponible est réservé par le conducteur annulant la réservation
### should release a parking
  * Vérification de la remise à 0 du timestamp qui correspond au début de la réservation
  * Vérification que l'adresse du conducteur ayant fait la réservation est dissociée du parking
  * Vérification de la remise à 0 du montant minimum requis pour une journée de réservation
  * Vérification de l'évènement confirmant la remise à disposition du parking

## Withdraw
### should revert if is not the owner of the parking
  * Vérification que l'adresse souhaitant récupérer le montant associé au parking est bien le propriétaire du parking
### should transfer funds and reset balance
  * Vérification de l'envoi des eth au propriétaire du parking
  * Vérification de la remise à 0 de la balance du parking
  * Vérification de l'évènement confirmant que le paiement au propriétaire a bien été effectué