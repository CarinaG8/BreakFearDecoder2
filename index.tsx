import React, { useState, FormEvent, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from '@google/genai';

type Page = 'welcome' | 'disclaimer' | 'form' | 'payment' | 'decoderResponse';

interface DecoderResponse {
  insight: string;
  task: string;
  thoughtProvokingQuestion: string;
}

// ------------------ Welcome Page ------------------
const WelcomePage = ({ onProceed }: { onProceed: () => void }) => (
  <div className="page-content">
    <h1 className="title">Welcome to the BreakFear Decoder</h1>
    <p>Your transformation begins here. Take a deep breath and prepare to step into a world of insights.</p>
    <button className="btn" onClick={onProceed}>Begin</button>
  </div>
);

// ------------------ Disclaimer Page ------------------
const DisclaimerPage = ({ onProceed }: { onProceed: () => void }) => {
  const [agreed, setAgreed] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [source, setSource] = useState('unknown');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const src = urlParams.get('source') || 'unknown';
    setSource(src);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !date.trim()) {
      setValidationError('Please complete all fields.');
      return;
    }
    if (!agreed) {
      setValidationError('You must agree to the terms to proceed.');
      return;
    }
    setValidationError(null);

    // Store info in localStorage for question page
    localStorage.setItem('userFirstName', firstName);
    localStorage.setItem('userLastName', lastName);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userSource', source);

    // Call Google AI to initialize decoder if needed
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `User's First Name: ${firstName}. Disclaimer agreed.`,
        config: {
          systemInstruction: "Initialize decoder for user.",
          responseMimeType: "application/json"
        }
      });
    } catch (err) {
      console.error('Google AI initialization failed', err);
    }

    onProceed();
  };

  return (
    <div className="page-content">
      <h2 className="header">Disclaimer & Consent</h2>
      <div className="disclaimer-box">
        <p>BreakFearFindFreedom LLC is committed to offering support for personal growth and insight through the BreakFear Decoder. By proceeding, you acknowledge the following:</p>
        <ul>
          <li><strong>Personal Responsibility:</strong> Content is for insight and educational purposes only. Always consult licensed professionals for medical, emotional, or mental health concerns.</li>
          <li><strong>Liability:</strong> You accept full responsibility for your decisions and actions. BreakFearFindFreedom LLC and its affiliates are not liable for outcomes.</li>
          <li><strong>Safety:</strong> Ensure a calm environment. Avoid unsafe activities while using the tool.</li>
          <li><strong>Emergency Resources:</strong> If in distress, contact 911 or a licensed professional. You can also reach out to our <a href="https://www.skool.com/@carina-ghionzoli-7880" target="_blank" rel="noopener noreferrer">BreakFearFindFreedom community</a>.</li>
          <li><strong>Confidentiality:</strong> Your data (name, email, question) is used only to improve this service. Emails and answers are not shared.</li>
          <li><strong>Consent:</strong> By agreeing, you confirm understanding of the above and accept the terms.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

        <label>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          I have read and agree to the terms.
        </label>

        {validationError && <div className="error-message">{validationError}</div>}
        <button className="btn" type="submit">Open the Portal 🌌</button>
      </form>
    </div>
  );
};

// ------------------ Form Page ------------------
interface FormData {
  question: string;
}

const FormPage = ({ onProceed }: { onProceed: (data: FormData) => void }) => {
  const [question, setQuestion] = useState('');
  const firstName = localStorage.getItem('userFirstName') || 'there';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onProceed({ question });
  };

  return (
    <div className="page-content">
      <h2 className="header">Hey {firstName}, what fear or challenge would you like to explore today?</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          required
        />
        <button className="btn" type="submit">Reveal My Next Insight</button>
      </form>
    </div>
  );
};

// ------------------ Main App ------------------
const App = () => {
  const [page, setPage] = useState<Page>('welcome');
  const [decoderResponse, setDecoderResponse] = useState<DecoderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDisclaimerProceed = () => setPage('form');

  const processQuestion = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setDecoderResponse(null);
    setPage('decoderResponse');

    const firstName = localStorage.getItem('userFirstName') || 'there';
    const source = localStorage.getItem('userSource') || 'unknown';

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `User's First Name: ${firstName}, Question: "${data.question}", Source: ${source}`,
        config: {
          systemInstruction: `Analyze question for harmful content and provide JSON {isHarmful, insight, task, thoughtProvokingQuestion}.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isHarmful: { type: Type.BOOLEAN },
              insight: { type: Type.STRING },
              task: { type: Type.STRING },
              thoughtProvokingQuestion: { type: Type.STRING },
            },
            required: ['isHarmful']
          }
        }
      });

      const result = JSON.parse(response.text);

      if (result.isHarmful) {
        setError('Your question suggests safety concerns. Please reach out to a professional.');
      } else {
        setDecoderResponse({
          insight: result.insight,
          task: result.task,
          thoughtProvokingQuestion: result.thoughtProvokingQuestion
        });
      }
    } catch (err) {
      setError('An error occurred while decoding your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {page === 'welcome' && <WelcomePage onProceed={() => setPage('disclaimer')} />}
      {page === 'disclaimer' && <DisclaimerPage onProceed={onDisclaimerProceed} />}
      {page === 'form' && <FormPage onProceed={processQuestion} />}
      {page === 'decoderResponse' && (
        <div className="page-content">
          {isLoading && <p>Decoding your insight...</p>}
          {error && <div className="error-message">{error}</div>}
          {decoderResponse && (
            <div>
              <h3>Your Insight</h3>
              <p>{decoderResponse.insight}</p>
              <h3>Task</h3>
              <p>{decoderResponse.task}</p>
              <h3>Reflection Question</h3>
              <p>{decoderResponse.thoughtProvokingQuestion}</p>
              <button className="btn" onClick={() => setPage('form')}>Ask Another Question</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);
