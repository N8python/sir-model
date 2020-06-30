let doingSimulation = false;
let updateInterval;
let model = { destroy() {} }
document.getElementById("start").onclick = () => {
    if (doingSimulation) {
        return;
    }
    doingSimulation = true;
    model.destroy();
    const pop = document.getElementById("size").value;
    let susceptible;
    let infected;
    let removed = 0;
    const i = document.getElementById("I").value;
    if (!i) {
        susceptible = (pop - 1) / pop;
        infected = 1 / pop;
    } else {
        susceptible = 1 - i;
        infected = +i;
    }
    const l = +document.getElementById("l").value;
    const y = +document.getElementById("y").value;
    const u = +document.getElementById("u").value;
    const v = +document.getElementById("v").value;
    const a = +document.getElementById("a").value;
    let timestep = 0;
    model = new Chart(document.getElementById("model"), {
        type: "line",
        data: {
            labels: ["t0"],
            datasets: [{
                data: [susceptible * pop],
                label: "Susceptible",
                fill: false,
                borderColor: "#3e95cd"
            }, {
                data: [infected * pop],
                label: "Infected",
                fill: false,
                borderColor: "#c45850"
            }, {
                data: [removed * pop],
                label: "Removed",
                fill: false,
                borderColor: "#999999"
            }]
        },
        options: {
            title: {
                display: true,
                text: "SIR Model"
            }
        }
    });
    updateInterval = setInterval(() => {
        timestep++;
        const s = susceptible;
        const i = infected;
        const r = removed;
        susceptible -= l * s * i;
        susceptible += v;
        susceptible += a * r;
        susceptible -= u * s;
        infected += l * s * i;
        infected -= y * i;
        infected -= u * i;
        removed += y * i;
        removed -= u * r;
        removed -= a * r;
        model.data.labels.push("t" + timestep);
        model.data.datasets.forEach(dataset => {
            switch (dataset.label) {
                case "Susceptible":
                    dataset.data.push(Math.round(susceptible * pop));
                    break;
                case "Infected":
                    dataset.data.push(Math.round(infected * pop));
                    break;
                case "Removed":
                    dataset.data.push(Math.round(removed * pop));
                    break;
            }
        })
        model.update();
        if (Math.round(infected * pop) < 1) {
            doingSimulation = false;
            clearInterval(updateInterval);
        }

    }, document.getElementById("speed").value * 1000);
}
document.getElementById("end").onclick = () => {
    doingSimulation = false;
    clearInterval(updateInterval);
}
