const express = require('express')
const app = express();

const { google } = require('googleapis');
const mongoose = require('mongoose');
const YoutubeDataModel = require('./models/YoutubeData');

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

const API_KEY = process.env.API_KEY

const youtube = google.youtube( {
    version: "v3",
    auth: API_KEY,
})
const PORT= process.env.PORT || 3000
app.use("/", require('./routes/route'))
const task = async() => {
    try{
    const response = await youtube.search.list({
        part: "snippet",
        maxResults:5,
        q:"free fire",
        type:"video",
        order:"date" ,
        publishedAfter:"2021-01-01T00:00:00Z"
    })
    const title = response.data.items.map((item) => item.snippet.title);
    const description = response.data.items.map((item) => item.snippet.description);
    const pAt = response.data.items.map((item) => item.snippet.publishedAt);
    const url = response.data.items.map((item) => item.snippet.thumbnails.default.url);
    //console.log(url);
    
    
    for(var i=0;i<5;i++) { 
        const newYTData = new YoutubeDataModel()
        newYTData.videoTitle = title[i];
        newYTData.videoDescription = description[i];
        newYTData.publishedAt = pAt[i];
        newYTData.url = url[i];
        //console.log(i)
        await newYTData.save();
    }
    setTimeout(task, 1000000000);
    } catch(err) {
        console.log(err)
    }
}
const connect = mongoose.connect(
    process.env.MONGO_URI,
    {},
    (err) => {
        if (err) console.log(err);
        else console.log("DB connection successful");
    }

)
app.listen(PORT, (err)=> {
    connect;
    task();
    if(err) console.log(err);
    else console.log("Running at port", PORT)
})