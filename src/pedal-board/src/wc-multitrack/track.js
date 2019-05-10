class Track{
  constructor(id,content){
    this.id=id;
    console.log("Salut, je suis track Id n°" + this.id);
    this.mainContainer = content;
    this.title = "Untitled Track" + id;
  }

  get trackCreation(){
    return this.mainContainer;
  }

  get titleCreation(){
    return this.title;
  }
}