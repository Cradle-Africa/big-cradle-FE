'use client';

import { useState, useEffect } from 'react';

type SearchSelectProps = {
    data: string[];
    name: string;
    value?: string;
    placeholder?: string;
    onSelect: (value: string) => void;
    className?: string;
};

const SearchSelect = ({
    data,
    name,
    value,
    onSelect,
    className = '',
    placeholder = 'Select a city...',
}: SearchSelectProps) => {
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (search === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(city =>
                city.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [search, data]);

    const handleSelect = (city: string) => {
        onSelect(city); 
        setSearch('');
        setIsFocused(false);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                name={name}
                placeholder={placeholder}
                className={className}
                value={search || value}
                onChange={e => {
                    setSearch(e.target.value);
                    onSelect(''); 
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay to allow click on list
                autoComplete="off"
            />
            {isFocused && search && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto rounded shadow">
                    {filteredData.length > 0 ? (
                        filteredData.map(city => (
                            <li
                                key={city}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(city)}
                            >
                                {city}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchSelect;
