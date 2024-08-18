
import { useState, useEffect} from 'react';
  
export async function ipRequest() {
    const cachedCity = localStorage.getItem('city');
    if (cachedCity) {
      return cachedCity;
    }
    // return fetch('/api/freeip')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data) {
    //       console.log(data);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Произошла ошибка:', error);
    //   });

    try {
      const response = await fetch('/api/ipinfo');
      if (response.status === 429) {
        console.log('Too many requests, retrying in 1 minute...');
        await delay(60000);
        return ipRequest();
      }
      const jsonResponse = await response.json();
      console.log(jsonResponse.ip, jsonResponse.country, jsonResponse.city);
      return jsonResponse.city;
    } catch (error) {
      console.error('Error fetching IP info:', error);
      return null;
    }
}

export async function getSettlements(partialName) {
    const apiKey = '3f979fcadf58b87f62faf5bc0d85d1a6';
  
    const requestPayload = {
      apiKey,
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: partialName,
        Limit: 10,
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
      if (data.success) {
        return data.data;
      } else {
        console.error('Error:', data.errors);
        return [];
      }
    } catch (error) {
      console.error('Request error:', error);
      return [];
    }
  }
  
  export async function getWarehouses(cityRef) {
    const apiKey = '3f979fcadf58b87f62faf5bc0d85d1a6';
  
    const requestPayload = {
      apiKey,
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityRef: cityRef,
        Page: '1',
        Limit: '500',
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
      if (data.success) {
        return data.data; 
      } else {
        console.error('Error:', data.errors);
        return [];
      }
    } catch (error) {
      console.error('Request error:', error);
      return [];
    }
  }


  export function SettlementAndWarehouseSelector() {
    const [settlements, setSettlements] = useState([]);
    const [selectedSettlement, setSelectedSettlement] = useState('');
    const [warehouses, setWarehouses] = useState([]);
  
    useEffect(() => {
      
      async function fetchSettlements() {
        const settlementsData = await getSettlements('Чернігів');
        setSettlements(settlementsData);
      }
      fetchSettlements();
    }, []);
  
    useEffect(() => {
      
      async function fetchWarehouses() {
        if (selectedSettlement) {
          const warehousesData = await getWarehouses(selectedSettlement);
          setWarehouses(warehousesData);
        }
      }
      fetchWarehouses();
    }, [selectedSettlement]);
  
    return (
      <div>
        <select onChange={(e) => setSelectedSettlement(e.target.value)}>
          <option value="">Выберите населенный пункт</option>
          {settlements.map(settlement => (
            <option key={settlement.Ref} value={settlement.Ref}>
              {settlement.Description}
            </option>
          ))}
        </select>
  
        {warehouses.length > 0 && (
          <select>
            <option value="">Выберите отделение</option>
            {warehouses.map(warehouse => (
              <option key={warehouse.Ref} value={warehouse.Ref}>
                {warehouse.Description}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }