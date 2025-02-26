import { useState } from 'react';

const SuccessMessagePopup = ({ message, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px', // Separación de 10px desde el bottom
      left: '10px', // Separación de 10px desde la izquierda
      width: '300px', // Ancho del box
      backgroundColor: '#32CD32', // Color de fondo
      padding: '10px',
      textAlign: 'center',
      zIndex: '9999',
      borderRadius: '5px', // Opcional: añade bordes redondeados
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Opcional: sombra para el cuadro
    }}>
      <p style={{ color: '#fff', margin: '0' }}>{message}</p>
      <button onClick={onClose} style={{
        backgroundColor: 'transparent',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        marginTop: '5px' // Espacio entre el mensaje y el botón
      }}>
        Close
      </button>
    </div>
  );
};

export default SuccessMessagePopup;
