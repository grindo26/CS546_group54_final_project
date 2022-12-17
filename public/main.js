let filter = document.getElementById('filter');
let content = document.querySelector('.content');
let content2 = document.querySelector('.content2')
let nameli = document.getElementsByClassName('nameli')
let priceli = document.getElementsByClassName('priceli')
let ratingli = document.getElementsByClassName('ratingli')
let myul = document.getElementById('results')
let li = document.createElement('li')
let submit = document.getElementById('submit')
let cityContent = document.querySelector('.cityContent');
let attrContent = document.querySelector('.attrContent')
let uldiv = document.getElementsByClassName('content2')


filter.addEventListener('change', function () {
    content = document.querySelector('.content');
    content2 = document.querySelector('.content2')
    nameli = document.getElementsByClassName('nameli')
    priceli = document.getElementsByClassName('priceli')
    console.log(priceli,"this is change")
    ratingli = document.getElementsByClassName('ratingli')
    myul = document.getElementById('results')
    let li = document.createElement('li')
    submit = document.getElementById('submit')
    cityContent = document.querySelector('.cityContent');
    attrContent = document.querySelector('.attrContent')
    uldiv = document.getElementsByClassName('content2')[0]
     selected = this.value;
    console.log(selected,"this is selected")
    myul.remove()
    myul = document.createElement('ul')
    myul.setAttribute('id','results')
    console.log(myul)
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
        let li = document.createElement('li')
        let li2 = document.createElement('li')
        let li3 = document.createElement('li')
        if(priceli[i].textContent == '$'){
        li.innerHTML = priceli[i].textContent
        myul.appendChild(li2)
        myul.appendChild(li)
        myul.appendChild(li3)
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
        myul.appendChild(li2)
        myul.appendChild(li)
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
        }

    }
return
} 
else {
    content.style.display = 'none';

}
});


