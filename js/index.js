document.addEventListener("DOMContentLoaded", () => {
    loadFormData(); // Cargar datos del formulario si existen en localStorage
    loadPresupuestos(); // Cargar presupuestos guardados en localStorage
    loadTipoEventos(); // Cargar tipos de eventos desde el archivo JSON
});

// Función para cargar los tipos de eventos desde un archivo JSON
async function loadTipoEventos() {
    const response = await fetch('eventos.json');
    const eventos = await response.json();
    const selectTipoEvento = document.getElementById('tipoEvento');

    
    eventos.forEach(evento => {
        const option = document.createElement('option');
        option.value = evento.tipoEvento;
        option.textContent = `${evento.tipoEvento} - $${evento.costoPorPersona} por persona`;
        selectTipoEvento.appendChild(option);
    });
}


let lunchCalc = document.getElementById("lunchCalc");
lunchCalc.addEventListener("submit", function (e) {
    e.preventDefault();

    
    Swal.fire({
        title: "¿Cuál es tu edad?",
        html: `<input type="number" id="edad" class="swal2-input" placeholder="Ingresa tu edad">`,
        confirmButtonText: "Enviar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        const edad = document.getElementById("edad").value;

        // Verificar si la edad es mayor o igual a 18
        if (edad >= 18) {
            calcExpenses(); // Calcular los gastos si la edad es suficiente
        } else {
            Swal.fire({
                title: '¡Debes ser mayor de 18 años!',
                icon: 'error',
                allowOutsideClick: false,
                customClass: {
                    popup: 'animate__animated animate__headShake'
                }
            });
        }
    });
});

// Obtener los valores del formulario
function getValues() {
    let tipoEvento = document.getElementById("tipoEvento").value;
    let budget = document.getElementById("budget").value;
    let date = document.getElementById("date").value;
    let people = document.getElementById("people").value;
    let comentarios = document.getElementById("comentarios").value;

    return { tipoEvento, budget, date, people, comentarios };
}

// Resetear el formulario
function resetForm() {
    document.getElementById("tipoEvento").value = '';
    document.getElementById("budget").value = '';
    document.getElementById("date").value = '';
    document.getElementById("people").value = '';
    document.getElementById("comentarios").value = '';
}

// Guardar los datos en localStorage
function saveFormData() {
    const { tipoEvento, budget, date, people, comentarios } = getValues();
    const formData = { tipoEvento, budget, date, people, comentarios };
    localStorage.setItem('formData', JSON.stringify(formData));
}

// Cargar los datos desde localStorage
function loadFormData() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (formData) {
        document.getElementById("tipoEvento").value = formData.tipoEvento;
        document.getElementById("budget").value = formData.budget;
        document.getElementById("date").value = formData.date;
        document.getElementById("people").value = formData.people;
        document.getElementById("comentarios").value = formData.comentarios;
    }
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

// Clase para crear objetos de presupuesto
class Presupuesto {
    constructor(tipoEvento, people, expenses) {
        this.tipoEvento = tipoEvento;
        this.people = people;
        this.expenses = expenses;
    }
}

// Array para almacenar los presupuestos
const PRESUPUESTOS = [];
const CONTENEDOR_PRESUPUESTOS = document.getElementById('presupuestoContainer');


function agregarTarjetasPresupuesto(presupuestos) {
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

// Función para guardar en localStorage
function savePresupuestos() {
    localStorage.setItem('presupuestos', JSON.stringify(PRESUPUESTOS));
}

// Función para cargar localStorage
function loadPresupuestos() {
    const presupuestosData = JSON.parse(localStorage.getItem('presupuestos'));
    if (presupuestosData) {
        PRESUPUESTOS.push(...presupuestosData);
        agregarTarjetasPresupuesto(PRESUPUESTOS);
    }
}

// Función para calcular los gastos basados en el tipo de evento y la cantidad de personas
function calcExpenses() {
    const { tipoEvento, budget, date, people, comentarios } = getValues();

    let costoPorPersona;
    switch (tipoEvento.toLowerCase()) {
        case 'casamiento':
            costoPorPersona = 600;
            break;
        case 'cumpleaños':
            costoPorPersona = 500;
            break;
        case 'corporativos':
            costoPorPersona = 500;
            break;
        default:
            costoPorPersona = 500;
    }

    let expenses = parseInt(people) * costoPorPersona; 
    let validBudget = parseInt(budget);


    while (validBudget < expenses) {
        validBudget = parseInt(
            Swal.fire({
                title: 'Presupuesto insuficiente',
                text: `El presupuesto es insuficiente. El costo total es ${expenses}. Por favor ingresa un presupuesto mayor.`,
                input: 'number',
                inputPlaceholder: 'Nuevo presupuesto',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                preConfirm: (nuevoPresupuesto) => {
                    return new Promise((resolve) => {
                        resolve(nuevoPresupuesto);
                    });
                }
            }).then((result) => {
                if (result.value) {
                    return result.value;
                }
            })
        );
    }

    saveFormData(); 
    const nuevoPresupuesto = new Presupuesto(tipoEvento, people, expenses); 
    PRESUPUESTOS.push(nuevoPresupuesto); 
    savePresupuestos(); 
    UI(tipoEvento, expenses, people); 
    agregarTarjetasPresupuesto(PRESUPUESTOS);
}