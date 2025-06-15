let t1
let t2
let t3
let t4
let t5
//let t6

function timer() {
    t1 = setTimeout(splash1o, 100)
    t2 = setTimeout(splash2o, 200)
    t3 = setTimeout(splash3o, 300)
    t4 = setTimeout(splash4o, 400)
    t5 = setTimeout(splash5o, 550)
    t6 = setTimeout(splash6o, 1000)
    t7 = setTimeout(splash7o, 1100)
}

function splash1o() {
    document.querySelector(".splash1").style.display = "block"
    document.querySelector(".wellc1").style.display = "none"
    document.querySelector(".wellc2").style.display = "block"
}

function splash2o() {
    document.querySelector(".splash2").style.display = "block"
}

function splash3o() {
    document.querySelector(".splash3").style.display = "block"
    document.querySelector(".wellc2").style.display = "none"
    document.querySelector(".wellc3").style.display = "block"
}

function splash4o() {
    document.querySelector(".splash4").style.display = "block"
}

function splash5o() {
    document.querySelector("#loader").style.background = "#3E549E"
    document.querySelector(".wellc3").style.display = "none"
    document.querySelector(".wellc4").style.display = "block"
}

function splash6o() {
    document.getElementById("loader").classList.add("load-dp")
}

function splash7o() {
    document.getElementById("loader").style.display = "none"
}