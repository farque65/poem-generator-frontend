import { useState } from 'react';

function formatPoem(poem: string) {

  let formattedPoem = JSON.parse(poem);

  formattedPoem = formattedPoem.replace(/{/g, '');
  formattedPoem = formattedPoem.replace(/}/g, '');
  formattedPoem = formattedPoem.replace(/\\/g, '');
  // Replace escaped quotes (\") with actual quotes
  formattedPoem = formattedPoem.replace(/"poem": "/g, '');
  // Replace double escaped newlines (\\n) with actual newlines
  formattedPoem = formattedPoem.replace(/\\n/g, '\n');
  formattedPoem = formattedPoem.replace(/."/g, '');

  // Split poem into lines and wrap each in <span>
  return formattedPoem.split('\\n').map((line: string, idx: number) => (
    <span key={idx}>
      {line}
      <br />
    </span>
  ));
}

function App() {
  const [topic, setTopic] = useState('');
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePoem = async () => {
    setLoading(true);
    setError('');
    setPoem('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/poem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to fetch poem');
      }

      const data = await response.json();
      console.log('Poem data:', data);
      setPoem(data.poem.trim());
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">✨ Poem Generator</h1>

        {/* Input + Button Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic......"
            className="w-full sm:w-2/3 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={generatePoem}
            disabled={loading || !topic.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition w-full sm:w-auto"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Error Display */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Poem Output Section */}
        {poem && (
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg max-h-[60vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-2 text-indigo-600">📝 Your Poem</h2>
            <pre className="whitespace-pre-wrap text-lg font-serif text-gray-800">{formatPoem(poem)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
