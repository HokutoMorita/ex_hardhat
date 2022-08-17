import React from 'react';

type ConnectWallet = () => void;

type Props = {
    connectWallet: ConnectWallet
}

export const Wallet: React.FC<Props> = ({ connectWallet }) => {
    return (
        <div>
            <p>Please connect to your wallet.</p>
            <button onClick={connectWallet}>
                Connect Wallet
            </button>
        </div>
    )
}

