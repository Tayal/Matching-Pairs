/*------Game Encapsulation------*/
class Game {
  constructor() {
    this.state = {
      turn: true,
      p1score: 0,
      p2score: 0,
      computer: false,
      cardsAll: [],
      cardsOpened: []
    }

    const nums = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'king', 'queen']
    const suits = ['spades', 'hearts', 'clubs', 'diamonds']
    nums.forEach(num => {
      suits.forEach(suit => {
        this.state.cardsAll.push(`${num}_of_${suit}.svg`)
        this.state.cardsOpened.push(false)
      })
    })
    
    this.jsConfetti = new JSConfetti()
    this.listenForEvents()
  }

  /*------Cached Element References ------*/
  elements = {
    body: document.querySelector('body'),
    start: document.getElementById('start'),
    human: document.getElementById('human'),
    computer: document.getElementById('computer'),
    game: document.getElementById('game'),
    cards: [],
    score1: document.getElementById('score1'),
    score2: document.getElementById('score2'),
    resetButton: document.getElementById('reset'),
    img2: document.getElementById('img2'),
    checkTurn: document.getElementById('turn'),
    stat: document.getElementById('staty'),
    winSound: document.getElementById('win'),
    flipSound: document.getElementById('flip'),
    shuffleSound: document.getElementById('shuffle'),
    matchSound: document.getElementById('match'),
  }

  /*------Event Listeners------*/
  listenForEvents() {
    this.elements.human.addEventListener('click', () => this.handler(false))
    this.elements.computer.addEventListener('click', () => this.handler(true))
    this.elements.resetButton.addEventListener('click', this.reset)

    for(let i=1; i<=52; i++) this.elements.cards.push(document.getElementById(`card${i}`))
    for(let i=0; i<52; i++) this.elements.cards[i].addEventListener('click', () => this.cardFlip(i, true))
  }


  /*------Event Handlers------*/
  handler = (comp) => {
    this.elements.shuffleSound.play()
    this.elements.body.style.background = "white"
    this.elements.start.style.display = "none"
    this.elements.game.style.display = "inline"
    this.state.computer = comp
    if(this.state.computer) this.elements.img2.setAttribute('src', 'https://static.thenounproject.com/png/2318526-200.png')
  }

  reset = () => {
    console.log('Resetting the Game.')
    window.location.reload()
  }

  /*------Game Logic ------*/
  cardFlip = (cardNum, flag) => {
    if(this.state.cardsOpened[cardNum] || (this.state.computer && flag && !this.state.turn)) return

    let idx = Math.floor(Math.random() * this.state.cardsAll.length)
    let flippedCard = this.state.cardsAll.splice(idx, 1)[0]
    
    idx = this.state.cardsOpened.findIndex(str => typeof str !== 'boolean' && str.split('_')[0] == flippedCard.split('_')[0])

    this.state.cardsOpened[cardNum] = flippedCard
    this.elements.cards[cardNum].setAttribute('src', `cards\\${flippedCard}`)

    if(idx !== -1) {
      this.elements.matchSound.play()
      this.elements.cards[cardNum].style.opacity = 0.1
      this.elements.cards[idx].style.opacity = 0.1
      this.state.cardsOpened[cardNum] = true
      this.state.cardsOpened[idx] = true

      if(this.state.turn) this.state.p1score++
      else this.state.p2score++
    }
    else this.state.turn = !this.state.turn

    this.render()
  }

  render() {
    const {p1score, p2score, turn, cardsAll, computer, cardsOpened} = this.state
    const {score1, score2, checkTurn, stat, winSound, flipSound} = this.elements
    
    score1.innerText = `Player 1 Score : ${p1score}`
    score2.innerText = `Player 2 Score : ${p2score}`

    if(p1score > p2score) stat.innerText='Player 1 is Winning!'
    else if(p2score > p1score) stat.innerText='Player 2 is Winning!'
    else stat.innerText = `It's a TIE right now!`
    
    checkTurn.innerText = turn ? "Player 1's Turn" : "Player 2's Turn"
    if(turn) setTimeout(() => {
      score1.style.color = "red"
      score2.style.color = "black"
    }, 500)
    else {
      score1.style.color = "black"
      score2.style.color = "red"
    }

    flipSound.play()
    if(!cardsAll.length) {
      winSound.play()
      this.jsConfetti.addConfetti()
      this.jsConfetti.addConfetti()
      this.jsConfetti.addConfetti()

      checkTurn.className += "animate__animated animate__flip"

      if(p1score > p2score) checkTurn.innerText = stat.innerText = "Player 1 Wins!"
      else if(p2score > p1score) checkTurn.innerText = stat.innerText = "Player 2 Wins!"
      else checkTurn.innerText = stat.innerText = "It was a TIE!"
    }
    else if(computer && !turn) {
      let rand = Math.floor(Math.random() * cardsOpened.length)
      if(cardsOpened[rand]) rand = cardsOpened.findIndex(val => !val)
      setTimeout(() => this.cardFlip(rand, false), 1500)
    }
  }
}

let gameHTML = ''
for(let i=1; i<=52; i++) gameHTML += `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlc5FuMrtZRUqIsWM082Hq1Sq7kPVTsS-Taj58dArkl2sMZn8pzfnejOdxSDPTq9gWtxo&usqp=CAU" class="card" id=card${i}>`
document.getElementById('game').innerHTML += gameHTML
new Game()