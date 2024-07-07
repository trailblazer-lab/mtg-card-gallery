import React from 'react';

const Card = ({ cardData }) => {
  // Check if cardData exists and has the necessary property
  if (!cardData || !cardData.image_uris || !cardData.image_uris.normal) {
    return (
      <div>
        {/* Render a placeholder or error message */}
        <p>Invalid card data</p>
      </div>
    );
  }

  // If cardData is valid, render the image with object-fit
  return (
    <div className="card">
      <img
        src={cardData.image_uris.normal}
        alt={cardData.name}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }} // Set object-fit
      />
    </div>
  );
};

export default Card;