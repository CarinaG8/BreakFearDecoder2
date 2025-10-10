import React, { useState, FormEvent, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from '@google/genai';

type Page = 'welcome' | 'disclaimer' | 'form' | 'payment' | 'decoderResponse';

interface DecoderResponse {
  insight: string;
  task: string;
  thoughtProvokingQuestion: string;
}

const WelcomePage = ({ onProceed }: { onProceed: () => void }) => (
  <div className="page-content">
    <h1 className="title">Welcome to the BreakFear Decoder</h1>
    <div className="portal-container">
      <div className="portal"></div>
    </div>
    <p>Your transformation begins here. Take a deep breath and prepare to step through the portal into a world of insights.</p>
    <button className="btn" onClick={onProceed}>Begin</button>
  </div>
);

const DisclaimerPage = ({ onProceed }: { onProceed: () => void }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !date.trim()) {
      setValidationError('Please provide your name, email, and the date.');
      return;
    }
    if (!agreed) {
      setValidationError('You must agree to the terms to proceed.');
      return;
    }
    setValidationError(null);

    // Save the name/email/date for later use
    localStorage.setItem('disclaimerName', firstName);
    localStorage.setItem('disclaimerEmail', email);
    localStorage.setItem('disclaimerDate', date);

    onProceed();
  };

  return (
    <div className="page-content">
      <h2 className="header">Disclaimer & Consent</h2>
      <div className="disclaimer-box">
        <p>BreakFearFindFreedom LLC is committed to offering support for personal growth and insight through the BreakFear Decoder. By proceeding, you acknowledge the following:</p>
        <p><strong>Personal Responsibility:</strong> This content is for personal insight only. Consult a licensed professional for medical, emotional, or mental health concerns.</p>
        <p><strong>Consent:</strong> By clicking "Agree," you confirm that you understand the purpose of this tool and the potential risks.</p>
        <p><strong>Confidentiality:</strong> Your name, email, and date will be kept private and used only for delivering your Decoder insights and relevant communications.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }} noValidate>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <div>
          <input
            id="agree-checkbox"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="agree-checkbox">I have read and agree to the terms.</label>
        </div>

        {validationError && <div className="error-message">{validationError}</div>}

        <button className="btn" type="submit">Open the Portal 🌌</button>
      </form>
    </div>
  );
};

interface FormData {
  question: string;
}

const FormPage = ({ 
    onProceed, 
    successMessage,
    isSubscribed,
    hasUsedFreeQuery,
    singleCredit,
    firstName
}: { 
    onProceed: (data: FormData) => void; 
    successMessage?: string | null;
    isSubscribed: boolean; 
    hasUsedFreeQuery: boolean;
    singleCredit: boolean;
    firstName: string;
}) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onProceed({ question });
  };

  const buttonText = isSubscribed || singleCredit
    ? 'Reveal My Next Insight'
    : !hasUsedFreeQuery
    ? 'Enter the Decoder Portal (First Insight Free)'
    : 'Unlock Your Hidden Message ($7)';

  return (
    <div className="page-content">
      {successMessage && <div className="success-message" role="status">{successMessage}</div>}
      <h2 className="header">Hello, {firstName}. What fear or sticky place would you like to bring into the Decoder?</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div className="form-group">
          <label htmlFor="question">Your Question</label>
          <textarea 
            id="question"
            className="form-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            aria-required="true"
          ></textarea>
        </div>
        <button className="btn" type="submit">
          {buttonText}
        </button>
      </form>
    </div>
  );
};

const PaymentPage = () => {
  const baseSuccessUrl = window.location.origin + window.location.pathname;

  const monthlySuccessUrl = `${baseSuccessUrl}?purchase=monthly`;
  const singleSuccessUrl = `${baseSuccessUrl}?purchase=single`;

  const stripeMonthlyUrl = `https://buy.stripe.com/00w8wP7HX1Ku6dfadG8Ra00?success_url=${encodeURIComponent(monthlySuccessUrl)}`;
  const stripeSingleUrl = `https://buy.stripe.com/00w14n3rHah00SV4Tm8Ra01?success_url=${encodeURIComponent(singleSuccessUrl)}`;

  return (
      <div className="page-content">
        <h2 className="header">Unlock Your Next Insight</h2>
        <p>Choose the path that's right for you. Go deeper with a monthly subscription for unlimited insights, or unlock just your next message.</p>
        <div className="payment-options">
            <a 
              href={stripeMonthlyUrl} 
              className="payment-btn"
              target="_top"
              rel="noopener noreferrer"
            >
              Reveal Unlimited Messages ($25/mo)
            </a>
            <a 
              href={stripeSingleUrl} 
              className="payment-btn secondary"
              target="_top"
              rel="noopener noreferrer"
            >
              Unlock Your Next Insight ($7)
            </a>
        </div>
        <p className="community-note" style={{fontSize: '0.9rem', marginTop: '1.5rem'}}>
          You can cancel your subscription at any time.
        </p>
      </div>
  );
};

const DecoderResponsePage = ({ 
    response, 
    userName, 
    isHarmful, 
    isLoading, 
    error,
    isSubscribed,
    onUnlockNext
}: { 
    response: DecoderResponse | null, 
    userName: string, 
    isHarmful: boolean,
    isLoading: boolean,
    error: string | null,
    isSubscribed: boolean,
    onUnlockNext: () => void;
}) => (
  <div className="page-content">
    {isLoading ? (
       <>
        <h2 className="header">Decoding your insight...</h2>
        <div className="spinner" style={{width: '50px', height: '50px', borderTopColor: 'var(--accent-color)', borderWidth: '5px'}}></div>
        <p>Your answer is materializing from the ether. Please wait a moment.</p>
      </>
    ) : error ? (
        <div className="error-message" role="alert">{error}</div>
    ) : isHarmful ? (
      <>
        <h2 className="header">Important Notice</h2>
        <div className="response-container safety-notice">
            <p>Your question suggests concerns about your safety or well-being. For your safety, we cannot process this request.</p>
            <p>If you feel unsafe or in distress, please reach out to a licensed professional or call 911. You can also connect with the <a href="https://www.skool.com/@carina-ghionzoli-7880" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text-color)'}}>BreakFearFindFreedom community</a> for additional support.</p>
        </div>
      </>
    ) : response && (
      <>
        <h2 className="header">Your Decoded Insight</h2>
        <h3 className="response-sub-header">Hello, {userName}. Here is your insight:</h3>
        <div className="response-container">
          <div className="response-section">
            <h3>Insight</h3>
            <p>{response.insight}</p>
          </div>
          <div className="response-section">
            <h3>Task/Exercise</h3>
            <p>{response.task}</p>
          </div>
          <div className="response-section">
            <h3>A Question for Reflection</h3>
            <p><em>{response.thoughtProvokingQuestion}</em></p>
          </div>
        </div>
        
        <p style={{ marginTop: '1.5rem', marginBottom: '0' }}>Ready for your next insight?</p>
        
        <p className="community-note">
          If you ever feel you need extra support, you can reach out to a licensed professional or connect with the <a href="https://www.skool.com/@carina-ghionzoli-7880" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text-color)'}}>BreakFearFindFreedom community</a>.
        </p>
        
        <button className="btn" onClick={onUnlockNext}>
            {isSubscribed ? 'Ask Another Question' : 'Unlock Your Next Insight'}
        </button>
      </>
    )}
  </div>
);

const App = () => {
  const [page, setPage] = useState<Page>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decoderResponse, setDecoderResponse] = useState<DecoderResponse | null>(null);
  const [userName, setUserName] = useState('');
  const [isHarmfulQuestion, setIsHarmfulQuestion] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [singleCredit, setSingleCredit] = useState(() => localStorage.getItem('singleCredit') === 'true');

  const [isSubscribed, setIsSubscribed] = useState(() => {
    const subscribed = localStorage.getItem('isSubscribed') === 'true';
    const expiry = localStorage.getItem('subscriptionExpiry');
    if (subscribed && expiry) {
        if (new Date().getTime() > parseInt(expiry, 10)) {
            localStorage.removeItem('isSubscribed');
            localStorage.removeItem('subscriptionExpiry');
            return false;
        }
        return true;
    }
    return false;
  });
  const [hasUsedFreeQuery, setHasUsedFreeQuery] = useState(() => {
    return localStorage.getItem('hasUsedFreeQuery') === 'true';
  });

  const disclaimerName = localStorage.getItem('disclaimerName') || '';

  const onDisclaimerProceed = () => {
    localStorage.setItem('disclaimerAgreed', 'true');
    setPage('form');
  };

  const processQuestion = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setDecoderResponse(null);
    setIsHarmfulQuestion(false);
    setUserName(disclaimerName);
    setPage('decoderResponse');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `User's First Name: ${disclaimerName}. User's Question: "${data.question}"`,
        config: {
            systemInstruction: `You are the BreakFear Decoder. Your task is to analyze a user's question for harmful content and provide a supportive, magical, and varied response if it's safe.

First, check the user's question for harmful content like self-harm, violence, abuse, or severe distress. If detected, your entire JSON response must be '{"isHarmful": true}'.

If the question is safe, provide a JSON response with 'isHarmful' set to false, and include 'insight', 'task', and 'thoughtProvokingQuestion'.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    isHarmful: { type: Type.BOOLEAN },
                    insight: { type: Type.STRING },
                    task: { type: Type.STRING },
                    thoughtProvokingQuestion: { type: Type.STRING },
                },
                required: ["isHarmful"],
            },
        },
      });

      const result = JSON.parse(response.text);
      
      if (result.isHarmful) {
        setIsHarmfulQuestion(true);
        setDecoderResponse(null);
      } else if (result.insight && result.task && result.thoughtProvokingQuestion) {
        setIsHarmfulQuestion(false);
        setDecoderResponse({
          insight: result.insight,
          task: result.task,
          thoughtProvokingQuestion: result.thoughtProvokingQuestion,
        });
      } else {
         setError("The Decoder returned an incomplete response. Please try again.");
      }

    } catch (e) {
      if (e instanceof Error) {
        setError(`An error occurred: ${e.message}. Please check the console for more details.`);
      } else {
        setError("An unknown error occurred while decoding your question.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const processRedirect = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const purchaseType = urlParams.get('purchase');

        if (!purchaseType) return;
        
        window.history.replaceState({}, document.title, window.location.pathname);
        
        if (purchaseType === 'single') {
            localStorage.setItem('singleCredit', 'true');
            setSingleCredit(true);
            setPaymentSuccessMessage("Payment successful! You may now ask your next question.");
            setPage('form');
            setTimeout(() => setPaymentSuccessMessage(null), 6000);

        } else if (purchaseType === 'monthly') {
            const expiry = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem('isSubscribed', 'true');
            localStorage.setItem('subscriptionExpiry', expiry.toString());
            setIsSubscribed(true);
            setPaymentSuccessMessage("Welcome, subscriber! You now have unlimited access for the month.");
            setPage('form');
            setTimeout(() => setPaymentSuccessMessage(null), 6000);
        }
    };
    
    processRedirect();
  }, []);


  const handleFormSubmit = async (data: FormData) => {
    if (isSubscribed) {
      await processQuestion(data);
    } else if (singleCredit) {
      localStorage.removeItem('singleCredit');
      setSingleCredit(false);
      await processQuestion(data);
    } else if (!hasUsedFreeQuery) {
      await processQuestion(data);
      localStorage.setItem('hasUsedFreeQuery', 'true');
      setHasUsedFreeQuery(true);
    } else {
      localStorage.setItem('pendingQuestion', JSON.stringify(data));
      setPage('payment');
    }
  };
  
  const handleNextStep = () => {
    if (isSubscribed) {
      setPage('form');
    } else {
      setPage('payment');
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'welcome':
        return <WelcomePage onProceed={() => setPage('disclaimer')} />;
      case 'disclaimer':
        return <DisclaimerPage onProceed={onDisclaimerProceed} />;
      case 'form':
        return <FormPage 
                  onProceed={handleFormSubmit} 
                  successMessage={paymentSuccessMessage} 
                  isSubscribed={isSubscribed}
                  hasUsedFreeQuery={hasUsedFreeQuery}
                  singleCredit={singleCredit}
                  firstName={disclaimerName}
                />;
      case 'payment':
        return <PaymentPage />;
      case 'decoderResponse':
        return <DecoderResponsePage 
                    response={decoderResponse} 
                    userName={userName} 
                    isHarmful={isHarmfulQuestion} 
                    isLoading={isLoading} 
                    error={error} 
                    isSubscribed={isSubscribed}
                    onUnlockNext={handleNextStep} 
                />;
      default:
        return <WelcomePage onProceed={() => setPage('disclaimer')} />;
    }
  };

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
