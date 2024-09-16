import React, { useState } from 'react';
import styled from 'styled-components';
import MovieList from './MovieList';
import { useApi } from '../services/api';

const AccordionMenu: React.FC = () => {
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const { fetchThisWeekMovies } = useApi();

  const handleYearClick = (year: number) => {
    setActiveYear(activeYear === year ? null : year);
    setActiveMonth(null); // Reset month selection when changing year
  };

  const handleMonthClick = (month: string) => {
    setActiveMonth(activeMonth === month ? null : month);
  };

  return (
    <AccordionContainer>
      <AccordionItem>
        <YearButton onClick={() => handleYearClick(2024)}>
          Year 2024
        </YearButton>
        {activeYear === 2024 && (
          <MonthContainer>
            <MonthButton onClick={() => handleMonthClick('January')}>
              January
            </MonthButton>
            {activeMonth === 'January' && (
              <MovieListWrapper>
                <MovieList type="upcoming" month="January" />
                <MovieList type="this-week" month="January" onBook={fetchThisWeekMovies} />
              </MovieListWrapper>
            )}

            <MonthButton onClick={() => handleMonthClick('February')}>
              February
            </MonthButton>
            {activeMonth === 'February' && (
              <MovieListWrapper>
                <MovieList type="upcoming" month="February" />
                <MovieList type="this-week" month="February" onBook={fetchThisWeekMovies} />
              </MovieListWrapper>
            )}
          </MonthContainer>
        )}
      </AccordionItem>
    </AccordionContainer>
  );
};

export default AccordionMenu;

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`;

const AccordionItem = styled.div`
  margin-bottom: 10px;
`;

const YearButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: left;
  &:hover {
    background-color: #0056b3;
  }
`;

const MonthContainer = styled.div`
  margin-top: 10px;
`;

const MonthButton = styled.button`
  background-color: #e9ecef;
  color: black;
  padding: 10px;
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: left;
  margin-bottom: 5px;
  &:hover {
    background-color: #d6dbdf;
  }
`;

const MovieListWrapper = styled.div`
  padding-left: 20px;
  margin-top: 10px;
`;
