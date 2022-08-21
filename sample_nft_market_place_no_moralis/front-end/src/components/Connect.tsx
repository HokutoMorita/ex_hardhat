import React, { useEffect, useState } from "react"

export const ConnectSection: React.FunctionComponent = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState('');

    const onAccountsChanged = (walletAddresses: any) => {
        setAddress(walletAddresses[0] || '');
        setIsConnected(walletAddresses[0]);
    }

    // 初回のみ実行するため第二引数は空配列
    useEffect(() => {
        (async () => {
            if ((window as any).ethereum) {
                const method = 'eth_accounts';
                const walletAddresses = await (window as any).ethereum.request({method});

                onAccountsChanged(walletAddresses);
            }
        })()
    }, []);

    useEffect(() => {
        if ((window as any).ethereum) {
            (window as any).ethereum.on('accountsChanged', onAccountsChanged);

            return () => {
                (window as any).ethereum.removeListener('accountsChanged', onAccountsChanged);
            }
        }
    });

    const onClickConnect = async () => {
        const method = 'eth_requestAccounts';
        const walletAddresses = await (window as any).ethereum.request({method});

        onAccountsChanged(walletAddresses);
    }

    return (
        <>
            <section>
                <h2>Connect</h2>
                <button onClick={onClickConnect}>Connect</button>
                <dl>
                    <dt>Wallet address</dt>
                    <dd>{address}</dd>
                </dl>
            </section>
            <div>
                {isConnected && (
                    <p>接続完了</p>
                )}
            </div>
        </>
    )
}
