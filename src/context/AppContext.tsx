import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transporte } from '../types';
import { listarTransportes, salvarTransporte, removerTransporte, limparTransportes } from '../services/storage';

// ── State ──────────────────────────────────────────────────────────────────
interface AppState {
  transportes: Transporte[];
  darkMode: boolean;
}

// ── Actions ────────────────────────────────────────────────────────────────
type Action =
  | { type: 'ADD_TRANSPORTE';    payload: Transporte }
  | { type: 'REMOVE_TRANSPORTE'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_TRANSPORTES';   payload: Transporte[] };

// ── Reducer ────────────────────────────────────────────────────────────────
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TRANSPORTES':
      return { ...state, transportes: action.payload };

    case 'ADD_TRANSPORTE':
      salvarTransporte(action.payload);
      return { ...state, transportes: [...state.transportes, action.payload] };

    case 'REMOVE_TRANSPORTE':
      removerTransporte(action.payload);
      return { ...state, transportes: state.transportes.filter(t => t.id !== action.payload) };

    case 'CLEAR_ALL':
      limparTransportes();
      return { ...state, transportes: [] };

    case 'TOGGLE_DARK_MODE': {
      const next = !state.darkMode;
      localStorage.setItem('dely:darkMode', String(next));
      return { ...state, darkMode: next };
    }

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    transportes: [],
    darkMode: localStorage.getItem('dely:darkMode') === 'true',
  });

  // Carrega transportes do localStorage na inicialização
  useEffect(() => {
    dispatch({ type: 'SET_TRANSPORTES', payload: listarTransportes() });
  }, []);

  // Aplica/remove classe `dark` no <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
