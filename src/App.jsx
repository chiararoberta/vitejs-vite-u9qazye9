import React, { useState, useRef, useEffect } from 'react';
import {
  Moon,
  Sun,
  Leaf,
  CloudRain,
  Sparkles,
  BookOpen,
  ArrowLeft,
  RefreshCw,
  Shuffle,
  Calendar,
  Book,
  Image as ImageIcon,
  Video,
  Mic,
  Square,
  Trash2,
  PlusCircle,
  Archive,
  User,
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';

// --- INITIALIZATION FIREBASE CON I TUOI DATI ---
const firebaseConfig = {
  apiKey: 'AIzaSyCWEStMbI-5zgnGg3YW-1DgRIV83PMW_jI',
  authDomain: 'metodo-bloom-app.firebaseapp.com',
  projectId: 'metodo-bloom-app',
  storageBucket: 'metodo-bloom-app.firebasestorage.app',
  messagingSenderId: '392572513414',
  appId: '1:392572513414:web:ff166c49cb1ea4b3c27507',
  measurementId: 'G-LFFGJN1Y34',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- STILI DEL BRANDBOOK ---
const brandColors = {
  bg: '#9B3B50',
  text: '#FFFFFF',
  crema: '#FEF9EF',
  darkText: '#9B3B50',
  dustyPink: '#C0929C',
  orange: '#DF741B',
  yellow: '#F3A419',
  red: '#C13142',
};

// --- INIEZIONE FONT E STILI ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Raleway:wght@300;400;500;600;700&display=swap');
    .font-playfair { font-family: 'Playfair Display', serif; }
    .font-raleway { font-family: 'Raleway', sans-serif; }
    
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
  `}</style>
);

// --- DATI DELLE CARTE ---
const deckData = {
  inverno: {
    id: 'inverno',
    name: 'Inverno',
    phase: 'Fase Mestruale',
    moon: 'Luna Nuova - Riposa',
    icon: CloudRain,
    bgColor: brandColors.dustyPink,
    textColor: '#FFFFFF',
    cardBg: brandColors.crema,
    cardText: brandColors.darkText,
    cards: [
      {
        title: 'Riposo come scelta',
        text: 'Ora il riposo non è un premio. È saggezza biologica. Riduci l’agenda e rallenta.',
      },
      {
        title: 'Agenda protetta',
        text: 'Non tutto merita spazio oggi. Togli impegni non essenziali.',
      },
      {
        title: 'Silenzio che cura',
        text: 'Il sistema nervoso chiede quiete. Evita schermi al risveglio, cerca silenzio.',
      },
      {
        title: 'Scrivere per vedere',
        text: 'Scrivi per chiarire. Cosa funziona? Cosa no?',
      },
      {
        title: 'Bilancio del ciclo',
        text: 'Fai il punto sulle settimane passate. Cosa vuoi portare avanti?',
      },
      {
        title: 'Non decidere nel dolore',
        text: 'Annota, ma rimanda decisioni importanti.',
      },
      {
        title: 'Cibo che riscalda',
        text: 'Zuppe, tisane, cibi semplici e caldi.',
      },
      {
        title: 'Risveglio gentile',
        text: 'Luce naturale al mattino. Niente telefono nella prima ora.',
      },
      { title: 'Ascolta i segnali', text: 'Il corpo comunica. Non ignorarlo.' },
      {
        title: 'Tempo della Luna',
        text: 'Fidati dell’istinto durante il sanguinamento.',
      },
    ],
  },
  primavera: {
    id: 'primavera',
    name: 'Primavera',
    phase: 'Fase Follicolare',
    moon: 'Luna Crescente - Inizia',
    icon: Leaf,
    bgColor: brandColors.orange,
    textColor: '#FFFFFF',
    cardBg: brandColors.crema,
    cardText: brandColors.darkText,
    cards: [
      { title: 'Inizio gentile', text: 'Fai il primo passo.' },
      { title: 'Seminare', text: 'Avvia nuovi progetti.' },
      { title: 'Fare la spesa grande', text: 'Organizza le settimane future.' },
      {
        title: 'Movimento che cresce',
        text: 'Inizia o intensifica l’attività fisica.',
      },
      { title: 'Networking', text: 'Allarga la rete di contatti.' },
      {
        title: 'Pianificazione',
        text: 'Getta le basi da revisionare in autunno.',
      },
      { title: 'Colazione completa', text: 'Proteine, carboidrati, grassi.' },
      { title: 'Luce naturale', text: 'Esponiti al sole al mattino.' },
      { title: 'Brainstorming', text: 'Scrivi idee senza giudicarle.' },
      { title: 'Non isolarti', text: 'La socialità ora ti sostiene.' },
    ],
  },
  estate: {
    id: 'estate',
    name: 'Estate',
    phase: 'Fase Ovulatoria',
    moon: 'Luna Piena - Espandi',
    icon: Sun,
    bgColor: brandColors.yellow,
    textColor: '#FFFFFF',
    cardBg: brandColors.crema,
    cardText: brandColors.darkText,
    cards: [
      { title: 'Espressione', text: 'Parla, condividi, mostrati.' },
      {
        title: 'Fissa riunioni importanti',
        text: 'Presentazioni e trattative ora.',
      },
      { title: 'Spesa organizzativa', text: 'Gestisci logistica e acquisti.' },
      { title: 'Chiedi aiuto', text: 'La comunicazione è fluida.' },
      { title: 'Leadership', text: 'Prendi spazio senza scuse.' },
      { title: 'Nutrimento regolare', text: 'Non saltare pasti.' },
      { title: 'Dormi comunque', text: 'Non sacrificare il sonno.' },
      { title: 'Limita l’alcol', text: 'Proteggi l’equilibrio ormonale.' },
      { title: 'Non decidere nell’euforia', text: 'Aspetta qualche giorno.' },
      { title: 'Consolida relazioni', text: 'Coltiva ciò che hai seminato.' },
    ],
  },
  autunno: {
    id: 'autunno',
    name: 'Autunno',
    phase: 'Fase Luteale',
    moon: 'Luna Calante - Revisiona',
    icon: Moon,
    bgColor: brandColors.crema,
    textColor: brandColors.darkText,
    cardBg: brandColors.bg,
    cardText: '#FFFFFF',
    cards: [
      { title: 'Revisiona', text: 'Perfeziona ciò che hai iniziato.' },
      { title: 'Completa', text: 'Chiudi task aperte.' },
      { title: 'Riduci impegni', text: 'Limita eventi e stimoli.' },
      { title: 'Comunica confini', text: 'Chiedi più tranquillità.' },
      { title: 'Pianifica pasti', text: 'Prepara cibo in anticipo.' },
      { title: 'Movimento moderato', text: 'Camminate, yoga dolce.' },
      { title: 'Vai a letto prima', text: 'Collabora col progesterone.' },
      { title: 'Mangia con presenza', text: 'Senza telefono o TV.' },
      { title: 'Potatura consapevole', text: 'Cosa ti nutre? Cosa ti svuota?' },
      { title: 'Prepara l’Inverno', text: 'Alleggerisci ora.' },
    ],
  },
  supporto: {
    id: 'supporto',
    name: 'Supporto',
    phase: 'Esercizi Trasversali',
    moon: 'Per i giorni difficili',
    icon: Sparkles,
    bgColor: brandColors.red,
    textColor: '#FFFFFF',
    cardBg: brandColors.crema,
    cardText: brandColors.darkText,
    cards: [
      {
        title: 'Rileggi le prove',
        text: 'Rileggi le email in cui ti sei detta “brava”.',
      },
      {
        title: 'Lista delle cose fatte',
        text: 'Scrivi tutto ciò che hai fatto.',
      },
      {
        title: 'Riduci al minimo',
        text: 'Scegli una sola cosa importante oggi.',
      },
      { title: 'Scrittura di scarico', text: '5 minuti senza fermarti.' },
      {
        title: 'Rientra nel corpo',
        text: '3 respiri profondi, piedi a terra.',
      },
      { title: 'Gentilezza intenzionale', text: 'Scriviti una frase gentile.' },
      { title: 'Chiudi una cosa', text: 'Completa una task piccola.' },
      {
        title: 'Rimanda senza colpa',
        text: 'Sposta qualcosa consapevolmente.',
      },
      {
        title: 'Guarda cosa funziona',
        text: 'Scrivi 3 cose che stanno andando bene.',
      },
      { title: 'Micro-cura', text: 'Una piccola azione di cura concreta.' },
    ],
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [activePhase, setActivePhase] = useState(null);
  const [drawnCard, setDrawnCard] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  // Stati Dati
  const [cardHistory, setCardHistory] = useState([]);
  const [cycleLength, setCycleLength] = useState(28);
  const [cycleHistory, setCycleHistory] = useState([]);
  const [newCycleDate, setNewCycleDate] = useState('');
  const [manualPhaseId, setManualPhaseId] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [linkedCardContext, setLinkedCardContext] = useState(null);
  const [attachedMedia, setAttachedMedia] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // --- FIREBASE AUTH & SYNC ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Auth error:', error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch and Sync User Data
  useEffect(() => {
    if (!user) return;

    // References standard per il database
    const userDocRef = doc(db, 'users', user.uid);
    const historyColRef = collection(db, 'users', user.uid, 'cardHistory');
    const diaryColRef = collection(db, 'users', user.uid, 'diary');

    // 1. Sync User Profile (Settings & Cycle)
    const unsubProfile = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.cycleLength) setCycleLength(data.cycleLength);
          if (data.cycleHistory) setCycleHistory(data.cycleHistory);
        } else {
          // Initialize if not exists
          setDoc(userDocRef, { cycleLength: 28, cycleHistory: [] });
        }
      },
      (error) => console.error('Profile sync error:', error)
    );

    // 2. Sync Card History
    const unsubHistory = onSnapshot(
      historyColRef,
      (snapshot) => {
        const hist = [];
        snapshot.forEach((doc) => hist.push({ id: doc.id, ...doc.data() }));
        setCardHistory(hist.sort((a, b) => b.timestamp - a.timestamp));
      },
      (error) => console.error('History sync error:', error)
    );

    // 3. Sync Diary
    const unsubDiary = onSnapshot(
      diaryColRef,
      (snapshot) => {
        const entries = [];
        snapshot.forEach((doc) => entries.push({ id: doc.id, ...doc.data() }));
        setDiaryEntries(entries.sort((a, b) => b.timestamp - a.timestamp));
      },
      (error) => console.error('Diary sync error:', error)
    );

    return () => {
      unsubProfile();
      unsubHistory();
      unsubDiary();
    };
  }, [user]);

  // --- WRAPPER PER SALVATAGGI FIREBASE ---
  const saveUserProfile = async (dataToUpdate) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, dataToUpdate, { merge: true });
  };

  // --- LOGICA DELLE CARTE ---
  const saveCardToHistory = async (card, phase) => {
    if (!user) return;
    const newDocRef = doc(collection(db, 'users', user.uid, 'cardHistory'));
    await setDoc(newDocRef, {
      dateStr: new Date().toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      card: card,
      phaseId: phase.id,
    });
  };

  const drawCard = (phaseId) => {
    setIsFlipping(true);
    setTimeout(() => {
      const phase = deckData[phaseId];
      const cards = phase.cards;
      const randomIdx = Math.floor(Math.random() * cards.length);
      const newCard = cards[randomIdx];

      setDrawnCard(newCard);
      setActivePhase(phase);
      saveCardToHistory(newCard, phase);

      setCurrentView('card');
      setIsFlipping(false);
    }, 400);
  };

  const drawRandomCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const phaseIds = Object.keys(deckData);
      const randomPhaseId =
        phaseIds[Math.floor(Math.random() * phaseIds.length)];
      const phase = deckData[randomPhaseId];
      const cards = phase.cards;
      const randomCard = cards[Math.floor(Math.random() * cards.length)];

      setDrawnCard(randomCard);
      setActivePhase(phase);
      saveCardToHistory(randomCard, phase);

      setCurrentView('card');
      setIsFlipping(false);
    }, 400);
  };

  // --- LOGICA DEL CICLO ---
  const handleUpdateCycleLength = (newLength) => {
    if (newLength < 20 || newLength > 45) return;
    saveUserProfile({ cycleLength: newLength });
  };

  const addCycleDate = () => {
    if (!newCycleDate) return;
    const updatedHistory = [...cycleHistory, newCycleDate].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    saveUserProfile({ cycleHistory: updatedHistory });
    setNewCycleDate('');
    setManualPhaseId(null);
  };

  const removeCycleDate = (dateToRemove) => {
    const updatedHistory = cycleHistory.filter((d) => d !== dateToRemove);
    saveUserProfile({ cycleHistory: updatedHistory });
  };

  const getCurrentPhaseInfo = () => {
    if (cycleHistory.length === 0) return null;

    const lastDateStr = cycleHistory[0];
    const startDate = new Date(lastDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays < 1) return null;

    const cycleDay =
      diffDays % cycleLength === 0 ? cycleLength : diffDays % cycleLength;
    let mathPhase = null;

    const lutealStart = cycleLength - 11;
    const ovulatoryStart = cycleLength - 15;

    if (cycleDay >= 1 && cycleDay <= 5) mathPhase = deckData.inverno;
    else if (cycleDay >= 6 && cycleDay < ovulatoryStart)
      mathPhase = deckData.primavera;
    else if (cycleDay >= ovulatoryStart && cycleDay < lutealStart)
      mathPhase = deckData.estate;
    else mathPhase = deckData.autunno;

    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + cycleLength);

    return {
      day: cycleDay,
      mathPhase: mathPhase,
      nextDate: nextDate.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  };

  // --- LOGICA DIARIO E MEDIA ---
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedMedia({ type, url });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        const url = URL.createObjectURL(audioBlob);
        setAttachedMedia({ type: 'audio', url });
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('Impossibile accedere al microfono.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveDiaryEntry = async () => {
    if ((newNoteText.trim() === '' && !attachedMedia) || !user) return;

    // Convert media object to strings to store in firestore
    let mediaToSave = null;
    if (attachedMedia && attachedMedia.type === 'image') {
      mediaToSave = {
        type: attachedMedia.type,
        url: 'media_not_supported_in_preview',
      };
    }

    const newDocRef = doc(collection(db, 'users', user.uid, 'diary'));
    await setDoc(newDocRef, {
      dateStr: new Date().toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      text: newNoteText,
      media: mediaToSave,
      cardContext: linkedCardContext
        ? {
            phaseId: activePhase.id,
            cardTitle: drawnCard.title,
          }
        : null,
    });

    setNewNoteText('');
    setAttachedMedia(null);
    setLinkedCardContext(null);
  };

  const linkCardToDiary = () => {
    setLinkedCardContext(true);
    setCurrentView('diary');
  };

  const deleteEntry = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'diary', id));
  };

  const deleteCardFromHistory = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'cardHistory', id));
  };

  if (!user) {
    return (
      <div
        className="min-h-[100dvh] w-full flex items-center justify-center font-raleway"
        style={{ backgroundColor: brandColors.bg }}
      >
        <div className="text-center text-white animate-pulse">
          <RefreshCw className="w-10 h-10 mx-auto mb-4 animate-spin opacity-50" />
          <p className="font-playfair text-xl">Sincronizzazione in corso...</p>
        </div>
      </div>
    );
  }

  // --- VISTE ---

  const HomeView = () => (
    <div className="flex flex-col items-center p-6 space-y-8 w-full animate-in fade-in duration-500">
      <div className="w-full flex justify-end">
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-black/10 rounded-full">
          <User className="w-4 h-4 text-white/80" />
          <span className="text-xs text-white/80 font-semibold tracking-wider uppercase">
            Spazio Privato
          </span>
        </div>
      </div>

      <div className="text-center space-y-4 w-full mt-2">
        <h1
          className="text-3xl font-playfair font-bold italic leading-tight"
          style={{ color: brandColors.text }}
        >
          “Non sei uguale ogni giorno.
          <br />E non devi esserlo.”
        </h1>
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={() => setCurrentView('info')}
          className="w-full flex items-center p-4 rounded-2xl shadow-lg transition-transform active:scale-95"
          style={{
            backgroundColor: brandColors.crema,
            color: brandColors.darkText,
          }}
        >
          <div className="p-3 rounded-full mr-4 bg-black/5">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="font-playfair font-bold text-lg">Il Metodo</h3>
            <p className="text-sm font-raleway opacity-80">
              Istruzioni e significato
            </p>
          </div>
        </button>

        <button
          onClick={drawRandomCard}
          className="w-full flex items-center p-4 rounded-2xl shadow-lg transition-transform active:scale-95"
          style={{ backgroundColor: brandColors.red, color: '#FFFFFF' }}
        >
          <div className="p-3 rounded-full mr-4 bg-white/20">
            <Shuffle className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="font-playfair font-bold text-lg">
              Pesca una carta a caso
            </h3>
            <p className="text-sm font-raleway opacity-90">
              Affidati all'istinto
            </p>
          </div>
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentView('cycle')}
            className="flex-1 flex flex-col items-center p-4 rounded-2xl shadow-lg transition-transform active:scale-95"
            style={{
              backgroundColor: brandColors.crema,
              color: brandColors.darkText,
            }}
          >
            <Calendar className="w-6 h-6 mb-2" />
            <span className="font-raleway text-sm font-semibold">
              Il Mio Ciclo
            </span>
          </button>

          <button
            onClick={() => setCurrentView('diary')}
            className="flex-1 flex flex-col items-center p-4 rounded-2xl shadow-lg transition-transform active:scale-95"
            style={{
              backgroundColor: brandColors.crema,
              color: brandColors.darkText,
            }}
          >
            <Book className="w-6 h-6 mb-2" />
            <span className="font-raleway text-sm font-semibold">
              Il Diario
            </span>
          </button>
        </div>

        <button
          onClick={() => setCurrentView('history')}
          className="w-full flex justify-center items-center p-3 rounded-xl border border-white/30 hover:bg-white/10 transition-colors"
        >
          <Archive
            className="w-4 h-4 mr-2"
            style={{ color: brandColors.text }}
          />
          <span
            className="font-raleway text-sm font-semibold"
            style={{ color: brandColors.text }}
          >
            Archivio Carte Pescate
          </span>
        </button>
      </div>

      <div className="w-full pt-2">
        <h2
          className="text-xl font-playfair font-bold mb-4 text-center"
          style={{ color: brandColors.text }}
        >
          Scegli la tua Stagione
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(deckData).map((phase) => {
            const Icon = phase.icon;
            return (
              <button
                key={phase.id}
                onClick={() => {
                  setActivePhase(phase);
                  setCurrentView('phase');
                }}
                className={`flex flex-col items-center p-5 rounded-3xl shadow-lg transition-transform active:scale-95 ${
                  phase.id === 'supporto' ? 'col-span-2' : ''
                }`}
                style={{
                  backgroundColor: phase.bgColor,
                  color: phase.textColor,
                }}
              >
                <Icon className="w-7 h-7 mb-2 opacity-90" />
                <span className="font-playfair font-bold text-lg">
                  {phase.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const InfoView = () => (
    <div className="flex flex-col p-6 w-full animate-in slide-in-from-right-4 duration-300">
      <button
        onClick={() => setCurrentView('home')}
        className="self-start mb-6 p-2 -ml-2 hover:opacity-70 transition-opacity"
        style={{ color: brandColors.text }}
      >
        <ArrowLeft className="w-7 h-7" />
      </button>

      <div
        className="p-8 rounded-3xl shadow-xl w-full"
        style={{
          backgroundColor: brandColors.crema,
          color: brandColors.darkText,
        }}
      >
        <h2 className="text-3xl font-playfair font-bold mb-6 text-center">
          Il Metodo Bloom
        </h2>

        <div className="text-center p-6 rounded-2xl mb-8 bg-white/60 shadow-sm border border-black/5">
          <p className="text-xl italic font-playfair leading-relaxed">
            “Non sei uguale ogni giorno.
            <br />E non devi esserlo.”
          </p>
        </div>

        <div className="space-y-8 font-raleway leading-relaxed text-[#4a4a4a]">
          <section>
            <h3
              className="text-xl font-playfair font-bold mb-3"
              style={{ color: brandColors.darkText }}
            >
              Spiegazione
            </h3>
            <p className="mb-4">
              Queste carte sono un supporto quotidiano per accompagnarti nelle
              diverse fasi del ciclo. Non servono a correggerti, migliorarti o
              spingerti a fare di più, ma ad{' '}
              <strong>allinearti a ciò che è già presente</strong> nel tuo corpo
              e nella tua energia.
            </p>
            <p
              className="font-semibold mb-2"
              style={{ color: brandColors.darkText }}
            >
              Puoi pescare una carta:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ogni mattina</li>
              <li>quando ti senti confusa</li>
              <li>quando hai poca energia</li>
              <li>quando hai troppa energia</li>
              <li>
                o semplicemente quando senti il bisogno di essere sostenuta
              </li>
            </ul>
            <p className="mt-4 italic opacity-80">
              Non devi fare tutto. Una carta è sufficiente.
            </p>
          </section>

          <section>
            <h3
              className="text-xl font-playfair font-bold mb-3"
              style={{ color: brandColors.darkText }}
            >
              Benvenuta
            </h3>
            <p>
              Queste carte non servono a dirti cosa fare nel modo giusto.
              Servono a tenerti compagnia mentre attraversi il ciclo. Puoi
              usarle quando ti senti stanca e non sai perché, hai tanta energia
              e non sai dove metterla, sei confusa, o vuoi una parola gentile.
            </p>
          </section>

          <section>
            <h3
              className="text-xl font-playfair font-bold mb-4"
              style={{ color: brandColors.darkText }}
            >
              Come usarle
            </h3>
            <div className="space-y-5">
              <div>
                <strong
                  className="block mb-1 text-lg"
                  style={{ color: brandColors.darkText }}
                >
                  1️⃣ Se conosci la fase del ciclo
                </strong>
                <p className="text-sm mb-2">
                  Usa il mazzo della stagione corrispondente:
                </p>
                <ul className="text-sm space-y-2 ml-1">
                  <li>
                    🌑 <strong>Inverno</strong> – Fase mestruale
                  </li>
                  <li>
                    🌱 <strong>Primavera</strong> – Fase follicolare
                  </li>
                  <li>
                    ☀️ <strong>Estate</strong> – Fase ovulatoria
                  </li>
                  <li>
                    🍂 <strong>Autunno</strong> – Fase luteale
                  </li>
                </ul>
              </div>
              <div>
                <strong
                  className="block mb-1 text-lg"
                  style={{ color: brandColors.darkText }}
                >
                  2️⃣ Se senti che non basta
                </strong>
                <p className="text-sm">
                  Pesca una sola carta di supporto pratico.
                </p>
              </div>
              <div>
                <strong
                  className="block mb-1 text-lg"
                  style={{ color: brandColors.darkText }}
                >
                  3️⃣ Nei giorni molto difficili
                </strong>
                <p className="text-sm">
                  Usa solo le carte esercizio (Supporto).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3
              className="text-xl font-playfair font-bold mb-3"
              style={{ color: brandColors.darkText }}
            >
              Il ciclo e la luna
            </h3>
            <p className="text-sm mb-3">
              La luna non serve per dirti cosa fare. Serve per ricordarti che
              cambiare forma è naturale.
            </p>
            <ul className="text-sm space-y-2 ml-1">
              <li>
                🌑 <strong>Inverno</strong> – Luna nuova – Riposa
              </li>
              <li>
                🌱 <strong>Primavera</strong> – Luna crescente – Inizia
              </li>
              <li>
                ☀️ <strong>Estate</strong> – Luna piena – Espandi
              </li>
              <li>
                🍂 <strong>Autunno</strong> – Luna calante – Revisiona
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white/60 shadow-sm border border-black/5 mt-4">
            <h3
              className="font-playfair font-bold mb-2 text-center text-lg"
              style={{ color: brandColors.darkText }}
            >
              Regola fondamentale
            </h3>
            <p
              className="italic text-center my-4 font-playfair text-xl leading-relaxed"
              style={{ color: brandColors.darkText }}
            >
              “Non si cambia la vita più del 10% alla volta.”
            </p>
            <p className="text-sm text-center font-raleway font-medium">
              Queste carte non sono compiti.
              <br />
              Sono inviti.
            </p>
          </section>
        </div>
      </div>
    </div>
  );

  const CardHistoryView = () => (
    <div className="flex flex-col p-6 w-full animate-in slide-in-from-right-4 duration-300">
      <button
        onClick={() => setCurrentView('home')}
        className="self-start mb-4 p-2 -ml-2 hover:opacity-70 transition-opacity"
        style={{ color: brandColors.text }}
      >
        <ArrowLeft className="w-7 h-7" />
      </button>

      <div
        className="p-6 rounded-3xl shadow-xl w-full flex flex-col"
        style={{
          backgroundColor: brandColors.crema,
          color: brandColors.darkText,
        }}
      >
        <div className="flex items-center justify-center mb-6">
          <Archive className="w-6 h-6 mr-3" />
          <h2 className="text-3xl font-playfair font-bold text-center">
            Archivio Carte
          </h2>
        </div>
        <p className="text-center font-raleway text-sm opacity-70 mb-6">
          Qui trovi tutte le carte che hai pescato in passato.
        </p>

        <div className="space-y-4">
          {cardHistory.length === 0 ? (
            <p className="text-center font-raleway italic opacity-50 py-6">
              Non hai ancora pescato nessuna carta.
            </p>
          ) : (
            cardHistory.map((item) => {
              const phase = deckData[item.phaseId];
              if (!phase) return null;
              const PhaseIcon = phase.icon;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white shadow-sm border flex flex-col relative"
                  style={{ borderColor: 'rgba(0,0,0,0.05)' }}
                >
                  <button
                    onClick={() => deleteCardFromHistory(item.id)}
                    className="absolute top-4 right-4 opacity-30 hover:opacity-100 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-raleway font-bold opacity-50 uppercase mb-3">
                    {item.dateStr}
                  </span>
                  <div className="flex items-center mb-3">
                    <div
                      className="p-2 rounded-full mr-3"
                      style={{
                        backgroundColor: phase.bgColor,
                        color: phase.textColor,
                      }}
                    >
                      <PhaseIcon className="w-4 h-4" />
                    </div>
                    <span
                      className="font-playfair font-bold text-sm uppercase opacity-80"
                      style={{ color: phase.bgColor }}
                    >
                      {phase.name}
                    </span>
                  </div>
                  <h4 className="font-playfair font-bold text-lg mb-2">
                    {item.card.title}
                  </h4>
                  <p className="font-raleway text-sm leading-relaxed opacity-80">
                    {item.card.text}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const CycleView = () => {
    const phaseInfo = getCurrentPhaseInfo();
    const displayPhase = manualPhaseId
      ? deckData[manualPhaseId]
      : phaseInfo
      ? phaseInfo.mathPhase
      : null;

    return (
      <div className="flex flex-col p-6 w-full animate-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => setCurrentView('home')}
          className="self-start mb-6 p-2 -ml-2 hover:opacity-70 transition-opacity"
          style={{ color: brandColors.text }}
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <div
          className="p-8 rounded-3xl shadow-xl w-full mb-6 flex flex-col"
          style={{
            backgroundColor: brandColors.crema,
            color: brandColors.darkText,
          }}
        >
          <h2 className="text-3xl font-playfair font-bold mb-6 text-center">
            Traccia il tuo Ciclo
          </h2>

          {/* Settings Durata Ciclo */}
          <div
            className="flex items-center justify-between p-4 mb-6 rounded-xl bg-white shadow-sm border"
            style={{ borderColor: 'rgba(0,0,0,0.05)' }}
          >
            <span className="font-raleway font-semibold text-sm">
              Durata media ciclo:
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() =>
                  handleUpdateCycleLength(Math.max(20, cycleLength - 1))
                }
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 font-bold"
              >
                -
              </button>
              <span className="font-playfair font-bold text-lg w-8 text-center">
                {cycleLength}
              </span>
              <button
                onClick={() =>
                  handleUpdateCycleLength(Math.min(45, cycleLength + 1))
                }
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {phaseInfo && displayPhase && (
            <div
              className="mb-6 p-6 rounded-2xl text-center shadow-md animate-in zoom-in-95 duration-500"
              style={{
                backgroundColor: displayPhase.bgColor,
                color: displayPhase.textColor,
              }}
            >
              <p className="font-raleway text-sm opacity-90 mb-2">
                Oggi sei al Giorno {phaseInfo.day}
              </p>
              <h3 className="font-playfair font-bold text-3xl mb-1">
                {displayPhase.name}
              </h3>
              <p className="font-raleway text-sm opacity-90 mb-6">
                {displayPhase.phase}
              </p>

              <div className="bg-black/10 rounded-xl p-4">
                <p className="font-raleway text-xs opacity-80 uppercase tracking-wide mb-1">
                  Prossima Mestruazione Prevista
                </p>
                <p className="font-playfair font-bold text-lg">
                  {phaseInfo.nextDate}
                </p>
              </div>
            </div>
          )}

          {/* OVERRIDE - L'ascolto del corpo */}
          {phaseInfo && (
            <div className="mb-8 pt-4 border-t border-black/10">
              <p className="font-playfair font-bold text-center text-lg mb-2">
                Come ti senti oggi?
              </p>
              <p className="font-raleway text-xs text-center opacity-70 mb-4">
                La matematica calcola una stima. Correggi la stagione se ti
                senti diversamente:
              </p>
              <div className="flex justify-between gap-2">
                {['inverno', 'primavera', 'estate', 'autunno'].map((pid) => {
                  const p = deckData[pid];
                  const Icon = p.icon;
                  const isSelected = displayPhase.id === pid;
                  return (
                    <button
                      key={pid}
                      onClick={() => setManualPhaseId(pid)}
                      className={`flex-1 py-3 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'shadow-md scale-105 ring-2 ring-offset-2 ring-offset-[#FEF9EF]'
                          : 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
                      }`}
                      style={{
                        backgroundColor: p.bgColor,
                        color: p.textColor,
                        ringColor: p.bgColor,
                      }}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setActivePhase(displayPhase);
                  setCurrentView('phase');
                }}
                className="w-full mt-6 p-4 rounded-full font-playfair font-bold text-white text-lg shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: brandColors.bg }}
              >
                Vai alla tua Stagione{' '}
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
          )}

          {!phaseInfo && (
            <div>
              <p className="font-raleway text-sm font-bold mb-3">
                Inserisci inizio mestruazione:
              </p>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 p-3 rounded-xl border focus:outline-none font-raleway bg-white"
                  style={{
                    borderColor: brandColors.dustyPink,
                    color: brandColors.darkText,
                  }}
                  value={newCycleDate}
                  onChange={(e) => setNewCycleDate(e.target.value)}
                />
                <button
                  onClick={addCycleDate}
                  className="p-3 rounded-xl shadow-md transition-transform active:scale-95"
                  style={{ backgroundColor: brandColors.bg, color: '#fff' }}
                >
                  <PlusCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STORICO CICLO */}
        {cycleHistory.length > 0 && (
          <div
            className="p-6 rounded-3xl shadow-xl w-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: brandColors.text,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-playfair font-bold text-xl">
                Storico Registrazioni
              </h3>
              <div className="flex items-center gap-2 opacity-80">
                <input
                  type="date"
                  className="w-8 h-8 opacity-0 absolute cursor-pointer"
                  onChange={(e) => {
                    setNewCycleDate(e.target.value);
                    setTimeout(addCycleDate, 100);
                  }}
                />
                <PlusCircle className="w-6 h-6 cursor-pointer" />
              </div>
            </div>

            <div className="space-y-3">
              {cycleHistory.map((dateStr, idx) => {
                const d = new Date(dateStr);
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    <span className="font-raleway font-semibold">
                      {d.toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => removeCycleDate(dateStr)}
                      className="opacity-70 hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const DiaryView = () => {
    const linkedContextPhase = linkedCardContext
      ? deckData[activePhase?.id]
      : null;

    return (
      <div className="flex flex-col p-6 w-full animate-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => setCurrentView('home')}
          className="self-start mb-4 p-2 -ml-2 hover:opacity-70 transition-opacity"
          style={{ color: brandColors.text }}
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <div
          className="p-6 rounded-3xl shadow-xl w-full flex flex-col"
          style={{
            backgroundColor: brandColors.crema,
            color: brandColors.darkText,
          }}
        >
          <h2 className="text-3xl font-playfair font-bold mb-6 text-center">
            Il tuo Diario
          </h2>

          {/* Editor Nota */}
          <div
            className="mb-8 p-1 rounded-2xl border bg-white"
            style={{ borderColor: brandColors.dustyPink }}
          >
            {linkedContextPhase && drawnCard && (
              <div
                className="m-3 p-3 rounded-xl flex justify-between items-center"
                style={{
                  backgroundColor: linkedContextPhase.bgColor,
                  color: linkedContextPhase.textColor,
                }}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-80">
                    {linkedContextPhase.name}
                  </span>
                  <h4 className="font-playfair font-bold text-sm">
                    {drawnCard.title}
                  </h4>
                </div>
                <button
                  onClick={() => setLinkedCardContext(false)}
                  className="opacity-70 hover:opacity-100 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <textarea
              className="w-full p-4 focus:outline-none font-raleway resize-none min-h-[100px] bg-transparent"
              placeholder="Come ti senti oggi? Cosa stai osservando?"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />

            <div
              className="flex items-center justify-between p-3 border-t bg-gray-50/50 rounded-b-2xl"
              style={{ borderColor: brandColors.dustyPink }}
            >
              <div className="flex gap-2">
                <button
                  className="p-2 rounded-full bg-black/5 hover:bg-black/10 opacity-50 cursor-not-allowed"
                  title="Disponibile nella versione finale"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-full bg-black/5 hover:bg-black/10 opacity-50 cursor-not-allowed"
                  title="Disponibile nella versione finale"
                >
                  <Video className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-full bg-black/5 hover:bg-black/10 opacity-50 cursor-not-allowed"
                  title="Disponibile nella versione finale"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={saveDiaryEntry}
                className="px-5 py-2 rounded-full font-raleway font-bold text-white shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: brandColors.bg }}
              >
                Salva
              </button>
            </div>
          </div>

          {/* Lista Note dal Cloud */}
          <div className="space-y-5">
            {diaryEntries.length === 0 ? (
              <p className="text-center font-raleway italic opacity-50 py-6">
                Nessuna pagina nel diario.
                <br />
                Scrivi il tuo primo pensiero.
              </p>
            ) : (
              diaryEntries.map((entry) => {
                const ctxPhase = entry.cardContext
                  ? deckData[entry.cardContext.phaseId]
                  : null;

                return (
                  <div
                    key={entry.id}
                    className="p-5 rounded-2xl bg-white shadow-sm border"
                    style={{ borderColor: 'rgba(0,0,0,0.05)' }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-raleway font-bold opacity-50 capitalize">
                        {entry.dateStr}
                      </span>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="opacity-30 hover:opacity-100 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {ctxPhase && (
                      <div
                        className="mb-3 px-3 py-2 rounded-lg text-sm inline-block shadow-sm"
                        style={{
                          backgroundColor: ctxPhase.bgColor,
                          color: ctxPhase.textColor,
                        }}
                      >
                        <span className="opacity-80 uppercase text-[10px] block mb-0.5">
                          {ctxPhase.name}
                        </span>
                        <strong className="font-playfair">
                          {entry.cardContext.cardTitle}
                        </strong>
                      </div>
                    )}

                    {entry.text && (
                      <p className="font-raleway whitespace-pre-wrap leading-relaxed opacity-90 mb-3">
                        {entry.text}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const PhaseReadyView = () => {
    const Icon = activePhase.icon;
    return (
      <div className="flex flex-col p-6 animate-in fade-in duration-500 w-full">
        <button
          onClick={() => setCurrentView('home')}
          className="self-start mb-8 p-2 -ml-2 opacity-80 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 mt-8">
          <div className="p-8 rounded-full bg-black/5 mb-8 backdrop-blur-sm">
            <Icon className="w-24 h-24" strokeWidth={1.5} />
          </div>
          <h2 className="text-6xl font-playfair font-bold mb-4">
            {activePhase.name}
          </h2>
          <p className="text-2xl font-raleway opacity-90 mb-3">
            {activePhase.phase}
          </p>
          <p className="text-base font-raleway opacity-80 mb-16 italic">
            {activePhase.moon}
          </p>
          <button
            onClick={() => drawCard(activePhase.id)}
            className="px-12 py-5 rounded-full font-playfair font-bold text-xl shadow-xl transform transition active:scale-95"
            style={{
              backgroundColor: activePhase.cardBg,
              color: activePhase.cardText,
            }}
          >
            Pesca una carta
          </button>
        </div>
      </div>
    );
  };

  const CardDrawView = () => {
    const Icon = activePhase.icon;
    return (
      <div className="flex flex-col p-6 w-full">
        <button
          onClick={() => setCurrentView('home')}
          className="self-start mb-6 p-2 -ml-2 opacity-80 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000 py-6">
          <div
            className={`w-full max-w-sm aspect-[3/4] rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-700 ${
              isFlipping
                ? 'scale-90 opacity-0 rotate-y-180'
                : 'scale-100 opacity-100 rotate-y-0'
            }`}
            style={{
              backgroundColor: activePhase.cardBg,
              color: activePhase.cardText,
            }}
          >
            <Icon
              className="absolute -right-12 -bottom-12 w-64 h-64 opacity-5"
              style={{ color: activePhase.cardText }}
            />
            <div className="relative z-10 flex flex-col h-full items-center justify-center w-full">
              <span className="text-sm font-raleway font-bold uppercase tracking-widest mb-8 opacity-70">
                {activePhase.name}
              </span>
              <h3 className="text-3xl font-playfair font-bold mb-6 leading-tight">
                {drawnCard?.title}
              </h3>
              <hr
                className="w-16 border-t-2 mb-6 opacity-30"
                style={{ borderColor: activePhase.cardText }}
              />
              <p className="text-xl font-raleway leading-relaxed opacity-90">
                {drawnCard?.text}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 w-full max-w-sm">
            <button
              onClick={linkCardToDiary}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-lg"
              style={{
                backgroundColor: brandColors.crema,
                color: brandColors.darkText,
              }}
            >
              <Book className="w-5 h-5" />
              <span className="font-raleway font-bold">Appunta nel Diario</span>
            </button>
            <button
              onClick={() => drawCard(activePhase.id)}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-full opacity-80 hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-md"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-raleway font-semibold">
                Pesca un'altra carta
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const currentBgColor =
    (currentView === 'phase' || currentView === 'card') && activePhase
      ? activePhase.bgColor
      : brandColors.bg;
  const currentTextColor =
    (currentView === 'phase' || currentView === 'card') && activePhase
      ? activePhase.textColor
      : brandColors.text;

  return (
    <>
      <FontStyles />
      <div
        className="min-h-[100dvh] w-full flex justify-center font-raleway transition-colors duration-700 ease-in-out"
        style={{ backgroundColor: currentBgColor, color: currentTextColor }}
      >
        <div className="w-full max-w-md min-h-[100dvh] relative flex flex-col transition-colors duration-700 ease-in-out">
          <div className="flex-1 flex flex-col w-full">
            {currentView === 'home' && <HomeView />}
            {currentView === 'info' && <InfoView />}
            {currentView === 'cycle' && <CycleView />}
            {currentView === 'diary' && <DiaryView />}
            {currentView === 'history' && <CardHistoryView />}
            {currentView === 'phase' && <PhaseReadyView />}
            {currentView === 'card' && <CardDrawView />}
          </div>
          <div className="w-full text-center py-8 mt-auto px-6">
            <p className="font-raleway text-sm font-medium opacity-70 tracking-wide">
              Prodotto con Amore da Chiara Roberta
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
