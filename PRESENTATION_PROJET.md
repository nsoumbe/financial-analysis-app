# Presentation Du Projet

## Titre
Application d'analyse financiere assistee par IA pour l'etude de fusions-acquisitions

## Resume
Ce projet est une application web qui permet de comparer deux entreprises cotees en bourse et de generer un rapport d'analyse de fusion-acquisition assiste par intelligence artificielle.  
L'application combine plusieurs briques techniques :

- recherche d'entreprises cotees via des sources de marche
- collecte de donnees financieres exploitables
- generation d'un rapport d'analyse avec une API d'IA
- export du resultat en PDF
- conteneurisation avec Docker pour faciliter la demonstration

## Probleme Traite
Dans une analyse de fusion-acquisition, la difficulte ne consiste pas seulement a recuperer des chiffres, mais aussi a les transformer en une synthese claire, argumentee et actionnable.

Ce projet montre comment une API d'IA peut ameliorer une application metier :

- en transformant des donnees financieres brutes en explications lisibles
- en aidant a structurer un raisonnement financier
- en accelerant la production d'un rapport comparatif
- en rendant l'information plus accessible a un utilisateur non expert

## Interet D'Utiliser L'IA
L'IA n'est pas utilisee ici comme un gadget, mais comme une couche d'interpretation.

Sa valeur ajoutee est de :

- contextualiser les chiffres
- faire ressortir les forces, risques et synergies potentielles
- produire une synthese exploitable plus rapidement qu'un traitement purement manuel
- ameliorer l'experience utilisateur avec une restitution plus claire

En pratique, l'API d'IA permet de passer d'une simple consultation de donnees boursieres a une aide a la decision.

## Competences Techniques Mises En Evidence
Ce projet met en avant plusieurs competences techniques utiles en developpement logiciel moderne :

- integration d'API d'IA dans une application web
- orchestration d'un frontend React, d'un backend Node.js et d'un service Python
- consommation et normalisation de donnees de marche issues de sources externes
- gestion de differents cas de donnees selon les places boursieres
- generation dynamique de rapports
- export PDF cote frontend
- securisation basique de la configuration avec variables d'environnement
- conteneurisation avec Docker pour faciliter le deploiement et les tests

## Competences De DevSecOps Et D'Architecture
Le projet montre egalement une capacite a :

- separer clairement les responsabilites frontend, backend et service IA
- externaliser les secrets dans `.env`
- eviter de versionner les cles API grace au `.gitignore`
- preparer un packaging Docker reutilisable sur une autre machine
- raisonner sur la robustesse des integrations externes

## Valeur Pour Une Presentation Git Ou CV
Ce projet est pertinent pour montrer :

- l'usage concret d'une API d'IA dans un cas metier
- la capacite a integrer plusieurs technologies dans une meme application
- la capacite a transformer une idee fonctionnelle en prototype deployable
- une approche pratique de l'ingenierie logicielle orientee produit

## Message Court Pour Presenter Le Projet
J'ai developpe une application web d'analyse de fusion-acquisition assistee par IA.  
Elle combine des donnees boursieres, un backend de traitement et une API d'intelligence artificielle pour generer automatiquement des rapports comparatifs sur des entreprises cotees.  
Le projet met en avant l'integration d'API IA, la normalisation de donnees financieres, la generation de rapports PDF et la conteneurisation Docker pour faciliter le partage et le deploiement.

## Message Plus Impactant Pour GitHub
Ce projet illustre comment l'IA peut enrichir une application metier en transformant des donnees financieres en analyses lisibles et exploitables.  
L'application s'appuie sur un frontend React, un backend Node.js, un service Python pour l'orchestration IA, des sources externes de donnees boursieres, et un packaging Docker pour un deploiement simplifie.  
Elle montre une demarche complete : collecte des donnees, traitement, analyse assistee par IA, restitution utilisateur et industrialisation.

## Conseils Avant Publication
- verifier une derniere fois que `.env` n'est pas commite
- fournir un `.env.example` propre sans cle reelle
- ajouter des captures d'ecran dans le repo
- ajouter un mini guide de lancement Docker dans le README
- regenerer la cle Gemini si elle a ete partagee dans un contexte non prive
