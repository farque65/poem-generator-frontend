// src/App.tsx
import { useState } from 'react';

function App() {
  const [topic, setTopic] = useState('');
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePoem = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://your-api-domain.com/api/poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setPoem(data.poem);
    } catch (error) {
      console.error('Error generating poem:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Poem Generator</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic"
        className="p-2 border border-gray-300 rounded mb-4 w-full max-w-md"
      />
      <button
        onClick={generatePoem}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Poem'}
      </button>
      {poem && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2">Your Poem:</h2>
          <p>{poem}</p>
        </div>
      )}
    </div>
  );
}

export default App;
