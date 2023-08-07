const { Schema , Model, model}= require('mongoose');

const YtDataSchema = new Schema({
    videoTitle:{
        type: String,
        required: true
    },
    videoDescription: {
        type: String,
        default: "No description"
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

