import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IMovieData } from '../interface/IMovieData';



const Home: React.FC = () => {
    const [movieData, setMovieData] = useState<IMovieData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const searchData = (document.getElementById('searchData') as HTMLInputElement).value;
        setIsLoading(true);

        try {
            const response = await fetch(`/api/Movie/${searchData}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: IMovieData = await response.json();
            setMovieData(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Assessment Project</h1>

            <form className="form-inline" onSubmit={handleSubmit}>
                <div className="form-group mx-sm-3 mb-2">
                    <label htmlFor="searchData" className="sr-only">Movie Title</label>
                    <input type="text" className="form-control" id="searchData" placeholder="movie title" required />
                </div>
                <button type="submit" className="btn btn-primary mb-2" id="searchBtn">Search</button>
            </form>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : movieData ? (
                <MovieCard movieData={movieData} />
            ) : (
                <p>Search for a movie</p>
            )}
        </div>
    );
};

interface MovieCardProps {
    movieData: IMovieData;
}

const MovieCard: React.FC<MovieCardProps> = ({ movieData }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="card p-3 m-2">
            <img src={movieData.poster} className="card-img-top" alt="Movie Poster" />
            <div className="card-body">
                <h5 className="card-title">{movieData.title}</h5>
                <p className="card-text">{movieData.plot}</p>
                
                <div className={`collapse${isExpanded ? ' show' : ''}`}>
                    <div className="mt-3">
                        <p><strong>Genre:</strong> {movieData.genre}</p>
                        <p><strong>Director:</strong> {movieData.director}</p>
                        
                    </div>
                </div>
                <button className="btn btn-primary" onClick={handleToggle}>
                    {isExpanded ? 'Hide Details' : 'View More info'}
                </button>
            </div>
        </div>
    );
};

export default connect()(Home);
