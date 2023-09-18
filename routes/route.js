const { google } = require('googleapis');

const router= require('express').Router();
//const controller = require('../controllers/controller'); 
const YoutubeDataModel = require('../models/YoutubeData');

const API_KEY = process.env.API_KEY

const youtube = google.youtube( {
    version: "v3",
    auth: API_KEY,
})

router.get('/api', async(req,res) => {
    try{
        const resultsPerPage = 5; //a
        const numOfResults =50;
        const { page=1, limit=5} = req.query; //a
        const data = await YoutubeDataModel.find().sort({"publishedAt": -1})
            .limit(limit)
            .skip((page-1)*limit);
        //res.render("dashboard", { title: "Dashboard", users: data })
        //a
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        if(page > numberOfPages){
            res.redirect('/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/?page='+encodeURIComponent('1'));
        }

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
        if(endingLink < (page + 4)){
            iterator -= (page + 4) - numberOfPages;
        }
        res.send({page, limit, data: data})
//a
    }catch (err) {
        console.log(err)
    }
})

router.get('/search/:videotitle', async(req,res) => {
    try {
        var data2 = [];
        try{
            const response = await youtube.search.list({
                part: "snippet",
                maxResults:5,
                q: req.params.videotitle,
                type:"video",
                order:"date" ,
                publishedAfter:"2021-01-01T00:00:00Z"
            })
            const title = response.data.items.map((item) => item.snippet.title);
            const description = response.data.items.map((item) => item.snippet.description);
            const pAt = response.data.items.map((item) => item.snippet.publishedAt);
            const url = response.data.items.map((item) => item.snippet.thumbnails.default.url);
            const videoId = response.data.items.map((item) => item.id.videoId);
            for(var i=0;i<5;i++) { 
                const newYTData = new YoutubeDataModel()
                newYTData.videoTitle = title[i];
                newYTData.videoDescription = description[i];
                newYTData.publishedAt = pAt[i];
                newYTData.url = url[i];
                newYTData.videoId = videoId[i];
                //console.log(i)
                await newYTData.save();
            }
            
            for(var i=0;i<5;i++) { 
                const temp = {
                videoTitle : title[i],
                videoDescription : description[i],
                publishedAt : pAt[i],
                url : url[i],
                videoId : videoId[i],
                }
                //console.log(i)
                data2.push(temp)
            }
        } catch(err) {
                console.log(err)
        }
        res.render("dashboard", { title: "Dashboard", users: data2 , home: false })
    }catch(err) {
        console.log(err)
    }
})

router.get('/', async(req,res) => {
    try{
        const resultsPerPage = 5; //a
        const numOfResults =50;
        const { page=1, limit=5} = req.query; //a
        //console.log(page)
        
        //res.render("dashboard", { title: "Dashboard", users: data })
        //a
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        //console.log(page,numberOfPages)
        if(page > numberOfPages){
            res.redirect('/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            page=1
            res.redirect('/?page='+encodeURIComponent('1'));
        }
        
        let iterator = (page - 5) < 1 ? 1 : page - 5;
        //console.log(iterator)
        let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
        //console.log(endingLink,iterator,numberOfPages,page)
        // if(endingLink < (page + 4)){
        //     iterator -= (page + 4) - numberOfPages;
        // }
        //console.log(endingLink,iterator,numberOfPages,page)
        const data = await YoutubeDataModel.find().sort({"_id": -1})
            .limit(limit)
            .skip((page-1)*limit);
        //res.send(data).redirect("index")
        res.render("dashboard", { title: "Dashboard", users: data , home: true, page: page, iterator: iterator, endingLink: endingLink, numberOfPages: numberOfPages})
//a
    }catch (err) {
        console.log(err)
    }
})



module.exports = router;
