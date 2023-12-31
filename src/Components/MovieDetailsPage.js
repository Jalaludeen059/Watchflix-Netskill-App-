import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons'
import { HiShare } from 'react-icons/hi';
import Play from '../Assets/PlayBt.svg'
import IMDB from '../Assets/IMDB.svg'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReactPlayer from 'react-player';

const MovieDetailsPage = () => {
    const { movieId } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [movieTrailers, setMovieTrailers] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const sliderRef = useRef(null);

    useEffect(() => {
        // Fetch movie details data
        axios
            .get(`https://api.themoviedb.org/3/movie?apikey=1cda0e2e7e8ac397165cdc643bcd6d5e&language=en-US`)
            .then(response => {
                setMovieDetails(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        // Fetch similar movies data
        axios
            .get(`https://api.themoviedb.org/3/movie/similar?api_key=1cda0e2e7e8ac397165cdc643bcd6d5e&language=en-US&page=1`)
            .then(response => {
                setSimilarMovies(response.data.results.slice(0, 18));
            })
            .catch(error => {
                console.log(error);
            });

        // Fetch movie trailers
        axios
            .get(`https://api.themoviedb.org/3/movie/videos?api_key=1cda0e2e7e8ac397165cdc643bcd6d5e&language=en-US`)
            .then(response => {
                setMovieTrailers(response.data.results);
            })
            .catch(error => {
                console.log(error);
            });
    }, [movieId]);

    const settings = {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ],
        afterChange: () => {
            // Force a re-render of the Slider component to update slide dimensions
            sliderRef.current.slickGoTo(0);
        },
    };

    const handleTrailerClick = (trailer) => {
        setSelectedTrailer(trailer);
    };

    const handleTrailerClose = () => {
        setSelectedTrailer(null);
    };

    return (
        <div className='app-container'>
            {movieDetails ? (
                <div className="movie-container">
                    <div className='movie-details-overlay' />
                    <img className="movie-img" src={`https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`} alt={movieDetails.title} />
                    <div className='flex items-center justify-around mb-6 movdet movie-details'>
                        <h2 className='movie-details-title ml-10'>{movieDetails.title}</h2>
                        <div className='flex mv-bt mr-14'>
                            <div className='flex flex-col items-center space-y-2 f-text mt-12'>
                                <AddIcon className='add-bt' boxSize={4} />
                                <span>WATCHLIST</span>
                            </div>
                            <div className='flex flex-col items-center space-y-2 f-text ml-10 mt-12'>
                                <HiShare size={21} />
                                <span>SHARE</span>
                            </div>
                            <img src={Play} alt="play-button" onClick={() => handleTrailerClick(movieTrailers[0])} />
                        </div>
                    </div>

                    {selectedTrailer && (
                        <div className='ml-10 mt-12'>
                            <div className='flex flex-row space-x-5'>
                                <div className="trailer-overlay">
                                    <div className="trailer-container">
                                        <ReactPlayer url={`https://www.youtube.com/watch?v=${selectedTrailer.key}`} controls={true} width='100%' height='100%' />
                                        <button className="close-btn" onClick={handleTrailerClose}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='ml-10'>
                        <div className='flex rating mb-14 rating'>
                            <div className='flex'>
                                <img className="imdb-img" src={IMDB} alt="imdb" />
                                <p>{movieDetails.vote_average}</p>
                            </div>
                            <p>{movieDetails.runtime} min</p>
                            <p>{movieDetails.release_date.slice(0, 4)}</p>
                        </div>
                        <div className="movie-tags flex space-x-4 mb-14">
                            {movieDetails.genres.map(genre => (
                                <button key={genre.id} className="tag-button">{genre.name}</button>
                            ))}
                        </div>
                        <p className='movie-details-text'>{movieDetails.overview}</p>
                    </div>
                    {movieTrailers.length > 0 && (
                        <div className='ml-10 mt-12'>
                            <h3 className='more-like mb-3'>More Like This</h3>
                            <div className='flex flex-row space-x-5'>
                                <div className='similar-movies-slider'>
                                    <Slider ref={sliderRef} {...settings}>
                                        {similarMovies.map(movie => (
                                            <Link to={`/movies/${movie.id}`} key={movie.id}>
                                                <div className='poster-img'>
                                                    <img src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} alt={movie.title} />
                                                </div>
                                            </Link>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MovieDetailsPage;
