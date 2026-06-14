import { useState } from 'react';

function TaxForm() {
  const [formData, setFormData] = useState({
    country: '',
    income: '',
    expenses: '',
    employmentStatus: 'employee',
    maritalStatus: 'single',
    numberOfChildren: '',
  });
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
    };
    return (
      <div>
        <h1>Tax Form</h1>
        <input 
          type="text" 
          placeholder="Enter your country"
          value={formData.country}
          onChange={(e) => setFormData({...formData, country: e.target.value})}
        />
        

        <input type="number" 
        placeholder="Enter your income"
        min={0}
        value={formData.income}
        onChange={(e) => setFormData({...formData, income: e.target.value === '' ? '' : parseFloat(e.target.value)})}
        />

        <input type="number"
          placeholder="Enter your expenses"
          min={0}
          value={formData.expenses}
          onChange={(e) => setFormData({...formData, expenses: e.target.value === '' ? '' : parseFloat(e.target.value)})}
         />

        <select
          value={formData.employmentStatus}
          onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}
        >
        <option value="employee">Employee</option>
        <option value="self-employed">Self-employed</option>
        </select>

        <select
        value={formData.maritalStatus}
        onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
        >
        <option value="single">Single</option>
        <option value="married">Mariried</option>
        </select>

        <input type="number" 
          placeholder="Enter your number of children"
          min={0}
          value={formData.numberOfChildren}
          onChange={(e) => setFormData({...formData, numberOfChildren: e.target.value === '' ? '' : parseInt(e.target.value)})}
        />
        
        <button onClick={handleSubmit}>Get Tax Advice</button>
      </div>
    )
  }
  
  export default TaxForm

 
