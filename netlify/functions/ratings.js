exports.handler = async function(event) {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwnPa672aMlwmDPjw7cUW2cZKH5ZM4-D0VifT9UAGoAXOzYCA2uSd666BmRtQtO2e1IUQ/exec%27);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch(err) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ today: [], overall: [], error: err.message })
    };
  }
};
