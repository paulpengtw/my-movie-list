const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = []

const dataPanel = document.querySelector('#data-panel')


function addToFavorite(id) {
  console.log(id)
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`
  })
}

// 監聽 data panel
dataPanel.addEventListener('click',function onPanelClicked(event){
  // 簡潔寫法 `dataPanel.addEventListener('click',(event) => {`
  if (event.target.matches('.btn-show-movie')) {
    console.log(event.target.dataset.id) 
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image, id 隨著每個 item 改變
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${
          POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}")>+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input') 
//...
//監聽表單提交事件
 searchForm.addEventListener('submit', function onSearchFormSubmitted(event)  {
    event.preventDefault() //取消預設事件, 避免表單重整頁面
    // console.log('click!') //測試用
    const keyword = searchInput.value.trim().toLowerCase() 
    // trim()：把字串頭尾空格去掉。若使用者不小心輸入一堆空白送出，也會被視為沒有輸入東西，而收到警告訊息。
    // toLowerCase()：把字串轉成小寫。我們希望這個搜尋功能是大小寫不敏感的，所以一律把拿到的值都轉成小寫，方便之後比對。

    let filteredMovies = []   //儲存符合篩選條件的項目

    // if (!keyword.length) { // 加入錯誤處理：若使用者沒輸入東西就送出，會跳出警告訊息。
    //   return alert('請輸入有效字串！')
    // }

    //filter 需要的參數是一個條件函式，只有通過這個條件函式檢查的項目，才會被 filter 保留並回傳一個新的陣列。
    //條件篩選
    filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`) // 錯誤處理優化版：無符合條件的結果
  }

  renderMovieList(filteredMovies) //重新渲染 #data-panel 裡的 template
  })

  
function addToFavorite(id) { //在 addToFavorite 傳入一個 id
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //第一次使用收藏功能時，此時 local storage 是空的，會取回 null 值，因此，list 會得到一個空陣列。而之後 local storage 有東西時，就會拿到 localStorage.getItem('favoriteMovies') 取回來的資料了！
    const movie = movies.find((movie) => movie.id === id) // 請 find 去電影總表中查看，找出 id 相同的電影物件回傳，暫存在 movie
    if (list.some((movie) => movie.id === id)) { //一部電影只能被收藏一次。所以我們要加入一個判斷式，判斷是否清單中已有相同的電影。如有，立即結束函式，並給使用者提示。some 方法和 find 類似，不過 some 只會回報「陣列裡有沒有 item 通過檢查條件」，有的話回傳 true ，到最後都沒有就回傳 false。
      return alert('此電影已經在收藏清單中！')
    }
    list.push(movie)  //把 movie 推進收藏清單
    localStorage.setItem('favoriteMovies', JSON.stringify(list)) // 接著呼叫 localStorage.setItem，把更新後的收藏清單同步到 local storage
  }

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderMovieList(movies) //新增這裡
})
  .catch((err) => console.log(err))
