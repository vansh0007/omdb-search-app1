<template>
  <div class="search-movies">
    <h1>Movie Search</h1>
    <input
      type="text"
      v-model="searchQuery"
      @input="searchMovies"
      placeholder="Search for a movie..."
    />
    <div v-if="movies.length > 0" class="results">
      <div v-for="movie in movies" :key="movie.imdbID" class="movie">
        <img :src="movie.Poster" alt="Poster" v-if="movie.Poster !== 'N/A'" />
        <div class="info">
          <h2>{{ movie.Title }}</h2>
          <p>{{ movie.Year }}</p>
          <button @click="buttonClicked">Do nothing</button>
        </div>
      </div>
    </div>
    <div v-else-if="searchQuery.length > 1 && !loading" class="no-results">
      No results found.
    </div>
    <div v-else-if="searchQuery.length <= 1 && !loading" class="no-query">
      Please enter at least 3 characters to search.
    </div>
    <div v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export default defineComponent({
  name: "SearchMovies",
  setup() {
    const searchQuery = ref<string>("");
    const movies = ref<Movie[]>([]);
    const loading = ref<boolean>(false);

    /**
     * Perform a movie search based on the provided search query.
     *
     * @return {Promise<void>} Returns nothing.
     */
    const searchMovies = async () => {
      if (searchQuery.value.length < 2) {
        movies.value = [];
        return;
      }

      loading.value = true;
      try {
        const { Search: moviesData } = await (
          await fetch(
            `http://www.omdbapi.com/?apikey=ba37f64c&s=${searchQuery.value}`
          )
        ).json();
        movies.value = moviesData || [];
      } catch (error) {
        console.error("Error fetching movies:", error);
        movies.value = [];
      } finally {
        loading.value = false;
      }
    };

    const buttonClicked = () => {
      // Button does nothing
    };

    return {
      searchQuery,
      movies,
      loading,
      searchMovies,
      buttonClicked,
    };
  },
});
</script>

<style scoped>
.search-movies {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
.results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.movie {
  border: 1px solid #ddd;
  margin: 10px;
  padding: 10px;
  width: 200px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.movie img {
  max-width: 100%;
}
.movie .info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.movie .info button {
  margin-top: 10px;
}
.no-results,
.no-query,
.loading {
  margin-top: 20px;
  font-size: 1.2em;
  color: #666;
}
</style>
