import React from 'react';
import { ClipLoader } from 'react-spinners';

function TransactionConfirmation({ message, isLoading }) {
    return (
        <div className="flex flex-col justify-center items-center gap-5 p-4 w-full">
            <div className="flex flex-col gap-2 items-center">
                <ClipLoader size={20} color={'#ffffff'} loading={isLoading} />
                <p className="text-gradient uppercase">{message}</p>
            </div>
        </div>
    );
}

export default TransactionConfirmation;
