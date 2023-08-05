const { Schema , Model, model}= require('mongoose');

const YtDataSchema = new Schema({
    videoTitle:{
        type: String,
        required: true
    },
    videoDescription: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Date,
        required: true
    }, 
    url: String,
},
{
    timestamps: true
});

const YoutubeDataModel = model('YoutubeData', YtDataSchema);

module.exports = YoutubeDataModel;

