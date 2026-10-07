import App from '../../generated/react/ExperimentDemo.tsx';
import '../../context/tokens.css';
import '../style.css';
import React from 'react'; import { createRoot } from 'react-dom/client'; createRoot(document.getElementById('app')).render(React.createElement(App));