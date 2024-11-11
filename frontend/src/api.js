export const sendGameData = async (gameData) => {
    try {
        const response = await fetch('http://localhost:3000/save-game', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
        body: JSON.stringify(gameData),
    });
  
      const data = await response.json();
      console.log('learning style assessment: ', data.assessment);
      console.log('Game data saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };
  


