import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import Base from "./components/Base";

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  
  min-height: 100vh;
  
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

//TODO: I dump the current UI
//TODO: I need  buttons for pages

function App() {
  const { network } = useTonConnect();
  return <Base></Base>
  // return (
  //   <StyledApp>
  //     <AppContainer>
  //       <FlexBoxCol>
  //         <FlexBoxRow>
  //           <TonConnectButton />
  //           <Button>
              // {network
              //   ? network === CHAIN.MAINNET
              //     ? "mainnet"
              //     : "testnet"
              //   : "N/A"}
  //           </Button>
  //         </FlexBoxRow>
  //         <Base></Base>
  //         <Counter />
  //         <TransferTon />
  //         <Jetton />
  //       </FlexBoxCol>
  //     </AppContainer>
  //   </StyledApp>
  // );
}

export default App;
