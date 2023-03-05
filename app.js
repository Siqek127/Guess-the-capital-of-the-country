var json = [] //deklaracja pustej tablicy, do której zostaną pobrane dane

//deklaracja pozostałych zmiannych
var capital = "" //stolica porównywana z odpowiedzią
var correct_capital = "" //stolica wyświetlana po podaniu odpowiedźi
var pkt = 0 //zminna przechowująca liczbę punktów zdobytych przez użytkownika
var hp = 0  //zmienna przechowująca pozostałą liczbę punktów życia użytkownika
var s_json = [] //tablica wykorzystywana w tworzeniu elementów do gry
var first_play = true //zmienna zapobiegająca ponowne pobranie json'a
var game_over = false //zmienna zapobiegająca przypisywanie klawisza po przegranej grze

//stworzenie stałej używanej w przypisywaniu klawisza do projektu
const pressedEnter = function(event) {
    if (event.keyCode === 13) {
      game()
    }
  }

async function getData(){ //pobranie danych z serwera
    const data = await fetch("https://restcountries.com/v2/all")
    json = await data.json()

    console.log(json)
}

function select_elements(){ //zmiana treści output`a względem wybranej wartośći w inpucie
    const input_range = document.getElementById("range_select_elements").value
    const output = document.getElementById("output_select_elements")

    //zmiana konkretnych wartości na wartości
    if (input_range == 1){
        output.innerHTML = "All regions"
    } else if (input_range == 2){
        output.innerHTML = "Europe"
    } else if (input_range == 3){
        output.innerHTML = "Asia"
    } else if (input_range == 4){
        output.innerHTML = "Africa"
    } else if (input_range == 5){
        output.innerHTML = "Americas"
    } else {
        output.innerHTML = "Oceania"
    }
    
}

function random_number(max){ //wylosowanie losowego numeru
    return Math.floor(Math.random() * max);
}

function random_country(){ //tworzenie elementów w div'ie `game`
    const div_game = document.getElementById("game")

    div_game.innerHTML = "" //wyczyszczenie div'a z grą 

    var country = s_json[random_number(s_json.length-1)]

    capital = country.capital.toLowerCase() //zamiana wszystkich liter w zmiennej na małe
    correct_capital = country.capital //przypisanie zmiennej prawidłowej odpowiedźi (wyświetlana po podaniu odpowiedzi w funkcji `show_correct_answer()`)

    //tworzenia div'a, gdzie będą informacje o wylosowanym państwie i elementy gry
    const div_country = document.createElement("div")
    div_country.setAttribute("id","country")

    //tworzenie nagłówka z nazwą wylosowanego państwa
    const country_name = document.createElement("h2")
    country_name.innerHTML = country.name

    //tworzenie flagi wylosowanego państwa
    const country_flag = document.createElement("img")
    country_flag.setAttribute("src", country.flag)
    country_flag.style.width = "250px"

    //tworzenie elementu z informacją, gdzie ma zostać podana odpowiedź
    const info = document.createElement("p")
    info.innerHTML = "ENTER ANSWER"
    info.style.marginBottom = "0px"

    //tworzenie input'a na odpowiedź
    const input = document.createElement("input")
    input.setAttribute("id","answer")
    input.setAttribute("type","text")

    //tworzenie przycisku `help`
    const help = document.createElement("button")
    help.setAttribute("id", "button_help_window")
    //appendchild dla elementu `help` nie jest wymagane


    //wstawienie utworzonych elementów na stronę
    div_country.appendChild(country_name)
    div_country.appendChild(country_flag)
    div_country.appendChild(info)
    div_country.appendChild(input)

    div_game.appendChild(div_country)

    //przypisanie klawisza `enter` do projektu, jeżeli gracz jeszcze nie przegrał
    if (game_over == false){
        document.addEventListener("keydown", pressedEnter)
    }
}

//pokazanie prawidłowej odpowieźi i nadanie jej coloru zgodnie z podaną odpowiedźią
function show_correct_answer(color){
    document.getElementById("correct_answer").innerHTML = correct_capital
    document.getElementById("correct_answer").style.color = color
}

//ukrycie prawidłowej odpowiedźi
function hide_correct_answer(){
    document.getElementById("correct_answer").innerHTML = ""
}

function game(){
    var answer = document.getElementById("answer").value //pobranie z inputa podanej przez użytkownika odpowiedźi
    var color_correct_answer = ""
    answer = answer.toLowerCase() //zamiana wszystkich liter w odpowiedźi na małe
    console.log(answer)   
    
    console.log(capital)

    if (answer!=""){ //jeżeli użytkownik nic nie wpisał, nic nie zostanie wykonane
        if (answer==capital){ //jeżeli odpowiedź będzie poprawna, zostanie przyznany punkt użytkownikowi
            pkt = pkt + 1
            document.getElementById("pkt").innerHTML = "Your score: " + pkt
            color_correct_answer = "chartreuse" //ustawienie coloru wyświetlanej odpowiedźi na zielony
        } else { //jeżeli odpowiedź będzie niepoprawna, zostanie odjęty punkt życia użytkownika
            hp = hp - 1

            //ustawienie graficznie ilości punktów życia użytkownika
            const p_hp = document.getElementById("hp")
            p_hp.innerHTML = ""

            for (var i=0;i<hp;i++){
                p_hp.innerHTML += "❤"
            }

            if (hp<=0){ //jeżeli użytkownik nie ma więcej punktów życia, gra się zakończy
                document.getElementById("final_score").innerHTML  = "Your final score: " + pkt //ustawienie wyniku, zdobytego przez użytkownika
                document.getElementById("div_game").style.display = "none" //ukrycie div'a z grą
                document.getElementById("div_game_over").style.display = "flex" //pokazanie div'a z informacją o zakończeniu gry
                game_over = true
            }
            color_correct_answer = "red" //ustawienie coloru wyświetlanej odpowiedźi na czerwony
        }
        document.removeEventListener("keydown", pressedEnter) //usunięcie przypisanego klawisza `enter` do projektu, aby użytkownik odpowiedział tylko raz
        show_correct_answer(color_correct_answer) //pokazanie poprawnej odpowiedźi
        setTimeout(hide_correct_answer, 1400) //ukrycie poprawnej odpowiedźi
        setTimeout(random_country, 2000) //wylosowanie kolejnego kraju
    }
}

//deklaracja tablic, do których będą przypisywane państwa z danego regionu
var Europe_json = []
var Asia_json = []
var Africa_json = []
var Americas_json = []
var Oceania_json = []

function add_to_json(){ //dodanie elementów z pobranego json'a do odpowiednich tablic
    for (var i=0; i<=json.length-1; i++){
        if (json[i].region == "Europe"){
            Europe_json.push(json[i])
        }
        if (json[i].region == "Asia"){
            Asia_json.push(json[i])
        }
        if (json[i].region == "Africa"){
            Africa_json.push(json[i])
        }
        if (json[i].region == "Oceania"){
            Oceania_json.push(json[i])
        }
        if (json[i].region == "Americas"){
            Americas_json.push(json[i])
        }
    }
}
async function start(){ //funckja przygotowująca dane i rozpoczynająca grę
    document.getElementById("button_start").removeAttribute("onclick") //usunięcie atrybutu `onclick`, aby użytkownik nie pobrał kilka razy danych i rozpoczą grę więcej niż raz
    if (first_play == true){ //jeżeli gracz gra pierwszą gre, dane zostaną pobrane z serwera
        document.getElementById("div_loading").style.display = "flex" //wyświetlenie animacji ładowania
        await getData() //zaczekanie aż dane z serwera zostaną pobrane
        document.getElementById("div_loading").style.display = "none" //ukrycie animacji ładowania

        add_to_json()
        console.log("Europe")
        console.log(Europe_json)

        console.log("Asia")
        console.log(Asia_json)

        console.log("Americas")
        console.log(Americas_json)

        console.log("Oceania")
        console.log(Oceania_json)

        console.log("Africa")
        console.log(Africa_json)

        first_play = false //zapobiegnięcie ponownego pobrania json'a
    }

    const selected = document.getElementById("output_select_elements").value
    
    //wybranie elementu, z którego państwa będą losowane
    if (selected == "All regions"){
        s_json = json
    }
    if (selected == "Europe"){
        s_json = Europe_json
    }
    if (selected == "Asia"){
        s_json = Asia_json
    }
    if (selected == "Africa"){
        s_json = Africa_json
    }
    if (selected == "Americas"){
        s_json = Americas_json
    }
    if (selected == "Oceania"){
        s_json = Oceania_json
    }

    random_country(s_json) //wylosowanie pierwszego państwa

    document.getElementById("div_start").style.display = "none" //ukrycie div'a z opcjami wybieranymi na początku
    document.getElementById("div_game").style.display = "grid" //wyświetlenie div'a z grą

    //ustawienie punktów życia, zgodnie z wybraną ilością
    const change_hp = document.getElementById("hp")
    hp = document.getElementById("output_hp").value
    change_hp.innerHTML = ""

    for (var i=0;i<hp;i++){
        change_hp.innerHTML += "❤"
    }
}

function show_help_window(){ //funkcja pokazująca okno pomocy
    document.getElementById("div_help_window").style.display = "grid"
    document.getElementById("button_close_help_window").style.display = "block"
    document.getElementById("button_help_window").style.display = "none"
}

function hide_help_window(){ //funkcja ukrywająca okno pomocy
    document.getElementById("div_help_window").style.display = "none"
    document.getElementById("button_close_help_window").style.display = "none"
    document.getElementById("button_help_window").style.display = "block"
}

function try_again(){ //funkcja pozwalająca zagrać ponownie
    document.getElementById("div_game_over").style.display = "none"
    document.getElementById("div_start").style.display = "flex"
    const button_start_game = document.getElementById("button_start")
    button_start_game.setAttribute("onclick", "start()")
    game_over = false
}