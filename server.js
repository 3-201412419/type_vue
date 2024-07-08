
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/youtube/search', async(req,res) => {
    try{
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search',{
            params : {
                part : 'snippet',
                type : 'video',
                q: req.query.q,
                key : process.env.VUE_APP_YOUTUBE_API_KEY,
                maxResults : 10
            }
        });

        res.json(response.data);
    } catch(error){
        console.error('Youtube API Error:', error);
        res.status(500).json({ error : 'An error occurred while fetching videos'});
    }
});

app.get('/api/steam/*', async(req,res) => {
    try{
        const steamApiUrl = `https://api.steampowered.com${req.path.replace('/api/steam', '')}`;
        const response = await axios.get(steamApiUrl , {
            params : {
                ...req.query,
                key: process.env.VUE_APP_STEAM_API_KEY
            }
        });
        res.json(response.data);
    } catch (error){
        console.error('Steam Api Error', error);
        res.status(500).json({ error :  'An error occurred while fetching Steam data'});
    }
});

app.get('/api/tmdb/*', async(req,res) => {
    try{
        const tmdbApiUrl = `https://api.themoviedb.org/3${req.path.replace('/api/tmdb', '')}`;
        const response = await axios.get(tmdbApiUrl, {
            params : {
                ...req.query,
                api_key : process.env.VUE_APP_TMDB_API_KEY
            }
        });

        res.json(response.data);

    }catch (error){
        console.error('TMDB API Error:', error);
        res.status(500).json({ error : 'An error occurred while fetching TMDB data'});
        
    }
})

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

