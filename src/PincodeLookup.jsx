import React, { useState } from 'react';
import './App.css';

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [details, setDetails] = useState(null);
  const [filteredDetails, setFilteredDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const handleLookup = () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    setLoading(true);
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        if (data[0].Status === 'Success') {
          setDetails(data[0].PostOffice);
          setFilteredDetails(data[0].PostOffice);
          setError('');
        } else {
          setError('No details found for the entered pincode.');
          setDetails(null);
        }
      })
      .catch(err => {
        setLoading(false);
        setError('Error fetching details. Please try again later.');
        setDetails(null);
      });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    if (details) {
      const filtered = details.filter(postOffice =>
        postOffice.Name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredDetails(filtered);
    }
  };

  return (
    <div className="pincode-lookup">
      <h2>Pincode Lookup</h2>
      <div className="input-container">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter 6-digit Pincode"
        />
        <button onClick={handleLookup}>Lookup</button>
      </div>
      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}
      {details && (
        <div className="details-container">
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Filter by post office name"
          />
          <div className="grid">
            {filteredDetails.map(detail => (
              <div key={detail.Name} className="details details-enter">
                <p><strong>Post Office Name:</strong> {detail.Name}</p>
                <p><strong>Branch Type:</strong> {detail.BranchType}</p>
                <p><strong>District:</strong> {detail.District}</p>
                <p><strong>Division:</strong> {detail.Division}</p>
                <p><strong>State:</strong> {detail.State}</p>
                <p><strong>Delivery Status:</strong> {detail.DeliveryStatus}</p>
                <p><strong>Pincode:</strong> {detail.Pincode}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodeLookup;
