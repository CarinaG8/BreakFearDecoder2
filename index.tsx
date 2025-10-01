
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
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [date, setDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!signature.trim() || !date.trim()) {
      setValidationError('Please provide your signature and the date.');
      return;
    }
    if (!agreed) {
        setValidationError('You must agree to the terms to proceed.');
        return;
    }
    setValidationError(null);
    onProceed();
  };


  return (
    <div className="page-content">
      <h2 className="header">Disclaimer & Indemnity</h2>
      <div className="disclaimer-box">
        <p>BreakFearFindFreedom LLC is committed to offering support for personal growth and insight through the BreakFear Decoder. By proceeding, you acknowledge the following:</p>
        <p><strong>Personal Responsibility:</strong> The content provided is for personal insight and educational purposes only. BreakFearFindFreedom LLC does not provide medical, psychological, or therapeutic advice. Always consult with a licensed professional for medical, emotional, or mental health concerns.</p>
        <p><strong>Liability Clause:</strong> By using the BreakFear Decoder, you agree that BreakFearFindFreedom LLC, its team, and affiliates are not liable for any direct or indirect consequences of actions taken based on the insights or advice provided. You take full responsibility for your own decisions and actions.</p>
        <p><strong>Safety Notice:</strong> Please ensure that you are in a safe and calm environment when using the BreakFear Decoder. Avoid performing any tasks while walking, driving, or engaging in any activities that may require full attention.</p>
        <p><strong>No Substitute for Professional Advice:</strong> The BreakFear Decoder provides guidance based on reflection, mindfulness, and self-exploration. It is not a substitute for professional advice, therapy, or other interventions that may be necessary for your well-being.</p>
        <p><strong>Consent:</strong> By clicking "Agree," you confirm that you understand the purpose of this tool and the potential risks involved in using it. You also agree to our Terms of Service and Privacy Policy.</p>
        <p><strong>Confidentiality and Privacy</strong></p>
        <p>Your responses, name, and email are kept strictly confidential. BreakFearFindFreedom LLC will not share your personal information with any third parties. Collected emails are used only for delivering your Decoder insights and relevant communications from BreakFearFindFreedom. By signing below, you acknowledge understanding and agreement with this privacy policy.</p>
      </div>

       <form 
        onSubmit={handleSubmit}
        style={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          marginTop: '1rem' 
        }}
        noValidate
      >
        <div className="form-group" style={{width: '100%'}}>
          <label htmlFor="signature">Signature</label>
          <input
            id="signature"
            className="form-input"
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Type your full name"
            aria-required="true"
          />
        </div>
        <div className="form-group" style={{width: '100%'}}>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            className="form-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-required="true"
          />
        </div>

        <div className="checkbox-container">
          <input 
            id="agree-checkbox" 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)} 
            aria-labelledby="agree-label"
          />
          <label id="agree-label" htmlFor="agree-checkbox">I have read and agree to the terms.</label>
        </div>

        {validationError && <div className="error-message" role="alert" style={{marginTop: '1rem', width: '100%'}}>{validationError}</div>}
        
        <button 
          className="btn" 
          type="submit"
        >
          Open the Portal 🌌
        </button>
      </form>
    </div>
  );
};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  question: string;
}

const FormPage = ({ 
    onProceed, 
    successMessage,
    isSubscribed,
    hasUsedFreeQuery,
    singleCredit
}: { 
    onProceed: (data: FormData) => void; 
    successMessage?: string | null;
    isSubscribed: boolean; 
    hasUsedFreeQuery: boolean;
    singleCredit: boolean;
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    question: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.firstName.trim() || !formData.email.trim()) {
      return;
    }
    onProceed(formData);
  };

  const buttonText = isSubscribed || singleCredit
    ? 'Reveal My Next Insight'
    : !hasUsedFreeQuery
    ? 'Enter the Decoder Portal (First Insight Free)'
    : 'Unlock Your Hidden Message ($7)';


  return (
    <div className="page-content">
      {successMessage && <div className="success-message" role="status">{successMessage}</div>}
      <h2 className="header">What fear or sticky place would you like to bring into the Decoder?</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input 
            id="firstName" 
            className="form-input"
            type="text" 
            value={formData.firstName}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input 
            id="lastName" 
            className="form-input"
            type="text" 
            value={formData.lastName}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            className="form-input"
            type="email" 
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="question">What fear or sticky place would you like to bring into the Decoder?</label>
          <textarea 
            id="question"
            className="form-textarea"
            value={formData.question}
            onChange={handleChange}
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


  const onDisclaimerProceed = () => {
    localStorage.setItem('disclaimerAgreed', 'true');
    setPage('form');
  };

  const processQuestion = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setDecoderResponse(null);
    setIsHarmfulQuestion(false);
    setUserName(data.firstName);
    setPage('decoderResponse');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `User's First Name: ${data.firstName}. User's Question: "${data.question}"`,
        config: {
            systemInstruction: `You are the BreakFear Decoder. Your task is to analyze a user's question for harmful content and provide a supportive, magical, and varied response if it's safe.

First, check the user's question for harmful content like self-harm, violence, abuse, or severe distress. If detected, your entire JSON response must be '{"isHarmful": true}'.

If the question is safe, provide a JSON response with 'isHarmful' set to false, and include 'insight', 'task', and 'thoughtProvokingQuestion'.
- 'insight': Around 150 words. Be transformative, practical, and unique. Avoid clichés. Address the user by their first name.
- 'task': A short, actionable "micro-task". Rotate through different categories:
  - Imagery/Visualization: Guide them to imagine scenes or symbols.
  - Creative Expression: Invite them to write a sentence, doodle, or create a metaphor.
  - Perspective Shifts: Offer a reframe (e.g., fear as a teacher).
  - Micro-Action: Suggest a tiny real-world experiment.
  - Storytelling: Weave their fear into a short parable.
  - Body Wisdom: Gentle awareness of posture or breath (use sparingly).
  - Connection: Suggest a safe conversation or reflection.
  - Do NOT repeat the same type of task (e.g., mindfulness) in every response. Make it surprising and magical.
- 'thoughtProvokingQuestion': A single, concise question for reflection.

Your final output must be a valid JSON object.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    isHarmful: { type: Type.BOOLEAN, description: "True if the question contains harmful content, otherwise false." },
                    insight: { type: Type.STRING, description: "The transformative insight for the user. Only present if isHarmful is false." },
                    task: { type: Type.STRING, description: "A simple, actionable mindfulness task. Only present if isHarmful is false." },
                    thoughtProvokingQuestion: { type: Type.STRING, description: "A single question for deeper reflection. Only present if isHarmful is false." },
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

        if (!purchaseType) {
            return;
        }
        
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
