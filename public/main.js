let filter = document.getElementById('filter');
let content = document.querySelector('.content');
let content2 = document.querySelector('.content2')
let nameli = document.getElementsByClassName('nameli')
let priceli = document.getElementsByClassName('priceli')
let ratingli = document.getElementsByClassName('ratingli')
let tagli = document.getElementsByClassName('tagli')
let myul = document.getElementById('results')
let li = document.createElement('li')
let submit = document.getElementById('submit')
let cityContent = document.querySelector('.cityContent');
let attrContent = document.querySelector('.attrContent')
let uldiv = document.getElementsByClassName('content2')
let sort = document.getElementById('sort')
let add = document.getElementById('add')

filter.addEventListener('change', function () {
    content = document.querySelector('.content');
    content2 = document.querySelector('.content2')
    nameli = document.getElementsByClassName('nameli')
    priceli = document.getElementsByClassName('priceli')
    tagli = document.getElementsByClassName('tagli')
    ratingli = document.getElementsByClassName('ratingli')
    myul = document.getElementById('results')
    let li = document.createElement('li')
    submit = document.getElementById('submit')
    cityContent = document.querySelector('.cityContent');
    attrContent = document.querySelector('.attrContent')
    uldiv = document.getElementsByClassName('content2')[0]
     selected = this.value;
    myul.remove()
    myul = document.createElement('ul')
    myul.setAttribute('id','results')

    uldiv.appendChild(myul)
    if (selected === 'all') {
        content.style.display = 'block';
        content2.style.display = 'none'
        return
} 

 else if (selected == 'names') {
    content.style.display = 'none'
    content2.style.display='block'
    for(let i=0;i<nameli.length;i++){
        let li = document.createElement('li')
        li.innerHTML = nameli[i].textContent
     
        myul.appendChild(li)
    }
return
}
else if (selected == '$') {
    content.style.display = 'none'
    content2.style.display='block'
    for(let i=0;i<priceli.length;i++){
        let br = document.createElement('br')
        let li = document.createElement('li')
        let li2 = document.createElement('li')
        let li3 = document.createElement('li')
        if(priceli[i].textContent == '$'){
        li.innerHTML = priceli[i].textContent
        myul.appendChild(li2)
        myul.appendChild(li)
        myul.appendChild(li3)
        myul.appendChild(br)
        }

    }
return
}
else if (selected == '$$') {
    content.style.display = 'none'
    content2.style.display='block'
    for(let i=0;i<priceli.length;i++){
        let br = document.createElement('br')
        let li = document.createElement('li')
        let li2 = document.createElement('li')
        let li3 = document.createElement('li')
        if(priceli[i].textContent == '$$'){
            li3.innerHTML = ratingli[i].textContent
            li2.innerHTML = nameli[i].textContent
        li.innerHTML = priceli[i].textContent
        myul.appendChild(li)
        myul.appendChild(li2)
        myul.appendChild(li3)
        myul.appendChild(br)
        }

    }
return
}
else if (selected == '$$$') {
    content.style.display = 'none'
    content2.style.display='block'
    for(let i=0;i<priceli.length;i++){
        let br = document.createElement('br')
        let li = document.createElement('li')
        let li2 = document.createElement('li')
        let li3 = document.createElement('li')
        if(priceli[i].textContent == '$$$'){
            li3.innerHTML = ratingli[i].textContent
            li2.innerHTML = nameli[i].textContent
        li.innerHTML = priceli[i].textContent
        myul.appendChild(li2)
        myul.appendChild(li)
        myul.appendChild(li3)
        myul.appendChild(br)
        }

    }
return
} 
else if (selected == 'tags') {
    content.style.display = 'none'
    content2.style.display='block'
    for(let i=0;i<tagli.length;i++){

    
        let br = document.createElement('br')
        let li = document.createElement('li')
        let li2 = document.createElement('li')
        let li3 = document.createElement('li')
        let li4 = document.createElement('li')
        if(tagli[i].innerHTML.includes('Indoor Activity')){

            li3.innerHTML = ratingli[i].textContent
            li2.innerHTML = nameli[i].textContent
        li.innerHTML = priceli[i].textContent
        li4.innerHTML = tagli[i].innerHTML

        myul.appendChild(li4)
        myul.appendChild(li2)
        myul.appendChild(li)
        myul.appendChild(li3)
        myul.appendChild(br)
        }

    }
return
}
else if (selected == 'tags2') {
    content.style.display = 'none'
    content2.style.display='block'
    for(let i=0;i<tagli.length;i++){

        let br = document.createElement('br')
        let li = document.createElement('li')
        let li2 = document.createElement('li')
        let li3 = document.createElement('li')
        let li4 = document.createElement('li')
        if(tagli[i].innerHTML.includes('Outdoor Activity')){

            li3.innerHTML = ratingli[i].textContent
            li2.innerHTML = nameli[i].textContent
        li.innerHTML = priceli[i].textContent
        li4.innerHTML = tagli[i].innerHTML

        myul.appendChild(li4)
        myul.appendChild(li2)
        myul.appendChild(li)
        myul.appendChild(li3)
        myul.appendChild(br)
        }

    }
return
}
else if (selected == 'tags3') {
    content.style.display = 'none'
    content2.style.display='block'
    for(let i=0;i<tagli.length;i++){

        let br = document.createElement('br')
        let li = document.createElement('li')
        let li2 = document.createElement('li')
        let li3 = document.createElement('li')
        let li4 = document.createElement('li')
        if(tagli[i].innerHTML.includes('Parks')){

            li3.innerHTML = ratingli[i].textContent
            li2.innerHTML = nameli[i].textContent
        li.innerHTML = priceli[i].textContent
        li4.innerHTML = tagli[i].innerHTML

        myul.appendChild(li4)
        myul.appendChild(li2)
        myul.appendChild(li)
        myul.appendChild(li3)
        myul.appendChild(br)
        }

    }
return
}
else if (selected == 'tags4') {
    content.style.display = 'none'
    content2.style.display='block'
    for(let i=0;i<tagli.length;i++){

        let br = document.createElement('br')
        let li = document.createElement('li')
        let li2 = document.createElement('li')
        let li3 = document.createElement('li')
        let li4 = document.createElement('li')
        if(tagli[i].innerHTML.includes('Monument')){

            li3.innerHTML = ratingli[i].textContent
            li2.innerHTML = nameli[i].textContent
        li.innerHTML = priceli[i].textContent
        li4.innerHTML = tagli[i].innerHTML

        myul.appendChild(li4)
        myul.appendChild(li2)
        myul.appendChild(li)
        myul.appendChild(li3)
        myul.appendChild(br)
        }

    }
return
}
else {
    content.style.display = 'none';

}
});



sort.addEventListener('change', function () {
    content = document.querySelector('.content');
    content2 = document.querySelector('.content2')
    nameli = document.getElementsByClassName('nameli')
    priceli = document.getElementsByClassName('priceli')
    let tagli = document.getElementsByClassName('tagli')
    ratingli = document.getElementsByClassName('ratingli')
    myul = document.getElementById('results')
    uldiv = document.getElementsByClassName('content2')[0]
    selected = this.value;
   myul.remove()
   myul = document.createElement('ul')
   myul.setAttribute('id','results')
   uldiv.appendChild(myul)

   if(selected == 'A-Z'){
    content.style.display = 'none'
    content2.style.display='block'
    let sortedArray = [];
    for(let i=0; i<nameli.length;i++){
       sortedArray.push(nameli[i].innerHTML)
    }
    let results = sortedArray.sort()
    for(let j=0; j<results.length;j++){
      const li = document.createElement('li')
      const li2 = document.createElement('li')
      const li3 = document.createElement('li')
      let br = document.createElement('br')

      li.innerHTML = results[j];
      li2.innerHTML = priceli[j].textContent
      li3.innerHTML = ratingli[j].textContent

      myul.appendChild(li)
      myul.appendChild(li2)
      myul.appendChild(li3)
      myul.appendChild(br)
    }
   }

   else if(selected == 'Z-A'){
    content.style.display = 'none'
    content2.style.display='block'
    let sortedArray = [];
    for(let i=0; i<nameli.length;i++){
       sortedArray.push(nameli[i].innerHTML)
    }
    let results = sortedArray.sort(function(a, b) {
        if (a > b) {
          return -1;
        }
        if (a < b) {
          return 1;
        }
        return 0;
      });
    for(let j=0; j<results.length;j++){
      const li = document.createElement('li')
      const li2 = document.createElement('li')
      const li3 = document.createElement('li')
      let br = document.createElement('br')

      li.innerHTML = results[j];
      li2.innerHTML = priceli[j].textContent
      li3.innerHTML = ratingli[j].textContent

      myul.appendChild(li)
      myul.appendChild(li2)
      myul.appendChild(li3)
      myul.appendChild(br)
    }
 }
 else if(selected == 'rating'){
    content.style.display = 'none'
    content2.style.display='block'
    let sortedArray = [];
    for(let i=0; i<nameli.length;i++){
       sortedArray.push(ratingli[i].innerHTML)
    }
    let results = sortedArray.sort(function(a, b) {
       return b - a
      });
    for(let j=0; j<results.length;j++){
        const a = document.getElementById('a')
        const href = a.getAttribute('href')
      const li = document.createElement('li')
      const li2 = document.createElement('li')
      const a1 = document.createElement('a')
    //   li2.appendChild(a1);
      const li3 = document.createElement('li')
      let br = document.createElement('br')
     a1.innerHTML = nameli[j].textContent
      li.innerHTML = results[j];
      li2.appendChild(a1)
      li3.innerHTML = priceli[j].textContent

      myul.appendChild(li)
      myul.appendChild(li2)
      myul.appendChild(li3)
      myul.appendChild(br)
    }
 }

});
