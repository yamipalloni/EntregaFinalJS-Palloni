document.addEventListener("DOMContentLoaded", () => {
    loadFormData(); // Carga datos del formulario guardados
    loadPresupuestos(); // Carga presupuestos guardados
    loadTipoEventos(); // Carga tipos de eventos desde JSON
});

// Cargar los tipos de eventos desde el archivo JSON
async function loadTipoEventos() {
    const response = await fetch('eventos.json'); // conexión API
    const eventos = await response.json(); 
    const selectTipoEvento = document.getElementById('tipoEvento');

    
    eventos.forEach(evento => {
        const option = document.createElement('option'); 
        option.value = evento.tipoEvento; 
        option.textContent = evento.tipoEvento.charAt(0).toUpperCase() + evento.tipoEvento.slice(1); 
        selectTipoEvento.appendChild(option); 
    });
}

// Cáculadora propiamente dicha
let lunchCalc = document.getElementById("lunchCalc");
lunchCalc.addEventListener("submit", function (e) {
    e.preventDefault();

    let botonEnviar = document.getElementById("botonEnviar");
    const EDAD = 18;

    // Verificación de edad
    botonEnviar.addEventListener("click", () => {
        Swal.fire({
            title: "¿Cuál es tu edad?",
            html: `<input type="text" id="edad" class="swal2-input" placeholder="ingresa tu edad">`,
            confirButtonText: "enviar",
            showCancelButton: true,
            cancelButtonText: "cancelar"
        }).then((result) => {
            const EDAD_SW = document.getElementById("edad").value;

            if (EDAD_SW >= EDAD) {
                calcExpenses(e); 
            } else {
                Swal.fire({
                    title: '¡Debes ser mayor de 18 años!',
                    allowOutsideClick: () => {
                        const popup = Swal.getPopup();
                        popup.classList.remove('swal2-show');
                        setTimeout(() => {
                            popup.classList.add('animate__animated', 'animate__headShake');
                        });
                        setTimeout(() => {
                            popup.classList.remove('animate__animated', 'animate__headShake');
                        }, 500);
                        return false;
                    },
                });
            }
        });
    });
});

// Obtener valores
function getValues() {
    let tipoEvento = document.getElementById("tipoEvento").value;
    let budget = document.getElementById("budget").value;
    let date = document.getElementById("date").value;
    let people = document.getElementById("people").value;
    let comentarios = document.getElementById("comentarios").value;

    return { tipoEvento, budget, date, people, comentarios };
}

// Reseteado
function resetForm() {
    document.getElementById("tipoEvento").value = '';
    document.getElementById("budget").value = '';
    document.getElementById("date").value = '';
    document.getElementById("people").value = '';
    document.getElementById("comentarios").value = '';
}

// Guardar datos del formulario en localStorage
function saveFormData() {
    const { tipoEvento, budget, date, people, comentarios } = getValues();
    const formData = { tipoEvento, budget, date, people, comentarios };
    localStorage.setItem('formData', JSON.stringify(formData));
}

// Recuperar los datos de localStorage
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

// Guardar en localStorage
function savePresupuestos() {
    localStorage.setItem('presupuestos', JSON.stringify(PRESUPUESTOS));
}

// Recuperar de localStorage
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

    // Ciclo para asegurar que el presupuesto sea suficiente
    while (validBudget < expenses) {
        validBudget = parseInt(
            Swal.fire({
                title: 'El presupuesto es insuficiente.',
                text: `El costo del evento es ${expenses}. Por favor ingresa un presupuesto mayor o igual.`,
                icon: 'error',
                allowOutsideClick: () => {
                    const popup = Swal.getPopup();
                    popup.classList.remove('swal2-show');
                    setTimeout(() => {
                        popup.classList.add('animate__animated', 'animate__headShake');
                    });
                    setTimeout(() => {
                        popup.classList.remove('animate__animated', 'animate__headShake');
                    }, 500);
                    return false;
                },
            })
        );
    }

    let balance = validBudget - expenses;

    console.log(`El tipo de evento es ${tipoEvento}, para ${people} personas y cuesta ${expenses}. Tu presupuesto es ${validBudget}`);

    // Actualizar con los resultados del cálculo
    UI(tipoEvento, expenses, people, comentarios);

    // Crear una nueva instancia de Presupuesto y agregarla al array
    let nuevoPresupuesto = new Presupuesto(tipoEvento, people, expenses);
    PRESUPUESTOS.push(nuevoPresupuesto);

    agregarTarjetasPresupuesto(PRESUPUESTOS);

    savePresupuestos(); 
    resetForm(); 
    saveFormData(); 
}




