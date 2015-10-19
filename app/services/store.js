import 'firebase';

class Lobbies extends Firebase {
  constructor(url){
    super('https://scorching-fire-6566.firebaseio.com/lobbies')
  }

  newEntry(e) {
    this.push({
      battleground: bg
    })
  }
}

export default Store;
