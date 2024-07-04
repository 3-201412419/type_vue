<template>
    <div class="steam-games-list">
        <div class="input-section">
            <input v-model="steamId" placeholder="Enter Steam ID" class="steam-id-input"/>
            <button @click="fetchGames" :disabled="loading" class="fetch-button">Fetch Games</button>
        </div>
        <p v-if="error" class="error-message">
            {{ error }}</p>
        <div v-if="loading" class="loading-message">
            Loading...</div>
        <ul v-if="games.length" class="games-list">
            <li v-for="game in games" :key="game.appid" class="game-item">
                <span class="game-name">{{ game.name }}</span>
                <span class="game-playtime">
                    (Playtime :
                    {{ formatPlaytime(game.playtime_forever) }})
                </span>
            </li>
        </ul>
    </div>
</template>

<script lang = "ts">
    import { defineComponent , ref} from 'vue';
    import axios from 'axios';

    interface Game {
        appid : number;
        name : string;
        playtime_forever : number;
    }

    export default defineComponent ({
        name : 'GameList',
        setup() {
            const steamId = ref('');
            const games = ref<Game[]>([]);
            const error = ref('');
            const loading = ref(false);

            const fetchGames = async () => {
                if (!steamId.value) {
                    error.value = 'Please enter a Steam ID';
                    return;
                }

                loading.value = true;
                error.value = '';
                games.value = [];

                try {
                    const response = await axios.get('/api/IPlayerService/GetOwnedGames/v1/', {
                        params : {
                            key : '4266E0BAAFA8356457C83F142725CD4C',
                            steamid : steamId.value,
                            include_appinfo : 1,
                            format : 'json'
                        }
                    });

                    console.log('API Response:', response.data);

                    if (response.data.response && response.data.response.games) {
                        games.value = response.data.response.games;
                    } else {
                        error.value = 'No games found or invalid Steam ID';
                    }
                } catch (err){
                    error.value = 'Error fecting games. Please try again ';
                    console.error(err);
                } finally {
                    loading.value = false;
                }
            };

            const formatPlaytime = (minutes : number): string => {
                const hours = Math.floor(minutes / 60);
                return `${hours} hour${hours !== 1 ? 's' : ''}`;
            };

            return {
                steamId,
                games,
                error,
                loading,
                fetchGames,
                formatPlaytime
            }
        }
    })
</script>


<style scoped>
.steam-games-list {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.input-section {
  display: flex;
  margin-bottom: 20px;
}

.steam-id-input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
}

.fetch-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.fetch-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

.loading-message {
  color: #666;
  margin-bottom: 10px;
}

.games-list {
  list-style-type: none;
  padding: 0;
}

.game-item {
  background-color: #f9f9f9;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}

.game-name {
  font-weight: bold;
}

.game-playtime {
  color: #666;
  margin-left: 10px;
}
</style>
