const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = []

axios
  .get(INDEX_URL) // 修改這裡
  .then((response) => {
    movies.push(response.data.results)
    console.log(response)
    console.log(response.data)
    console.log(response.data.results)
  })
  .catch((err) => console.log(err))
  