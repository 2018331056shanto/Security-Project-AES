"use client"
import crypto from 'crypto'
import { useState } from 'react'
import CryptoJS from 'crypto-js'

const AESEncryption=()=>{
    var key  = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
    var iv   = CryptoJS.enc.Hex.parse("253D3FB468A0E246");

    const [text,setText]=useState("")
    const [mode,setMode]=useState("")
    const [enctyptedMsg,setEncryptedMsg]=useState(null)
    const [decryptedMsg,setDecryptedMsg]=useState(null)
    const [inputFile,setInputFile]=useState(null)
    const [decryptedFile,setDecryptedFile]=useState(null)
    const handleOptionChange = (event) => {
        console.log(event.target.value)
        setMode(event.target.value);
      };

    const textAreaHandler=(e)=>{

        console.log(e.target.value)
        setText(e.target.value)
    }
    const textAreaOnClickHandlerEncrypt=()=>{

        if(mode==='cbc')
        {
            var encrypted = CryptoJS.AES.encrypt(
                text,
                key, 
                {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode:CryptoJS.mode.CBC
            });

            setEncryptedMsg(encrypted.toString())
        }
        if(mode=='cfb')
        {
            var encrypted = CryptoJS.AES.encrypt(
                text,
                key, 
                {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode:CryptoJS.mode.CFB
            });

            setEncryptedMsg(encrypted.toString())
        }
        if(mode==='ofb')
        {
            var encrypted = CryptoJS.AES.encrypt(
                text,
                key, 
                {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode:CryptoJS.mode.OFB
            });

            setEncryptedMsg(encrypted.toString())
        }

    }
    const textAreaOnClickHandlerDecrypt=()=>{
        if(mode==='cbc')
        {
            var decrypted = CryptoJS.AES.decrypt(
                text,
                key, 
                {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode:CryptoJS.mode.CBC
            });

            setDecryptedMsg(decrypted.toString(CryptoJS.enc.Utf8))
        }
        if(mode=='cfb')
        {
            var decrypted = CryptoJS.AES.decrypt(
                text,
                key, 
                {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode:CryptoJS.mode.CFB
            });

            setDecryptedMsg(decrypted.toString(CryptoJS.enc.Utf8))
        }
        if(mode==='ofb')
        {
            var decrypted = CryptoJS.AES.decrypt(
                text,
                key, 
                {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode:CryptoJS.mode.OFB
            });

            setDecryptedMsg(decrypted.toString(CryptoJS.enc.Utf8))
        }

    }

    const inputFileHandler=(e)=>{

        setInputFile(e.target.files[0])

    }

    const inputFileEncryption=(fileBuffer)=>{
        const wordArray=CryptoJS.lib.WordArray.create(fileBuffer)
        const str=CryptoJS.enc.Hex.stringify(wordArray)

        let mod=CryptoJS.mode.CBC

        if(mode==='cfb')
        {
            mod=CryptoJS.mode.CFB
        }
        if(mode==='ofb')
        {
            mod=CryptoJS.mode.OFB
        }
        const encrypt=CryptoJS.AES.encrypt(str,key,{
            iv:iv,
            padding:CryptoJS.pad.Pkcs7,
            mode:mod

        }).toString()
        const binaryData = new Uint8Array(encrypt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        downloadTextFile(encrypt,inputFile.name)



    }

    const encryptFileHandler=()=>{

        if(inputFile)
        {
            let fileReader=new FileReader()
            fileReader.onload=async(e)=>{

                const fileData=e.target.result
                const encryptFile= inputFileEncryption(fileData)
               
                
            }
            fileReader.readAsArrayBuffer(inputFile)
        }
    }

    const decryptFileHandler=()=>{
        if(inputFile)
        {
            let fr=new FileReader()
            fr.onload=async(e)=>{
                const fileData=e.target.result
                const str = new TextDecoder().decode(new Uint8Array(fileData));
               
                let mod=CryptoJS.mode.CBC

                if(mode==='cfb')
                {
                    mod=CryptoJS.mode.CFB
                }
                if(mode==='ofb')
                {
                    mod=CryptoJS.mode.OFB
                }

                const decrypted=CryptoJS.AES.decrypt(
                    str,
                    key,
                    {
                        iv:iv,
                        padding:CryptoJS.pad.Pkcs7,
                        mode:mod

                    }

                )
                // console.log(decrypted)
                const decryptedFileData = decrypted.toString(CryptoJS.enc.Utf8);
                // console.log(decryptedFileData)
                const binaryData = new Uint8Array(decryptedFileData.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                const blob = new Blob([binaryData], { type: inputFile.type });
                const fileUrl = URL.createObjectURL(blob);
                setDecryptedFile(fileUrl)


            }
            fr.readAsArrayBuffer(inputFile)
        }
    }

    const downloadTextFile=(text, fileName)=> {
        const blob = new Blob([text], { type: "application/octet-stream"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }



    return (
      <div className="w-[80%] min-h-[85vh] flex flex-col ring-2 p-8 rounded-lg shadow-2xl">
        <div className="  flex flex-col text-left space-y-4">
          <h1 className="flex text-xl font-bold">Select Encryption Mode</h1>
          <select
            onChange={handleOptionChange}
            value={mode}
            className=" flex items-center appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ease-in-out duration-300"
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="cbc">CBC</option>
            <option value="cfb">CFB</option>
            <option value="ofb">OFB</option>
          </select>
        </div>

        <div className="flex flex-col w-full space-y-5 ">
          <h1 className=" text-lg font-semibold pt-5">
            Enter The Encrypted Text
          </h1>
          <textarea
            onChange={(e) => textAreaHandler(e)}
            className="border-5 w-full pl-4 pt-3 text-lg font-medium flex bg-slate-200 border-black"
          ></textarea>
          <div className=" w-[10rem] h-[3rem] bg-[#32C4BE] rounded-md text-white text-xl font-semibold hover:bg-black flex justify-center items-center">
            <button onClick={textAreaOnClickHandlerEncrypt}>Encrypt</button>
          </div>
          <div>
            <h1 className=" text-xl font-semibold">The Encrypted Message</h1>
          </div>
          <div className=" text-lg font-medium">
            {enctyptedMsg ? <p>{enctyptedMsg}</p> : <p></p>}
          </div>
        </div>
        <div className="flex flex-col w-full space-y-5 pt-10">
          <h1 className=" text-xl font-semibold">
            Enter Decrypted Message Text
          </h1>
          <textarea
            onChange={(e) => textAreaHandler(e)}
            className="border-5 w-full felx pl-5 pt-3 bg-slate-200 border-black"
          ></textarea>
          <div className="w-[10rem] h-[3rem] bg-[#5395B2] text-white text-xl font-semibold rounded-md hover:bg-black flex justify-center items-center">
            <button onClick={textAreaOnClickHandlerDecrypt}>Decrypt</button>
          </div>
          <div>
            <h1 className=" text-xl font-semibold">The Decrypted Message</h1>
          </div>
          <div className=" text-lg font-medium">
            {decryptedMsg ? <p>{decryptedMsg}</p> : <p></p>}
          </div>
        </div>
        <div className=" flex flex-col justify-center items-center space-y-5 pt-5">
          <div className=" text-3xl font-bold">Enter the Input File</div>
          <div>
            <input onChange={(e) => inputFileHandler(e)} type="file" />
          </div>
          <div className=" w-[10rem] h-[3rem] bg-violet-600 text-white text-xl font-semibold rounded-md flex justify-center items-center hover:bg-black">
            <button onClick={encryptFileHandler}>Encrypt</button>
          </div>
        </div>

        <div className=" flex flex-col justify-center items-center space-y-3 pt-8">
          <h1 className=" text-3xl font-bold">Enter the Encrypted File</h1>
          <div className=" pt-5">
            <input onChange={(e) => inputFileHandler(e)} type="file" />
          </div>
          <div className=" bg-sky-700 text-white w-[10rem] h-[3rem] flex justify-center items-center rounded-md text-xl font-semibold  hover:bg-black">
            <button onClick={decryptFileHandler}>Decrypt</button>
          </div>
          {inputFile && inputFile.type.startsWith("image") && (
            <img src={decryptedFile} alt="Decrypted  Media" />
          )}
          {inputFile && inputFile.type.startsWith("audio") && (
            <audio controls src={decryptedFile}></audio>
          )}
          {inputFile && inputFile.type.startsWith("video") && (
            <video controls src={decryptedFile}></video>
          )}
          {/* {decryptedFile&&<img src={decryptedFile} style={{ maxWidth: '100%' }}  />} */}
        </div>
      </div>
    );



}


export default AESEncryption