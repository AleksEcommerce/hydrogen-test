import React, { useState, useEffect } from 'react';

const API_KEY = '3f979fcadf58b87f62faf5bc0d85d1a6';

export async function searchSettlement(query) {
  let page = 1;
  const limit = 500;
  const settlements = [];

  while (true) {
        const requestPayload = {
        apiKey: API_KEY,
        modelName: 'Address',
        calledMethod: 'getSettlements',
            methodProperties: {
                FindByString: query,
                Warehouse: '1',
                Page: String(page),
                Limit: String(limit),
            }
        };

        try {
            const response = await fetch('/api/novaposhta', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestPayload),
            });
            const data = await response.json();
            if (!data.success || data.data.length === 0) {
                break;
            }

            const filtered = data.data.filter(settlement =>
                settlement.Description.toLowerCase().includes(query.toLowerCase())
            );
            settlements.push(...filtered);
            if (filtered.length > 0) {
                break;
            }
            page++;
        } catch (error) {
            console.error('Request error:', error);
            break;
        }
    }

  return settlements;
}

export function SettlementAndWarehouseSelector() {
  const [filteredSettlements, setFilteredSettlements] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputValue.length >= 3) {
      async function fetchSettlements() {
        const settlementsData = await searchSettlement(inputValue);
        setFilteredSettlements(settlementsData);
      }
      fetchSettlements();
    } else {
      setFilteredSettlements([]);
    }
  }, [inputValue]);

  return (
    <div>
      <form>
        <label htmlFor="city">Город:</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Введите город"
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {filteredSettlements.length > 0 && (
          <ul className="suggestions-list">
            {filteredSettlements.map(settlement => (
              <li key={settlement.Ref}>
                {settlement.Description}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
