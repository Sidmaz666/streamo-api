const cheerio = require('cheerio')
const axios = require('axios')
const {response} = require('express')

  const category_list = [
  { name : "action"},
  { name : "tv-show"},
  { name : "adventure"},
  { name : "animation"},
  { name : "biography"},
  { name : "comedy"},
  { name : "crime"},
  { name : "documentary"},
  { name : "drama"},
  { name : "family"},
  { name : "fantasy"},
  { name : "history"},
  { name : "horror"},
  { name : "musical"},
  { name : "mystery"},
  { name : "xmas"},
  { name : "romance"},
  { name : "sci-fi"},
  { name : "sitcom"},
  { name : "sport"},
  { name : "mythological"},
  { name : "psychological"},
  { name : "thriller"},
  { name : "war"},
  { name : "costume"},
  { name : "kungfu"}
]

async function all_category_list(res){
	
  res.status(200).json(category_list)

}


async function get_home(res,limit){

 
 const url_mList = `https://fmoviesf.me/my-ajax?limit=${limit}&action=list_movie_suggest`
 const url_Sug_mList = `https://fmoviesf.me/my-ajax?limit=${limit}&action=list_movies`
 const url_Sug_tvList = `https://fmoviesf.me/my-ajax?limit=${limit}&action=tv_series`

  const axios_header = { headers : {
    'Authority': 'fmoviesf.me',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'referer': 'https://fmoviesf.me/home/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.81 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'

  }
}

  try {

  let media = []

  const fetch_mList = await axios.get(url_mList,axios_header)
  const movie_list = await fetch_mList.data

  const fetch_Msug = await axios.get(url_Sug_mList,axios_header)	
  const movie_suggestions = await fetch_Msug.data

  const fetch_Tvsug = await axios.get(url_Sug_tvList,axios_header)
  const tv_suggestions = await fetch_Tvsug.data

    media.push({
      movie_list,
      movie_suggestions,
      tv_suggestions
    })

    res.status(200).json(media)

  } catch(error) {
    get_home(res, limit)
//    res.status(404).json({ message : "Server Busy Due To a Bug!" , error })
 }
}





async function get_category(res,genre){

   let match = false
    for(let x=0; x < category_list.length; x++){
      if(category_list[x].name == genre){
	match = true
      }
    }

if(match){

   

    const gen_url = `https://fmoviesf.me/category/${genre}`

    try {

      const fetch_url = await axios.get(`${gen_url}`)
      const html = fetch_url.data

      const result = []

      const $ = cheerio.load(html)

      $('div.movie-list').find('div.item').each(function(){
	const qualit = $(this).find('div.quality').text().trim()
	const title = $(this).find('a.name').text().trim().replaceAll('FMovies Full Movie Online Free', '')
	const media_id = $(this).find('a.name').attr('href').replaceAll('https://fmoviesf.me/movie/','').replaceAll('https://fmoviesf.me/tv/', '')
	const thumb = $(this).find('img.movie-item').attr('src').replaceAll("https://cdn.fmoviesf.me", "")

	const media_type = qualit ? ' ' && 'Movie' : 'Tv'
	const quality = qualit ? ' ' && qualit : 'generic'
	
	result.push(
	  {
	    title,
	    quality,
	    media_type,
	    media_id,
	    thumb
	  }
	)

      })

     res.status(200).json({ result  })
  }
    catch(error){
      get_category(res, genre)
//    res.status(404).json({ error })
  }
  
  } else {
    res.status(200).json({ message: "Invalid Genre" })
  }


}




async function search_media(res,query,page){

  try{

    const p_query = query.replaceAll(' ','-')
    
    const gen_url = `https://fmoviesf.me/search/?keyword=${p_query}&step=${page}`

      const fetch_url = await axios.get(`${gen_url}`)
      const html = fetch_url.data

      const result = []

      const $ = cheerio.load(html)

      $('div.movie-list').find('div.item').each(function(){
	const qualit = $(this).find('div.quality').text().trim()
	const title = $(this).find('a.name').text().trim().replaceAll('FMovies Full Movie Online Free', '')
	const episode = $(this).find('div.status').find('span').text().trim()
	const media_id = $(this).find('a.name').attr('href').replaceAll('https://fmoviesf.me/movie/','').replaceAll('https://fmoviesf.me/tv/', '')
	const thumb = $(this).find('img.movie-item').attr('src').replaceAll("https://cdn.fmoviesf.me", "")

	const media_type = qualit ? ' ' && 'Movie' : 'Tv'
	const quality = qualit ? ' ' && qualit : 'generic'

	const show_status = episode ? ' ' && 'EP ' +  episode : 'A Few Hours'
	
	result.push(
	  {
	    title,
	    quality,
	    media_type,
	    media_id,
	    show_status,
	    thumb
	  }
	)

      })

     res.status(200).json({ result  })

  }
    catch(error){
      search_media(res, query, page)
  //  res.status(404).json({ error })
  }

}

async function search_lib(res,query,page){

  try {

  const gen_url = `https://fmoviesf.me/library/${query}/page/${page}`

  const get_res = await axios.get(gen_url)
  const html = get_res.data

  const $ = cheerio.load(html)

  const result = []

    $('tbody').find('tr').each(function(){
	  const title = $(this).find('td').find('a.name').text().trim().replaceAll('FMovies Full Movie Online Free', '')
	  const thumb = $(this).find('td').find('img.thumb').attr('src').replaceAll("https://cdn.fmoviesf.me", "")
	  const rating = $(this).find('td').find('span.imdb').text().trim()
	  const year = $(this).children().first().next().next().text()
	  const quality = $(this).children().first().next().next().next().text()
	  const media_id = $(this).find('td').find('a.name').attr('href').replaceAll('https://fmoviesf.me','').replaceAll('/movie/', '').replaceAll('/tv/', '')


      result.push({
	title,
	rating,
	year,
	quality,
	media_id,
	thumb
      })
	  
    })

  res.status(200).json({ result })

  } catch (error){
  	search_lib(res, query, page)
    //  res.status(404).json({ message : "Something went Wrong!" , error })
  }

}

async function get_movie(res,mediaID){

  try {

  const gen_url = `https://fmoviesf.me/movie/${mediaID}`

  const get_res = await axios.get(gen_url)
  const html = get_res.data

  const media_data = []

  const $ = cheerio.load(html)

      $('ul#list-eps').find('a.btn-eps').each(function(){
      
      const iframeLink = $(this).attr('data-src')
      const episode = $(this).text().trim()


      media_data.push({
	iframeLink,
	episode,
      })
    
    })

   const media_info = []

    const description = $('div.info').find('div.desc').text().trim()
    const title = $('div.info').find('h1.name').text().trim().replaceAll('FMovies Full Movie Online Free', '')
    const rating = $('div.info').find('div.meta').find('span').first().find('b').text().trim()
    const duration = $('div.info').find('div.meta').find('span').last().text().trim() || "A few Episodes"
    const genre = $('div.info').find('div.row').find('dl.meta').find('dd').first().text().trim().toLowerCase() 

    const cast = $('div.info').find('div.row').find('dl.meta').find('dd').first().next().next().text().trim()

    const quality = $('div.info').find('div.row').find('dl.meta').find('dd').last().text().trim()
    const year = $('div.info').find('div.row').find('dl.meta').find('dd').last().prev().prev().text().trim()

    const region = $('div.info').find('div.row').find('dl.meta').first().find('dd').last().text().trim()


    media_info.push({
      title,
      description,
      rating,
      genre,
      cast,
      quality,
      year,
      region,
      duration
    })

  res.status(200).json({ media_data, media_info })

  } catch (error){
    get_media(res, mediaID)
   // res.status(404).json({ message : "Something went Wrong!" , error })
  } 
	

}


async function get_tv(res,mediaID){

  try {

  const gen_url = `https://fmoviesf.me/tv/${mediaID}`

  const get_res = await axios.get(gen_url)
  const html = get_res.data

  const media_data = []

  const $ = cheerio.load(html)

      $('ul#list-eps').find('a.btn-eps').each(function(){
      
      const iframeLink = $(this).attr('data-src')
      const episode = $(this).text().trim()


      media_data.push({
	iframeLink,
	episode,
      })
    
    })

   const media_info = []

    const description = $('div.info').find('div.desc').text().trim()
    const title = $('div.info').find('h1.name').text().trim().replaceAll('FMovies Full Movie Online Free', '')
    const rating = $('div.info').find('div.meta').find('span').first().find('b').text().trim()
    const duration = $('div.info').find('div.meta').find('span').last().text().trim() || "A few Episodes"
    const genre = $('div.info').find('div.row').find('dl.meta').find('dd').first().text().trim().toLowerCase() 

    const cast = $('div.info').find('div.row').find('dl.meta').find('dd').first().next().next().text().trim()

    const quality = $('div.info').find('div.row').find('dl.meta').find('dd').last().text().trim()
    const year = $('div.info').find('div.row').find('dl.meta').find('dd').last().prev().prev().text().trim()

    const region = $('div.info').find('div.row').find('dl.meta').first().find('dd').last().text().trim()


    media_info.push({
      title,
      description,
      rating,
      genre,
      cast,
      quality,
      year,
      region,
      duration
    })

  res.status(200).json({ media_data, media_info })

  } catch (error){
    get_media(res, mediaID)
   // res.status(404).json({ message : "Something went Wrong!" , error })
  } 
	

}


module.exports = {
  get_home,
  all_category_list,
  get_category,
  search_media,
  get_movie,
  get_tv,
  search_lib,
}
