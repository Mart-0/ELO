# ELO
Dit is een alternatief voor de standaard Windesheim ELO leeromgeving<br/>
Om dit modelijk te maken is een userscript gebruikt.<br/>
Een userscript is een javascipt bestand wat een bestaande site kan wijzigen.<br/>
Dit userscript herschrijft de gehele windesheim ELO.<br/>
<br/>
Als je het standaard plaatje niet mooi vind dan kun je deze aanpassen in het bestand.<br/>
<br/>
Als je een bug tegen komt noteer dit bij de issues.
<br/><br/>

## Voordelen van deze ELO:
* sneller
* moderner
* open-source
<br/><br/>

## Installeren:<br/>
Om deze ELO te kunnen gebruiken moet je eerst Tampermonkey geïnstalleerd hebben.
Hierna kan je het userscript installeren.
1. Tampermonkey: https://www.tampermonkey.net/
1. Het userscript: https://github.com/Mart-0/ELO/raw/master/elo.user.js
<br/><br/>

## Gemaakt met:
* vue
* tailwindcss
* heroicons
<br/><br/>

## Screenshots van de ELO na installatie:
Dit is wat je ziet aan het begin:
![screenshot1.jpg](images/screenshots/screenshot1.jpg)
Nadat je een vak gekozen hebt kun je de inhoud van het vak bekijken:
![screenshot2.jpg](images/screenshots/screenshot2.jpg)
Een gekozen item opent naast de inhoud van het vak:
![screenshot3.jpg](images/screenshots/screenshot3.jpg)

## Development
als je een wijziging in dit project wil maken, clone dan dit project, maak dan een userscript aan met het vogelnde template:

// ==UserScript==
// @name          ELO
// @namespace     https://github.com/Mart-0
// @description   ELO made for speed
// @author        Mart Groothuis
// @license       MIT

// @downloadURL   https://github.com/Mart-0/ELO/raw/master/elo.user.js
// @updateURL     https://github.com/Mart-0/ELO/raw/master/elo.user.js
// @supportURL    https://github.com/Mart-0/ELO/issues
// @version       1.0.0

// @match         https://elo.windesheim.nl/*
// @grant         none
// @run-at        document-start
// @require       https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js
// @require       file:///C:/[naar map]/ELO/elo.user.js               <<<<<<<< moet nog aangepast worden
// @noframes
// ==/UserScript==