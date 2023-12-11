import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

function LoadingButton({ style,isLoading,type, onClick,className, children }) {
  return (
    <button style={style} type={type} className={  className ? className :`btn btn-gradient w-auto  my-3`} onClick={onClick} disabled={isLoading}>
      {isLoading ? <ClipLoader size={20} color={'#ffffff'} loading={isLoading} /> : children}
    </button>
  );
}

export default LoadingButton;
