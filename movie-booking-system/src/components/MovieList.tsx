import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApi } from '../services/api';

interface MovieListProps {
  type: 'upcoming' | 'this-week';
  month: string;
  onBook?: () => void;
}

const MovieList: React.FC<MovieListProps> = ({ type, month, onBook }) => {
  const [movies, setMovies] = useState([]);
  const { fetchThisWeekMovies,fetchUpcomingMovies } = useApi();

  useEffect(() => {
    if (type === 'this-week') {
      fetchThisWeekMovies().then(setMovies);
    } else {
        fetchUpcomingMovies().then(setMovies);
    }
  }, [type, month, fetchThisWeekMovies]);

  const handleBook = (movieId: number) => {
    if (onBook) {
      onBook();
    }
    alert(`Booked movie with ID: ${movieId}`);
  };

  return (
    <MovieListContainer>
      <MovieListHeader>{type === 'this-week' ? 'This Week Movies' : 'Upcoming Movies'}</MovieListHeader>
      <MovieItems>
        {movies.map((movie: any) => (
          <MovieItem key={movie.id}>
            <MovieName>{movie.name}</MovieName>
            <MovieDate>Release Date: {movie.releaseDate}</MovieDate>
            {type === 'this-week' && <BookButton onClick={() => handleBook(movie.id)}>Book</BookButton>}
          </MovieItem>
        ))}
      </MovieItems>
    </MovieListContainer>
  );
};

export default MovieList;

const MovieListContainer = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MovieListHeader = styled.h2`
  margin-bottom: 15px;
  color: #333;
`;

const MovieItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MovieItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const MovieName = styled.span`
  font-weight: bold;
`;

const MovieDate = styled.span`
  font-size: 14px;
  color: #777;
`;

const BookButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;
