// async function getUsers(){
//     try {
//         const result = await fetch('http://127.0.0.1:3000/api/posts');
    
//         if (!result.ok){
//             throw new Error('Error on fetch')
//         }
    
//         const data = await result.text()
//         return data

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// getUsers().then(data=>{
//     if (data){
//         document.getElementById('content').innerHTML = data;
//     } else {
//         document.getElementById('content').innerHTML = 'Ma\lumot topilmadi!';
//     }
// });





// ===============================================HTML==============================
const track = document.querySelector('.rasmAnimation');
let slides = document.querySelectorAll('.slide');

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

slides = document.querySelectorAll('.slide');
const slideCount = slides.length;

let index = 1;

track.style.transition = 'none';
track.style.transform = `translateX(-${index * 100 / slideCount}%)`;

function updateSlide(withTransition = true) {
    track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
    track.style.transform = `translateX(-${index * 100 / slideCount}%)`;
}

function nextSlide() {
    index++;
    updateSlide();
}

function prevSlide() {
    index--;
    updateSlide();
}

document.querySelector('.next').addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

document.querySelector('.prev').addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

track.addEventListener('transitionend', () => {
    if (index === slideCount - 1) {
        index = 1;
        updateSlide(false);
    }
    if (index === 0) {
        index = slideCount - 2;
        updateSlide(false);
    }
});

// avtomatik almashinish
let autoSlide = setInterval(nextSlide, 3000);

function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 3000);
}