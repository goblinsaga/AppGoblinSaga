import { useState } from 'react';

const ErrorMessagePopup = ({ message, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px', // Separación de 10px desde el bottom
      left: '10px', // Separación de 10px desde la izquierda
      width: '300px', // Ancho del box
      backgroundColor: '#ff6347',
      padding: '10px',
      textAlign: 'center',
      zIndex: '9999',
      borderRadius: '5px', // Opcional: añade bordes redondeados
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Opcional: sombra para el cuadro
    }}>
      <p style={{ color: '#fff', margin: '0' }}>{message}</p>
      <button onClick={onClose} style={{ marginTop: '5px', backgroundColor: '#fff', color: '#ff6347', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>
        Close
      </button>
    </div>
  );
};

export default ErrorMessagePopup;
