const fs = require('fs').promises;
const path = "../DataJson/data.json"


async function readJson(path) {
    try{
        const data = await fs.readFile(path, 'utf-8');

        let votes = JSON.parse(data)
      
        return votes;
    }
    catch(err){   
        console.log("No se puedo acceder al archivo ", err.message)
       
    }

}
const validateName     =    (name) => /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(name)

const validateAge      =    age => (typeof(age) !=='number' || age <= 0) ? false : true

const validateResponse =    response => (Object.values(response).length === 0 ) ? false : true

const calculateAverageAge = (arr, validUsers) => (Math.floor(((arr.reduce((acc, item )=> acc + item, 0)) / validUsers)*100) / 100)

const validateVotes = (responses) => {
  
    let data = responses.reduce((acc, item) => {

      for (let [ask, answer] of Object.entries(item)){
            
            acc[ask] =  acc[ask] || []
            
           
            if(answer.length > 0){

                acc[ask].push(answer)
               
            }
      }
      return acc;

    
    },{})
    
    return data;
}
function countVotes(fn, arr){

    if(typeof(fn) !== 'function') throw new Error("valide bien los datos");

    return Object.entries(fn(arr)).reduce((acc, item) =>{
        
        acc[item[0]] = (acc[item[0]] || {})

        for (let value of item[1]){
            
            acc[item[0]][value] =  (acc[item[0]][value] || 0) + 1


        }
        return acc;
       
        
    },{})

    
    
}
function getAverageVotes(obj){
   

  return  Object.entries(obj).reduce((acc, [key, value])=>{
   
    let total = Object.values(value).reduce((acc, item ) => acc + item,0)
    
    let average = Object.keys(value).reduce((acc, key) =>{

        acc[key] = ((value[key]/ total)* 100).toFixed(2)
      
        return acc
    },{})

    acc[key] = average

    return acc;

  },{})
 
    
 
}
function showResults(obj){
    
    Object.entries(obj).forEach(([ask, response]) =>{
        
        console.log(`\n\t${ask.toUpperCase()}`)
   
        for (let [clave, valor ] of Object.entries(response)){
            console.log(`\t\t${clave}: ${valor}\n`)
        }
        
    })

}

function main(data) {

    let total_Participants = data.length;
    let valid_Participants = 0
    let disabled_Participants = 0
    let ages = []
    let responses = []
    

    data.forEach((value) => {

        const { nombre, edad, respuestas } = value;
        if(validateName(nombre) && validateAge(edad) && validateResponse(respuestas)){
            responses.push(respuestas)
            ages.push(edad)
            valid_Participants ++
        }
        else{
            disabled_Participants++
        }
        
    });




console.log(`Total de participantes : ${total_Participants}`)
console.log(`Participantes válidos  : ${valid_Participants}`)
console.log(`Participantes inválidos: ${disabled_Participants}\n\n`)
console.log(`Promedio de edad       : ${calculateAverageAge(ages, valid_Participants)}\n`)
console.log(`resultados por pregunta\n`)

let votesCounted = countVotes(validateVotes, responses)
let averageVotes = getAverageVotes(votesCounted)
showResults(averageVotes)
}

readJson(path)
            .then(main)
            .catch(err => console.log(err.message))


        