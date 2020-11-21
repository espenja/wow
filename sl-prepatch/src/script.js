// const startTimeEU = 1605097200 + 120
// const startTimeNA = 1605054000 + 120

// const startTimeNA = 1605548877 // + 220
// const startTimeEU = 1605556077 // + 220

const settings = JSON.parse(localStorage.getItem("settings") || "{}")

const startTimeEU = 1605556177 + 120
const startTimeNA = 1605548957 + 120
const rotationTimer = 600
const activationTime = 120

window.selected = "EU"
window.startTime = startTimeEU
window.sound = true
window.config = false
window.preventDing = false
window.loadedTime = new Date()
window.loadedTime.setSeconds(window.loadedTime.getSeconds() + 5)

if (!settings["sound"]) {
    settings["sound"] = {}
}

const currentActiveRare = document.getElementById("currentActiveRare")
const currentActiveWaypoint = document.getElementById("currentActiveWaypoint")
const currentActiveItems = document.getElementById("currentActiveItems")
const currentActiveActiveTime = document.getElementById(
    "currentActiveActiveTime"
)
const currentActiveSpawnedTimestamp = document.getElementById(
    "currentActiveSpawnedTimestamp"
)
const currentActiveSpawnedTime = document.getElementById(
    "currentActiveSpawnedTime"
)

const nextActiveRare = document.getElementById("nextActiveRare")
const nextActiveSpawnsTimestamp = document.getElementById(
    "nextActiveSpawnsTimestamp"
)
const nextActiveSpawnsTime = document.getElementById("nextActiveSpawnsTime")
const nextActiveItems = document.getElementById("nextActiveItems")
const nextActiveWaypoint = document.getElementById("nextActiveWaypoint")
const nextActiveActiveTime = document.getElementById("nextActiveActiveTime")
const speaker = document.getElementById("speaker")
const cogwheel = document.getElementById("settings")
const config = document.getElementById("rareSettingsWrapper")
const bellOffsetValue = document.getElementById("bellOffsetValue")
const bellOffset = document.getElementById("bellOffset")

bellOffset.value = settings["bellOffset"] || 20

window.currentRare = ""

const saveSettings = () => {
    localStorage.setItem("settings", JSON.stringify(settings))
}

const rares = [
    {
        order: 16,
        name: "Noth the Plaguebringer",
        x: 31.6,
        y: 70.5,
        items: [183642, 183676, 183654, 183200, 183616]
    },
    {
        order: 17,
        name: "Patchwerk",
        x: 34.4,
        y: 68.5,
        items: [183643, 183644, 183645, 183200, 183616]
    },
    {
        order: 18,
        name: "Blood Queen Lana'thel",
        x: 49.7,
        y: 32.7,
        items: [183646, 183647, 183648, 183200, 183616]
    },
    {
        order: 19,
        name: "Professor Putricide",
        x: 57.1,
        y: 30.3,
        items: [183649, 183650, 183651, 183200, 183616]
    },
    {
        order: 20,
        name: "Lady Deathwhisper",
        x: 51.1,
        y: 78.5,
        items: [183652, 183653, 183655, 183200, 183616]
    },
    {
        order: 1,
        name: "Skadi the Ruthless",
        x: 57.8,
        y: 56.1,
        items: [44151, 183670, 183656, 183657, 183200, 183616]
    },
    {
        order: 2,
        name: "Ingvar the Plunderer",
        x: 52.4,
        y: 52.6,
        items: [183668, 183659, 183658, 183200, 183616]
    },
    {
        order: 3,
        name: "Prince Keleseth",
        x: 54.0,
        y: 44.7,
        items: [183678, 183680, 183661, 183200, 183616]
    },
    {
        order: 4,
        name: "The Black Knight",
        x: 64.8,
        y: 22.1,
        items: [183638, 183637, 183636, 183200, 183616]
    },
    {
        order: 5,
        name: "Bronjahm",
        x: 70.7,
        y: 38.4,
        items: [183634, 183675, 183639, 183635, 183200, 183616]
    },
    {
        order: 6,
        name: "Scourgelord Tyrannus",
        x: 47.2,
        y: 66.1,
        items: [183674, 183633, 183632, 183200, 183616]
    },
    {
        order: 7,
        name: "Forgemaster Garfrost",
        x: 58.6,
        y: 72.5,
        items: [183666, 183631, 183630, 183200, 183616]
    },
    {
        order: 8,
        name: "Marwyn",
        x: 58.2,
        y: 83.4,
        items: [183687, 183663, 183662, 183200, 183616]
    },
    {
        order: 9,
        name: "Falric",
        x: 50.2,
        y: 87.9,
        items: [183664, 183665, 183667, 183200, 183616]
    },
    {
        order: 10,
        name: "The Prophet Tharon'ja",
        x: 80.1,
        y: 61.2,
        items: [183686, 183685, 183684, 183200, 183616]
    },
    {
        order: 11,
        name: "Novos the Summoner",
        x: 77.8,
        y: 66.1,
        items: [183671, 183672, 183627, 183200, 183616]
    },
    {
        order: 12,
        name: "Trollgore",
        x: 58.3,
        y: 39.4,
        items: [183669, 183626, 183640, 183200, 183616]
    },
    {
        order: 13,
        name: "Krik'thir the Gatewatcher",
        x: 67.5,
        y: 58.0,
        items: [183681, 183682, 183683, 183200, 183616]
    },
    {
        order: 14,
        name: "Prince Taldaram",
        x: 29.6,
        y: 62.2,
        items: [183625, 183679, 183677, 183200, 183616]
    },
    {
        order: 15,
        name: "Elder Nadox",
        x: 44.2,
        y: 49.1,
        items: [183673, 183641, 183624, 183200, 183616]
    }
].sort((a, b) => a.order - b.order)

const getRareId = (rare) => {
    return rare.name.replace(/[^A-Za-z]/g, "").toLowerCase()
}

const resetSkullColors = () => {
    for (const el of document.getElementsByClassName("skull")) {
        el.setAttribute("src", "img/skull.png")
    }
}

const setRareSkullActive = (rare, color) => {
    document
        .getElementById(getRareId(rare))
        .setAttribute(
            "src",
            color === "green" ? "img/skull_green.png" : "img/skull_red.png"
        )
}

const initMap = () => {
    const skulls = document.getElementById("skull-container")
    skulls.innerHTML = ""

    for (const rare of rares) {
        const skull = document.createElement("img")
        skull.setAttribute("id", getRareId(rare))
        skull.setAttribute("src", "img/skull.png")
        skull.setAttribute("class", "skull")
        skull.setAttribute("style", `left: ${rare.x}%; top: ${rare.y}%;`)

        skulls.appendChild(skull)

        tippy("#" + getRareId(rare), {
            content: `<div class='header'>
                ${rare.name}
                </div><hr /><div class='content'>x:${rare.x}, y:${rare.y}</div>`,
            allowHTML: true
        })
    }
}

initMap()

const formatTime = (time) => {
    let minutes = ""
    let seconds = ""

    if (time / 60 >= 1) {
        minutes = time / 60
    }

    seconds = time % 60

    return (
        (minutes ? ~~minutes.toString().padStart(2, "0") + " minutes, " : "") +
        ~~seconds +
        " seconds"
    )
}

const initSettings = () => {
    // bellOffset.value = bellOffset
    bellOffsetValue.innerHTML =
        formatTime(settings["bellOffset"] || 20) + " before activation"

    const rareSettings = document.getElementById("rareSettings")
    rareSettings.innerHTML = ""

    for (const rare of [...rares].sort((a, b) => (a.name > b.name ? 1 : -1))) {
        const rareId = getRareId(rare)

        if (settings["sound"][rareId] === undefined) {
            settings["sound"][rareId] = true
        }

        const checkContainer = document.createElement("div")
        checkContainer.setAttribute("class", "check-container")

        const rareSetting = document.createElement("input")
        const rareLabel = document.createElement("label")
        rareSetting.setAttribute("id", `check${rareId}`)
        rareSetting.setAttribute("type", "checkbox")
        rareSetting.setAttribute("name", `check${rareId}`)
        rareLabel.setAttribute("for", `check${rareId}`)

        if (settings["sound"][rareId]) {
            rareSetting.checked = settings["sound"][rareId]
        }

        rareSetting.addEventListener("change", (e) => {
            settings["sound"][rareId] = e.target.checked
            saveSettings()
        })

        rareLabel.innerHTML = rare.name

        checkContainer.appendChild(rareSetting)
        checkContainer.appendChild(rareLabel)
        rareSettings.appendChild(checkContainer)
    }
}

initSettings()

const formatDate = (date) => {
    return date.toString().replace(/\(.*?\)$/g, "")
}

const setCurrentRare = (rare) => {
    currentActiveRare.innerHTML = rare.name
}

const setCurrentTime = (time) => {
    currentActiveSpawnedTime.innerHTML =
        "Spawned " + formatTime(Math.abs(600 - time)) + " ago"
}

const setCurrentTimestamp = (time) => {
    const activates = new Date(0)
    activates.setUTCSeconds(time.getTime() / 1000 + 120)

    if (new Date() < activates) {
        currentActiveActiveTime.innerHTML =
            "Activates in " +
            formatTime(
                Math.abs(
                    new Date().getTime() / 1000 - activates.getTime() / 1000
                )
            )
    } else {
        currentActiveActiveTime.innerHTML =
            "Activated " +
            formatTime(
                Math.abs(
                    activates.getTime() / 1000 - new Date().getTime() / 1000
                )
            ) +
            " ago"
    }

    currentActiveSpawnedTimestamp.innerHTML = "Spawned: " + formatDate(time)
}

const setCurrentWaypoint = (rare) => {
    currentActiveWaypoint.innerHTML = `Waypoint: /tway ${rare.x} ${rare.y}`
}

const setItems = (rare, element) => {
    while (element.lastElementChild) {
        element.removeChild(element.lastElementChild)
    }

    for (const item of rare.items) {
        const a = document.createElement("a")
        a.setAttribute("href", "#")
        a.setAttribute("data-wowhead", `item=${item}`)
        a.setAttribute("data-wh-icon-size", "small")

        element.appendChild(a)
    }
}

const setNextRare = (rare) => {
    nextActiveRare.innerHTML = rare.name
}

const setNextTime = (time) => {
    nextActiveSpawnsTime.innerHTML = "Spawns in " + formatTime(time)
    nextActiveActiveTime.innerHTML =
        "Activates in " + formatTime(time + activationTime)
}

const setNextTimestamp = (time) => {
    nextActiveSpawnsTimestamp.innerHTML = "Spawns: " + formatDate(time)
}

const setNextWaypoint = (rare) => {
    nextActiveWaypoint.innerHTML = `Waypoint: /tway ${rare.x} ${rare.y}`
}

const playSound = () => {
    console.log("Attempting to play sound")
    let url = "./sound/Long.ogg"
    window.AudioContext = window.AudioContext || window.webkitAudioContext //fix up prefixing
    let context = new AudioContext() //context
    let source = context.createBufferSource() //source node
    source.connect(context.destination) //connect source to speakers so we can hear it
    let request = new XMLHttpRequest()
    request.open("GET", url, true)
    request.responseType = "arraybuffer" //the  response is an array of bits
    request.onload = function () {
        context.decodeAudioData(
            request.response,
            function (response) {
                source.buffer = response
                source.start(0) //play audio immediately
                source.loop = false
            },
            function () {
                console.error("The request failed.")
            }
        )
    }
    request.send()
}

const recalculate = () => {
    const now = Math.floor(new Date().getTime() / 1000)
    const diff = now - window.startTime

    const spawnIndex = Math.floor(diff / rotationTimer)
    const currentRareIndex = Math.floor(spawnIndex % 20)
    const nextRareIndex = Math.floor((spawnIndex + 1) % 20)

    const currentRareTime = new Date(0)
    currentRareTime.setUTCSeconds(window.startTime + spawnIndex * rotationTimer)

    const nextRareTime = new Date(0)
    nextRareTime.setUTCSeconds(
        window.startTime + spawnIndex * rotationTimer + rotationTimer
    )

    const currentTime = currentRareTime.getTime() / 1000 - now + rotationTimer
    setCurrentTimestamp(currentRareTime)
    setCurrentTime(currentTime)

    const nextTime = nextRareTime.getTime() / 1000 - now
    setNextTimestamp(nextRareTime)
    setNextTime(nextTime)

    const currentRare = rares[currentRareIndex]
    const nextRare = rares[nextRareIndex]

    if (
        currentRareTime.getTime() / 1000 +
            activationTime -
            settings["bellOffset"] ===
        ~~(new Date().getTime() / 1000)
    ) {
        if (
            window.sound &&
            !window.preventDing &&
            new Date() > window.loadedTime
        ) {
            if (settings["sound"][getRareId(currentRare)]) {
                playSound()
            }
        }
    }

    if (window.currentRare === rares[currentRareIndex].name) {
        return
    }

    resetSkullColors()
    setRareSkullActive(currentRare, "green")
    setRareSkullActive(nextRare, "red")

    setCurrentRare(currentRare)
    setCurrentWaypoint(currentRare)
    setItems(currentRare, currentActiveItems)
    setNextRare(nextRare)
    setItems(nextRare, nextActiveItems)
    setNextWaypoint(nextRare)

    window.preventDing = false
    window.currentRare = currentRare.name

    const nextRares = document.getElementById("nextRares")
    nextRares.innerHTML = ""

    const trHead = document.createElement("tr")
    const thName = document.createElement("th")
    const thTime = document.createElement("th")

    thName.innerHTML = "Name"
    thTime.innerHTML = "Time"
    trHead.appendChild(thName)
    trHead.appendChild(thTime)
    nextRares.appendChild(trHead)

    let counter = spawnIndex
    let index = Math.floor((counter + 2) % 20)
    while (index !== currentRareIndex) {
        const tr = document.createElement("tr")
        const tdName = document.createElement("td")
        const tdTime = document.createElement("td")

        const indexDate = new Date(0)
        indexDate.setSeconds(
            window.startTime + counter * rotationTimer + 2 * rotationTimer
        )

        tdName.innerHTML = rares[index].name
        tdTime.innerHTML = indexDate

        tr.appendChild(tdName)
        tr.appendChild(tdTime)
        nextRares.appendChild(tr)

        counter++
        index = Math.floor((counter + 2) % 20)
    }

    setTimeout(() => {
        $WowheadPower.refreshLinks()
    }, 100)
}

recalculate()

setInterval(() => {
    recalculate()
}, 1000)

const toggleSound = () => {
    if (window.sound) {
        speaker.setAttribute("src", "img/mute.svg")
    } else {
        speaker.setAttribute("src", "img/speaker.svg")
    }

    window.sound = !window.sound
}

const toggleConfig = () => {
    window.config = !window.config

    cogwheel.classList.add("spin")

    if (window.config) {
        config.setAttribute("style", "display: flex")
    } else {
        config.setAttribute("style", "display: none")
    }

    setTimeout(() => {
        cogwheel.classList.remove("spin")
    }, 2000)
}

const setNaSelected = () => {
    window.selected = "NA"
    window.startTime = startTimeNA

    document.getElementById("button-eu").classList.remove("active")
    document.getElementById("button-na").classList.add("active")
    recalculate()
}

const setEuSelected = () => {
    window.selected = "EU"
    window.startTime = startTimeEU

    document.getElementById("button-eu").classList.add("active")
    document.getElementById("button-na").classList.remove("active")
    recalculate()
}

const setOffset = (offset) => {
    bellOffsetValue.innerHTML = formatTime(offset) + " before activation"
    settings["bellOffset"] = offset
    saveSettings()
}

window.updateRegion = (region) => {
    window.currentRare = ""
    window.preventDing = true

    if (region === "NA") {
        setNaSelected()
    }
    if (region === "EU") {
        setEuSelected()
    }
}
