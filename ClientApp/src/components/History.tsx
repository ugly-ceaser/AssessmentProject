import React, { useState, useEffect } from 'react';
import { NavItem, NavLink } from 'reactstrap';

interface HistoryData {
    Title: string;
}

const SearchHistoryDropdown: React.FC = () => {
    const [searchHistory, setSearchHistory] = useState<HistoryData[]>([]);

    useEffect(() => {
        fetchSearchHistory();
    }, []);

    const fetchSearchHistory = async () => {
        try {
            const response = await fetch('/api/Movie/SearchHistory');
            if (!response.ok) {
                throw new Error('Failed to fetch search history');
            }
            const searchData = await response.json();
            setSearchHistory(searchData);
        } catch (error) {
            console.error('Error fetching search history:', error);
        }
    };

    if (searchHistory.length === 0) {
        return (
            <div>
                <h1>Search History</h1>
                <p>No Search history.</p>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Search History</h1>
                <ul>
                    {searchHistory.map((history, index) => (
                        <li key={index}>{history}</li>
                    ))}
                </ul>
            </div>
        );
    }
};

export default SearchHistoryDropdown;
