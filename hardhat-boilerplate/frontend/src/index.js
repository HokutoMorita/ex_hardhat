import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "./components/Dapp";

import "bootstrap/dist/css/bootstrap.css";

// これはアプリケーションのエントリーポイントですが、単にDappをレンダリングしているだけです
// Reactコンポーネントです。すべてのロジックはこの中に含まれています

ReactDOM.render(
    <React.StrictMode>
        <Dapp />
    </React.StrictMode>,
    document.getElementById("root")
);
