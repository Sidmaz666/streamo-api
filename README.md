# aniswim-api

A simple API to get Move & TV-Shows Details & Video Links.

## Installation
	
	npm i
		
Run Locally - `npm run start ` or `node index.js`

## Endpoints:

1. `/` - List of popular Movies and TV-Shows
2. `/category` - Get the List of Genre
3. `/category/:category-name` - Get a List of Movies & TV shows according to the genre.
4. `/search/:search-query` Search For TV Shows and Movies.
5. `/lib/:OPTION` Get a List of Movies and TV shows according to the number, or alphabets. `[0-9]` , `[a-z]`
6. `/view/media_id` Get Details about the Movie/TV-Show and Video Links.

## URL Query Parameters

1. `page` - Go to <b>n</b> number of pages.
2.  `limit` - Limit the number of Movie & Tv Show suggestions.

## Note `?page=` & `?limit=` parameter is only available for the following Endpoints.

1.  `/lib/:lib-option?page=2`
2. `/search/:search-query?page=`
3. `/?limit=`

### Example
		
		/search/witcher?page=2

		/lib/a

		/lib/0-9

		/category/drama

## Usage
		GET:
		url: "https://streamo-api.herokuapp.com/view/a-guide-to-recognizing-your-saints-2006-045156"
		response: [
		{
	  "media_data": [
	    {
	    "iframeLink": "https://video.moviedata.xyz/embed/player.html?id=2b766f4644773d3d",
	    "episode": "01"
	    }
	  ],
	  "media_info": [
	  {
	      "title": "A Guide to Recognizing Your Saints ",
	      "description": "Dito Montiel, a successful author, receives a call from his long-suffering mother, asking him to return home and visit his ailing father. There he finds redemption by facing the \"saints\" who have influenced his life.",
	      "rating": "7.1",
	      "genre": "crime,drama",
	      "cast": "Robert Downey Jr.",
	      "quality": "HD",
	      "year": "2006",
	      "region": "United States",
	      "duration": "100 min"
	  }
	  ]
	}
	  ]

### <a src="https://streamo-api.herokuapp.com/">Live Demo</a>

<a href="https://streamo-api.herokuapp.com/">Live Link</a> - Get the list of top/popular Movies/TV-Shows.



