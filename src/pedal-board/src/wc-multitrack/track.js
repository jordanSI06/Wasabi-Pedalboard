class Track{
  constructor(id,content){
    this.id=id;
    console.log("Salut, je suis track Id n°" + this.id);
    this.mainContainer = content;
    this.title = "Untitled Track" + id;
  }

  get getTrackHTML(){
    console.log(this.mainContainer.childNodes[3].childNodes[2])
    return this.mainContainer;
  }

  get titleCreation(){
    return this.title;
  }

  test(){
    console.log(document.querySelector('#delete'));
  }

}

