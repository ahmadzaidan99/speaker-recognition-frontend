import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import Input from "./Input";
import randomWords from "random-words";
import { useSpeechRecognition } from "react-speech-kit";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import stringSimilarity from "string-similarity";

const Sidebar = () => {
  const [email, setEmail] = useState("");
  const [authString] = useState(randomWords({ min: 3, max: 4 }) + "");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [wordsMatch, setWordsMatch] = useState(false);
  const [value, setValue] = useState("");
  const [recordState, setRecordState] = useState(null);

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue(result);
    },
  });

  const onStop = (audioData) => {
    console.log("audioData", audioData);
  };
  var words = authString.replace(/,/g, " ");

  const compare = () => {
    const editedText = value.slice(0, -1).toLowerCase();
    console.log(editedText);
    console.log(words);
    var similarity = stringSimilarity.compareTwoStrings(
      words.toLowerCase(),
      editedText.toLowerCase()
    );
    console.log(similarity);
    if (similarity > 0.7) {
      console.log("true");
      setWordsMatch(true);
    }
  };

  const onSubmitSignIn = () => {
    fetch("http://localhost:3000/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data === "success") {
          setAuth(true);
        }
      });
  };

  const onClickStop = () => {
    stop();
    setRecordState(RecordState.STOP);
    compare();
  };

  const onClickStart = () => {
    listen();
    setRecordState(RecordState.START);
  };

  if (auth) {
    return (
      <Container>
        <LogoWrapper>
          <img src={logo} alt="" />
          <h3>
            Speaker <span>Recognition</span>
          </h3>
        </LogoWrapper>
        <Form>
          <h2>Read The following Words</h2>
          <h3>{words}</h3>
        </Form>
        <Speech>
          <button onClick={onClickStart}>Start Recording</button>
          <button onClick={onClickStop}>Stop Recording</button>
          {listening}
        </Speech>
        <AudioReactRecorder
          state={recordState}
          onStop={onStop}
          backgroundColor="rgba(0,0,0,0)"
          foregroundColor="rgba(0,0,0,0)"
          canvasHeight="0"
          canvasWidth="0"
        />
      </Container>
    );
  } else {
    return (
      <Container>
        <LogoWrapper>
          <img src={logo} alt="" />
          <h3>
            Speaker <span>Recognition</span>
          </h3>
        </LogoWrapper>
        <Form>
          <h3>Sign In</h3>
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={onSubmitSignIn}>Sign In</button>
        </Form>
        <div></div>
      </Container>
    );
  }
};

const Form = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    margin-bottom: 4rem;
  }
  h3 {
    color: #666666;
    margin-bottom: 2rem;
  }

  button {
    width: 75%;
    max-width: 350px;
    min-width: 250px;
    height: 40px;
    border: none;
    margin: 1rem 0;
    box-shadow: 0px 14px 9px -15px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    background-color: #70edb9;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in;

    &:hover {
      transform: translateY(-3px);
    }
  }
`;

const LogoWrapper = styled.div`
  img {
    height: 6rem;
    margin-left: 2rem;
  }
  h3 {
    color: #ff8d8d;
    text-align: center;
    font-size: 22px;
  }

  span {
    color: #5dc399;
    font-weight: 300;
    font-size: 18px;
  }
`;

const Container = styled.div`
  min-width: 400px;
  backdrop-filter: blur(35px);
  background-color: rgba(255, 255, 255, 0.8);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 2rem;

  @media (max-width: 900px) {
    width: 100vw;
    position: absolute;
    padding: 0;
  }

  h4 {
    color: #808080;
    font-weight: bold;
    font-size: 13px;
    margin-top: 2rem;

    span {
      color: #ff8d8d;
      cursor: pointer;
    }
  }
`;

const Speech = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  button {
    width: 30%;
    max-width: 350px;
    min-width: 150px;
    height: 40px;
    border: none;
    margin: 1rem 0;
    box-shadow: 0px 14px 9px -15px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    background-color: #70edb9;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in;

    &:hover {
      transform: translateY(-3px);
    }
  }
`;

export default Sidebar;
