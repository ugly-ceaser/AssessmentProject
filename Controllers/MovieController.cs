using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace AssessmentProject.Controllers
{
    // Define a model class for the movie data
   

    [ApiController]
    [Route("api/Movie")]
    public class MovieController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private static readonly List<string> _searchHistory = new List<string>();


        public MovieController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
           
        }

        [HttpGet("{title}")]
        public async Task<IActionResult> GetMovie(string title)
        {
            try
            {
                var client = _clientFactory.CreateClient();
                var apiKey = "dfe76a61";
                var response = await client.GetAsync($"https://www.omdbapi.com?apikey={apiKey}&t={title}");

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode);
                }

                var content = await response.Content.ReadAsStringAsync(); // Read response content as string
                var movieData = JsonSerializer.Deserialize<MovieData>(content); // Deserialize JSON string to MovieData object
                AddToSearchHistory(title);
                return Ok(movieData);
            }
            catch (HttpRequestException)
            {
                return StatusCode(500); // Internal server error
            }
        }

        [HttpGet("SearchHistory")]
        public IActionResult GetSearchHistory()
        {
            return Ok(_searchHistory);
        }


        private void AddToSearchHistory(string searchTerm)
        {
            
            if (_searchHistory.Count >= 5)
            {
                _searchHistory.RemoveAt(0);

               
                for (int i = 0; i < _searchHistory.Count; i++)
                {
                    _searchHistory[i] = _searchHistory[i + 1];
                }

                _searchHistory.RemoveAt(_searchHistory.Count - 1);
            }

          
            _searchHistory.Add(searchTerm);

            Console.WriteLine(_searchHistory);
        }





    }
}
