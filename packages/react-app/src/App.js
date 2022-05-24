import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

const Context = React.createContext();

const LoginBox = () => {
  const [val , setVal] = useContext(Context);
  const [connectedAccount, setConnectedAccount] = useState()
  const [data, setData] = useState()
  const message = `Hi I wanna Login with Web3 Wallet!`


  // Login Metamask Functionbality
  // Make Signature
  // Save it to State/Context
  const loginMetamask = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await window.ethereum.request({ method: 'eth_requestAccounts' });          

      // Sign Message
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();      
      const messageUtf8Bytes = ethers.utils.toUtf8Bytes(message);
      const testBytes = ethers.utils.arrayify(messageUtf8Bytes);
      const signature = await signer.signMessage(testBytes);

      console.log("Signer : ", await signer.getAddress())

      // Save Signature to Local Storage & Context
      localStorage.setItem("signature", signature); 
      setVal(signature)      

    } catch (error) {
      console.error(error);
    }
  }

  const disconnectMetamask = () => {
    localStorage.setItem("signature", ''); 
    setVal('')
    setData()
  }

  const setAccount = async () => {
    const [account] = await window.ethereum.request({ method: 'eth_accounts' });      
    setConnectedAccount(account)
  }


  // Get Data from API
  const getData = async () => {
    var myHeaders = new Headers();
    myHeaders.append("signature", val);
    myHeaders.append("message", message);

    var urlencoded = new URLSearchParams();

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const bikesData = await fetch("http://127.0.0.1:3000/api/bikes/get-data", requestOptions)
      .then(response => response.json())      
      .catch(error => console.log('error', error));

    setData(bikesData.data)
    console.log(bikesData.data)
  }

  useEffect(() => {
    setAccount()
    console.log("Ahoyt")
  }, [data])

  useEffect(() => {    
    console.log("Data Updated")
  }, [data])


  return (
    <div>
      {
      val === '' 
      ? <button onClick={() => loginMetamask()}>Connect Metamask</button> 
      : <button onClick={() => disconnectMetamask()}>Disconnect</button>}      

      <br/>
      {
        val === ''  ? '' : `Your Address : ${connectedAccount}`
      }

      <br/>
      <br/>
      {
        val !== ''  ? <button onClick={() => getData()}>Get Data</button> : null
      }      
      
      { typeof data !== 'undefined' ? 
        <Datatable datas={data}></Datatable>
       :  null}
    </div>
  );
};

const Datatable = ({datas}) => {  
  return (
   <div>
     <table border="1" cellSpacing={0} cellPadding={5}>
       <tr>
        <th>Id</th>
        <th>Name</th>       
      </tr>

      { datas.map((item,index) => {
        return <tr>
          <td>{item.id}</td>
          <td>{item.bike_name}</td>       
        </tr>
      })}
      
     </table>     
   </div>
  );
}

export default function App() {
  const [val, setVal] = useState(localStorage.getItem("signature"));

  return (
    <Context.Provider value={[val, setVal]}>
      <LoginBox />           
    </Context.Provider>
  );
}