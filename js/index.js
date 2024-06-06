let lunchCalc = document.getElementById("lunchCalc");

// cuando se aprieta submit, solo si es mayor de 18 años se permitirá la fx calcExpenses
lunchCalc.addEventListener("submit", function(e) {
    e.preventDefault();
    
    let edad = prompt("¿Cuántos años tienes?");
    
    if (edad >= 18) {
        calcExpenses(e);
    } else {
        alert("Debes ser mayor de 18 años para continuar.");
    }
});

// guardar cada valor en una variable
function getValues () {
    let tipoEvento = document.getElementById("tipoEvento").value;
    let budget = document.getElementById("budget").value;
    let date = document.getElementById("date").value;
    let people = document.getElementById("people").value;
    let comentarios = document.getElementById("comentarios").value;

    return {tipoEvento, budget, date, people, comentarios};
}

function resetForm() {
    document.getElementById("tipoEvento").value = '';
    document.getElementById("budget").value = '';
    document.getElementById("date").value = '';
    document.getElementById("people").value = '';
    document.getElementById("comentarios").value = '';
}

function calcExpenses() {
    const { tipoEvento, budget, date, people, comentarios } = getValues();

    let costoPorPersona = 500;
    let expenses = parseInt(people) * costoPorPersona;

    // Ciclo para asegurar que el presupuesto sea suficiente
    let validBudget = parseInt(budget);
    while (validBudget < expenses) {
        validBudget = parseInt(prompt(`El presupuesto es insuficiente. El costo del evento es ${expenses}. Por favor ingresa un presupuesto mayor o igual.`));
    }
    let balance = validBudget - expenses;

    console.log(`El tipo de evento es ${tipoEvento}, para ${people} personas y cuesta ${expenses}. Tu presupuesto es ${validBudget}`);

    // Llevar la data a la UI para aplicar luego el resto
    UI(tipoEvento, expenses, people, comentarios);

    // Crear una nueva instancia de Presupuesto y agregarla al array
    let nuevoPresupuesto = new Presupuesto(tipoEvento, people, expenses);
    PRESUPUESTOS.push(nuevoPresupuesto);

    // Actualizar las tarjetas de presupuesto
    agregarTarjetasPresupuesto(PRESUPUESTOS);

    // Limpiar el formulario para un nuevo cálculo
    resetForm();
}


function resetUI() {
    let result = document.getElementById("result");
    result.innerHTML = '';
}

function UI(tipoEvento, expenses, people) {
    resetUI();
    let result = document.getElementById("result");
    let dataPrint = document.createElement("div");

    dataPrint.innerHTML = `
    <div class="container-data row">
        <div class="col s4">
            <h6>${tipoEvento}</h6>
        </div>
        <div class="col s4">
            <h6>${expenses}</h6>
        </div>
        <div class="col s4">
            <h6>${people}</h6>
        </div>
    </div>`;

    result.appendChild(dataPrint);

}


// objeto con presupuesto
class Presupuesto {
    constructor(tipoEvento, people, expenses) {
        this.tipoEvento = tipoEvento;
        this.people = people;
        this.expenses = expenses;
    }
}

// array 
const PRESUPUESTOS = [];

const CONTENEDOR_PRESUPUESTOS = document.getElementById('presupuestoContainer');

// función para crear una card y darle la info
function agregarTarjetasPresupuesto(presupuestos) {
    // Limpiar el contenedor antes de agregar nuevas tarjetas
    CONTENEDOR_PRESUPUESTOS.innerHTML = '';

    presupuestos.forEach(presupuesto => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>Presupuesto para: ${presupuesto.tipoEvento}</h2>
            <p>Personas: ${presupuesto.people}</p>
            <p>Precio: ${presupuesto.expenses}</p>
        `;

        CONTENEDOR_PRESUPUESTOS.appendChild(card);
    });
}

// Inicializar con las tarjetas de presupuesto predefinidas
agregarTarjetasPresupuesto(PRESUPUESTOS);