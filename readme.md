# real-time-web-project

This is the repo of the course Real-Time Web for the minor Web Development

The goal of this course is to learn how to create a real-time web application.

![Screenshot of the web app](https://i.imgur.com/uROSxfJ.png)

- **[About this project](#about-this-project)**
- **[Installation](#installation)**
- **[Technologies used](#technologies-used)**
- **[The web app](#the-web-app)**
- **[External data source](#external-data-source)**
- **[Events](#events)**
- **[Data life cycle](#data-life-cycle)**
- **[Wishlist](#wishlist)**

## About this project

Matchday is an web app that loads tweets about a specific football match (the European football). A user can select a home team and a away team, and the web app will load the previous 30 tweets. The web app will also show tweets that are tweeted after the page is done loading in REAL TIME

## Installation

To install the web app, run:

```javascript
npm install
```

NOTE: before you can run the app, you need to get a consumer key, consumer sectrec, acces token key and an acces token secret. You can get one [here](https://apps.twitter.com/). You need to fill this in App.js in the `const client` which is now empty. You also need to add the tokens to apikey.js

To run the web app:

```javascript
nodemon app.js
```

## Technologies used

The web app uses the following technologies:

- Node.JS
- Express
- EJS
- Socket.io
- Twitter Stream Api
- Twitter Api

## The web app

When a user goes to the website, the app primarily shows two dropdowns, which contain all the football teams from the Dutch Eredivisie. These clubs are rendered by a clubs.JSON file that exists on the server. A user can select a home-, and a away team. When the submit button is clicked, the magic happens.

Each club has its own part of a hashtag on twitter. For example, AZ Alkmaar has az, and NAC Breda has nac. When AZ Alkmaar plays at home against NAC Breda, the hashtag becomes #aznac. When a user selects two teams, the hashtag is generated, and send to the server. The server then does two things. The first thing is that the server sends a request with an OAuth token for the static tweets. Then the server sends the same request, but for the stream. If everything goes well, Twitter sends back the static tweets, and everytime someone tweets with the hashtag the user wants, Twitter will send that tweet to the server as well.

![Screenshot of the tweets page](https://i.imgur.com/VyQV7Zt.png)

When the server gets the tweets, it sends the data to the client. When a new tweet is tweeted, the server sends an event with socket.io to the client with the data. The client recieves the tweets, and puts them on the screen. The client also displays the hashtag that the user searched for. The web app only searches for tweets that are tweeted the last 30 days, so when no tweet with that hashtag is tweeted, it shows the user that the user probably should search for a more recent match.

![Screenshot of the message](https://i.imgur.com/34eGjsp.png)

## External data source

The external data source is the [Twitter API](https://developer.twitter.com/). The web app asks for the 30 most recent tweets, and for every tweet that is tweeted after the first request.

## Events



## Wishlist

- Cover multiple leagues
- Show live and matches that are starting withing a few days
- Add more styling based on the match the user wants tweets from
- Selecting a team only once, so no double hashtag (#azaz for example)


<!-- ☝️ replace this description -->

<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- Maybe a table of contents here? 📚 -->

<!-- How about a section that describes how to install this project? 🤓 -->

<!-- ...but how does one use this project? What are its features 🤔 -->

<!-- What external data source is featured in your project and what are its properties 🌠 -->

<!-- Where do the 0️⃣s and 1️⃣s live in your project? What db system are you using?-->

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

<!-- How about a license here? 📜 (or is it a licence?) 🤷 -->
