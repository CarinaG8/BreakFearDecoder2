import React, { useState, FormEvent, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from '@google/genai';

type Page = 'welcome' | 'disclaimer' | 'form' | 'payment' | 'decoderResponse';

interface DecoderResponse {
  reflection: string;
  reframe: string;
  mirrorPoint: string;
  shiftMove: string;
}

const craftConcise = (text: string, maxSentences = 2) => {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return cleaned;

  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  const uniqueSentences: string[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    const normalized = trimmed.toLowerCase();
    if (!uniqueSentences.some(existing => existing.toLowerCase() === normalized)) {
      uniqueSentences.push(trimmed);
    }
    if (uniqueSentences.length >= maxSentences) break;
  }

  let condensed = uniqueSentences.slice(0, maxSentences).join(' ');
  if (condensed.length > 280) {
    condensed = `${condensed.slice(0, 277).trimEnd().replace(/[.,!?;:]?$/, '')}...`;
  }

  return condensed;
};

const removeForbiddenCharacters = (text: string) =>
  text.replace(/[:\-&]/g, ' ').replace(/\s+/g, ' ').trim();

const replaceSingularPronouns = (text: string) =>
  text
    .replace(/\bI\b/gi, 'we')
    .replace(/\bme\b/gi, 'us')
    .replace(/\bmy\b/gi, 'our')
    .replace(/\bmine\b/gi, 'ours');

const removeBannedWords = (text: string) => {
  const banned = ['unleash', 'ignite', 'dont', 'isnt', 'most'];
  let output = text;
  for (const word of banned) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    output = output.replace(pattern, '').replace(/\s+/g, ' ').trim();
  }
  return output;
};

const removeTechSpeak = (text: string) => {
  const banned = ['AI', 'A.I.', 'technology', 'platform', 'software', 'algorithm', 'app'];
  let output = text;
  for (const word of banned) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    output = output.replace(pattern, '').replace(/\s+/g, ' ').trim();
  }
  return output;
};

const limitWords = (text: string, maxWords: number) => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(' ')}...`;
};

const baseSanitize = (text: string) => {
  let sanitized = removeForbiddenCharacters(text);
  sanitized = replaceSingularPronouns(sanitized);
  sanitized = removeBannedWords(sanitized);
  sanitized = removeTechSpeak(sanitized);
  return sanitized.trim();
};

const sanitizeReflection = (text: string) => limitWords(baseSanitize(text), 30);

const sanitizeReframe = (text: string) => limitWords(baseSanitize(text), 30);

const sanitizeMirrorPoint = (text: string) => limitWords(baseSanitize(text), 25);

const SHIFT_MOVE_SUFFIX = 'Stay aware and safe as you move. Always trust your intuition first.';

const sanitizeShiftMove = (text: string) => {
  let sanitized = baseSanitize(text);
  if (sanitized.toLowerCase().endsWith(SHIFT_MOVE_SUFFIX.toLowerCase())) {
    sanitized = sanitized.slice(0, sanitized.length - SHIFT_MOVE_SUFFIX.length).trim();
  }
  sanitized = limitWords(sanitized, 28);
  const needsVerb = sanitized ? sanitized : 'Choose one kind micro action today.';
  return `${needsVerb.trim()} ${SHIFT_MOVE_SUFFIX}`.trim();
};

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onProceed({ question });
  };

  return (
    <div className="page-content">
      <h2 className="header">What fear or challenge would you like to explore today?</h2>
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
const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'self-harm',
  'self harm',
  'hurt myself',
  'end my life',
  'take my life',
  'die',
  'overdose',
  'kill someone',
  'harm someone',
];

const containsCrisisLanguage = (question: string) => {
  const normalized = question.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => normalized.includes(keyword));
};

const App = () => {
  const [page, setPage] = useState<Page>('welcome');
  const [decoderResponse, setDecoderResponse] = useState<DecoderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDisclaimerProceed = () => setPage('form');

  const processQuestion = async (data: FormData) => {
    setError(null);
    setDecoderResponse(null);
    setPage('decoderResponse');
    setIsLoading(true);

    if (containsCrisisLanguage(data.question)) {
      setError(
        'We detected language that may indicate immediate danger. Please contact emergency services or a licensed professional for support.'
      );
      setIsLoading(false);
      return;
    }

    const firstName = localStorage.getItem('userFirstName') || 'there';
    const source = localStorage.getItem('userSource') || 'unknown';

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `User's First Name: ${firstName}, Question: "${data.question}", Source: ${source}`,
        config: {
          systemInstruction: `You are BreakFearDecoder. Detect crisis language; whenever you sense immediate danger set isHarmful true. If safe craft Reflection Reframe Mirror Point and Shift Move. Each stays within twenty to thirty words, all together between eighty and one hundred twenty words. Speak as a warm grounded human partner. Use only we voice. Stay poetic yet practical. Reveal love as the foundation. No repetition loops. No affirmations. No journaling or meditation prompts. Tasks must feel imaginative and embodied. Avoid stock phrasing. Never mention tools or technology. Avoid negation where possible. Never use the words unleash ignite dont isnt most. Never use colons dashes or ampersands. Shift Move must end with the line 'Stay aware and safe as you move. Always trust your intuition first.' Deliver JSON {isHarmful, reflection, reframe, mirrorPoint, shiftMove}.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isHarmful: { type: Type.BOOLEAN },
              reflection: { type: Type.STRING },
              reframe: { type: Type.STRING },
              mirrorPoint: { type: Type.STRING },
              shiftMove: { type: Type.STRING },
            },
            required: ['isHarmful']
          }
        }
      });

      const result = JSON.parse(response.text);

      const isHarmful = result?.isHarmful === true;
      const reflection = typeof result?.reflection === 'string' ? result.reflection : null;
      const reframe = typeof result?.reframe === 'string' ? result.reframe : null;
      const mirrorPoint = typeof result?.mirrorPoint === 'string' ? result.mirrorPoint : null;
      const shiftMove = typeof result?.shiftMove === 'string' ? result.shiftMove : null;

      if (isHarmful) {
        setError('Your question suggests safety concerns. Please reach out to a professional.');
      } else if (reflection && reframe && mirrorPoint && shiftMove) {
        setDecoderResponse({
          reflection: sanitizeReflection(craftConcise(reflection, 2)),
          reframe: sanitizeReframe(craftConcise(reframe, 2)),
          mirrorPoint: sanitizeMirrorPoint(craftConcise(mirrorPoint, 2)),
          shiftMove: sanitizeShiftMove(craftConcise(shiftMove, 2))
        });
      } else {
        setError('We were unable to generate a complete response. Please try asking your question again.');
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
              <h3>Reflection</h3>
              <p>{decoderResponse.reflection}</p>
              <h3>Reframe</h3>
              <p>{decoderResponse.reframe}</p>
              <h3>Mirror Point</h3>
              <p>{decoderResponse.mirrorPoint}</p>
              <h3>Shift Move</h3>
              <p>{decoderResponse.shiftMove}</p>
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
