import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [newRecord, setNewRecord] = useState({
    id: '', quantity: '', amount: '', postingYear: '', postingMonth: '', actionType: '', actionNumber: '', actionName: '', status: '', Impact: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({...newRecord, [name]: value});
  };

  const handleEditChange = (id, name, value) => {
    const updatedData = data.map(item => 
      item.id === id ? {...item, [name]: ['quantity', 'amount'].includes(name) ? parseFloat(value) : value} : item
    );
    setData(updatedData);
  };

  const handleSave = () => {
    const savePromises = data.map(item => 
      axios.put(`http://localhost:5000/data/${item.id}`, item)
    );
    
    Promise.all(savePromises)
      .then(() => {
        console.log('All changes saved successfully');
        return axios.get('http://localhost:5000/data');
      })
      .then(response => {
        setData(response.data);
      })
      .catch(error => console.error('Error saving changes:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/data', newRecord)
      .then(response => setData([...data, response.data]))
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <h1>STATXO Data Management</h1>
      <button onClick={() => setIsAdmin(false)}>Login as User</button>
      <button onClick={() => setIsAdmin(true)}>Login as Admin</button>
      <form onSubmit={handleSubmit}>
        <input type="number" name="id" placeholder="ID" onChange={handleInputChange} required />
        <input type="number" name="quantity" placeholder="Quantity" onChange={handleInputChange} required />
        <input type="number" name="amount" placeholder="Amount" onChange={handleInputChange} required />
        <input type="text" name="postingYear" placeholder="Posting Year" onChange={handleInputChange} required />
        <input type="text" name="postingMonth" placeholder="Posting Month" onChange={handleInputChange} required />
        <select name="actionType" onChange={handleInputChange} required>
          <option value="Type1">Type1</option>
          <option value="Type2">Type2</option>
          <option value="Type3">Type3</option>
        </select>
        <input type="text" name="actionNumber" placeholder="Action Number" onChange={handleInputChange} required />
        <select name="actionName" onChange={handleInputChange} required>
          <option value="Action1">Action1</option>
          <option value="Action2">Action2</option>
          <option value="Action3">Action3</option>
        </select>
        <select name="Impact" onChange={handleInputChange} required>
          <option value="Low">Low</option>
          <option value="Mid">Mid</option>
          <option value="High">High</option>
        </select>
        <button type="submit">Add Record</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Posting Year</th>
            <th>Posting Month</th>
            <th>Action Type</th>
            <th>Action Number</th>
            <th>Action Name</th>
            <th>Status</th>
            <th>Impact</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => handleEditChange(item.id, 'quantity', e.target.value)} 
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={item.amount} 
                  onChange={(e) => handleEditChange(item.id, 'amount', e.target.value)} 
                />
              </td>
              <td>{item.postingYear}</td>
              <td>{item.postingMonth}</td>
              <td>
                <select 
                  value={item.actionType} 
                  onChange={(e) => handleEditChange(item.id, 'actionType', e.target.value)}
                >
                  <option value="Type1">Type1</option>
                  <option value="Type2">Type2</option>
                </select>
              </td>
              <td>{item.actionNumber}</td>
              <td>
                <select 
                  value={item.actionName} 
                  onChange={(e) => handleEditChange(item.id, 'actionName', e.target.value)}
                >
                  <option value="Action1">Action1</option>
                  <option value="Action2">Action2</option>
                </select>
              </td>
              <td>
                {isAdmin ? (
                  <select 
                    value={item.status} 
                    onChange={(e) => handleEditChange(item.id, 'status', e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Approved">Approved</option>
                  </select>
                ) : item.status}
              </td>
              <td>{item.Impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isAdmin && <button onClick={handleSave}>Save Changes</button>}
    </div>
  );
}

export default App;
