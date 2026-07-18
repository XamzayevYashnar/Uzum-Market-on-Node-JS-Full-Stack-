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