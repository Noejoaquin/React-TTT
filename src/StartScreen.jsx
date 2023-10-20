function StartScreen({ handleAi }) {
    return(
      <>
        <div>
          <h2>Who do you want to play?</h2>
          <button onClick={() => handleAi(true)}>AI</button>
          <button onClick={() => handleAi(false)}>Human</button>
        </div>
      </>
    )
}

export default StartScreen;