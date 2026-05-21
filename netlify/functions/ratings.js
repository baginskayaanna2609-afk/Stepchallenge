exports.handler = async function(event) {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzmQswGCWHiMtInEcmWvE3L6YNEDJBey3UxQ62xF1Pdv5TkZHu7bA8V2s0CD9r7bYFVxQ/exec%27);
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
